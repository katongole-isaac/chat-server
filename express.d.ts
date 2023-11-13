/**
 * Extending Express
 *
 */

import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      /**
       * Authenticated user id
       */
      user: string;
    }
  }
}
