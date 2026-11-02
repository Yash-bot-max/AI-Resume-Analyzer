const mongoose = require("mongoose");

// Define the resume schema
const ResumeSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true
        },
        resume_name: {
            type: String,
            required: true
        },
        job_desc: {
            type: String,
            required: true
        },
        score: {
            type: Number,
            default: 0
        },
        feedback: {
            type: String
        },
        // These flags hide records without permanently deleting them.
        isHiddenFromHistory: {
            type: Boolean,
            default: false
        },
        isHiddenFromAdmin: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

const ResumeModel = mongoose.model("resume", ResumeSchema);

module.exports = ResumeModel;