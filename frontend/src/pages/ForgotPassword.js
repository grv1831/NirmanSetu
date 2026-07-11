// src/pages/ForgotPassword.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const BASE = 'https://nirmansetu-api.onrender.com';

export default function ForgotPassword() {
  const [mobile,   setMobile]   = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [result,   setResult]   = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch(`${BASE}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ paddingTop:62, minHeight:'100vh', background:'#FAFAF7', fontFamily:"'Sora',sans-serif", display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ width:'100%', maxWidth:420, padding:'2rem' }}>
        <div style={{ background:'#fff', border:'1.5px solid #E0D0B8', borderRadius:16, overflow:'hidden' }}>

          {/* Header */}
          <div style={{ background:'#C0392B', padding:'1.5rem 2rem' }}>
            <div style={{ fontSize:'1.1rem', fontWeight:900, color:'#fff' }}>🔑 Forgot Password</div>
            <div style={{ fontSize:'.7rem', color:'rgba(255,255,255,.65)', marginTop:'.2rem' }}>Enter your mobile number to reset password</div>
          </div>

          <div style={{ padding:'2rem' }}>
            {/* Success Result */}
            {result ? (
              <div>
                <div style={{ textAlign:'center', marginBottom:'1.5rem' }}>
                  <div style={{ fontSize:'3rem', marginBottom:'.8rem' }}>✅</div>
                  <div style={{ fontWeight:800, fontSize:'1rem', color:'#1A7A40', marginBottom:'.3rem' }}>
                    Password Reset Successfully!
                  </div>
                  <div style={{ fontSize:'.8rem', color:'#7A6652' }}>
                    Hello {result.name}!
                  </div>
                </div>

                {/* Temp Password Box */}
                <div style={{ background:'#FDF3E3', border:'2px solid #C0392B', borderRadius:10, padding:'1.2rem', textAlign:'center', marginBottom:'1.5rem' }}>
                  <div style={{ fontSize:'.68rem', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'#7A6652', marginBottom:'.5rem' }}>
                    Your Temporary Password
                  </div>
                  <div style={{ fontSize:'2.5rem', fontWeight:900, color:'#C0392B', letterSpacing:'.15em' }}>
                    {result.tempPassword}
                  </div>
                  <div style={{ fontSize:'.72rem', color:'#7A6652', marginTop:'.5rem' }}>
                    Use this to login, then change your password from dashboard
                  </div>
                </div>

                <div style={{ background:'#FEF0EE', border:'1px solid #F5C4B3', borderRadius:8, padding:'.8rem 1rem', fontSize:'.75rem', color:'#C0392B', marginBottom:'1.5rem', lineHeight:1.6 }}>
                  ⚠️ Save this password now — it will not be shown again!
                </div>

                <Link to="/login" style={{ display:'block', textAlign:'center', padding:'.85rem', background:'#C0392B', color:'#fff', borderRadius:9, fontWeight:800, fontSize:'.9rem', textDecoration:'none', boxShadow:'3px 3px 0 #7B241C' }}>
                  🔐 Go to Login
                </Link>
              </div>
            ) : (
              /* Form */
              <form onSubmit={handleSubmit}>
                {error && (
                  <div style={{ background:'#FDECEA', border:'1px solid #FADBD8', color:'#C0392B', padding:'.75rem 1rem', borderRadius:8, fontSize:'.78rem', marginBottom:'1rem' }}>
                    {error}
                  </div>
                )}

                <div style={{ marginBottom:'1.5rem' }}>
                  <label style={{ display:'block', fontSize:'.65rem', fontWeight:700, letterSpacing:'.09em', textTransform:'uppercase', color:'#7A6652', marginBottom:'.3rem' }}>
                    Registered Mobile Number
                  </label>
                  <input
                    required
                    type="tel"
                    value={mobile}
                    onChange={e => setMobile(e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                    style={{ width:'100%', padding:'.65rem .85rem', border:'1.5px solid #E0D0B8', borderRadius:7, fontFamily:"'Sora',sans-serif", fontSize:'.88rem', background:'#FDF3E3', outline:'none', boxSizing:'border-box' }}
                  />
                  <div style={{ fontSize:'.7rem', color:'#7A6652', marginTop:'.3rem' }}>
                    Enter the mobile number you registered with
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{ width:'100%', padding:'.88rem', border:'none', borderRadius:9, fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:'.9rem', background:'#C0392B', color:'#fff', cursor:loading?'not-allowed':'pointer', boxShadow:'3px 3px 0 #7B241C', opacity:loading?.7:1 }}
                >
                  {loading ? '⏳ Resetting…' : '🔑 Reset Password'}
                </button>

                <p style={{ textAlign:'center', fontSize:'.75rem', color:'#7A6652', marginTop:'1rem' }}>
                  Remember your password? <Link to="/login" style={{ color:'#C0392B', fontWeight:700 }}>Login here</Link>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}