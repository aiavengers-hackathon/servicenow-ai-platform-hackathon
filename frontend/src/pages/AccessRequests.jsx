import { useEffect, useState } from "react";
import api from "../services/api";

function AccessRequests() {

  const [data, setData] = useState([]);

  useEffect(() => {

    fetchList();

    async function fetchList(){
      const res = await api.get('/api/access-requests');
      setData(res.data);
    }

  }, []);

  const updateStatus = async (id, status) => {
    await api.patch(`/api/access-requests/${id}`, { status });
    const res = await api.get('/api/access-requests');
    setData(res.data);
  }

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
          <div>
            <button onClick={() => updateStatus(r.id, 'approved')}>Approve</button>
            <button onClick={() => updateStatus(r.id, 'denied')} style={{marginLeft:8}}>Deny</button>
          </div>
        </div>
      ))}

    </div>
  );
}

export default AccessRequests;