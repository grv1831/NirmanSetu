// src/components/WorkerCard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SKILL_ICON = {
  Mason:'🧱', Electrician:'⚡', Plumber:'🔧', Carpenter:'🪵',
  Painter:'🎨', Helper:'🏠', Welder:'🔩', Tiling:'🪟',
};

const S = {
  card: { background:'#fff', border:'1.5px solid #E0D0B8', borderRadius:13, overflow:'hidden', transition:'all .22s', cursor:'pointer', fontFamily:"'Sora',sans-serif" },
  top:  { background:'linear-gradient(135deg,#F5E6C8 0%,#EDD9A3 100%)', padding:'1.2rem', display:'flex', gap:'.9rem', alignItems:'center', position:'relative' },
  av:   { width:52, height:52, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem', border:'2.5px solid #fff', background:'#fff', boxShadow:'0 3px 10px rgba(0,0,0,.1)', flexShrink:0 },
  name: { fontWeight:800, fontSize:'.9rem', color:'#1C2833' },
  loc:  { fontSize:'.68rem', color:'#7A6652', marginTop:2 },
  veri: { fontSize:'.62rem', color:'#1A7A40', fontWeight:700, marginTop:3 },
  badge:(avail) => ({ position:'absolute', top:'.8rem', right:'.8rem', fontSize:'.6rem', fontWeight:700, padding:'.18rem .55rem', borderRadius:999, background:avail?'#D5F5E3':'#FDECEA', color:avail?'#1A7A40':'#C0392B' }),
  body: { padding:'1.1rem' },
  tags: { display:'flex', flexWrap:'wrap', gap:'.35rem', marginBottom:'.9rem' },
  tag:  { background:'#FDF3E3', border:'1px solid #E0D0B8', color:'#7A6652', fontSize:'.65rem', fontWeight:600, padding:'.18rem .55rem', borderRadius:4 },
  nums: { display:'grid', gridTemplateColumns:'repeat(3,1fr)', borderTop:'1px solid #E0D0B8', paddingTop:'.8rem', marginBottom:'.9rem', textAlign:'center' },
  numV: { fontWeight:800, fontSize:'.9rem', color:'#1C2833' },
  numK: { fontSize:'.6rem', color:'#7A6652' },
  rateRow: { display:'flex', justifyContent:'space-between', alignItems:'center', background:'#FDF3E3', borderRadius:7, padding:'.6rem .8rem', marginBottom:'.8rem' },
  rate: { fontSize:'1.1rem', fontWeight:900, color:'#1A7A40' },
  per:  { fontSize:'.65rem', color:'#7A6652' },
  stars:{ fontSize:'.72rem', color:'#D4870A' },
};

export default function WorkerCard({ worker }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const wp = worker.workerProfile || {};
  const icon = SKILL_ICON[wp.primarySkill] || '👷';
  const stars = '★'.repeat(Math.round(wp.avgRating||0))+'☆'.repeat(5-Math.round(wp.avgRating||0));
  const tags = [wp.primarySkill,...(wp.additionalSkills||[]).slice(0,2)].filter(Boolean);

  const handleHire = (e) => {
    e.stopPropagation();

    // Not logged in → go to login
    if (!user) { navigate('/login'); return; }

    // Worker trying to hire → not allowed
    if (user.role === 'worker') { navigate(`/worker/${worker._id}`); return; }

    // Owner has no hire credits → go to payment
    if (!user.hireCredits || user.hireCredits < 1) {
      navigate(`/pay?role=owner&workerId=${worker._id}`);
      return;
    }

    // Has credits → go to worker detail to hire
    navigate(`/worker/${worker._id}`);
  };

  return (
    <div
      style={S.card}
      onClick={() => navigate(`/worker/${worker._id}`)}
      onMouseEnter={e => { e.currentTarget.style.borderColor='#C0392B'; e.currentTarget.style.transform='translateY(-5px)'; e.currentTarget.style.boxShadow='5px 5px 0 rgba(192,57,43,.12),0 16px 36px rgba(0,0,0,.08)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor='#E0D0B8'; e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}
    >
      <div style={S.top}>
        <div style={S.av}>{icon}</div>
        <div>
          <div style={S.name}>{worker.name}</div>
          <div style={S.loc}>📍 {worker.location?.village && worker.location.village+', '}{worker.location?.district}, {worker.location?.state}</div>
          {wp.isVerified && <div style={S.veri}>✓ Aadhaar Verified</div>}
        </div>
        <span style={S.badge(wp.isAvailable)}>{wp.isAvailable?'● Available':'● Busy'}</span>
      </div>
      <div style={S.body}>
        <div style={S.tags}>{tags.map(t=><span key={t} style={S.tag}>{t}</span>)}</div>
        <div style={S.nums}>
          <div><div style={S.numV}>{wp.experience||0}yr</div><div style={S.numK}>Experience</div></div>
          <div><div style={S.numV}>{wp.avgRating||'—'}★</div><div style={S.numK}>Rating</div></div>
          <div><div style={S.numV}>{wp.totalJobsDone||0}</div><div style={S.numK}>Jobs Done</div></div>
        </div>
        <div style={S.rateRow}>
          <div><div style={S.rate}>₹{wp.dailyRate||'—'}</div><div style={S.per}>per day</div></div>
          <div style={S.stars}>{stars}</div>
        </div>
        <button
          onClick={handleHire}
          style={{ width:'100%', padding:'.62rem', background:'#C0392B', color:'#fff', border:'none', borderRadius:7, fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:'.78rem', cursor:'pointer', boxShadow:'2px 2px 0 #7B241C' }}
          onMouseEnter={e=>e.currentTarget.style.background='#7B241C'}
          onMouseLeave={e=>e.currentTarget.style.background='#C0392B'}
        >
          {!user ? '🔐 Login to Hire' : (!user.hireCredits||user.hireCredits<1) ? '💳 Pay ₹1 to Hire' : `Hire ${worker.name.split(' ')[0]} →`}
        </button>
      </div>
    </div>
  );
}
