import { WebSocket } from "ws";

export interface WsClient extends WebSocket {
  room: string;
  userId: string;
  connectionId: string;
}


