import axios from "axios";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

// Use the deployed backend URL in production and localhost during development.
const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
});

// Wait until Firebase restores the authentication session.
const getCurrentUser = () => {
    if (auth.currentUser) {
        return Promise.resolve(auth.currentUser);
    }

    return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            unsubscribe();
            resolve(user);
        });
    });
};

// Attach the Firebase ID token to authenticated API requests.
instance.interceptors.request.use(
    async (config) => {
        const currentUser = await getCurrentUser();

        if (currentUser) {
            const token = await currentUser.getIdToken();
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default instance;