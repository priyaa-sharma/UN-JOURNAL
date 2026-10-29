import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase.js";

const signInLinks = document.querySelectorAll("[data-auth-signin]");
const signOutButtons = document.querySelectorAll("[data-auth-signout]");
const accountSession = document.getElementById("account-session");
const accountLabel = document.getElementById("account-label");
const authStatus = document.querySelector("[data-auth-status]");

onAuthStateChanged(auth, (user) => {
  signInLinks.forEach((link) => {
    link.hidden = Boolean(user);
  });
  signOutButtons.forEach((button) => {
    button.hidden = !user;
  });

  if (accountSession) {
    accountSession.hidden = !user;
  }

  if (accountLabel && user) {
    accountLabel.textContent = user.displayName || user.email || "Signed in";
  }
});

signOutButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    button.disabled = true;
    if (authStatus) {
      authStatus.hidden = true;
      authStatus.textContent = "";
    }

    try {
      await signOut(auth);
      window.location.assign("login.html?signedOut=1");
    } catch (error) {
      console.error("Firebase sign-out failed.", error);
      button.disabled = false;

      if (authStatus) {
        authStatus.textContent = "Couldn't sign out. Please try again.";
        authStatus.hidden = false;
      } else {
        window.alert("Couldn't sign out. Please try again.");
      }
    }
  });
});

if (authStatus && new URLSearchParams(window.location.search).has("signedOut")) {
  authStatus.textContent = "You have been signed out.";
  authStatus.hidden = false;
}
