import { useState, useEffect } from "react";
import Sidebar from "./layout/Sidebar";

import Dashboard from "./pages/Dashboard";
import AIAssistant from "./pages/AIAssistant";
import Incidents from "./pages/Incidents";
import AccessRequests from "./pages/AccessRequests";
import ChangeRequests from "./pages/ChangeRequests";
import Admin from "./pages/Admin";
import Login from "./pages/Login";

function App() {

  const [active, setActive] = useState("dashboard");

  // Sync active state with URL hash (supports links like #/incidents)
  useEffect(() => {
    const applyHash = () => {
      const h = window.location.hash || "";
      if (h.startsWith("#/")) {
        const key = h.replace("#/", "");
        if (key) setActive(key);
      }
    };

    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  // update URL hash when active changes (keeps links/bookmarks working)
  useEffect(() => {
    const desired = `#/${active}`;
    if (window.location.hash !== desired) {
      window.history.replaceState(null, "", desired);
    }
  }, [active]);

  const renderPage = () => {
    switch (active) {

      case "login":
        return <Login setActive={setActive} />;

      case "ai":
        return <AIAssistant />;

      case "incidents":
        return <Incidents />;

      case "access":
        return <AccessRequests />;

      case "change":
        return <ChangeRequests />;

      default:
        return <Dashboard />;
    }
  };

  return (
    <div style={{ display: "flex" }}>

      <Sidebar setActive={setActive} />

      <div style={{
        flex: 1,
        padding: 20,
        background: "#f4f6f8",
        minHeight: "100vh"
      }}>
        {renderPage()}
      </div>

    </div>
  );
}

export default App;