// src/pages/Register.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const STATES = ["Uttar Pradesh","Maharashtra","Rajasthan","Bihar","Gujarat","Madhya Pradesh","Tamil Nadu","Karnataka","Haryana","Punjab","Delhi","West Bengal","Odisha","Jharkhand","Chhattisgarh"];
const SKILLS = ['Mason','Electrician','Plumber','Carpenter','Painter','Helper','Welder','Tiling'];

const inp = { width:'100%',padding:'.65rem .85rem',border:'1.5px solid #E0D0B8',borderRadius:7,fontFamily:"'Sora',sans-serif",fontSize:'.82rem',color:'#1A120A',background:'#FDF3E3',outline:'none',boxSizing:'border-box' };
const lbl = { display:'block',fontSize:'.62rem',fontWeight:700,letterSpacing:'.09em',textTransform:'uppercase',color:'#7A6652',marginBottom:'.28rem' };

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [tab,     setTab]     = useState('worker');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    name:'', mobile:'', password:'', email:'',
    state:'', district:'', block:'', village:'',
    primarySkill:'', additionalSkills:[], dailyRate:'', experience:'', bio:'',
    companyName:'', propertyType:'Residential Home',
  });

  const set = (k,v) => setForm(f => ({ ...f, [k]:v }));
  const toggleSkill = (sk) => {
    setForm(f => ({
      ...f,
      additionalSkills: f.additionalSkills.includes(sk)
        ? f.additionalSkills.filter(s => s !== sk)
        : [...f.additionalSkills, sk]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const payload = {
        name: form.name, mobile: form.mobile, password: form.password,
        role: tab, email: form.email,
        location: { state:form.state, district:form.district, block:form.block, village:form.village },
      };
      if (tab === 'worker') {
        payload.workerProfile = {
          primarySkill: form.primarySkill,
          additionalSkills: form.additionalSkills,
          dailyRate: Number(form.dailyRate),
          experience: Number(form.experience),
          bio: form.bio,
        };
      }
      if (tab === 'owner') payload.propertyType = form.propertyType;
      if (tab === 'contractor') payload.companyName = form.companyName;

      await register(payload);
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally { setLoading(false); }
  };

  if (success) return (
    <div style={{ paddingTop:62,minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Sora',sans-serif",background:'#FAFAF7' }}>
      <div style={{ textAlign:'center',padding:'3rem' }}>
        <div style={{ fontSize:'4rem',marginBottom:'1rem' }}>🎉</div>
        <h2 style={{ fontSize:'1.6rem',fontWeight:900,color:'#1A7A40',marginBottom:'.5rem' }}>Registered Successfully!</h2>
        <p style={{ color:'#7A6652',fontSize:'.88rem' }}>Redirecting to your dashboard…</p>
      </div>
    </div>
  );

  return (
    <div style={{ paddingTop:62,minHeight:'100vh',background:'#FAFAF7',fontFamily:"'Sora',sans-serif" }}>
      {/* Header */}
      <div style={{ background:'#1C2833',padding:'3rem 2.5rem',textAlign:'center' }}>
        <h2 style={{ fontSize:'2.2rem',fontWeight:900,color:'#fff',letterSpacing:'-.03em',marginBottom:'.5rem' }}>Join NirmanSetu</h2>
        <p style={{ fontSize:'.85rem',color:'rgba(255,255,255,.4)',marginBottom:'2rem' }}>निर्माण का सेतु — Select how you want to join</p>

        {/* Role Tabs */}
        <div style={{ display:'flex',gap:'1rem',justifyContent:'center' }}>
          {[['worker','💼','I\'m a Worker','Register my skills & get hired'],['owner','🏠','I Need Workers','Post jobs & hire locally'],['contractor','🏗️','I\'m a Contractor','Source labour for big projects']].map(([r,icon,title,sub]) => (
            <div key={r} onClick={() => setTab(r)} style={{ background:tab===r?'#C0392B':'rgba(255,255,255,.07)',border:`2px solid ${tab===r?'#C0392B':'rgba(255,255,255,.12)'}`,borderRadius:13,padding:'1.4rem 2rem',cursor:'pointer',textAlign:'center',minWidth:160,transition:'all .2s' }}>
              <div style={{ fontSize:'2rem',marginBottom:'.5rem' }}>{icon}</div>
              <div style={{ fontSize:'.88rem',fontWeight:800,color:'#fff',marginBottom:'.2rem' }}>{title}</div>
              <div style={{ fontSize:'.7rem',color:'rgba(255,255,255,.5)' }}>{sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <div style={{ maxWidth:680,margin:'0 auto',padding:'2.5rem 2.5rem 4rem' }}>
        <div style={{ background:'#fff',border:'1.5px solid #E0D0B8',borderRadius:14,overflow:'hidden' }}>
          <div style={{ background: tab==='worker'?'#C0392B':tab==='owner'?'#1C2833':'#2C3E50',padding:'1.2rem 1.8rem' }}>
            <div style={{ fontSize:'1rem',fontWeight:800,color:'#fff' }}>
              {tab==='worker'?'👷 Register as Worker / Kaarigar':tab==='owner'?'🏠 Register as Property Owner':'🏗️ Contractor Registration'}
            </div>
            <div style={{ fontSize:'.7rem',color:'rgba(255,255,255,.65)',marginTop:'.2rem' }}>
              {tab==='worker'?'Register free — Admin will activate your profile':tab==='owner'?'Free account — search and hire workers near you':'Source verified labour for multiple projects'}
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ padding:'2rem 1.8rem' }}>
            {tab==='worker' && (
              <div style={{ display:'flex',gap:'.8rem',alignItems:'center',background:'#FDF3E3',border:'1.5px solid #E0D0B8',borderLeft:'4px solid #C0392B',borderRadius:8,padding:'.9rem',marginBottom:'1.4rem' }}>
                <span style={{ fontSize:'1.5rem',flexShrink:0 }}>🎉</span>
<p style={{ fontSize:'.75rem',color:'#7A6652',lineHeight:1.5 }}>Registration is <strong style={{ color:'#1A7A40' }}>completely free!</strong> Submit your profile and admin will activate it within 24 hours.</p>
              </div>
            )}

            {error && <div style={{ background:'#FDECEA',border:'1px solid #FADBD8',color:'#C0392B',padding:'.8rem 1rem',borderRadius:8,fontSize:'.78rem',marginBottom:'1rem' }}>{error}</div>}

            {/* Basic Info */}
            <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'.8rem' }}>
              <div><label style={lbl}>Full Name *</label><input required style={inp} value={form.name} onChange={e=>set('name',e.target.value)} placeholder="Your full name" /></div>
              <div><label style={lbl}>Mobile Number *</label><input required style={inp} type="tel" value={form.mobile} onChange={e=>set('mobile',e.target.value)} placeholder="+91 XXXXX XXXXX" /></div>
            </div>
            <div style={{ marginTop:'.9rem',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'.8rem' }}>
              <div><label style={lbl}>Password *</label><input required style={inp} type="password" value={form.password} onChange={e=>set('password',e.target.value)} placeholder="Min 6 characters" /></div>
              <div><label style={lbl}>Email (optional)</label><input style={inp} type="email" value={form.email} onChange={e=>set('email',e.target.value)} placeholder="your@email.com" /></div>
            </div>

            {/* Worker-specific */}
            {tab==='worker' && (
              <>
                <div style={{ margin:'1rem 0 .5rem',borderTop:'1px solid #E0D0B8',paddingTop:'1rem' }}>
                  <label style={lbl}>Primary Skill *</label>
                  <select required style={inp} value={form.primarySkill} onChange={e=>set('primarySkill',e.target.value)}>
                    <option value="">Select your main trade</option>
                    {SKILLS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div style={{ marginTop:'.9rem' }}>
                  <label style={lbl}>Additional Skills</label>
                  <div style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'.4rem',marginTop:'.3rem' }}>
                    {SKILLS.map(sk => (
                      <div key={sk} onClick={() => toggleSkill(sk)} style={{ padding:'.42rem .5rem',border:`1.5px solid ${form.additionalSkills.includes(sk)?'#C0392B':'#E0D0B8'}`,borderRadius:6,textAlign:'center',fontSize:'.68rem',fontWeight:600,cursor:'pointer',color:form.additionalSkills.includes(sk)?'#C0392B':'#7A6652',background:form.additionalSkills.includes(sk)?'#FEF0EE':'#FDF3E3' }}>
                        {sk}
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ marginTop:'.9rem',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'.8rem' }}>
                  <div><label style={lbl}>Daily Rate (₹) *</label><input required style={inp} type="number" min="200" value={form.dailyRate} onChange={e=>set('dailyRate',e.target.value)} placeholder="e.g. 500" /></div>
                  <div><label style={lbl}>Years of Experience</label><input style={inp} type="number" min="0" value={form.experience} onChange={e=>set('experience',e.target.value)} placeholder="e.g. 5" /></div>
                </div>
                <div style={{ marginTop:'.9rem' }}>
                  <label style={lbl}>About Yourself</label>
                  <textarea style={{ ...inp,minHeight:80,resize:'vertical' }} value={form.bio} onChange={e=>set('bio',e.target.value)} placeholder="Describe your experience, specialties, past projects…" />
                </div>
              </>
            )}

            {/* Contractor-specific */}
            {tab==='contractor' && (
              <div style={{ marginTop:'.9rem' }}>
                <label style={lbl}>Company / Firm Name</label>
                <input style={inp} value={form.companyName} onChange={e=>set('companyName',e.target.value)} placeholder="Your firm name" />
              </div>
            )}

            {/* Owner-specific */}
            {tab==='owner' && (
              <div style={{ marginTop:'.9rem' }}>
                <label style={lbl}>Property Type</label>
                <select style={inp} value={form.propertyType} onChange={e=>set('propertyType',e.target.value)}>
                  {['Residential Home','Flat/Apartment','Commercial','Agricultural Land','Other'].map(p=><option key={p}>{p}</option>)}
                </select>
              </div>
            )}

            {/* Location */}
            <div style={{ marginTop:'1rem',borderTop:'1px solid #E0D0B8',paddingTop:'1rem' }}>
              <div style={{ fontSize:'.75rem',fontWeight:700,color:'#1C2833',marginBottom:'.7rem' }}>📍 Location Details</div>
              <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'.8rem' }}>
                <div>
                  <label style={lbl}>State *</label>
                  <select required style={inp} value={form.state} onChange={e=>set('state',e.target.value)}>
                    <option value="">Select State</option>
                    {STATES.map(s=><option key={s}>{s}</option>)}
                  </select>
                </div>
                <div><label style={lbl}>District *</label><input required style={inp} value={form.district} onChange={e=>set('district',e.target.value)} placeholder="Your district" /></div>
                <div><label style={lbl}>Block / Tehsil</label><input style={inp} value={form.block} onChange={e=>set('block',e.target.value)} placeholder="Block name" /></div>
                <div><label style={lbl}>Village / Ward / गाँव</label><input style={inp} value={form.village} onChange={e=>set('village',e.target.value)} placeholder="Your village or ward" /></div>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{ width:'100%',padding:'.9rem',border:'none',borderRadius:9,fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:'.9rem',cursor:loading?'not-allowed':'pointer',background:tab==='worker'?'#C0392B':tab==='owner'?'#1C2833':'#2C3E50',color:'#fff',marginTop:'1.2rem',opacity:loading?.7:1,boxShadow:'3px 3px 0 rgba(0,0,0,.2)' }}>
              {loading ? 'Registering…' : tab==='worker' ?'✅ Register Free — Submit Profile' : tab==='owner' ? '🏠 Create Free Owner Account' : '🚀 Register as Contractor'}
            </button>
            <p style={{ textAlign:'center',fontSize:'.75rem',color:'#7A6652',marginTop:'1rem' }}>
              Already have an account? <Link to="/login" style={{ color:'#C0392B',fontWeight:700 }}>Login here</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
