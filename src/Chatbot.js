import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FiSend, FiLoader, FiUser, FiMessageSquare } from 'react-icons/fi'; // Tambahkan FiMessageSquare
import './Chatbot.css';

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]); // Efek dijalankan setiap kali pesan atau status loading berubah

  const sendMessage = async () => {
    if (input.trim() === '' || loading) return;

    const userMessage = { text: input, sender: 'user' };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Pastikan URL ini sesuai dengan endpoint backend Anda
      const response = await axios.post('https://tuyaysolihin-chatbot.hf.space/chatbot', {
      message: input,   // ✅ cocok sama backend
      });


      const botMessage = { text: response.data.response, sender: 'bot' };
      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error mengirim pesan:', error);
      const errorMessage = { text: 'Maaf, terjadi kesalahan. Silakan coba lagi nanti.', sender: 'bot' };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h1 className="chatbot-title">ASISTEN AI🤖</h1>
        <p className="chatbot-subtitle">Tanyakan apa saja pada saya</p>
      </div>
      <div className="chatbot-messages">
        {messages.length === 0 && (
          <div className="chatbot-welcome-message">
            <FiMessageSquare size={40} />
            <p>Mulai percakapan Anda</p>
          </div>
        )}
        {messages.map((msg, index) => (
          <div key={index} className={`message-bubble-wrapper ${msg.sender}`}>
            <div className="message-bubble">
              <div className="message-content">{msg.text}</div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="message-bubble-wrapper bot">
            <div className="message-bubble loading">
              <FiLoader className="loading-icon" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="chatbot-input-area">
        <input
          type="text"
          className="chatbot-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ketik pesan Anda di sini..."
          disabled={loading}
        />
        <button className="chatbot-send-button" onClick={sendMessage} disabled={loading || input.trim() === ''}>
          <FiSend />
        </button>
      </div>
    </div>
  );
}

export default Chatbot;
