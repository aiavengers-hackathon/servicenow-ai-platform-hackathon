import { useState, useRef, useEffect } from "react";
import api from "../services/api";

function ChatWindow() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [pendingFlow, setPendingFlow] = useState(null);
  const [flowValues, setFlowValues] = useState({});

  const messagesRef = useRef(null);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop =
        messagesRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = message;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: userMessage,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const res = await api.post("/api/chat", {
        message: userMessage,
      });

      const data = res.data;

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: data.response,
          link: data.link,
        },
      ]);

      if (
        data.type &&
        data.type.endsWith("_pending")
      ) {
        setPendingFlow({
          type: data.type,
          missing_fields:
            data.missing_fields || [],
        });
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "AI service unavailable.",
        },
      ]);
    }

    setLoading(false);
  };

  const createItem = async () => {
    try {
      let res;

      if (
        pendingFlow.type ===
        "access_request_pending"
      ) {
        res = await api.post(
          "/api/access-requests",
          {
            application:
              flowValues.application,
            details: flowValues.details,
            urgency: flowValues.urgency,
          }
        );
      } else if (
        pendingFlow.type ===
        "incident_pending"
      ) {
        res = await api.post(
          "/api/incidents",
          {
            summary:
              flowValues.summary ||
              flowValues.title ||
              "Incident",

            description:
              flowValues.description ||
              flowValues.summary,

            severity:
              flowValues.severity ||
              "medium",
          }
        );
      } else if (
        pendingFlow.type ===
        "change_request_pending"
      ) {
        res = await api.post(
          "/api/change-requests",
          {
            title:
              flowValues.title ||
              flowValues.summary,

            description:
              flowValues.description,
          }
        );
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: `Created: ${res.data.id}`,
          link: res.data.link,
        },
      ]);

      setPendingFlow(null);
      setFlowValues({});
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text:
            "Failed to create item.",
        },
      ]);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        padding: 20,
        background: "#f3f4f6",
        fontFamily:
          "Inter, system-ui, sans-serif",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          padding: "12px 16px",
          borderBottom:
            "1px solid #e5e7eb",
          marginBottom: 10,
          display: "flex",
          alignItems: "center",
          gap: 12,
          background: "white",
          borderRadius: 10,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 8,
            background: "#2563eb",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
          }}
        >
          AI
        </div>

        <div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 600,
            }}
          >
            ServiceNow AI Assistant
          </div>

          <div
            style={{
              fontSize: 12,
              color: "#6b7280",
            }}
          >
            Ask about incidents,
            access requests, or IT
            support
          </div>
        </div>
      </div>

      {/* CHAT AREA */}
      <div
        ref={messagesRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: 16,
          background: "#ffffff",
          borderRadius: 10,
          marginBottom: 15,
          border:
            "1px solid #e5e7eb",
        }}
      >
        {messages.length === 0 && (
          <div
            style={{
              textAlign: "center",
              marginTop: 100,
              color: "#6b7280",
            }}
          >
            <h3>
              Welcome to ServiceNow
              AI
            </h3>

            <p>
              Ask about incidents,
              access requests, or IT
              support.
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

              marginBottom: 12,
            }}
          >
            <div
              style={{
                maxWidth: "70%",
                padding:
                  "12px 16px",
                borderRadius: 12,
                background:
                  msg.role === "user"
                    ? "#2563eb"
                    : "#f9fafb",

                color:
                  msg.role === "user"
                    ? "white"
                    : "#111827",

                border:
                  msg.role === "user"
                    ? "none"
                    : "1px solid #e5e7eb",
              }}
            >
              <div
                style={{
                  lineHeight: "22px",
                }}
              >
                {msg.text}
              </div>

              {msg.link && (
                <div
                  style={{
                    marginTop: 8,
                  }}
                >
                  <a
                    href={msg.link}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View item
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div
            style={{
              color: "#6b7280",
              padding: 10,
              fontStyle: "italic",
            }}
          >
            AI is thinking...
          </div>
        )}
      </div>

      {/* PENDING FLOW */}
      {pendingFlow && (
        <div
          style={{
            background: "white",
            padding: 16,
            borderRadius: 10,
            marginBottom: 15,
            border:
              "1px solid #e5e7eb",
          }}
        >
          <h4
            style={{
              marginTop: 0,
            }}
          >
            Complete Request Details
          </h4>

          {pendingFlow.missing_fields.map(
            (field) => (
              <div
                key={field}
                style={{
                  marginBottom: 12,
                }}
              >
                <label
                  style={{
                    display: "block",
                    marginBottom: 6,
                    fontSize: 14,
                    fontWeight: 500,
                  }}
                >
                  {field.replace(
                    "_",
                    " "
                  )}
                </label>

                <input
                  value={
                    flowValues[field] ||
                    ""
                  }
                  onChange={(e) =>
                    setFlowValues(
                      (prev) => ({
                        ...prev,
                        [field]:
                          e.target.value,
                      })
                    )
                  }
                  style={{
                    width: "100%",
                    padding: 10,
                    borderRadius: 8,
                    border:
                      "1px solid #d1d5db",
                  }}
                />
              </div>
            )
          )}

          <div
            style={{
              display: "flex",
              gap: 10,
            }}
          >
            <button
              onClick={createItem}
              style={{
                padding:
                  "10px 16px",
                background:
                  "#2563eb",
                color: "white",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              Create
            </button>

            <button
              onClick={() => {
                setPendingFlow(
                  null
                );
                setFlowValues({});
              }}
              style={{
                padding:
                  "10px 16px",
                background:
                  "#f3f4f6",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* INPUT AREA */}
      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "center",
        }}
      >
        <textarea
          value={message}
          onChange={(e) =>
            setMessage(
              e.target.value
            )
          }
          placeholder="Describe your issue..."
          onKeyDown={(e) => {
            if (
              e.key === "Enter" &&
              !e.shiftKey
            ) {
              e.preventDefault();
              sendMessage();
            }
          }}
          style={{
            flex: 1,
            resize: "none",
            borderRadius: 10,
            padding: 12,
            border:
              "1px solid #d1d5db",
            height: 70,
            fontSize: 14,
          }}
        />

        <button
          onClick={sendMessage}
          disabled={loading}
          style={{
            minWidth: 120,
            border: "none",
            borderRadius: 10,
            background: loading
              ? "#93c5fd"
              : "#2563eb",
            color: "white",
            cursor: loading
              ? "default"
              : "pointer",
            padding:
              "12px 18px",
            fontWeight: 600,
          }}
        >
          {loading
            ? "Sending..."
            : "Send"}
        </button>
      </div>
    </div>
  );
}

export default ChatWindow;
