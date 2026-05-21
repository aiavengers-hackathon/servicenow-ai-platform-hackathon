import { useEffect, useState } from "react";
import api from "../services/api";

function ChangeRequests() {

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
          const res = await api.get(`/api/change-requests/${id}`)
          setData([res.data])
          return
        }
      }

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

      {data.length === 1 && data[0].id ? (
        <div style={{background:'#fff', padding:16, borderRadius:8}}>
          <h3>Change Request #{data[0].id}</h3>
          <p><b>Title:</b> {data[0].title}</p>
          <p><b>Description:</b> {data[0].description}</p>
          <p><b>Status:</b> {data[0].status}</p>
        </div>
      ) : (
        data.map((c) => (
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
        ))
      )}

    </div>
  );
}

export default ChangeRequests;