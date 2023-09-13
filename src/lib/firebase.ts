import config from "config";

import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from 'firebase-admin/firestore'

const firebaseConfig = {
  projectId: config.get("firebaseProjectId") as string,
};

const firebaseApp =  initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
const firestoreDB = getFirestore();


export { firebaseAuth, firestoreDB  }

