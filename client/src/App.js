// client/src/App.js
import React from 'react';
import MessageForm from './components/MessageForm';
import './App.css';

const App = () => {
    return (
        <div className="App">
            <center><h1 className="app-heading">Encryption & Decryption App</h1></center>
            <MessageForm />
        </div>
    );
};

export default App;
