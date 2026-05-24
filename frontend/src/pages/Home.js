// src/pages/Home.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from '../components/Footer';

const S = {
  wrap:    { paddingTop: 62, fontFamily: "'Sora', sans-serif" },
  hero: {
    minHeight: 'calc(100vh - 62px)',
    display: 'grid', gridTemplateColumns: '1fr 1fr',
    background: '#FAFAF7',
  },
  left:    { padding: '4rem 3.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  eyebrow: {
    display: 'inline-flex', alignItems: 'center', gap: '.5rem',
    background: '#F5E6C8', border: '1px solid #E0D0B8',
    padding: '.28rem .9rem', borderRadius: 4, fontSize: '.68rem',
    fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase',
    color: '#D4870A', marginBottom: '1.6rem', width: 'fit-content',
  },
  h1:  { fontSize: '3.4rem', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-.04em', color: '#1C2833', marginBottom: '.5rem' },
  red: { color: '#C0392B' },
  deva:{ fontFamily: "'Noto Sans Devanagari', sans-serif", fontSize: '1rem', color: '#7A6652', marginBottom: '1.4rem' },
  desc:{ fontSize: '.9rem', color: '#7A6652', lineHeight: 1.75, maxWidth: 440, marginBottom: '2rem' },
  btns:{ display: 'flex', gap: '.9rem', flexWrap: 'wrap', marginBottom: '2.5rem' },
  btnP:{
    padding: '.85rem 1.9rem', borderRadius: 9, border: 'none',
    fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: '.88rem',
    background: '#C0392B', color: '#fff', cursor: 'pointer',
    boxShadow: '4px 4px 0 #7B241C',
  },
  btnS:{
    padding: '.85rem 1.9rem', borderRadius: 9, border: '2px solid #1A7A40',
    fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: '.88rem',
    background: 'transparent', color: '#1A7A40', cursor: 'pointer',
  },
  stats: { display: 'flex', gap: '1.5rem', flexWrap: 'wrap', paddingTop: '1.5rem', borderTop: '1px solid #E0D0B8' },
  statN: { fontSize: '1.8rem', fontWeight: 900, color: '#C0392B' },
  statL: { fontSize: '.65rem', color: '#7A6652', lineHeight: 1.3 },
  right: {
    background: '#1C2833', padding: '3rem 3.5rem',
    display: 'flex', flexDirection: 'column', justifyContent: 'center',
  },
  rpTitle: { fontSize: '1.05rem', fontWeight: 800, color: '#fff', marginBottom: '.2rem' },
  rpSub:   { fontFamily: "'Noto Sans Devanagari', sans-serif", fontSize: '.72rem', color: 'rgba(255,255,255,.4)', marginBottom: '1.5rem' },
  previewCard: {
    background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)',
    borderRadius: 10, padding: '1rem 1.1rem', display: 'flex',
    alignItems: 'center', gap: '.9rem', marginBottom: '.7rem', cursor: 'pointer',
  },
  seeAll: {
    marginTop: '.8rem', width: '100%', padding: '.7rem', borderRadius: 8,
    border: '1.5px solid rgba(255,255,255,.15)', background: 'transparent',
    color: 'rgba(255,255,255,.6)', fontFamily: "'Sora', sans-serif",
    fontWeight: 700, fontSize: '.78rem', cursor: 'pointer',
  },
  ticker: { background: '#C0392B', padding: '.55rem 0', overflow: 'hidden' },
  tickerInner: { display: 'flex', gap: '3rem', animation: 'tick 22s linear infinite', whiteSpace: 'nowrap' },
  howWrap: { background: '#1C2833', padding: '4rem 2.5rem' },
  howInner: { maxWidth: 1100, margin: '0 auto' },
  howTitle: { fontSize: '1.8rem', fontWeight: 900, color: '#fff', letterSpacing: '-.03em', marginBottom: '.4rem' },
  howSub:   { fontSize: '.82rem', color: 'rgba(255,255,255,.4)', marginBottom: '2.5rem' },
  howGrid:  { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' },
  howCard:  { background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 14, padding: '1.8rem' },
  howStep:  { display: 'flex', gap: '.8rem', marginBottom: '1.1rem' },
  stepNum: (c) => ({
    width: 26, height: 26, borderRadius: '50%', display: 'flex',
    alignItems: 'center', justifyContent: 'center', fontSize: '.72rem',
    fontWeight: 800, flexShrink: 0, marginTop: 1,
    background: c === 'o' ? 'rgba(192,57,43,.2)' : 'rgba(26,122,64,.2)',
    color: c === 'o' ? '#E74C3C' : '#27AE60',
  }),
  featWrap: { background: '#FDF3E3', padding: '4rem 2.5rem' },
  featGrid: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.1rem', maxWidth: 1100, margin: '0 auto' },
  featCard: { background: '#fff', border: '1.5px solid #E0D0B8', borderRadius: 12, padding: '1.5rem' },
};

const STEPS_OWNER = [
  ['Browse or Filter Workers', 'Go to Find Labour tab. Filter by state, district, village and skill type.'],
  ['View Profiles & Rates', 'Check ratings, experience, daily rate, and portfolio before deciding.'],
  ['Contact & Hire', 'Click Hire, confirm the job — worker is notified instantly.'],
  ['Rate After Work', 'Leave a rating once done. Build trust in the network for everyone.'],
];
const STEPS_WORKER = [
  ['Register for ₹1', 'One-time fee via UPI. No monthly charges. No commission on earnings.'],
  ['Build Your Profile', 'Add skills, experience, daily rate, work photos. Set exact village location.'],
  ['Get Discovered Locally', 'Profile appears in searches from your village, block, district.'],
  ['Accept & Earn', 'Receive job alerts. Accept, work, get paid, grow reputation.'],
];
const FEATURES = [
  ['📍','Village-Level Search','Filter to Gram Panchayat level. State → District → Tehsil → Village.'],
  ['⚖️','Fair Wage Reference','Govt minimum wage as floor. Workers set own rate higher.'],
  ['✅','Aadhaar Verification','Optional identity check gives owners confidence. Gives workers a Verified badge.'],
  ['📱','Works on Basic Phones','WhatsApp & SMS alerts — no smartphone needed to get hired.'],
  ['⭐','Rating System','Owners rate every job. Higher ratings → better pay and more visibility.'],
  ['🗣️','10+ Regional Languages','Hindi, Marathi, Tamil, Telugu, Kannada, Bengali, Gujarati & more.'],
];

export default function Home() {
  const navigate = useNavigate();
  const [preview, setPreview] = useState([]);

  useEffect(() => {
    axios.get('/api/workers?limit=5&sort=rating&available=true')
      .then(r => setPreview(r.data.data || []))
      .catch(() => {});
  }, []);

  return (
    <div style={S.wrap}>
      <style>{`@keyframes tick{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>

      {/* Hero */}
      <div style={S.hero}>
        <div style={S.left}>
          <div style={S.eyebrow}>🇮🇳 India's Civil Labour Marketplace</div>
          <h1 style={S.h1}>Hire <span style={S.red}>Skilled Workers</span> Near Your Home</h1>
          <div style={S.deva}>घर के पास कुशल कारीगर ढूंढें</div>
          <p style={S.desc}>NirmanSetu connects property owners with verified masons, electricians, plumbers, carpenters & daily workers — from your village to any city across all 28 states of India.</p>
          <div style={S.btns}>
            <button style={S.btnP} onClick={() => navigate('/find')}>🔍 Browse All Workers</button>
            <button style={S.btnS} onClick={() => navigate('/register')}>💼 Register @ ₹1</button>
          </div>
          <div style={S.stats}>
            {[['50K+','Registered Workers'],['28','States Covered'],['6L+','Villages Listed'],['₹1','Worker Fee']].map(([n,l]) => (
              <div key={l}><div style={S.statN}>{n}</div><div style={S.statL}>{l}</div></div>
            ))}
          </div>
        </div>
        <div style={S.right}>
          <div style={S.rpTitle}>Recently Available Workers</div>
          <div style={S.rpSub}>अभी उपलब्ध कारीगर</div>
          {preview.map(w => (
            <div key={w._id} style={S.previewCard} onClick={() => navigate(`/worker/${w._id}`)}>
              <div style={{ fontSize: '1.3rem' }}>👷</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '.82rem', fontWeight: 700, color: '#fff' }}>{w.name}</div>
                <div style={{ fontSize: '.68rem', color: 'rgba(255,255,255,.45)' }}>{w.workerProfile?.primarySkill} · {w.location?.district}, {w.location?.state}</div>
                {w.workerProfile?.isVerified && <div style={{ fontSize: '.62rem', color: '#27AE60', fontWeight: 600 }}>✓ Verified</div>}
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '.9rem', fontWeight: 800, color: '#F39C12' }}>₹{w.workerProfile?.dailyRate}</div>
                <div style={{ fontSize: '.6rem', color: 'rgba(255,255,255,.4)' }}>/day</div>
              </div>
            </div>
          ))}
          {preview.length === 0 && (
            <div style={{ color: 'rgba(255,255,255,.3)', fontSize: '.78rem', textAlign: 'center', padding: '2rem' }}>
              Loading workers…
            </div>
          )}
          <button style={S.seeAll} onClick={() => navigate('/find')}>See All Workers → सभी देखें</button>
        </div>
      </div>

      {/* Ticker */}
      <div style={S.ticker}>
        <div style={S.tickerInner}>
          {['🧱 Mason','⚡ Electrician','🔧 Plumber','🪵 Carpenter','🎨 Painter','🏠 Helper','🔩 Welder','🪟 Tiling',
            '🧱 Mason','⚡ Electrician','🔧 Plumber','🪵 Carpenter','🎨 Painter','🏠 Helper','🔩 Welder','🪟 Tiling'
          ].map((t,i) => <span key={i} style={{ fontSize: '.72rem', fontWeight: 700, color: 'rgba(255,255,255,.85)', flexShrink: 0 }}>{t}</span>)}
        </div>
      </div>

      {/* How It Works */}
      <div style={S.howWrap}>
        <div style={S.howInner}>
          <div style={S.howTitle}>How NirmanSetu Works</div>
          <div style={S.howSub}>Two sides, one bridge.</div>
          <div style={S.howGrid}>
            {[['🏠','For Property Owners','मकान मालिक के लिए',STEPS_OWNER,'o'],['💼','For Workers / Kaarigar','कारीगर के लिए',STEPS_WORKER,'w']].map(([icon,title,sub,steps,c]) => (
              <div key={title} style={S.howCard}>
                <div style={{ display:'flex',alignItems:'center',gap:'.7rem',marginBottom:'1.5rem' }}>
                  <div style={{ fontSize:'1.5rem' }}>{icon}</div>
                  <div>
                    <div style={{ fontSize:'.95rem',fontWeight:800,color:'#fff' }}>{title}</div>
                    <div style={{ fontFamily:"'Noto Sans Devanagari',sans-serif",fontSize:'.68rem',color:'rgba(255,255,255,.35)' }}>{sub}</div>
                  </div>
                </div>
                {steps.map(([h,p],i) => (
                  <div key={h} style={S.howStep}>
                    <div style={S.stepNum(c)}>{i+1}</div>
                    <div>
                      <div style={{ fontSize:'.82rem',fontWeight:700,color:'#fff',marginBottom:'.15rem' }}>{h}</div>
                      <div style={{ fontSize:'.72rem',color:'rgba(255,255,255,.4)',lineHeight:1.55 }}>{p}</div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div style={S.featWrap}>
        <div style={{ maxWidth:1100,margin:'0 auto' }}>
          <div style={{ fontSize:'.68rem',fontWeight:700,letterSpacing:'.14em',textTransform:'uppercase',color:'#C0392B',marginBottom:'.5rem' }}>Platform Features</div>
          <h2 style={{ fontSize:'2rem',fontWeight:900,color:'#1C2833',letterSpacing:'-.03em',marginBottom:'.5rem' }}>Built for Bharat 🇮🇳</h2>
          <p style={{ fontSize:'.85rem',color:'#7A6652',maxWidth:480,lineHeight:1.7,marginBottom:'2.5rem' }}>Designed for India's unique labour ecosystem — from metro construction to village home repairs.</p>
          <div style={S.featGrid}>
            {FEATURES.map(([icon,title,desc]) => (
              <div key={title} style={S.featCard}>
                <div style={{ width:44,height:44,background:'#F5E6C8',border:'1px solid #E0D0B8',borderRadius:9,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.3rem',marginBottom:'.9rem' }}>{icon}</div>
                <div style={{ fontSize:'.88rem',fontWeight:700,color:'#1C2833',marginBottom:'.3rem' }}>{title}</div>
                <div style={{ fontSize:'.75rem',color:'#7A6652',lineHeight:1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
