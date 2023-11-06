import { WebSocket } from 'ws'

interface WebSocketExt extends WebSocket {
    id: string;
}

export default WebSocketExt;