// server/app.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config');
const messageRoutes = require('./routes/messages');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(bodyParser.json());
app.use('/api/messages', messageRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
