import { useState } from 'react'
import auth from '../services/auth'

function Login({ setActive }){
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await auth.login(username, password)
      setActive('dashboard')
    } catch (err) {
      console.error('login failed', err)
      setError(err?.response?.data?.detail || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const card = { maxWidth:420, margin:'40px auto', background:'#fff', padding:28, borderRadius:8, boxShadow:'0 8px 30px rgba(0,0,0,0.08)'}

  return (
    <div>
      <div style={card}>
        <h2 style={{marginTop:0, marginBottom:6}}>Sign in</h2>
        <p style={{color:'#6b7280', marginTop:0}}>Sign in to access the admin and management features.</p>

        {error && <div style={{color:'red', marginBottom:12}}>{error}</div>}

        <form onSubmit={submit}>
          <div style={{marginBottom:12}}>
            <label style={{display:'block', marginBottom:6, fontSize:13}}>Username</label>
            <input autoFocus value={username} onChange={e=>setUsername(e.target.value)} placeholder="username" style={{width:'100%', padding:10, borderRadius:6, border:'1px solid #e5e7eb'}} />
          </div>

          <div style={{marginBottom:16}}>
            <label style={{display:'block', marginBottom:6, fontSize:13}}>Password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="password" style={{width:'100%', padding:10, borderRadius:6, border:'1px solid #e5e7eb'}} />
          </div>

          <div style={{display:'flex', gap:8}}>
            <button type="submit" disabled={loading} style={{padding:'10px 14px', background:'#111827', color:'white', border:'none', borderRadius:6, cursor:'pointer'}}>{loading ? 'Signing in...' : 'Sign in'}</button>
            <button type="button" onClick={()=>{ setUsername(''); setPassword('') }} style={{padding:'10px 14px', background:'#f3f4f6', border:'none', borderRadius:6, cursor:'pointer'}}>Clear</button>
          </div>
        </form>

        <div style={{marginTop:16, fontSize:13, color:'#6b7280'}}>
          For local development you can create a dev admin via the backend seed script.
        </div>
      </div>
    </div>
  )
}

export default Login
