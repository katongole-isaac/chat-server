import { DecodedIdToken } from "firebase-admin/auth";
import { User } from "./users";
import { NewFriendRequest } from "./friend_request";

interface Helpers {
  decodeToken: (token: string) => Promise<DecodedIdToken | null>;
  saveUser: (id: string, user: User) => Promise<boolean>;
  updateUser: (id: string, user: Partial<User>) => Promise<boolean>;
  getUser: (
    userId: string
  ) => Promise<(FirebaseFirestore.DocumentData & User) | null | undefined>;
  getAllUsers: () => Promise<FirebaseFirestore.DocumentData[] | null>;
  createFriendRequest: (data: NewFriendRequest) => Promise<boolean>;
  getFriendRequest: (id:string) => Promise<FirebaseFirestore.DocumentData | null | undefined >
}

export default Helpers;
