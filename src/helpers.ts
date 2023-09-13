/**
 * Parse Urls
 *
 */
import { IncomingMessage } from "http";

import { firebaseAuth, firestoreDB } from "./lib/firebase";

export type User = {
  userId: string,
  connectionId: string;
  email : string;
  online: boolean;
}



// container
const helpers: { [key: string]: Function } = {};

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
helpers.saveUser = async function (
  userId: string,
  data: User
) {

  const docRef = firestoreDB.collection("users").doc(userId);

  try {
    
    await docRef.set(data);

    return true;

  } catch (error) {

    console.log("[Saving user]: ", error);

    return false;
  }
};

// getting user data
helpers.getUser = async function (userId: string) {

  const userCollection = firestoreDB.collection("users");

  try {

    const docRef = userCollection.doc(userId);
    const doc = await docRef.get();

    if (!doc.exists) return null;

    return doc;

  } catch (error) {
    console.log("[Getting user]: ", error);

    return null;
  }
};

// updating user 
helpers.updateUser = async function (userId:string, data: Partial<User> ) {

  const docRef = firestoreDB.doc(`users/${userId}`);
  
  try {

    await docRef.update({...data});
    return true;

  } catch (error) {

    console.log(`[Updating user]: ${error}`);

    return false;
    
  }

}

export default helpers;