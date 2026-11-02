const UserModel = require("../Models/user");

exports.register = async (req, res) => {
    try {
        const { uid, email, name, picture, email_verified } = req.firebaseUser;

        // Validate Firebase user details
        if (!uid || !email || !email_verified) {
            return res.status(403).json({
                success: false,
                message: "Verified email and valid user ID are required."
            });
        }

        // Find an existing user using their email
        let userExist = await UserModel.findOne({ email });

        if (!userExist) {
            // Create a new user
            userExist = await UserModel.create({
                firebaseUid: uid,
                name: name || "User",
                email,
                photoUrl: picture || ""
            });

        } else {
            // Prevent linking an account with a different Firebase UID
            if (userExist.firebaseUid && userExist.firebaseUid !== uid) {
                return res.status(403).json({
                    success: false,
                    message: "User authentication mismatch."
                });
            }

            // Update existing user details without changing their role
            userExist.firebaseUid = uid;
            userExist.name = name || userExist.name;
            userExist.photoUrl = picture || userExist.photoUrl;

            await userExist.save();
        }

        return res.status(200).json({
            success: true,
            message: "Login Successful",
            user: userExist
        });

    } catch (err) {
        console.error("Registration Error:", err);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};