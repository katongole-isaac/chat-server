/**
 * Primary file for the server
 *
 */

import express, { Application } from "express";
import { WebSocketServer } from "ws";

const app: Application = express();

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

const wss = new WebSocketServer({ noServer: true });

const server = app.listen(PORT, () => {
  console.log(`\x1b[1;32m [SERVER] Running on port %d ... \x1b[0m`, PORT);
});

wss.on("connection", (ws) => {

  console.log("Client conncted");

  ws.on("message", (msg) => {
    console.log("MSG: ", msg.toString());
  });

  ws.send("yoo");

});

server.on("upgrade", (req, socket, head) => {
  wss.handleUpgrade(req, socket, head, function (ws) {
    wss.emit("connection", ws, req);
  });
});
