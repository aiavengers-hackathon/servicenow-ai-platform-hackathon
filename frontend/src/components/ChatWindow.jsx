import { useState } from "react";
import api from "../services/api";

function ChatWindow() {

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

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
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100%"
    }}>

      {/* CHAT AREA */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: 10,
        background: "#f9fafb",
        borderRadius: 10,
        marginBottom: 15
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

          <div
            key={index}
            style={{
              display: "flex",
              justifyContent:
                msg.role === "user"
                  ? "flex-end"
                  : "flex-start",
              marginBottom: 12
            }}
          >

            <div
              style={{
                maxWidth: "70%",
                padding: "12px 16px",
                borderRadius: 12,
                background:
                  msg.role === "user"
                    ? "#2563eb"
                    : "#e5e7eb",
                color:
                  msg.role === "user"
                    ? "white"
                    : "black"
              }}
            >
              {msg.text}
            </div>

          </div>
        ))}

        {loading && (
          <div style={{
            color: "#666",
            padding: 10
          }}>
            AI is thinking...
          </div>
        )}

      </div>

      {/* INPUT AREA */}
      <div style={{
        display: "flex",
        gap: 10
      }}>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask for VPN help, access requests, incidents..."
          style={{
            flex: 1,
            resize: "none",
            borderRadius: 10,
            padding: 12,
            border: "1px solid #ccc",
            height: 60
          }}
        />

        <button
          onClick={sendMessage}
          style={{
            width: 120,
            border: "none",
            borderRadius: 10,
            background: "#2563eb",
            color: "white",
            cursor: "pointer"
          }}
        >
          Send
        </button>

      </div>

    </div>
  );
}

export default ChatWindow;