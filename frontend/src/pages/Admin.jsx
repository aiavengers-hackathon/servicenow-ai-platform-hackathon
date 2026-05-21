import { useEffect, useState } from 'react';
import api from '../services/api';

function Admin(){
  const [counts, setCounts] = useState({incidents:0, access:0, changes:0});

  useEffect(() => {
    async function fetchCounts(){
      const inc = await api.get('/api/incidents');
      const ar = await api.get('/api/access-requests');
      const cr = await api.get('/api/change-requests');
      setCounts({incidents: inc.data.length, access: ar.data.length, changes: cr.data.length});
    }
    fetchCounts();
  }, []);

  return (
    <div>
      <h2>Admin</h2>
      <div style={{display:'flex', gap:20}}>
        <div style={{background:'#fff', padding:16, borderRadius:8}}>
          <h3>Incidents</h3>
          <p>{counts.incidents} open</p>
          <a href="#/incidents">View incidents</a>
        </div>
        <div style={{background:'#fff', padding:16, borderRadius:8}}>
          <h3>Access Requests</h3>
          <p>{counts.access} requests</p>
          <a href="#/access">View access requests</a>
        </div>
        <div style={{background:'#fff', padding:16, borderRadius:8}}>
          <h3>Change Requests</h3>
          <p>{counts.changes} change requests</p>
          <a href="#/change">View change requests</a>
        </div>
      </div>
    </div>
  )
}

export default Admin;
