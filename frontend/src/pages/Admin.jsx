import { useEffect, useState } from 'react';
import api from '../services/api';

function Admin(){
  const [counts, setCounts] = useState({incidents:0, access:0, changes:0});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function fetchCounts(){
      try {
        const [inc, ar, cr] = await Promise.all([
          api.get('/api/incidents'),
          api.get('/api/access-requests'),
          api.get('/api/change-requests')
        ]);
        if (!mounted) return;
        setCounts({incidents: inc.data.length, access: ar.data.length, changes: cr.data.length});
      } catch (err) {
        console.error('Failed to load admin counts', err);
        if (mounted) setError('Failed to load counts');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchCounts();
    return () => { mounted = false; };
  }, []);

  const navigate = (key) => {
    // programmatic navigation using hash -- works regardless of anchor handling
    window.location.hash = `#/${key}`;
    // also try history replace to update URL without reload
    try { window.history.replaceState(null, '', `#/${key}`); } catch(e){}
    // scroll to top
    window.scrollTo(0,0);
  };

  const cardStyle = {
    background: '#fff', padding:16, borderRadius:8, width: 260, boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
  };

  return (
    <div>
      <h2>Admin</h2>

      {loading ? (
        <div>Loading counts...</div>
      ) : (
        error && (
          <div style={{color:'red', marginBottom:12}}>{error}. Tiles still work below.</div>
        )
      )}

      <div style={{display:'flex', gap:20, flexWrap:'wrap'}}>
        <div style={cardStyle}>
          <h3 style={{marginTop:0}}>Incidents</h3>
          <p style={{margin:'8px 0'}}><strong>{counts.incidents}</strong> open</p>
          <button onClick={() => navigate('incidents')} style={{padding:'8px 12px', borderRadius:6, background:'#2563eb', color:'white', border:'none', cursor:'pointer'}}>View incidents</button>
        </div>

        <div style={cardStyle}>
          <h3 style={{marginTop:0}}>Access Requests</h3>
          <p style={{margin:'8px 0'}}><strong>{counts.access}</strong> requests</p>
          <button onClick={() => navigate('access')} style={{padding:'8px 12px', borderRadius:6, background:'#2563eb', color:'white', border:'none', cursor:'pointer'}}>View access requests</button>
        </div>

        <div style={cardStyle}>
          <h3 style={{marginTop:0}}>Change Requests</h3>
          <p style={{margin:'8px 0'}}><strong>{counts.changes}</strong> change requests</p>
          <button onClick={() => navigate('change')} style={{padding:'8px 12px', borderRadius:6, background:'#2563eb', color:'white', border:'none', cursor:'pointer'}}>View change requests</button>
        </div>
      </div>
    </div>
  )
}

export default Admin;
