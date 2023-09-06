import config from "config";

import { initializeApp } from "firebase-admin/app";

const firebaseConfig = {
  projectId: config.get("firebaseProjectId") as string,
};

export default initializeApp(firebaseConfig);
