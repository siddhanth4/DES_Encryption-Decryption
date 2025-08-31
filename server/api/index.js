// import express from "express";
// import serverless from "serverless-http";
// import messagesRoutes from "../routes/messages.js";
// import app from "../app.js";

// const app = express();

// app.use(express.json());
// app.use("/api/messages", messagesRoutes);

// // Export for Vercel
// export default serverless(app);


// server/api/index.js
import serverless from "serverless-http";
import app from "../app.js";   // import the ESM app

export default serverless(app);
