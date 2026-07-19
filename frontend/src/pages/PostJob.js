// src/pages/PostJob.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const BASE = 'https://nirmansetu-api.onrender.com';

const inp = { width:'100%',padding:'.65rem .85rem',border:'1.5px solid #E0D0B8',borderRadius:7,fontFamily:"'Sora',sans-serif",fontSize:'.82rem',background:'#FDF3E3',outline:'none',marginTop:'.28rem',boxSizing:'border-box' };
const lbl = { fontSize:'.62rem',fontWeight:700,letterSpacing:'.09em',textTransform:'uppercase',color:'#7A6652' };
const STATES = ["Uttar Pradesh","Maharashtra","Rajasthan","Bihar","Gujarat","Madhya Pradesh","Tamil Nadu","Karnataka","Haryana","Punjab","Delhi","West Bengal","Odisha","Jharkhand","Chhattisgarh"];

export default function PostJob() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title:'',description:'',workType:'Mason',state:'',district:'',village:'',duration:'1 Day',budget:'' });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${BASE}/api/jobs`, {
        title: form.title, description: form.description, workType: form.workType,
        location: { state: form.state, district: form.district, village: form.village },
        duration: form.duration, budget: Number(form.budget),
      });
      setDone(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch(e) { alert('Failed: ' + (e.response?.data?.message || e.message)); }
    finally { setLoading(false); }
  };

  if (done) return (
    <div style={{ paddingTop:100,textAlign:'center',fontFamily:"'Sora',sans-serif" }}>
      <div style={{ fontSize:'4rem',marginBottom:'1rem' }}>✅</div>
      <h2 style={{ color:'#27AE60',fontWeight:900 }}>Job Posted!</h2>
      <p style={{ color:'#7A6652',marginTop:'.5rem' }}>Redirecting to dashboard…</p>
    </div>
  );

  return (
    <div style={{ paddingTop:62,minHeight:'100vh',background:'#FAFAF7',fontFamily:"'Sora',sans-serif" }}>
      <div style={{ background:'#1C2833',padding:'2rem 2.5rem' }}>
        <h2 style={{ fontSize:'1.6rem',fontWeight:900,color:'#fff',letterSpacing:'-.03em' }}>Post a Job</h2>
        <p style={{ fontSize:'.78rem',color:'rgba(255,255,255,.4)',marginTop:'.3rem' }}>Describe your requirement — matching workers will be notified</p>
      </div>
      <div style={{ maxWidth:600,margin:'2rem auto',padding:'0 2.5rem 4rem' }}>
        <div style={{ background:'#fff',border:'1.5px solid #E0D0B8',borderRadius:14,padding:'2rem' }}>
          <form onSubmit={submit}>
            <div style={{ marginBottom:'.9rem' }}><label style={lbl}>Job Title *</label><input required style={inp} value={form.title} onChange={e=>set('title',e.target.value)} placeholder="e.g. Need mason for house construction" /></div>
            <div style={{ marginBottom:'.9rem' }}><label style={lbl}>Work Type *</label>
              <select required style={inp} value={form.workType} onChange={e=>set('workType',e.target.value)}>
                {['Mason','Electrician','Plumber','Carpenter','Painter','Helper','Welder','Tiling'].map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
            <div style={{ marginBottom:'.9rem' }}><label style={lbl}>Job Description *</label><textarea required style={{...inp,minHeight:100,resize:'vertical'}} value={form.description} onChange={e=>set('description',e.target.value)} placeholder="Describe the work in detail…" /></div>
            <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'.8rem',marginBottom:'.9rem' }}>
              <div><label style={lbl}>State</label>
                <select style={inp} value={form.state} onChange={e=>set('state',e.target.value)}>
                  <option value="">Select State</option>
                  {STATES.map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
              <div><label style={lbl}>District</label><input style={inp} value={form.district} onChange={e=>set('district',e.target.value)} placeholder="Your district" /></div>
              <div><label style={lbl}>Village / Area</label><input style={inp} value={form.village} onChange={e=>set('village',e.target.value)} placeholder="Village or locality" /></div>
              <div><label style={lbl}>Duration</label>
                <select style={inp} value={form.duration} onChange={e=>set('duration',e.target.value)}>
                  {['1 Day','2-3 Days','1 Week','2 Weeks','1 Month+'].map(d=><option key={d}>{d}</option>)}
                </select>
              </div>
            </div>
            <div style={{ marginBottom:'1.2rem' }}><label style={lbl}>Budget (₹/day)</label><input style={inp} type="number" value={form.budget} onChange={e=>set('budget',e.target.value)} placeholder="Max daily rate you'll pay" /></div>
            <button type="submit" disabled={loading} style={{ width:'100%',padding:'.88rem',border:'none',borderRadius:9,fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:'.9rem',background:'#C0392B',color:'#fff',cursor:'pointer',boxShadow:'3px 3px 0 #7B241C' }}>
              {loading ? 'Posting…' : '📋 Post This Job'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
