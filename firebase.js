import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAuHI5gIDhB0d0_s-HXShMMGBJeXfel4_8",
  authDomain: "unjournal-e57f1.firebaseapp.com",
  projectId: "unjournal-e57f1",
  storageBucket: "unjournal-e57f1.firebasestorage.app",
  messagingSenderId: "46853574994",
  appId: "1:46853574994:web:3539a01328846173cdea8b",
  measurementId: "G-8XBSH2L9D9",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
