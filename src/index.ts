/**
 * Primary file for the server
 *
 */



import cors from "cors";
import express, { Application } from "express";
import { WebSocketServer, WebSocket } from "ws";

import authRouter from "./routes/auth";

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

wss.on("connection", (ws) => {
  console.log("Client conncted");

  ws.on("message", (msg, isBinary) => {
    wss.clients.forEach(function (client) {
      if (client !== ws && client.readyState === WebSocket.OPEN)
        client.send(msg, { binary: isBinary });
    });
  });
});

server.on("upgrade", (req, socket, head) => {

  if(req.url === "/chat")
    
    wss.handleUpgrade(req, socket, head, function (ws) {
      wss.emit("connection", ws, req);
    });

  
});
