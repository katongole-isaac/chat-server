/**
 * Parse Urls
 *
 */
import { IncomingMessage } from "http";

import { firebaseAuth, firestoreDB } from "./lib/firebase";
import { CommandTypes, MessageFormat, WsClient } from "./misc/types";

export type User = {
  userId: string;
  connectionId: string;
  email: string;
  online: boolean;
};

// container
const helpers: Record<string, Function> = {};

// getting query params
helpers.getHeaders = function (req: IncomingMessage) {
  const parseURL = new URL(req.url!, `http://${req.headers.host}`);

  const token = parseURL.searchParams.get("token") as string;
  const userId = parseURL.searchParams.get("userId") as string;

  return {
    token,
    userId,
  };
};

// executed on login
helpers.login = function (ws: WsClient) {
  console.log(`client connected`);
  const response: MessageFormat = {
    type: CommandTypes.LOGIN,
    params: {
      isOnline: true,
    },
  };

  ws.send(JSON.stringify(response));
};


// decoding jwt firebase token
helpers.decodeToken = async function (token: string) {
  try {
    const decoded = await firebaseAuth.verifyIdToken(token);
    return decoded;
  } catch (error) {
    console.log("[token Decoding]: ", error);
    return null;
  }
};

// saving the user
helpers.saveUser = async function (userId: string, data: User) {
  try {
    const docRef = firestoreDB.collection("users").doc(userId);

    await docRef.set(data);

    return true;
  } catch (error) {
    
    console.log("[Saving user]: ", error);

    return false;
  }
};


// getting user data
helpers.getUser = async function (userId: string) {
  try {
    const docRef = firestoreDB.collection("users").doc(userId);

    const doc = await docRef.get();

    if (!doc.exists) return null;

    return doc.data();

  } catch (error) {
    console.log("[Getting user]: ", error);

    return null;
  }
};

// updating user
helpers.updateUser = async function (userId: string, data: Partial<User>) {
  try {
    const docRef = firestoreDB.doc(`users/${userId}`);

    await docRef.update({ ...data });

    return true;

  } catch (error) {

    console.log(`[Updating user]: ${error}`);

    return false;
  }
};


// Json stringfy
helpers.stringify = function(data : object) {
  try {

    return JSON.stringify(data);

  } catch (error) {

      console.log(`[Failed to stringfy JSON]: ${error}`);

      return {}
  }
}




export default helpers;
