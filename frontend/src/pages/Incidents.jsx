import { useEffect, useState } from "react";
import api from "../services/api";

function Incidents() {

  const [incidents, setIncidents] = useState([]);

  useEffect(() => {

    // backend API (you will implement later)
    fetchList();

    async function fetchList(){
      const res = await api.get("/api/incidents");
      setIncidents(res.data);
    }

  }, []);

  const updateStatus = async (id, status) => {
    await api.patch(`/api/incidents/${id}`, { status });
    const res = await api.get('/api/incidents');
    setIncidents(res.data);
  }

  return (
    <div>

      <h2>Incidents</h2>

      <table border="1" width="100%" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Short Description</th>
            <th>Status</th>
            <th>Priority</th>
          </tr>
        </thead>

        <tbody>
          {incidents.map((i) => (
            <tr key={i.id}>
              <td>{i.id}</td>
              <td>{i.description}</td>
              <td>{i.status}</td>
              <td>{i.priority}</td>
              <td>
                <button onClick={() => updateStatus(i.id, 'resolved')}>Resolve</button>
                <button onClick={() => updateStatus(i.id, 'closed')} style={{marginLeft:8}}>Close</button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
}

export default Incidents;