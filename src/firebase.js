import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBPebG8SSpQ7fIEzIji0Fer0cR_QXfw6Ng",
  authDomain: "interl-nk-65f95.firebaseapp.com",
  projectId: "interl-nk-65f95",
  storageBucket: "interl-nk-65f95.appspot.com",
  messagingSenderId: "16180256681",
  appId: "1:16180256681:web:0cfd98e3ddc9d70152eeb8"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore()