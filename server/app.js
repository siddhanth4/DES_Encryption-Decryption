// // server/app.js
// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const connectDB = require('./config');
// const messageRoutes = require('./routes/messages');

// const app = express();
// const PORT = process.env.PORT || 5000;

// connectDB();

// app.use(cors());
// app.use(bodyParser.json());
// app.use('/api/messages', messageRoutes);

// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });


// server/app.js
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import connectDB from "./config.js";      // make sure config.js uses export default
import messageRoutes from "./routes/messages.js"; // use .js and ESM syntax

// Initialize app
const app = express();

// Connect DB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/messages", messageRoutes);

// Export app for serverless
export default app;
