import { useEffect, useState } from "react";
import api from "../services/api";

function ChangeRequests() {

  const [data, setData] = useState([]);

  useEffect(() => {

    fetchList();

    async function fetchList(){
      const res = await api.get('/api/change-requests');
      setData(res.data);
    }

  }, []);

  const updateStatus = async (id, status) => {
    await api.patch(`/api/change-requests/${id}`, { status });
    const res = await api.get('/api/change-requests');
    setData(res.data);
  }

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
          <div>
            <button onClick={() => updateStatus(c.id, 'scheduled')}>Schedule</button>
            <button onClick={() => updateStatus(c.id, 'completed')} style={{marginLeft:8}}>Complete</button>
          </div>
        </div>
      ))}

    </div>
  );
}

export default ChangeRequests;