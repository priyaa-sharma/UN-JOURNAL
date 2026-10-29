import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase.js";

onAuthStateChanged(
  auth,
  (user) => {
    if (!user || !user.emailVerified) {
      window.location.replace("login.html");
      return;
    }

    document.body.classList.remove("auth-pending");
  },
  (error) => {
    console.error("Could not verify the Firebase session.", error);
    window.location.replace("login.html");
  },
);
