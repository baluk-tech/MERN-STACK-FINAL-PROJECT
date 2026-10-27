import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiUser } from 'react-icons/fi';
import { FaRobot } from 'react-icons/fa'; // Mela intha icon-a install/import pannikkonga
import instance from '../Utils/Middleware';

function AskAI() {
  const [messages, setMessages] = useState([
    { 
      sender: 'ai', 
      text: "Hello! I'm your StitchAI Stylist. Planning for a wedding, reception, or casual outing? Ask me for fabric, color, or style suggestions! 👗👔" 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Puthu message vantha automatic ah keezha scroll aaga
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => { scrollToBottom(); }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // 1. User message-a chat-la add pandrom
    const userMsg = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // 2. Backend API-ku anuppurom
      const res = await instance.post('/user/ask-ai', { prompt: userMsg.text });
      
      // 3. AI response-a chat-la add pandrom
      const aiMsg = { sender: 'ai', text: res.data.reply };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { sender: 'ai', text: "Sorry, I am facing a network issue. Please try again later! 🔌" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-light min-vh-100 py-4 py-md-5">
      <div className="container" style={{ maxWidth: '800px' }}>
        
        <div className="card border-0 shadow-lg rounded-4 overflow-hidden d-flex flex-column" style={{ height: '80vh' }}>
          
          {/* Chat Header */}
          <div className="bg-white p-4 border-bottom d-flex align-items-center gap-3">
            <div className="bg-light text-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
              <FaRobot size={24} style={{ color: 'var(--purple)' }} />
            </div>
            <div>
              <h5 className="fw-bold mb-0 text-dark">StitchAI Stylist</h5>
              <small className="text-muted">Powered by AI</small>
            </div>
          </div>

          {/* Chat Messages Area */}
          <div className="card-body p-4 overflow-auto d-flex flex-column gap-3" style={{ backgroundColor: '#f8f9fa' }}>
            {messages.map((msg, index) => (
              <div key={index} className={`d-flex ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                
                {msg.sender === 'ai' && (
                  <div className="me-2 mt-auto mb-2 text-muted"><FaRobot size={14} /></div>
                )}
                
                <div 
                  className={`px-4 py-3 rounded-4 shadow-sm ${msg.sender === 'user' ? 'text-white' : 'bg-white text-dark border'}`}
                  style={{ 
                    background: msg.sender === 'user' ? 'var(--purple)' : 'white',
                    maxWidth: '75%', 
                    borderBottomRightRadius: msg.sender === 'user' ? '4px' : '1rem',
                    borderBottomLeftRadius: msg.sender === 'ai' ? '4px' : '1rem',
                  }}
                >
                  {msg.text}
                </div>

                {msg.sender === 'user' && (
                  <div className="ms-2 mt-auto mb-2 text-muted"><FiUser size={14} /></div>
                )}
              </div>
            ))}
            
            {loading && (
              <div className="d-flex justify-content-start">
                <div className="me-2 mt-auto mb-2 text-muted"><FaRobot size={14} /></div>
                <div className="px-4 py-3 rounded-4 bg-white text-muted shadow-sm border" style={{ borderBottomLeftRadius: '4px' }}>
                  <span className="spinner-grow spinner-grow-sm me-1" role="status" aria-hidden="true"></span>
                  <span className="spinner-grow spinner-grow-sm me-1" role="status" aria-hidden="true"></span>
                  <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Box */}
          <div className="bg-white p-3 border-top">
            <form onSubmit={handleSend} className="d-flex gap-2">
              <input 
                type="text" 
                className="form-control rounded-pill px-4 py-2 bg-light border-0 shadow-none" 
                placeholder="E.g., Suggest a design for a silk shirt..." 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
              />
              <button 
                type="submit" 
                className="btn rounded-circle text-white d-flex align-items-center justify-content-center"
                style={{ width: '45px', height: '45px', background: 'var(--purple)' }}
                disabled={loading || !input.trim()}
              >
                <FiSend />
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}

export default AskAI;