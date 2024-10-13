// server/routes/messages.js
const express = require('express');
const router = express.Router();
const CryptoJS = require('crypto-js');

// Function to generate a random secret key for DES encryption
const generateKey = () => {
    return CryptoJS.lib.WordArray.random(64 / 8).toString();
};

// Function to encrypt a message using DES
const encryptMessage = (text, secretKey) => {
    return CryptoJS.DES.encrypt(text, secretKey).toString();
};

// Function to decrypt a message using DES
const decryptMessage = (encryptedText, secretKey) => {
    const bytes = CryptoJS.DES.decrypt(encryptedText, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
};

// POST request to encrypt a message
router.post('/encrypt', (req, res) => {
    const { plainText } = req.body;
    const secretKey = generateKey(); // Generate a random secret key for encryption
    const encryptedText = encryptMessage(plainText, secretKey); // Encrypt the message

    // Return the encrypted text and the key
    res.status(200).json({
        encryptedText,
        secretKey,
    });
});

// POST request to decrypt a message
router.post('/decrypt', (req, res) => {
    const { encryptedText, secretKey } = req.body;
    try {
        const decryptedText = decryptMessage(encryptedText, secretKey); // Decrypt the message
        res.status(200).json({ decryptedText });
    } catch (error) {
        res.status(400).json({ error: 'Invalid Key or Cipher text' });
    }
});

module.exports = router;
