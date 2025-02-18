import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD5o6wuYDmML_i4BQyHqhYvYu_MSPqQceQ",
  authDomain: "chatapp-9947a.firebaseapp.com",
  projectId: "chatapp-9947a",
  storageBucket: "chatapp-9947a.firebasestorage.app",
  messagingSenderId: "310104047623",
  appId: "1:310104047623:web:b7933ad138a4bce9beaaa2",
  measurementId: "G-12BMGRBC45",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
