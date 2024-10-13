// client/src/components/MessageForm.js
import React, { useState } from 'react';
import axios from 'axios';
import './MessageForm.css'; // Import the CSS file

const MessageForm = () => {
    const [plainText, setPlainText] = useState('');
    const [encryptionResult, setEncryptionResult] = useState(null);
    const [encryptedText, setEncryptedText] = useState('');
    const [secretKey, setSecretKey] = useState('');
    const [decryptionResult, setDecryptionResult] = useState(null);
    const [errorMessage, setErrorMessage] = useState(''); // New state for error message

    const handleEncryptSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/messages/encrypt', { plainText });
            setEncryptionResult(response.data);
            setErrorMessage(''); // Reset error message on successful encryption
        } catch (error) {
            console.error('Error encrypting the message:', error);
        }
    };

    const handleDecryptSubmit = async (e) => {
        e.preventDefault();
        // Check if the provided cipher text and secret key match the expected values
        if (encryptedText !== encryptionResult?.encryptedText || secretKey !== encryptionResult?.secretKey) {
            setErrorMessage("Your Cipher Text or Key is Incorrect");
            setDecryptionResult(null); // Clear previous decryption result
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/messages/decrypt', {
                encryptedText,
                secretKey,
            });
            setDecryptionResult(response.data.decryptedText);
            setErrorMessage(''); // Reset error message on successful decryption
        } catch (error) {
            console.error('Error decrypting the message:', error);
            setDecryptionResult('Error decrypting message. Check the key and cipher text.');
            setErrorMessage(''); // Reset error message on decryption error
        }
    };

    return (
        <div className="container">
            <div className="encryption-section">
                <center> <h2>Encrypt a Message using DES</h2> </center>
                <form onSubmit={handleEncryptSubmit}>
                    <textarea className='e'
                        value={plainText}
                        onChange={(e) => setPlainText(e.target.value)}
                        placeholder="Enter your message to encrypt"
                        rows="4"
                        cols="50"
                        required
                    />
                    <button type="submit">Encrypt Message</button>
                </form>

                {encryptionResult && (
                    <div>
                        <h3>Encrypted Message:</h3>
                        <p id='cipher'>{encryptionResult.encryptedText}</p>
                        <h4>Secret Key:</h4>
                        <pre>{encryptionResult.secretKey}</pre>
                    </div>
                )}
            </div>

            <div className="decryption-section">
                <center><h2>Decrypt a Message using DES</h2></center>
                <p>Note: Avoid SPACE after entering cipher text or secret key below </p>   
                <form onSubmit={handleDecryptSubmit}>
                    <textarea
                        value={encryptedText}
                        onChange={(e) => setEncryptedText(e.target.value)}
                        placeholder="Enter the cipher text to decrypt"
                        rows="4"
                        cols="50"
                        required
                    />
                    <textarea
                        value={secretKey}
                        onChange={(e) => setSecretKey(e.target.value)}
                        placeholder="Enter the secret key"
                        rows="1"
                        cols="50"
                        required
                    />
                    <button type="submit">Decrypt Message</button>
                </form>

                {errorMessage && (
                    <p style={{ color: 'red' }}>{errorMessage}</p> // Display error message in red
                )}

                {decryptionResult && (
                    <div>
                        <h3>Decrypted Message:</h3>
                        <p>{decryptionResult}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MessageForm;
