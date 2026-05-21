import { useEffect, useState } from "react";
import api from "../services/api";

function Incidents() {

  const [incidents, setIncidents] = useState([]);

  useEffect(() => {

    // backend API (you will implement later)
    fetchList();

    async function fetchList(){
      // detect if URL has an id param like #/incidents?id=123
      const h = window.location.hash || ''
      const qpos = h.indexOf('?')
      if (qpos !== -1 && h.includes('id=')){
        const params = new URLSearchParams(h.slice(qpos+1))
        const id = params.get('id')
        if (id){
          const res = await api.get(`/api/incidents/${id}`)
          setIncidents([res.data])
          return
        }
      }

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

      {incidents.length === 1 && incidents[0].id ? (
        <div style={{background:'#fff', padding:16, borderRadius:8}}>
          <h3>Incident #{incidents[0].id}</h3>
          <p><b>Summary:</b> {incidents[0].summary || incidents[0].description}</p>
          <p><b>Description:</b> {incidents[0].description}</p>
          <p><b>Status:</b> {incidents[0].status}</p>
          <p><b>Priority:</b> {incidents[0].priority}</p>
          <p><b>Reporter:</b> {incidents[0].reporter_id}</p>
        </div>
      ) : (
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
      )}

    </div>
  );
}

export default Incidents;