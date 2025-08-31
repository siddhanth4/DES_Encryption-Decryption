import React, { useState } from 'react';
import axios from 'axios';
import './MessageForm.css';

const MessageForm = () => {
  const [plainText, setPlainText] = useState('');
  const [encryptionAlgorithm, setEncryptionAlgorithm] = useState('DES');
  const [encryptionResult, setEncryptionResult] = useState(null);
  const [encryptedText, setEncryptedText] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [decryptionAlgorithm, setDecryptionAlgorithm] = useState('DES');
  const [decryptionResult, setDecryptionResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleEncryptSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/messages/encrypt', {
        plainText,
        algorithm: encryptionAlgorithm,
      });

      setEncryptionResult(response.data);
      setErrorMessage('');
    } catch (error) {
      console.error('Error encrypting the message:', error);
    }
  };

  const handleDecryptSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/messages/decrypt', {
        encryptedText,
        secretKey,
        algorithm: decryptionAlgorithm,
        originalAlgorithm: encryptionResult?.algorithm 
      });

      setDecryptionResult(response.data.decryptedText);
      setErrorMessage('');
    } catch (error) {
      const err = error.response?.data;

      if (err?.errorType === 'algorithm') {
        // ✅ Algorithm mismatch → Clear outputs, show popup only
        setDecryptionResult(null);
        setErrorMessage('');
        alert(err.error); 
      } else if (err?.errorType === 'key') {
        // ✅ Wrong key/ciphertext → Show error in place of output
        setErrorMessage('Decryption Failed: Wrong key or ciphertext'); 
        setDecryptionResult(null);
      } else {
        setErrorMessage('Unknown error occurred during decryption');
        setDecryptionResult(null);
      }
    }
  };

  return (
    <div className="container">
      {/* ===================== ENCRYPTION ===================== */}
      <div className="encryption-section">
        <center>
          <h2>Encrypt a Message</h2>
        </center>
        <form onSubmit={handleEncryptSubmit}>
          <label htmlFor="algorithm">Choose Algorithm:</label>
          <select
            id="algorithm"
            value={encryptionAlgorithm}
            onChange={(e) => setEncryptionAlgorithm(e.target.value)}
          >
            <option value="DES">DES</option>
            <option value="AES">AES</option>
            <option value="Blowfish">Blowfish</option>
          </select>

          <br />
          <textarea
            className="e"
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
            <p id="cipher">{encryptionResult.encryptedText}</p>
            <h4>Secret Key:</h4>
            <pre>{encryptionResult.secretKey}</pre>
          </div>
        )}
      </div>

      {/* ===================== DECRYPTION ===================== */}
      <div className="decryption-section">
        <center>
          <h2>Decrypt a Message</h2>
        </center>
        <p>Note: Avoid SPACE after entering cipher text or secret key below</p>
        <form onSubmit={handleDecryptSubmit}>
          <label htmlFor="decryptAlgorithm">Choose Algorithm:</label>
          <select
            id="decryptAlgorithm"
            value={decryptionAlgorithm}
            onChange={(e) => setDecryptionAlgorithm(e.target.value)}
          >
            <option value="DES">DES</option>
            <option value="AES">AES</option>
            <option value="Blowfish">Blowfish</option>
          </select>

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

        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

        {decryptionResult !== null && (
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
