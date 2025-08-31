import React, { useState } from "react";
import axios from "axios";
import "./MessageForm.css";

const MessageForm = () => {
  const [plainText, setPlainText] = useState("");
  const [encryptionAlgorithm, setEncryptionAlgorithm] = useState("DES");
  const [encryptionResult, setEncryptionResult] = useState(null);
  const [encryptedText, setEncryptedText] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [decryptionAlgorithm, setDecryptionAlgorithm] = useState("DES");
  const [decryptionResult, setDecryptionResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // ✅ Helper: Auto-expand textarea height
  const handleAutoExpand = (e) => {
    e.target.style.height = "auto"; // reset height
    e.target.style.height = e.target.scrollHeight + "px"; // expand
  };

  const handleEncryptSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/messages/encrypt", {
        plainText,
        algorithm: encryptionAlgorithm,
      });

      setEncryptionResult(response.data);
      setErrorMessage("");
    } catch (error) {
      console.error("Error encrypting the message:", error);
    }
  };

  const handleDecryptSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/messages/decrypt", {
        encryptedText,
        secretKey,
        algorithm: decryptionAlgorithm,
        originalAlgorithm: encryptionResult?.algorithm,
      });

      setDecryptionResult(response.data.decryptedText);
      setErrorMessage("");
    } catch (error) {
      const err = error.response?.data;

      if (err?.errorType === "algorithm") {
        setDecryptionResult(null);
        setErrorMessage("");
        alert(err.error);
      } else if (err?.errorType === "key") {
        setErrorMessage("Decryption Failed: Wrong key or ciphertext");
        setDecryptionResult(null);
      } else {
        setErrorMessage("Unknown error occurred during decryption");
        setDecryptionResult(null);
      }
    }
  };

  return (
    <div className="form-container">
      {/* ===================== ENCRYPTION ===================== */}
      <div className="card encryption-card">
        <h2>🔒 Encrypt a Message</h2>
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

          <textarea
            className="input-area"
            value={plainText}
            onChange={(e) => {
              setPlainText(e.target.value);
              handleAutoExpand(e);
            }}
            placeholder="Enter your message to encrypt..."
            required
          />

          <button type="submit" className="glow-button">
            🚀 Encrypt
          </button>
        </form>

        {encryptionResult && (
          <div className="result-box">
            <h3>Encrypted Message:</h3>
            <p id="cipher">{encryptionResult.encryptedText}</p>
            <h4>Secret Key:</h4>
            <pre>{encryptionResult.secretKey}</pre>
          </div>
        )}
      </div>

      {/* ===================== DECRYPTION ===================== */}
      <div className="card decryption-card">
        <h2>🔓 Decrypt a Message</h2>
        <p className="note">⚠️ Avoid spaces after cipher text or key</p>
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
            className="input-area"
            value={encryptedText}
            onChange={(e) => {
              setEncryptedText(e.target.value);
              handleAutoExpand(e);
            }}
            placeholder="Paste cipher text here..."
            required
          />
          <textarea
            className="input-area"
            value={secretKey}
            onChange={(e) => {
              setSecretKey(e.target.value);
              handleAutoExpand(e);
            }}
            placeholder="Enter secret key..."
            required
          />

          <button type="submit" className="glow-button red">
            🔑 Decrypt
          </button>
        </form>

        {errorMessage && <p className="error">{errorMessage}</p>}

        {decryptionResult !== null && (
          <div className="result-box success">
            <h3>Decrypted Message:</h3>
            <p>{decryptionResult}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageForm;
