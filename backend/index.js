// Load environment variables
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const ResumeRoutes = require("./Routes/resume");
const UserRoutes = require("./Routes/user");
const connectDB = require("./conn");

const app = express();

const PORT = process.env.PORT || 4000;

// Allow requests from the frontend application
const allowedOrigins = [
    "http://localhost:5173",
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: allowedOrigins
}));

// Parse incoming JSON request bodies
app.use(express.json());

// Register API routes
app.use("/api/user", UserRoutes);
app.use("/api/resume", ResumeRoutes);

// Connect to MongoDB before starting the server
const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Backend is running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
};

startServer();