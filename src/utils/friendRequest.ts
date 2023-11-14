import { UserRecord } from "firebase-admin/auth";
import { Timestamp } from "firebase-admin/firestore";

import { firestoreDB as db, firebaseAuth as auth} from "../lib/firebase";

export interface FriendRequest {
  /**
   * Recipient id
   */
  readonly to: string;

  /**
   * Sender id
   */
  readonly from: string;
}

export interface NewFriendRequest {
  readonly sender: string;
  readonly recipient: string;

  /**
   * Denotes the date when the request was created
   */
  readonly createdAt: Timestamp;
}

type NotEmptyArray<T> = [T, ...T[]];

class FriendRequest_ {

    private readonly collection = "friend_request";

    async create(data: NewFriendRequest){
        const docRef = db.collection(this.collection).doc();
        await docRef.set(data);
        return true
    }

    async get(id:string) {
        const fq =  await db.collection(this.collection).doc(id).get();

        if(!fq.exists) return null;

        return fq.data() as FirebaseFirestore.DocumentData & NewFriendRequest;
    }

    async delete(id:string) {
         const fqRef =  db.collection(this.collection).doc(id);

         await fqRef.delete();
         
        return true;
    }

    async getAll(userId:string) {

      const q = db.collection(this.collection).where('recipient', '==', userId);

      const fqs = await q.orderBy('createdAt', 'desc').get();

      return fqs.docs.map(
        (fq) => fq.data() as FirebaseFirestore.DocumentData & NewFriendRequest
      );

    }

    async firebaseUser(userIds:NotEmptyArray<string>) {
      const data : UserRecord[] = [];

       userIds.map(async (uid) => data.push(await auth.getUser(uid)));

       return data;
    }
}

export default new FriendRequest_();