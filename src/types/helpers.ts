import { DecodedIdToken } from "firebase-admin/auth";
import { User } from "./users";
import { NewFriendRequest } from "./friend_request";
import { IncomingMessage } from "node:http";
import internal from "node:stream";

interface Helpers {
  decodeToken: (token: string) => Promise<DecodedIdToken | null>;
  saveUser: (id: string, user: User) => Promise<boolean>;
  updateUser: (id: string, user: Partial<User>) => Promise<boolean>;
  getUser: (
    userId: string
  ) => Promise<(FirebaseFirestore.DocumentData & User) | null | undefined>;
  getAllUsers: () => Promise<FirebaseFirestore.DocumentData[] | null>;
  createFriendRequest: (data: NewFriendRequest) => Promise<boolean>;
  getFriendRequest: (
    id: string
  ) => Promise<FirebaseFirestore.DocumentData | null | undefined>;
  deleteFriendRequest: (id: string) => Promise<boolean>;
  socketAuthentication: (req: IncomingMessage, socket: internal.Duplex) => Promise<boolean>;
}

export default Helpers;
