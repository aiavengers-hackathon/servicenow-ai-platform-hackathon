import { useEffect, useState } from "react";
import api from "../services/api";

function ChangeRequests() {

  const [data, setData] = useState([]);

  useEffect(() => {

    api.get("/api/change-requests")
      .then(res => setData(res.data));

  }, []);

  return (
    <div>

      <h2>Change Requests</h2>

      {data.map((c) => (
        <div key={c.id} style={{
          background: "#fff",
          margin: 10,
          padding: 10
        }}>
          <p><b>Change:</b> {c.title}</p>
          <p><b>Status:</b> {c.status}</p>
        </div>
      ))}

    </div>
  );
}

export default ChangeRequests;