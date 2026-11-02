const { initializeApp, cert, getApps } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const path = require("path");

// Load Firebase credentials from the environment or local JSON file.
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
: require(path.join(__dirname, "../serviceAccountKey.json"));

// Initialize Firebase Admin only once.
if (!getApps().length) {
initializeApp({
credential: cert(serviceAccount),
});
}

const firebaseAuth = getAuth();

module.exports = firebaseAuth;
