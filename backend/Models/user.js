const mongoose = require("mongoose");

// Define the user schema
const UserSchema = new mongoose.Schema(
    {
        firebaseUid: {
            type: String,
            unique: true,
            sparse: true
        },
        email: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        role: {
            type: String,
            default: "user"
        },
        photoUrl: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

const UserModel = mongoose.model("user", UserSchema);

module.exports = UserModel;