// src/pages/WorkerDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';

export default function WorkerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [worker,  setWorker]  = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hired,   setHired]   = useState(false);

  useEffect(() => {
    axios.get(`/api/workers/${id}`)
      .then(r => { setWorker(r.data.data); setReviews(r.data.reviews || []); })
      .catch(() => navigate('/find'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ paddingTop:100,textAlign:'center',color:'#7A6652',fontFamily:"'Sora',sans-serif" }}>Loading…</div>;
  if (!worker)  return null;

  const wp = worker.workerProfile || {};
  const stars = (n) => '★'.repeat(Math.round(n||0)) + '☆'.repeat(5-Math.round(n||0));

  return (
    <div style={{ paddingTop:62,fontFamily:"'Sora',sans-serif",background:'#FAFAF7',minHeight:'100vh' }}>
      {/* Hero */}
      <div style={{ background:'#1C2833',padding:'3rem 2.5rem' }}>
        <div style={{ maxWidth:900,margin:'0 auto',display:'flex',gap:'2rem',alignItems:'flex-start' }}>
          {/* Avatar */}
          <div style={{ width:100,height:100,borderRadius:'50%',background:'#F5E6C8',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'3rem',border:'4px solid rgba(255,255,255,.15)',flexShrink:0 }}>
            {wp.profilePhoto ? <img src={wp.profilePhoto} alt={worker.name} style={{ width:'100%',height:'100%',borderRadius:'50%',objectFit:'cover' }} /> : '👷'}
          </div>
          <div style={{ flex:1 }}>
            <div style={{ display:'flex',alignItems:'center',gap:'.8rem',marginBottom:'.4rem' }}>
              <h1 style={{ fontSize:'2rem',fontWeight:900,color:'#fff',letterSpacing:'-.03em' }}>{worker.name}</h1>
              {wp.isVerified && <span style={{ background:'#27AE60',color:'#fff',fontSize:'.65rem',fontWeight:800,padding:'.2rem .7rem',borderRadius:999 }}>✓ Aadhaar Verified</span>}
            </div>
            <div style={{ fontSize:'.88rem',color:'rgba(255,255,255,.6)',marginBottom:'.4rem' }}>{wp.primarySkill} · {worker.location?.village && worker.location.village+', '}{worker.location?.district}, {worker.location?.state}</div>
            <div style={{ display:'flex',gap:'1.5rem',marginBottom:'.8rem' }}>
              <span style={{ fontSize:'.82rem',color:'#F39C12',fontWeight:700 }}>{stars(wp.avgRating)} {wp.avgRating||'—'}</span>
              <span style={{ fontSize:'.82rem',color:'rgba(255,255,255,.5)' }}>{wp.totalRatings||0} reviews</span>
              <span style={{ fontSize:'.82rem',color:'rgba(255,255,255,.5)' }}>{wp.totalJobsDone||0} jobs done</span>
            </div>
            <span style={{ fontSize:'.75rem',fontWeight:700,padding:'.22rem .7rem',borderRadius:999, background:wp.isAvailable?'#D5F5E3':'#FDECEA', color:wp.isAvailable?'#1A7A40':'#C0392B' }}>
              {wp.isAvailable ? '● Available Now' : '● Currently Busy'}
            </span>
          </div>
          {/* Rate Card */}
          <div style={{ background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.12)',borderRadius:14,padding:'1.5rem',minWidth:180,textAlign:'center',flexShrink:0 }}>
            <div style={{ fontSize:'.68rem',fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',color:'rgba(255,255,255,.4)',marginBottom:'.4rem' }}>Daily Rate</div>
            <div style={{ fontSize:'2.6rem',fontWeight:900,color:'#27AE60',lineHeight:1 }}>₹{wp.dailyRate||'—'}</div>
            <div style={{ fontSize:'.72rem',color:'rgba(255,255,255,.4)',marginBottom:'1rem' }}>per day</div>
            {user ? (
              hired ? (
                <div style={{ background:'#27AE60',color:'#fff',padding:'.7rem',borderRadius:8,fontSize:'.78rem',fontWeight:700 }}>✅ Request Sent!</div>
              ) : (
                <button onClick={() => setHired(true)} style={{ width:'100%',padding:'.75rem',background:'#C0392B',color:'#fff',border:'none',borderRadius:8,fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:'.82rem',cursor:'pointer',boxShadow:'2px 2px 0 #7B241C' }}>
                  Hire {worker.name.split(' ')[0]}
                </button>
              )
            ) : (
              <button onClick={() => navigate('/login')} style={{ width:'100%',padding:'.75rem',background:'#C0392B',color:'#fff',border:'none',borderRadius:8,fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:'.82rem',cursor:'pointer' }}>
                Login to Hire
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth:900,margin:'2rem auto',padding:'0 2.5rem' }}>
        <div style={{ display:'grid',gridTemplateColumns:'2fr 1fr',gap:'2rem' }}>
          <div>
            {/* Skills */}
            <div style={{ background:'#fff',border:'1.5px solid #E0D0B8',borderRadius:13,padding:'1.8rem',marginBottom:'1.5rem' }}>
              <h3 style={{ fontSize:'1rem',fontWeight:800,color:'#1C2833',marginBottom:'1rem' }}>Skills & Expertise</h3>
              <div style={{ display:'flex',flexWrap:'wrap',gap:'.5rem',marginBottom:'1rem' }}>
                <span style={{ background:'#C0392B',color:'#fff',fontSize:'.75rem',fontWeight:700,padding:'.3rem .8rem',borderRadius:6 }}>{wp.primarySkill}</span>
                {(wp.additionalSkills||[]).map(s => (
                  <span key={s} style={{ background:'#F5E6C8',border:'1px solid #E0D0B8',color:'#7A6652',fontSize:'.72rem',fontWeight:600,padding:'.25rem .7rem',borderRadius:6 }}>{s}</span>
                ))}
              </div>
              {wp.bio && <p style={{ fontSize:'.82rem',color:'#7A6652',lineHeight:1.7 }}>{wp.bio}</p>}
            </div>

            {/* Work Photos */}
            {(wp.workPhotos||[]).length > 0 && (
              <div style={{ background:'#fff',border:'1.5px solid #E0D0B8',borderRadius:13,padding:'1.8rem',marginBottom:'1.5rem' }}>
                <h3 style={{ fontSize:'1rem',fontWeight:800,color:'#1C2833',marginBottom:'1rem' }}>Work Portfolio</h3>
                <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'.6rem' }}>
                  {wp.workPhotos.map((p,i) => (
                    <img key={i} src={p} alt={`work-${i}`} style={{ width:'100%',aspectRatio:'1',objectFit:'cover',borderRadius:8,border:'1px solid #E0D0B8' }} />
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div style={{ background:'#fff',border:'1.5px solid #E0D0B8',borderRadius:13,padding:'1.8rem' }}>
              <h3 style={{ fontSize:'1rem',fontWeight:800,color:'#1C2833',marginBottom:'1rem' }}>Reviews ({reviews.length})</h3>
              {reviews.length === 0 ? (
                <p style={{ fontSize:'.82rem',color:'#7A6652' }}>No reviews yet. Be the first to hire and review!</p>
              ) : reviews.map(r => (
                <div key={r._id} style={{ borderBottom:'1px solid #E0D0B8',paddingBottom:'1rem',marginBottom:'1rem' }}>
                  <div style={{ display:'flex',justifyContent:'space-between',marginBottom:'.3rem' }}>
                    <span style={{ fontWeight:700,fontSize:'.82rem',color:'#1C2833' }}>{r.owner?.name||'Owner'}</span>
                    <span style={{ color:'#D4870A',fontSize:'.78rem' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</span>
                  </div>
                  {r.comment && <p style={{ fontSize:'.78rem',color:'#7A6652',lineHeight:1.6 }}>{r.comment}</p>}
                  <div style={{ fontSize:'.65rem',color:'#7A6652',marginTop:'.3rem' }}>{new Date(r.createdAt).toLocaleDateString('en-IN')}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div style={{ background:'#fff',border:'1.5px solid #E0D0B8',borderRadius:13,padding:'1.5rem',marginBottom:'1rem' }}>
              <h4 style={{ fontSize:'.82rem',fontWeight:800,color:'#1C2833',marginBottom:'1rem' }}>Quick Stats</h4>
              {[
                ['Experience', `${wp.experience||0} years`],
                ['Daily Rate', `₹${wp.dailyRate||'—'}`],
                ['Jobs Done', wp.totalJobsDone||0],
                ['Avg Rating', `${wp.avgRating||'—'} / 5`],
              ].map(([k,v]) => (
                <div key={k} style={{ display:'flex',justifyContent:'space-between',padding:'.5rem 0',borderBottom:'1px solid #E0D0B8' }}>
                  <span style={{ fontSize:'.78rem',color:'#7A6652' }}>{k}</span>
                  <span style={{ fontSize:'.78rem',fontWeight:700,color:'#1C2833' }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ background:'#fff',border:'1.5px solid #E0D0B8',borderRadius:13,padding:'1.5rem' }}>
              <h4 style={{ fontSize:'.82rem',fontWeight:800,color:'#1C2833',marginBottom:'.8rem' }}>Location</h4>
              <div style={{ fontSize:'.78rem',color:'#7A6652',lineHeight:2 }}>
                {worker.location?.village && <div>🏘️ {worker.location.village}</div>}
                {worker.location?.block    && <div>🗺️ {worker.location.block}</div>}
                {worker.location?.district && <div>📍 {worker.location.district}</div>}
                {worker.location?.state    && <div>🏛️ {worker.location.state}</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
