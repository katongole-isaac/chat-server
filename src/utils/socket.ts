/**
 * Socket Utilities
 *
 */

import { IncomingMessage } from "http";
import internal from "stream";
import utils from ".";

class SocketUtil {
  
  async authenticate(req: IncomingMessage, socket: internal.Duplex) {
    const parsedURL = new URL(req.url!, `http://${req.headers.host}`);
    const token = parsedURL.searchParams.get("token");

    if (!token) {
      socket.write(`HTTP/1.1 401 Unauthorized\r\n\r\n`);
      socket.destroy();
      return false;
    }

    if (!(await utils.decodeToken(token))) return false;

    return true;
  }
}

export default new SocketUtil();
