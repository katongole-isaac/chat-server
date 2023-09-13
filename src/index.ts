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
import { WsClient } from "./misc/types";
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
  console.log("Client conncted");

  const { token } = helpers.getHeaders(req);

  const decoded: DecodedIdToken = await helpers.decodeToken(token);

  const { email, uid } = decoded;

  const connectionId = uuidv4();

  let user = (await helpers.getUser(uid)) as User;

  // if the user doesn't exists in the DB
  // create/save the user
  if (!user) {
    const data: User = {
      connectionId,
      email: email as string,
      userId: uid,
      online: true,
    };

    await helpers.saveUser(data);

    user = data;
  } else {
    // if the user exists, update the connection_id and set online to true
    await helpers.updateUser({
      connectionId,
      online: true,
    });
  }

  // set user initial on ws
  ws.userId = user.userId;
  ws.connectionId = user.connectionId;

  // when connections is established
  ws.on("open", () => {});

  
});

server.on("upgrade", (req, socket, head) => {

  const parseURL = new URL(req.url!, `http://${req.headers.host}`);

  if (req.url?.includes("/chat"))
    wss.handleUpgrade(req, socket, head, function (ws) {
      wss.emit("connection", ws, req);
    });

});
