import {initializeApp} from "firebase/app";
import {getFirestore} from "@firebase/firestore"
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAXbAdWUHbnfruKmFaq1-isHsyL_yyqL-Q",
  authDomain: "trello-clone-1a05a.firebaseapp.com",
  projectId: "trello-clone-1a05a",
  storageBucket: "trello-clone-1a05a.appspot.com",
  messagingSenderId: "348978438841",
  appId: "1:348978438841:web:75b354bbfa16199ee47168"
};

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app);
export const auth = getAuth(app);
