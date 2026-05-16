import { useState } from "react";
import Sidebar from "./layout/Sidebar";

import Dashboard from "./pages/Dashboard";
import AIAssistant from "./pages/AIAssistant";
import Incidents from "./pages/Incidents";
import AccessRequests from "./pages/AccessRequests";
import ChangeRequests from "./pages/ChangeRequests";

function App() {

  const [active, setActive] = useState("dashboard");

  const renderPage = () => {
    switch (active) {

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