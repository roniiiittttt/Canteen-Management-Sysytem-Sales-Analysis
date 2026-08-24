import React, { useState } from "react";
import { askAiAnalysis } from "../services/analyticsService";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const AiSidebar = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hello! I am your AI Business Analyst. How can I help you analyze the canteen data today?" }
  ]);
  const [aiIntent, setAiIntent] = useState("");
  const [aiChartData, setAiChartData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userQ = query.trim();
    setMessages(prev => [...prev, { role: "user", text: userQ }]);
    setQuery("");
    setLoading(true);
    setAiIntent("");
    setAiChartData(null);

    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const endDate = today;

    try {
      const response = await askAiAnalysis({
        question: userQ,
        startDate: startDate.toISOString().slice(0, 10),
        endDate: endDate.toISOString().slice(0, 10),
      });
      setMessages(prev => [...prev, { role: "ai", text: response.answer || "I'm sorry, I couldn't process that." }]);
      setAiIntent(response.intent || "");
      setAiChartData(response.chartData || null);
    } catch (err) {
      setMessages(prev => [...prev, { role: "ai", text: "Error: Could not connect to AI service." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestion = (q) => {
    setQuery(q);
  };

  return (
    <>
      <div style={{
        position: "fixed",
        top: 0,
        right: isOpen ? 0 : "-400px",
        width: "400px",
        height: "100vh",
        background: "#ffffff",
        boxShadow: "-4px 0 24px rgba(0,0,0,0.1)",
        zIndex: 1000,
        transition: "right 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Outfit', sans-serif"
      }}>
        <div style={{
          padding: "20px",
          borderBottom: "1px solid #e2e8f0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#f8fafc"
        }}>
          <h2 style={{ margin: 0, color: "#0f172a", fontSize: "18px", fontWeight: "600" }}>AI Business Analyst</h2>
          <button onClick={onClose} style={{
            background: "transparent", border: "none", fontSize: "24px", cursor: "pointer", color: "#64748b"
          }}>&times;</button>
        </div>

        <div style={{
          flex: 1,
          padding: "20px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          background: "#f1f5f9"
        }}>
          {messages.map((msg, i) => (
            <div key={i} style={{
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              background: msg.role === "user" ? "#3b82f6" : "#ffffff",
              color: msg.role === "user" ? "#ffffff" : "#1e293b",
              padding: "12px 16px",
              borderRadius: msg.role === "user" ? "16px 16px 0 16px" : "16px 16px 16px 0",
              maxWidth: "85%",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              lineHeight: 1.5,
              whiteSpace: "pre-wrap",
              fontSize: "14px"
            }}>
              {msg.text}
              
              {/* Render charts ONLY on the very last AI message if we have data */}
              {msg.role === "ai" && i === messages.length - 1 && aiIntent === "best_selling_products" && aiChartData?.topProducts && (
                <div style={{ height: "200px", marginTop: "16px", width: "100%" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={aiChartData.topProducts} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="productName" tick={{fontSize: 10}} />
                      <YAxis yAxisId="left" tick={{fontSize: 10}} />
                      <Tooltip />
                      <Bar yAxisId="left" dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
              {msg.role === "ai" && i === messages.length - 1 && aiIntent === "category_performance" && aiChartData?.categories && (
                <div style={{ height: "200px", marginTop: "16px", width: "100%" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={aiChartData.categories} dataKey="revenue" nameKey="category" cx="50%" cy="50%" outerRadius={60} label={false}>
                        {aiChartData.categories.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"][index % 5]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend wrapperStyle={{fontSize: "10px"}} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
              {msg.role === "ai" && i === messages.length - 1 && aiIntent === "operations_payment_summary" && aiChartData?.operationsPayments?.payments?.byMethod && (
                <div style={{ height: "200px", marginTop: "16px", width: "100%" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={aiChartData.operationsPayments.payments.byMethod} dataKey="revenue" nameKey="method" cx="50%" cy="50%" outerRadius={60} label={false}>
                        {aiChartData.operationsPayments.payments.byMethod.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={["#10b981", "#3b82f6", "#f59e0b"][index % 3]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend wrapperStyle={{fontSize: "10px"}} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div style={{
              alignSelf: "flex-start",
              background: "#ffffff",
              padding: "12px 16px",
              borderRadius: "16px 16px 16px 0",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              fontSize: "14px",
              color: "#64748b"
            }}>
              Analyzing data...
            </div>
          )}
        </div>

        <div style={{ padding: "16px", borderTop: "1px solid #e2e8f0", background: "#ffffff" }}>
          <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "8px", marginBottom: "8px", scrollbarWidth: "none" }}>
            {["Best-selling products?", "Category performance?", "Operations summary?"].map(q => (
              <button key={q} onClick={() => handleSuggestion(q)} style={{
                background: "#f1f5f9",
                border: "1px solid #cbd5e1",
                borderRadius: "20px",
                padding: "6px 12px",
                fontSize: "12px",
                color: "#475569",
                cursor: "pointer",
                whiteSpace: "nowrap"
              }}>
                {q}
              </button>
            ))}
          </div>
          <form onSubmit={handleSubmit} style={{ display: "flex", gap: "8px" }}>
            <input 
              type="text" 
              value={query} 
              onChange={e => setQuery(e.target.value)}
              placeholder="Ask a question..."
              style={{
                flex: 1,
                padding: "10px 14px",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                outline: "none",
                fontSize: "14px"
              }}
            />
            <button type="submit" disabled={loading} style={{
              background: "#ef4444",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "0 16px",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: "600"
            }}>
              Send
            </button>
          </form>
        </div>
      </div>
      
      {/* Overlay */}
      {isOpen && (
        <div onClick={onClose} style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.2)",
          zIndex: 999
        }}></div>
      )}
    </>
  );
};

export default AiSidebar;
