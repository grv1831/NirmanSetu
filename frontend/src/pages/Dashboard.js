// src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const card = { background:'#fff',border:'1.5px solid #E0D0B8',borderRadius:13,padding:'1.8rem',marginBottom:'1.5rem' };
const inp  = { width:'100%',padding:'.62rem .85rem',border:'1.5px solid #E0D0B8',borderRadius:7,fontFamily:"'Sora',sans-serif",fontSize:'.82rem',color:'#1A120A',background:'#FDF3E3',outline:'none',marginTop:'.28rem',boxSizing:'border-box' };
const lbl  = { display:'block',fontSize:'.62rem',fontWeight:700,letterSpacing:'.09em',textTransform:'uppercase',color:'#7A6652',marginBottom:'.18rem' };

export default function Dashboard() {
  const { user }  = useAuth();
  const [jobs,    setJobs]    = useState([]);
  const [tab,     setTab]     = useState('profile');
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [profile, setProfile] = useState({
    dailyRate:   user?.workerProfile?.dailyRate || '',
    experience:  user?.workerProfile?.experience || '',
    bio:         user?.workerProfile?.bio || '',
    isAvailable: user?.workerProfile?.isAvailable ?? true,
  });

  // Workers: load applied jobs; Owners: load posted jobs
  useEffect(() => {
    if (!user) return;
    const endpoint = user.role === 'worker' ? '/api/jobs/my/applied' : '/api/jobs/my/posted';
    axios.get(endpoint).then(r => setJobs(r.data.data || [])).catch(() => {});
  }, [user]);

  const saveProfile = async () => {
    setSaving(true);
    try {
      await axios.put('/api/workers/profile', { workerProfile: profile });
      setSaved(true); setTimeout(() => setSaved(false), 2000);
    } catch(e) { alert('Save failed: ' + (e.response?.data?.message || e.message)); }
    finally { setSaving(false); }
  };

  const TABS = user?.role === 'worker'
    ? [['profile','👤 My Profile'],['jobs','💼 My Jobs'],['availability','🟢 Availability']]
    : [['jobs','📋 My Posted Jobs'],['post','➕ Post a Job']];

  return (
    <div style={{ paddingTop:62,minHeight:'100vh',background:'#FAFAF7',fontFamily:"'Sora',sans-serif" }}>
      {/* Header */}
      <div style={{ background:'#1C2833',padding:'2rem 2.5rem' }}>
        <div style={{ maxWidth:900,margin:'0 auto' }}>
          <h2 style={{ fontSize:'1.6rem',fontWeight:900,color:'#fff',letterSpacing:'-.03em',marginBottom:'.3rem' }}>
            Welcome, {user?.name?.split(' ')[0]}! 👋
          </h2>
          <div style={{ fontSize:'.78rem',color:'rgba(255,255,255,.4)',marginBottom:'1.5rem' }}>
            {user?.role === 'worker' ? '💼 Worker Dashboard' : user?.role === 'contractor' ? '🏗️ Contractor Dashboard' : '🏠 Owner Dashboard'}
          </div>
          <div style={{ display:'flex',gap:'.5rem' }}>
            {TABS.map(([k,label]) => (
              <button key={k} onClick={() => setTab(k)} style={{ padding:'.45rem 1.1rem',borderRadius:7,border:'none',fontFamily:"'Sora',sans-serif",fontWeight:700,fontSize:'.78rem',cursor:'pointer',background:tab===k?'#C0392B':'rgba(255,255,255,.08)',color:tab===k?'#fff':'rgba(255,255,255,.6)' }}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth:900,margin:'2rem auto',padding:'0 2.5rem 3rem' }}>

        {/* ── Worker: Profile Tab ── */}
        {tab === 'profile' && user?.role === 'worker' && (
          <div style={card}>
            <h3 style={{ fontSize:'1rem',fontWeight:800,color:'#1C2833',marginBottom:'1.2rem' }}>Update Your Profile</h3>
            <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'.9rem',marginBottom:'.9rem' }}>
              <div><label style={lbl}>Daily Rate (₹)</label><input style={inp} type="number" value={profile.dailyRate} onChange={e=>setProfile(p=>({...p,dailyRate:e.target.value}))} /></div>
              <div><label style={lbl}>Years of Experience</label><input style={inp} type="number" value={profile.experience} onChange={e=>setProfile(p=>({...p,experience:e.target.value}))} /></div>
            </div>
            <div style={{ marginBottom:'.9rem' }}>
              <label style={lbl}>About Yourself</label>
              <textarea style={{ ...inp,minHeight:100,resize:'vertical' }} value={profile.bio} onChange={e=>setProfile(p=>({...p,bio:e.target.value}))} placeholder="Describe your skills and experience…" />
            </div>
            <div style={{ display:'flex',alignItems:'center',gap:'.8rem',marginBottom:'1.2rem' }}>
              <input type="checkbox" id="avail" checked={profile.isAvailable} onChange={e=>setProfile(p=>({...p,isAvailable:e.target.checked}))} style={{ width:18,height:18,cursor:'pointer' }} />
              <label htmlFor="avail" style={{ fontSize:'.85rem',fontWeight:600,color:'#1C2833',cursor:'pointer' }}>I am available for new jobs</label>
            </div>
            <button onClick={saveProfile} disabled={saving} style={{ padding:'.75rem 2rem',background:'#C0392B',color:'#fff',border:'none',borderRadius:9,fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:'.88rem',cursor:'pointer',boxShadow:'2px 2px 0 #7B241C' }}>
              {saving ? 'Saving…' : saved ? '✅ Saved!' : 'Save Changes'}
            </button>
          </div>
        )}

        {/* ── Jobs Tab ── */}
        {tab === 'jobs' && (
          <div>
            <h3 style={{ fontSize:'1rem',fontWeight:800,color:'#1C2833',marginBottom:'1rem' }}>
              {user?.role === 'worker' ? 'Jobs You Applied To' : 'Jobs You Posted'}
            </h3>
            {jobs.length === 0 ? (
              <div style={{ ...card,textAlign:'center',color:'#7A6652',padding:'3rem' }}>
                <div style={{ fontSize:'2.5rem',marginBottom:'1rem' }}>📋</div>
                <p>{user?.role === 'worker' ? 'You haven\'t applied to any jobs yet.' : 'You haven\'t posted any jobs yet.'}</p>
              </div>
            ) : jobs.map(j => (
              <div key={j._id} style={{ ...card,marginBottom:'.9rem' }}>
                <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start' }}>
                  <div>
                    <div style={{ fontWeight:800,fontSize:'.95rem',color:'#1C2833',marginBottom:'.3rem' }}>{j.title}</div>
                    <div style={{ fontSize:'.75rem',color:'#7A6652',marginBottom:'.3rem' }}>📍 {j.location?.district}, {j.location?.state} · {j.workType}</div>
                    <div style={{ fontSize:'.75rem',color:'#7A6652' }}>{j.description}</div>
                  </div>
                  <span style={{ fontSize:'.68rem',fontWeight:700,padding:'.22rem .7rem',borderRadius:999,flexShrink:0,
                    background:j.status==='completed'?'#D5F5E3':j.status==='open'?'#FEF0EE':j.status==='assigned'?'#EBF5FB':'#F5EEF8',
                    color:j.status==='completed'?'#1A7A40':j.status==='open'?'#C0392B':j.status==='assigned'?'#1A5276':'#6C3483' }}>
                    {j.status?.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Availability Tab ── */}
        {tab === 'availability' && user?.role === 'worker' && (
          <div style={card}>
            <h3 style={{ fontSize:'1rem',fontWeight:800,color:'#1C2833',marginBottom:'1rem' }}>Availability Status</h3>
            <p style={{ fontSize:'.82rem',color:'#7A6652',marginBottom:'1.5rem',lineHeight:1.6 }}>Toggle your availability so owners know when you're free to take on new work.</p>
            <div style={{ display:'flex',alignItems:'center',gap:'1.2rem' }}>
              <div
                onClick={() => setProfile(p=>({...p,isAvailable:!p.isAvailable}))}
                style={{ width:56,height:28,borderRadius:999,cursor:'pointer',transition:'all .25s',
                  background:profile.isAvailable?'#27AE60':'#BDC3C7',position:'relative' }}>
                <div style={{ position:'absolute',top:3,left:profile.isAvailable?28:3,width:22,height:22,borderRadius:'50%',background:'#fff',transition:'left .25s',boxShadow:'0 2px 6px rgba(0,0,0,.2)' }} />
              </div>
              <span style={{ fontSize:'.88rem',fontWeight:700,color:profile.isAvailable?'#27AE60':'#7A6652' }}>
                {profile.isAvailable ? '🟢 Available for Jobs' : '🔴 Currently Busy'}
              </span>
            </div>
            <button onClick={saveProfile} style={{ marginTop:'1.5rem',padding:'.7rem 2rem',background:'#C0392B',color:'#fff',border:'none',borderRadius:9,fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:'.85rem',cursor:'pointer' }}>
              {saved ? '✅ Saved!' : 'Save Status'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
