"use strict";
/**
 * Primary file for the server
 *
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ws_1 = require("ws");
const app = (0, express_1.default)();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const wss = new ws_1.WebSocketServer({ noServer: true });
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
