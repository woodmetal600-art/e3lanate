import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAn8ts_jNTN3ti_NpPfLSGHDaal5z4ZJvA",
  authDomain: "e3lanate.firebaseapp.com",
  projectId: "e3lanate",
  storageBucket: "e3lanate.firebasestorage.app",
  messagingSenderId: "716958885129",
  appId: "1:716958885129:web:629fbc1328896ba6eedfd8",
  measurementId: "G-K87MN006VQ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, signInWithPopup, collection, addDoc, getDocs, query, orderBy, serverTimestamp };
