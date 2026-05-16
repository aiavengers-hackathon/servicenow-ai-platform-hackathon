import { useEffect, useState } from "react";
import api from "../services/api";

function AccessRequests() {

  const [data, setData] = useState([]);

  useEffect(() => {

    api.get("/api/access-requests")
      .then(res => setData(res.data));

  }, []);

  return (
    <div>

      <h2>Access Requests</h2>

      {data.map((r) => (
        <div key={r.id} style={{
          background: "white",
          margin: 10,
          padding: 10,
          borderRadius: 6
        }}>
          <p><b>User:</b> {r.user}</p>
          <p><b>Application:</b> {r.application}</p>
          <p><b>Status:</b> {r.status}</p>
        </div>
      ))}

    </div>
  );
}

export default AccessRequests;