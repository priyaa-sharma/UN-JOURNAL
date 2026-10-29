import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider } from "./firebase.js";

const authForm = document.getElementById("auth-form");
const authTitle = document.getElementById("auth-title");
const nameField = document.getElementById("name-field");
const nameInput = document.getElementById("name");
const confirmField = document.getElementById("confirm-field");
const confirmInput = document.getElementById("confirm-password");
const passwordInput = document.getElementById("password");
const emailInput = document.getElementById("email");
const forgotPasswordButton = document.getElementById("forgot-password");
const submitButton = document.getElementById("submit-button");
const switchPrompt = document.getElementById("switch-prompt");
const switchModeButton = document.getElementById("switch-mode");
const formMessage = document.getElementById("form-message");
const googleButton = document.getElementById("google-button");

let isSignUp = true;

function showAuthError(error) {
  const messages = {
    "auth/account-exists-with-different-credential":
      "An account already exists with this email. Sign in using its original method.",
    "auth/email-already-in-use": "An account with this email already exists. Try signing in.",
    "auth/expired-action-code": "This email confirmation link has expired. Request a new one by creating your account again.",
    "auth/invalid-credential": "The email or password is incorrect. Please try again.",
    "auth/invalid-email": "Enter a valid email address.",
    "auth/network-request-failed": "Couldn't connect. Check your internet connection and try again.",
    "auth/operation-not-allowed": "This sign-in method isn't enabled in Firebase yet.",
    "auth/popup-blocked": "Your browser blocked the Google sign-in window. Allow pop-ups and try again.",
    "auth/popup-closed-by-user": "Google sign-in was closed before it finished.",
    "auth/too-many-requests": "Too many attempts. Wait a little while, then try again.",
    "auth/unauthorized-domain": "This website isn't authorized in Firebase. Add its domain under Authentication settings.",
    "auth/user-disabled": "This account has been disabled. Contact the site administrator.",
    "auth/user-not-found": "No account was found with this email. Create an account first.",
    "auth/weak-password": "Choose a stronger password with at least 8 characters.",
    "auth/wrong-password": "The email or password is incorrect. Please try again.",
  };

  formMessage.textContent =
    messages[error.code] || "Authentication failed. Please try again.";
}

function setBusy(isBusy) {
  submitButton.disabled = isBusy;
  switchModeButton.disabled = isBusy;
  forgotPasswordButton.disabled = isBusy;
  googleButton.disabled = isBusy;
  authForm.setAttribute("aria-busy", String(isBusy));
}

function openJournal() {
  window.location.assign("journal.html");
}

function showConfirmationMessage() {
  formMessage.textContent =
    "Check your email and confirm your account before logging in.";
}

function setMode(signUp) {
  isSignUp = signUp;
  authTitle.textContent = signUp ? "Create your account" : "Welcome back";
  nameField.hidden = !signUp;
  nameInput.required = signUp;
  confirmField.hidden = !signUp;
  confirmInput.required = signUp;
  confirmInput.value = "";
  passwordInput.autocomplete = signUp ? "new-password" : "current-password";
  forgotPasswordButton.hidden = signUp;
  submitButton.textContent = signUp ? "Create account" : "Sign in";
  switchPrompt.textContent = signUp ? "Already have an account?" : "New to UN-JOURNAL?";
  switchModeButton.textContent = signUp ? "Sign in" : "Create account";
  formMessage.textContent = "";
}

switchModeButton.addEventListener("click", () => {
  setMode(!isSignUp);
});

authForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  formMessage.textContent = "";

  if (isSignUp && passwordInput.value !== confirmInput.value) {
    confirmInput.setCustomValidity("Passwords do not match.");
    confirmInput.reportValidity();
    confirmInput.focus();
    confirmInput.setCustomValidity("");
    return;
  }

  setBusy(true);
  let createdAccount = false;

  try {
    const email = emailInput.value.trim();

    if (isSignUp) {
      const credential = await createUserWithEmailAndPassword(
        auth,
        email,
        passwordInput.value,
      );
      createdAccount = true;
      const displayName = nameInput.value.trim();

      if (displayName) {
        await updateProfile(credential.user, { displayName });
      }

      await sendEmailVerification(credential.user);
      await signOut(auth);
      showConfirmationMessage();
      return;
    } else {
      const credential = await signInWithEmailAndPassword(
        auth,
        email,
        passwordInput.value,
      );

      if (!credential.user.emailVerified) {
        await signOut(auth);
        showConfirmationMessage();
        return;
      }

      if (auth.currentUser?.uid !== credential.user.uid) {
        formMessage.textContent =
          "We couldn't confirm your sign-in. Please try again.";
        return;
      }
    }

    openJournal();
  } catch (error) {
    if (createdAccount && auth.currentUser) {
      try {
        await signOut(auth);
      } catch (signOutError) {
        console.error("Could not clear the unverified Firebase session.", signOutError);
      }
    }

    showAuthError(error);
  } finally {
    setBusy(false);
  }
});

forgotPasswordButton.addEventListener("click", async () => {
  if (!emailInput.reportValidity()) {
    return;
  }

  formMessage.textContent = "";
  setBusy(true);

  try {
    await sendPasswordResetEmail(auth, emailInput.value.trim());
    formMessage.textContent = "If an account exists for that email, a password reset link is on its way.";
  } catch (error) {
    showAuthError(error);
  } finally {
    setBusy(false);
  }
});

googleButton.addEventListener("click", async () => {
  formMessage.textContent = "";
  setBusy(true);

  try {
    const credential = await signInWithPopup(auth, googleProvider);

    if (!credential.user.emailVerified || auth.currentUser?.uid !== credential.user.uid) {
      await signOut(auth);
      showConfirmationMessage();
      return;
    }

    openJournal();
  } catch (error) {
    showAuthError(error);
  } finally {
    setBusy(false);
  }
});
