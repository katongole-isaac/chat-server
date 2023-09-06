/**
 * For authenicating user before
 * establishing a websocket
 *
 */

import express from "express";

import firebaseApp from "../lib/firebase";
import { getAuth } from "firebase-admin/auth";

const firebaseAuth = getAuth(firebaseApp);

const router = express.Router();

router.get("/", async (req, res) => {

  const token = req.headers["x-auth-token"] as string ;
  try {
    console.log(token);

    await firebaseAuth.verifyIdToken(token);

    res.send({ message: "ok" });
  } catch (error) {

    console.log("uuid");

    // if the token is invalid
    res.status(301).send({ redirectUrl: "/login" });
  }
});

export default router;
