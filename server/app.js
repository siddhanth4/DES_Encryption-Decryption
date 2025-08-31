// server/app.js
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import connectDB from "./config.js";
import messageRoutes from "./routes/messages.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/messages", messageRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
