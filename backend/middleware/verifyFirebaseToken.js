const firebaseAuth = require("./firebaseAdmin");

// Verify the Firebase ID token before allowing access to the route
exports.verifyFirebaseToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Authentication token missing."
            });
        }

        const token = authHeader.split(" ")[1];

        const decodedToken = await firebaseAuth.verifyIdToken(token);

        req.firebaseUser = decodedToken;

        next();
    } catch (error) {
        console.error("Firebase Token Error:", error.message);

        return res.status(401).json({
            success: false,
            message: "Invalid or expired authentication token."
        });
    }
};