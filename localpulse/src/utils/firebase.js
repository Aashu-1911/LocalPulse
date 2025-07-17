// src/utils/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";        // ✅ Use Realtime Database, not Firestore
import { getAuth, signInAnonymously } from "firebase/auth";

// ✅ These are your real config values — good!
const firebaseConfig = {
  apiKey: "AIzaSyC7l5uPlF25TCjpH_RiB1a5xadl1t5ERdQ",
  authDomain: "localpulse-e375c.firebaseapp.com",
  databaseURL: "https://localpulse-e375c-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "localpulse-e375c",
  storageBucket: "localpulse-e375c.appspot.com",   // ✅ Corrected domain to .appspot.com
  messagingSenderId: "997148110876",
  appId: "1:997148110876:web:49d15f645324dd06e02fd9"
};

// 🚀 Initialize Firebase App
const app = initializeApp(firebaseConfig);

// 🔄 Use Realtime Database and Auth
const database = getDatabase(app);       // ✅ Needed for reading/writing reports
const auth = getAuth(app);

// 👤 Automatically sign in user anonymously
signInAnonymously(auth).catch((error) => {
  console.error("Anonymous login failed:", error);
});

// 🔁 Export auth and database
export { auth, database };
