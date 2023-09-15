/**
 * Primary file for the server
 *
 */



import cors from "cors";
import express, { Application } from "express";
import { DecodedIdToken } from "firebase-admin/auth";
import { WebSocketServer } from "ws";
import { v4 as uuidv4 } from "uuid";

import authRouter from "./routes/auth";
import { MessageFormat, WsClient } from "./misc/types";
import helpers, { User } from "./helpers";

const app: Application = express();

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;

const wss = new WebSocketServer({ noServer: true });

//mounting middlewares
app.use(
  cors({
    origin: "*",
    allowedHeaders: ["x-auth-token"],
  })
);
app.use("/auth", authRouter);

const server = app.listen(PORT, () => {
  console.log(`\x1b[1;32m [SERVER] Running on PORT %d ... \x1b[0m`, PORT);
});

server.on("error", (error) => {
  if ((error as NodeJS.ErrnoException).code === "EADDRINUSE")
    throw new Error(`${PORT} is in use...`);
});

// event fired upon handshake completion
wss.on("connection", async (ws: WsClient, req) => {
  console.log("Client connected");

  // used to send updates on the user online status
  ws.on("message", (data) => {
    const message = JSON.parse(data.toString()) as MessageFormat;
    if (message.type === "login") {
      
      const response: MessageFormat = {
        type: "login",
        params: {
          isOnline: true,
        },
      };

      ws.send(JSON.stringify(response));
    }
  });

  const { token } = helpers.getHeaders(req);

  const decoded: DecodedIdToken = await helpers.decodeToken(token);

  const { email, uid } = decoded;

  const connectionId = uuidv4();

  let user = <User>await helpers.getUser(uid);

  // if the user doesn't exists in the DB
  // create/save the user
  if (!user) {
    const data: User = {
      connectionId,
      email: email as string,
      userId: uid,
      online: true,
    };

    await helpers.saveUser(data.userId, data);

    user = data;
  } else {
    // if the user exists, update the connection_id and set online to true
    await helpers.updateUser(user.userId, {
      connectionId,
      online: true,
    });
  }

  // set user id and connectionId initials on ws, so that we can recognize them
  ws.userId = user.userId;
  ws.connectionId = user.connectionId;

  // you can send connectionId to the user.
  // user can store it in the sessionstorage
  ws.send(helpers.stringify({ connectionId }));

  // upon closing the websocket, update user [online, connectionId]
  // then reset ws.userId and ws.connectioId to null
  ws.on("close", async (code, reason) => {
    console.log("Client disconnected !");

    await helpers.updateUser(user.userId, {
      connectionId: null,
      online: false,
    });

    ws.userId = null;
    ws.connectionId = null;
  });


  ws.on("message", (data) => {
    console.log(`Data: ${data} `);
  });
});

server.on("upgrade", (req, socket, head) => {

  // const parseURL = new URL(req.url!, `http://${req.headers.host}`);

  if (req.url?.includes("/chat"))
    wss.handleUpgrade(req, socket, head, function (ws) {
      wss.emit("connection", ws, req);
    });

});
