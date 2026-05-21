import { useState, useRef, useEffect } from "react";
import api from "../services/api";

function ChatWindow() {

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesRef = useRef(null);

  useEffect(() => {
    try {
      if (messagesRef.current) {
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
      }
    } catch (e) {}
  }, [messages, loading]);

  const sendMessage = async () => {

    if (!message.trim()) return;

    const userMessage = message;

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: userMessage
      }
    ]);

    setMessage("");
    setLoading(true);

    try {

      const res = await api.post("/api/chat", {
        message: userMessage
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: res.data.response
        }
      ]);

    } catch (err) {

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "AI service unavailable."
        }
      ]);
    }

    setLoading(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial' }}>

      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid #e6e9ee',
        marginBottom: 10,
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }}>
        <div style={{width:40, height:40, borderRadius:8, background:'#2563eb', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700}}>AI</div>
        <div>
          <div style={{fontSize:16, fontWeight:600}}>ServiceNow AI Assistant</div>
          <div style={{fontSize:12, color:'#666'}}>Ask about incidents, access requests, or IT support</div>
        </div>
      </div>

      {/* CHAT AREA */}
      <div ref={messagesRef} style={{
        flex: 1,
        overflowY: "auto",
        padding: 16,
        background: "#f7fafc",
        borderRadius: 10,
        marginBottom: 15,
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6)'
      }}>

        {messages.length === 0 && (
          <div style={{
            textAlign: "center",
            marginTop: 100,
            color: "#666"
          }}>
            <h3>Welcome to ServiceNow AI</h3>
            <p>
              Ask about incidents, access requests, or IT support.
            </p>
          </div>
        )}

        {messages.map((msg, index) => (

          <div key={index} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 12 }}>

            <div style={{
              maxWidth: '72%',
              padding: '12px 16px',
              borderRadius: 12,
              background: msg.role === 'user' ? '#0f62fe' : '#ffffff',
              color: msg.role === 'user' ? 'white' : '#111827',
              boxShadow: msg.role === 'user' ? 'none' : '0 1px 2px rgba(16,24,40,0.05)'
            }}>
              <div style={{fontSize:13, lineHeight:'18px'}}>{msg.text}</div>
            </div>

          </div>
        ))}

        {loading && (
          <div style={{ color: '#666', padding: 10, fontStyle: 'italic' }}>AI is thinking...</div>
        )}

      </div>

      {/* INPUT AREA */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="E.g. 'My VPN is down' or 'I need access to CONCUR'"
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
          style={{
            flex: 1,
            resize: 'none',
            borderRadius: 10,
            padding: 12,
            border: '1px solid #e6e9ee',
            height: 64,
            fontSize: 14
          }}
        />

        <button
          onClick={sendMessage}
          disabled={loading}
          style={{
            minWidth: 120,
            border: 'none',
            borderRadius: 10,
            background: loading ? '#93c5fd' : '#2563eb',
            color: 'white',
            cursor: loading ? 'default' : 'pointer',
            padding: '10px 16px',
            fontWeight: 600
          }}
        >
          {loading ? 'Sending...' : 'Send'}
        </button>

      </div>

    </div>
  );
}

export default ChatWindow;