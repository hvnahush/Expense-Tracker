import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; 
import {getAuth} from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBZkWd5MN7zu4cjGGo3ca2hRQU300tvncQ",
  authDomain: "expense-tracker-3da9f.firebaseapp.com",
  projectId: "expense-tracker-3da9f",
  storageBucket: "expense-tracker-3da9f.appspot.com",
  messagingSenderId: "65338754086",
  appId: "1:65338754086:web:347238673952cbbd1152e7",
  measurementId: "G-G43JFS8PV6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth,db };
