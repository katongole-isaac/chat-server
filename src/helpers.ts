/**
 * Parse Urls
 *
 */
import internal from "node:stream";
import { IncomingMessage } from "node:http";
import { FieldValue, Timestamp } from "firebase-admin/firestore";

import { User } from "./types/users";
import Helpers from "./types/helpers";
import { firebaseAuth, firestoreDB } from "./lib/firebase";
import FriendRequest, { NewFriendRequest } from "./types/friend_request";

// decoding jwt firebase token
const decodeToken = async function (token: string) {
  try {
    const decoded = await firebaseAuth.verifyIdToken(token);
    return decoded;
  } catch (error) {
    console.log("[token Decoding]: ", error);
    return null;
  }
};

// saving the user
const saveUser = async function (userId: string, data: User) {
  try {
    const docRef = firestoreDB.collection("users").doc(userId);

    await docRef.set(data);

    return true;
  } catch (error) {
    console.log("[Saving user]: ", error);

    return false;
  }
};

const getAllUsers = async function () {
  try {
    const users = await firestoreDB.collection("users").get();
    return users.docs;
  } catch (error) {
    console.log(`[Getting All Users]: `, error);
    return null;
  }
};

const getUser = async function (
  userId: string
): Promise<(FirebaseFirestore.DocumentData & User) | null | undefined> {
  try {
    const docRef = firestoreDB.collection("users").doc(userId);

    const doc = (await docRef.get()) as FirebaseFirestore.DocumentSnapshot<
      FirebaseFirestore.DocumentData & User
    >;

    if (!doc.exists) return undefined;

    return doc.data();
  } catch (error) {
    console.log("[Getting user]: ", error);

    return null;
  }
};

// updating user
const updateUser = async function (userId: string, data: Partial<User>) {
  try {
    const docRef = firestoreDB.doc(`users/${userId}`);

    await docRef.update({
      ...data,
      friends: FieldValue.arrayUnion(...(data.friends as string[])),
    });

    return true;
  } catch (error) {
    console.log(`[Updating user]: ${error}`);

    return false;
  }
};

const createFriendRequest = async (data: NewFriendRequest) => {
  try {
    const docRef = firestoreDB.collection("friend_request").doc();
    await docRef.set({
      ...data,
      createdAt: Timestamp.now(), // denotes the time the friend request was created
    });

    return true;
  } catch (error) {
    console.log(`[Createing New Friend Request]: ${error}`);
    return false;
  }
};

const getFriendRequest = async (id: string) => {
  try {
    const friendRequest = await firestoreDB
      .collection("friend_request")
      .doc(id)
      .get();

    if (!friendRequest.exists) return;

    return friendRequest.data();
  } catch (error) {
    console.log(`[Getting friend request]: ${error}`);
    return null;
  }
};

const deleteFriendRequest = async (id: string) => {
  try {
    const docRef = firestoreDB.collection("friend_request").doc(id);

    await docRef.delete();

    return true;
  } catch (error) {
    console.log(`[Deleting Friend Request]: ${error}`);

    return false;
  }
};

const socketAuthentication = async(req: IncomingMessage, socket: internal.Duplex) => {
  
  const parsedURL = new URL(req.url!, `http://${req.headers.host}`);

  const token = parsedURL.searchParams.get('token');

  if(!token) {
    socket.write(`HTTP/1.1 401 Unauthorized\r\n\r\n`);
    socket.destroy()
    return false;
  }

  if(!await helpers.decodeToken(token)) return false;

  return true;


};

const helpers: Helpers = {
  decodeToken,
  getUser,
  saveUser,
  updateUser,
  getAllUsers,
  createFriendRequest,
  getFriendRequest,
  deleteFriendRequest,
  socketAuthentication,
};

export default helpers;