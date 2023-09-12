/**
 * For authenicating user before
 * establishing a websocket
 *
 */

import express from "express";

import { firebaseAuth } from "../lib/firebase";

const router = express.Router();

router.get("/", async (req, res) => {

  const token = req.headers["x-auth-token"] as string ;

  try {
    await firebaseAuth.verifyIdToken(token);

    res.send({ message: "ok" });
    
  } catch (error) {
    // if the token is invalid
    res.status(301).send({ redirectUrl: "/login" });
  }
});

export default router;
