function Sidebar({ setActive }) {

  const itemStyle = {
    padding: "10px 12px",
    cursor: "pointer",
    borderRadius: 6,
    marginBottom: 8
  };

  return (
    <div style={{
      width: 220,
      background: "#1f2937",
      color: "white",
      padding: 20,
      height: "100vh"
    }}>

      <h2 style={{ marginBottom: 30 }}>
        ServiceNow AI
      </h2>

      {/* Dashboard */}
      <div
        onClick={() => setActive("dashboard")}
        style={itemStyle}
        onMouseEnter={(e) => e.target.style.background = "#374151"}
        onMouseLeave={(e) => e.target.style.background = "transparent"}
      >
        🏠 Dashboard
      </div>

      {/* AI Assistant */}
      <div
        onClick={() => setActive("ai")}
        style={itemStyle}
        onMouseEnter={(e) => e.target.style.background = "#374151"}
        onMouseLeave={(e) => e.target.style.background = "transparent"}
      >
        🤖 AI Assistant
      </div>

      {/* Incidents */}
      <div
        onClick={() => setActive("incidents")}
        style={itemStyle}
        onMouseEnter={(e) => e.target.style.background = "#374151"}
        onMouseLeave={(e) => e.target.style.background = "transparent"}
      >
        🔥 Incidents
      </div>

      {/* Access */}
      <div
        onClick={() => setActive("access")}
        style={itemStyle}
        onMouseEnter={(e) => e.target.style.background = "#374151"}
        onMouseLeave={(e) => e.target.style.background = "transparent"}
      >
        🔐 Access Requests
      </div>

      {/* Change */}
      <div
        onClick={() => setActive("change")}
        style={itemStyle}
        onMouseEnter={(e) => e.target.style.background = "#374151"}
        onMouseLeave={(e) => e.target.style.background = "transparent"}
      >
        🔄 Change Requests
      </div>

    </div>
  );
}

export default Sidebar;