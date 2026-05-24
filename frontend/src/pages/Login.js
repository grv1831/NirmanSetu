// src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const inp = { width:'100%',padding:'.65rem .85rem',border:'1.5px solid #E0D0B8',borderRadius:7,fontFamily:"'Sora',sans-serif",fontSize:'.88rem',color:'#1A120A',background:'#FDF3E3',outline:'none',marginTop:'.28rem',boxSizing:'border-box' };

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [mobile,   setMobile]   = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await login(mobile, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid mobile or password.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ paddingTop:62,minHeight:'100vh',background:'#FAFAF7',fontFamily:"'Sora',sans-serif",display:'flex',alignItems:'center',justifyContent:'center' }}>
      <div style={{ width:'100%',maxWidth:420,padding:'2rem' }}>
        <div style={{ background:'#fff',border:'1.5px solid #E0D0B8',borderRadius:16,overflow:'hidden' }}>
          <div style={{ background:'#C0392B',padding:'1.5rem 2rem' }}>
            <div style={{ fontSize:'1.1rem',fontWeight:900,color:'#fff' }}>🔐 Login to NirmanSetu</div>
            <div style={{ fontSize:'.7rem',color:'rgba(255,255,255,.65)',marginTop:'.2rem' }}>निर्माण का सेतु — Welcome back</div>
          </div>
          <form onSubmit={handleSubmit} style={{ padding:'2rem' }}>
            {error && <div style={{ background:'#FDECEA',border:'1px solid #FADBD8',color:'#C0392B',padding:'.75rem 1rem',borderRadius:8,fontSize:'.78rem',marginBottom:'1rem' }}>{error}</div>}
            <div style={{ marginBottom:'1rem' }}>
              <label style={{ fontSize:'.65rem',fontWeight:700,letterSpacing:'.09em',textTransform:'uppercase',color:'#7A6652' }}>Mobile Number</label>
              <input required style={inp} type="tel" value={mobile} onChange={e=>setMobile(e.target.value)} placeholder="+91 XXXXX XXXXX" />
            </div>
            <div style={{ marginBottom:'1.5rem' }}>
              <label style={{ fontSize:'.65rem',fontWeight:700,letterSpacing:'.09em',textTransform:'uppercase',color:'#7A6652' }}>Password</label>
              <input required style={inp} type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Your password" />
            </div>
            <button type="submit" disabled={loading} style={{ width:'100%',padding:'.88rem',border:'none',borderRadius:9,fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:'.9rem',background:'#C0392B',color:'#fff',cursor:loading?'not-allowed':'pointer',boxShadow:'3px 3px 0 #7B241C',opacity:loading?.7:1 }}>
              {loading ? 'Logging in…' : '🔑 Login'}
            </button>
            <p style={{ textAlign:'center',fontSize:'.75rem',color:'#7A6652',marginTop:'1rem' }}>
              New to NirmanSetu? <Link to="/register" style={{ color:'#C0392B',fontWeight:700 }}>Register here</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
