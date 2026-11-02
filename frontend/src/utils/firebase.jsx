import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Firebase project configuration.
const firebaseConfig = {
  apiKey: "AIzaSyAfChxY3xPBi2_MKyFHqO3oOulbNT5hFS8",
  authDomain: "mern3ai.firebaseapp.com",
  projectId: "mern3ai",
  storageBucket: "mern3ai.firebasestorage.app",
  messagingSenderId: "751102733790",
  appId: "1:751102733790:web:e3a549228cb070c30e014f",
  measurementId: "G-HQ0EZDYLYK",
};

// Initialize Firebase and Google authentication.
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };