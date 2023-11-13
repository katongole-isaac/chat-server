import { DecodedIdToken } from "firebase-admin/auth";
import { User } from "./users";
import { NewFriendRequest } from "./friend_request";
import { IncomingMessage } from "node:http";
import internal from "node:stream";

interface Helpers {
  deleteFriendRequest: (id: string) => Promise<boolean>;
  saveUser: (id: string, user: User) => Promise<boolean>;
  decodeToken: (token: string) => Promise<DecodedIdToken | null>;
  createFriendRequest: (data: NewFriendRequest) => Promise<boolean>;
  updateUser: (id: string, user: Partial<User>) => Promise<boolean>;
  getAllUsers: () => Promise<(FirebaseFirestore.DocumentData & User)[] | null>;
  socketAuthentication: (req: IncomingMessage, socket: internal.Duplex) => Promise<boolean>;
  getUser: (userId: string) => Promise<(FirebaseFirestore.DocumentData & User) | null | undefined>;
  getMyFriendRequests: (userId: string) => Promise<(FirebaseFirestore.DocumentData & NewFriendRequest)[] | null>
  getFriendRequest: (id: string ) => Promise<(FirebaseFirestore.DocumentData & NewFriendRequest) | null | undefined>;
}

export default Helpers;
