import { FieldValue } from "firebase-admin/firestore";
import { firestoreDB as db} from "../lib/firebase";

export interface User {
  readonly socket_id: string;
  readonly userId: string;
  readonly email: string;
  readonly friends: string[];
}

class UserUtils {

  private readonly collection = "users";

  async create(id: string, data: User) {
    const docRef = db.collection(this.collection).doc(id);
    await docRef.set(data);

    return true;
  }

  async update(id: string, data: Partial<User>) {
    const docRef = db.doc(this.collection + id);

    if (data.friends)
      return await docRef.update({
        friends: FieldValue.arrayUnion(...(data.friends as string[])),
      });

    return await docRef.update({ ...data });
  }

  async get(id: string) {
    const docRef = db.collection(this.collection).doc(id);

    const doc = await docRef.get();

    if (!doc.exists) return null;

    return doc.data() as FirebaseFirestore.DocumentData & User;
  }

  async delete(id:string) {

    const docRef = db.collection(this.collection).doc(id);

    await docRef.delete();

    return true;

  }

  async getAll() {
    const users = await db
      .collection(this.collection)
      .orderBy("email", "asc")
      .get();

    return users.docs.map(
      (user) => user.data() as FirebaseFirestore.DocumentData & User
    );
  }
}


export default new UserUtils();