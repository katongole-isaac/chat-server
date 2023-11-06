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
    
    console.log(error);
    // if the token is invalid
    res.status(301).send({ type: "error", redirectUrl: "/login" });
  }
});

router.post("/", async (req, res) => {

  const { email } = req.body as { email: string };
  


});

export default router;

