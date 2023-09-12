/**
 * Primary file for the server
 *
 */



import cors from "cors";
import express, { Application } from "express";
import { WebSocketServer } from "ws";
import { v4 as uuidv4 } from 'uuid'

import authRouter from "./routes/auth";
import { WsClient } from "./misc/types";
import { getHeaders } from "./helpers/parseUrl";

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

wss.on("connection", (ws : WsClient, req) => {

  console.log("Client conncted");

  const { userId } = getHeaders(req);
  
  const connection_id = uuidv4();

   


});

server.on("upgrade", (req, socket, head) => {

  const parseURL = new URL(req.url!, `http://${req.headers.host}`);

  if (req.url?.includes("/chat"))
    wss.handleUpgrade(req, socket, head, function (ws) {
      wss.emit("connection", ws, req);
    });

});
