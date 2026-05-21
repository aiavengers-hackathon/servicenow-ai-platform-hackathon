import { useState, useEffect } from "react";
import auth, { currentUser } from "../services/auth";

function Sidebar({ setActive }) {

  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {

    setToken(auth.getToken());

    let mounted = true;

    currentUser()
      .then((u) => {
        if (mounted && u) {
          setUser(u);
        }
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };

  }, []);

  const itemStyle = {
    padding: "10px 12px",
    cursor: "pointer",
    borderRadius: 6,
    marginBottom: 8,
  };

  return (
    <div
      style={{
        width: 220,
        background: "#1f2937",
        color: "white",
        padding: 20,
        height: "100vh",
      }}
    >
      <h2 style={{ marginBottom: 30 }}>
        ServiceNow AI
      </h2>

      {/* Dashboard */}
      <div
        onClick={() => setActive("dashboard")}
        style={itemStyle}
        onMouseEnter={(e) =>
          (e.target.style.background = "#374151")
        }
        onMouseLeave={(e) =>
          (e.target.style.background = "transparent")
        }
      >
        🏠 Dashboard
      </div>

      {/* AI */}
      <div
        onClick={() => setActive("ai")}
        style={itemStyle}
        onMouseEnter={(e) =>
          (e.target.style.background = "#374151")
        }
        onMouseLeave={(e) =>
          (e.target.style.background = "transparent")
        }
      >
        🤖 AI Assistant
      </div>

      {/* Incidents */}
      <div
        onClick={() => setActive("incidents")}
        style={itemStyle}
        onMouseEnter={(e) =>
          (e.target.style.background = "#374151")
        }
        onMouseLeave={(e) =>
          (e.target.style.background = "transparent")
        }
      >
        🔥 Incidents
      </div>

      {/* Access */}
      <div
        onClick={() => setActive("access")}
        style={itemStyle}
        onMouseEnter={(e) =>
          (e.target.style.background = "#374151")
        }
        onMouseLeave={(e) =>
          (e.target.style.background = "transparent")
        }
      >
        🔐 Access Requests
      </div>

      {/* Change */}
      <div
        onClick={() => setActive("change")}
        style={itemStyle}
        onMouseEnter={(e) =>
          (e.target.style.background = "#374151")
        }
        onMouseLeave={(e) =>
          (e.target.style.background = "transparent")
        }
      >
        🔄 Change Requests
      </div>

      {/* Admin */}
      <div
        onClick={() => setActive("admin")}
        style={itemStyle}
        onMouseEnter={(e) =>
          (e.target.style.background = "#374151")
        }
        onMouseLeave={(e) =>
          (e.target.style.background = "transparent")
        }
      >
        🛠️ Admin
      </div>

      {/* Auth */}
      <div style={{ marginTop: 20 }}>

        {user ? (
          <div
            style={{
              color: "#9ca3af",
              marginBottom: 8,
            }}
          >
            Signed in as{" "}
            <strong style={{ color: "#fff" }}>
              {user.username}
            </strong>
          </div>
        ) : null}

        {token ? (
          <div
            onClick={() => {
              auth.clearToken();
              setToken(null);
              setUser(null);
              setActive("login");
            }}
            style={itemStyle}
            onMouseEnter={(e) =>
              (e.target.style.background = "#374151")
            }
            onMouseLeave={(e) =>
              (e.target.style.background = "transparent")
            }
          >
            🔓 Sign out
          </div>
        ) : (
          <div
            onClick={() => setActive("login")}
            style={itemStyle}
            onMouseEnter={(e) =>
              (e.target.style.background = "#374151")
            }
            onMouseLeave={(e) =>
              (e.target.style.background = "transparent")
            }
          >
            🔐 Sign in
          </div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;