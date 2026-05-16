import { useEffect, useState } from "react";
import api from "../services/api";

function Dashboard() {

  const [stats, setStats] = useState({
    incidents: 0,
    accessRequests: 0,
    changeRequests: 0
  });

  const [recentTickets, setRecentTickets] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {

      // These APIs you will implement in backend
      const [inc, access, change, recent] = await Promise.all([
        api.get("/api/incidents/count"),
        api.get("/api/access-requests/count"),
        api.get("/api/change-requests/count"),
        api.get("/api/tickets/recent")
      ]);

      setStats({
        incidents: inc.data.count,
        accessRequests: access.data.count,
        changeRequests: change.data.count
      });

      setRecentTickets(recent.data);

    } catch (err) {
      console.log("Dashboard load error", err);
    }
  };

  return (
    <div>

      {/* HEADER */}
      <h1 style={{ marginBottom: 20 }}>
        ServiceNow AI Dashboard
      </h1>

      {/* KPI CARDS */}
      <div style={{
        display: "flex",
        gap: 15,
        marginBottom: 30
      }}>

        <Card title="Incidents" value={stats.incidents} color="#ff4d4f" />
        <Card title="Access Requests" value={stats.accessRequests} color="#1890ff" />
        <Card title="Change Requests" value={stats.changeRequests} color="#52c41a" />

      </div>

      {/* MAIN GRID */}
      <div style={{
        display: "flex",
        gap: 20
      }}>

        {/* LEFT: RECENT TICKETS */}
        <div style={{
          flex: 2,
          background: "white",
          padding: 15,
          borderRadius: 10
        }}>

          <h3>Recent Tickets</h3>

          <table width="100%" cellPadding="10">
            <thead>
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Description</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {recentTickets.map((t, i) => (
                <tr key={i}>
                  <td>{t.id}</td>
                  <td>{t.type}</td>
                  <td>{t.description}</td>
                  <td>{t.status}</td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>

        {/* RIGHT: AI PANEL */}
        <div style={{
          flex: 1,
          background: "#f9f9f9",
          padding: 15,
          borderRadius: 10
        }}>

          <h3>AI Insights</h3>

          <AIInsight />

        </div>

      </div>

    </div>
  );
}

/* ---------------- KPI CARD ---------------- */
function Card({ title, value, color }) {
  return (
    <div style={{
      flex: 1,
      background: "white",
      padding: 20,
      borderRadius: 10,
      borderLeft: `6px solid ${color}`
    }}>
      <h4>{title}</h4>
      <h2>{value}</h2>
    </div>
  );
}

/* ---------------- AI INSIGHT PANEL ---------------- */
function AIInsight() {

  const [insight, setInsight] = useState("");

  useEffect(() => {

    async function loadAI() {

      try {

        const res = await api.post("/api/chat", {
          message: "Give me system health summary of IT operations"
        });

        setInsight(res.data.response);

      } catch (err) {
        setInsight("AI unavailable");
      }
    }

    loadAI();

  }, []);

  return (
    <div>
      <p style={{ fontSize: 14 }}>
        {insight}
      </p>
    </div>
  );
}

export default Dashboard;