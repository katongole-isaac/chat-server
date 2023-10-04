import { WebSocket } from "ws";

export interface WsClient extends WebSocket {
  room: string;
  userId: string | null;
  connectionId: string | null;
}

// commands for the websocket
type Commands = "login" | "join" | "leave" | "create" | "error" | "success";

// describes message format used
export interface MessageFormat {
  type: Commands;
  params?: Record<string, any>;
}

