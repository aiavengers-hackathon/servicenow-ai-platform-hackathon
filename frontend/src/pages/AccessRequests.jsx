import { useEffect, useState } from "react";
import api from "../services/api";

function AccessRequests() {

  const [data, setData] = useState([]);

  useEffect(() => {

    fetchList();

    async function fetchList(){
      const h = window.location.hash || ''
      const qpos = h.indexOf('?')
      if (qpos !== -1 && h.includes('id=')){
        const params = new URLSearchParams(h.slice(qpos+1))
        const id = params.get('id')
        if (id){
          const res = await api.get(`/api/access-requests/${id}`)
          setData([res.data])
          return
        }
      }

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

      {data.length === 1 && data[0].id ? (
        <div style={{background:'#fff', padding:16, borderRadius:8}}>
          <h3>Access Request #{data[0].id}</h3>
          <p><b>Application:</b> {data[0].application}</p>
          <p><b>Details:</b> {data[0].details}</p>
          <p><b>Urgency:</b> {data[0].urgency}</p>
          <p><b>Status:</b> {data[0].status}</p>
        </div>
      ) : (
        data.map((r) => (
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
        ))
      )}

    </div>
  );
}

export default AccessRequests;