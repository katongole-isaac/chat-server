import { WebSocket } from "ws";

export interface WsClient extends WebSocket {
  room: string;
  userId: string | null;
  connectionId: string | null;
}


// defining command types.
export enum CommandTypes {
  LOGIN = "login",
  JOIN_ROOM = "join",
  LEAVE_ROOM = "leave",
  CREATE_ROOM = "create",
  ERROR_ROOM = "error",
  SUCCESS_ROOM = "success",
  GET_ROOMS_INFO = "getRoomsInfo"
}

// describes message format used
export interface MessageFormat {
  type: CommandTypes;
  params?: Record<string, any>;
}

