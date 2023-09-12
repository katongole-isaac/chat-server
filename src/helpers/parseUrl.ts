/**
 * Parse Urls
 *
 */
import { IncomingMessage } from "http";

export function getHeaders(req: IncomingMessage) {

  const parseURL = new URL(req.url!, `http://${req.headers.host}`);

  const token = parseURL.searchParams.get("token") as string;
  const userId = parseURL.searchParams.get("userId") as string;

  return {
    token, 
    userId
  }

}
