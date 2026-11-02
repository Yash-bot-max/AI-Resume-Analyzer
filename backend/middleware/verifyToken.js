const firebaseAuth = require("./firebaseAdmin");
const UserModel = require("../Models/user");

// Verify the Firebase token and find the corresponding database user
exports.verifyToken = async (req, res, next) => {
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

    const dbUser = await UserModel.findOne({
      firebaseUid: decodedToken.uid
    });

    if (!dbUser) {
      return res.status(401).json({
        success: false,
        message: "User not found."
      });
    }

    req.user = dbUser;
    next();

  } catch (error) {
    console.error("Authentication Error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token."
    });
  }
};

// Restrict access to users with the admin role
exports.requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin only."
    });
  }

  next();
};