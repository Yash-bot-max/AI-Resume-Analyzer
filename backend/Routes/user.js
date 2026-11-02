const express = require("express");
const router = express.Router();

const UserController = require("../Controllers/user");
const { verifyFirebaseToken } = require("../middleware/verifyFirebaseToken");

// Register or update a user after Firebase token verification
router.post("/", verifyFirebaseToken, UserController.register);

module.exports = router;