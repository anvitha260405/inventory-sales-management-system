import { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./AIChatbot.css";

const SUGGESTIONS = [
  "low stock products",
  "restock suggestions",
  "inventory value",
  "dead stock",
  "inventory summary",
  "top selling products",
  "overstocked items",
];

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export default function AIChatbot() {
  const [open, setOpen]       = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "👋 Hi! I'm your **Inventory AI Assistant**.\n\nAsk me anything about your stock — try the suggestions below or type your own question!",
      type: "info",
    },
  ]);
  const [input, setInput]     = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef             = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const sendMessage = async (text) => {
    const userMsg = text || input;
    if (!userMsg.trim()) return;

    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(`${BASE_URL}/api/ai/chat`, { message: userMsg });
      const { reply, type, data } = res.data;
      setMessages((prev) => [...prev, { role: "bot", text: reply, type, data }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "❌ Could not connect to the AI backend. Is Spring Boot running?",
          type: "error",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Parse **bold** markdown in bot messages
  const renderText = (text) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((p, i) =>
      p.startsWith("**") ? <strong key={i}>{p.slice(2, -2)}</strong> : p
    );
  };

  return (
    <>
      {/* Floating button */}
      <button className="ai-fab" onClick={() => setOpen((o) => !o)} title="AI Assistant">
        {open ? (
          <span className="ai-fab-icon">✕</span>
        ) : (
          <>
            <span className="ai-fab-icon">🤖</span>
            <span className="ai-fab-label">AI</span>
          </>
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div className="ai-chat-window">
          {/* Header */}
          <div className="ai-chat-header">
            <div className="ai-header-left">
              <span className="ai-avatar">🤖</span>
              <div>
                <div className="ai-name">Inventory AI</div>
                <div className="ai-status">
                  <span className="ai-dot" />
                  Powered by your data · No API key needed
                </div>
              </div>
            </div>
            <button className="ai-close" onClick={() => setOpen(false)}>✕</button>
          </div>

          {/* Messages */}
          <div className="ai-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`ai-msg ai-msg--${msg.role}`}>
                {msg.role === "bot" && (
                  <div className={`ai-bubble ai-bubble--${msg.type || "info"}`}>
                    <p className="ai-bubble-text">
                      {msg.text.split("\n").map((line, j) => (
                        <span key={j}>
                          {renderText(line)}
                          {j < msg.text.split("\n").length - 1 && <br />}
                        </span>
                      ))}
                    </p>

                    {/* Data table */}
                    {msg.data && msg.data.length > 0 && (
                      <div className="ai-table-wrap">
                        <table className="ai-table">
                          <thead>
                            <tr>
                              {Object.keys(msg.data[0]).map((col) => (
                                <th key={col}>{col}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {msg.data.map((row, ri) => (
                              <tr key={ri}>
                                {Object.values(row).map((val, vi) => (
                                  <td key={vi}>{val}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {msg.role === "user" && (
                  <div className="ai-user-bubble">{msg.text}</div>
                )}
              </div>
            ))}

            {loading && (
              <div className="ai-msg ai-msg--bot">
                <div className="ai-bubble ai-bubble--info ai-typing">
                  <span /><span /><span />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Suggestions */}
          <div className="ai-suggestions">
            {SUGGESTIONS.map((s) => (
              <button key={s} className="ai-chip" onClick={() => sendMessage(s)}>
                {s}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="ai-input-row">
            <input
              className="ai-input"
              placeholder="Ask about your inventory..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              disabled={loading}
            />
            <button
              className="ai-send"
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}
