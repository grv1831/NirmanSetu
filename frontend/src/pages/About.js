// src/pages/About.js
import React from 'react';
import Footer from '../components/Footer';

export default function About() {
  return (
    <div style={{ paddingTop:62,fontFamily:"'Sora',sans-serif",background:'#FAFAF7' }}>
      <div style={{ background:'#1C2833',padding:'4rem 3rem',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'3rem',alignItems:'center' }}>
        <div>
          <h2 style={{ fontSize:'2.6rem',fontWeight:900,color:'#fff',letterSpacing:'-.04em',marginBottom:'.6rem' }}>About NirmanSetu</h2>
          <div style={{ fontFamily:"'Noto Sans Devanagari',sans-serif",fontSize:'1rem',color:'rgba(255,255,255,.4)',marginBottom:'1rem' }}>निर्माण का सेतु — हमारे बारे में</div>
          <p style={{ fontSize:'.85rem',color:'rgba(255,255,255,.5)',lineHeight:1.8 }}>NirmanSetu was founded with one mission: to bridge the gap between India's massive skilled labour force and the millions of homeowners, contractors and businesses who need them — at every level, from villages to metros, across all 28 states.</p>
        </div>
        <div style={{ background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.1)',borderRadius:14,padding:'2rem',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1.5rem' }}>
          {[['50K+','Registered Workers'],['28','States & UTs'],['6L+','Villages Listed'],['₹1','Worker Registration']].map(([n,l])=>(
            <div key={l} style={{ textAlign:'center',padding:'1.2rem',background:'rgba(255,255,255,.04)',borderRadius:9 }}>
              <div style={{ fontSize:'2.2rem',fontWeight:900,color:'#F39C12' }}>{n}</div>
              <div style={{ fontSize:'.7rem',color:'rgba(255,255,255,.4)',marginTop:'.2rem' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth:1100,margin:'0 auto',padding:'4rem 2.5rem' }}>
        <div style={{ fontSize:'.68rem',fontWeight:700,letterSpacing:'.14em',textTransform:'uppercase',color:'#C0392B',marginBottom:'.5rem' }}>Our Mission</div>
        <h2 style={{ fontSize:'2rem',fontWeight:900,color:'#1C2833',marginBottom:'2rem' }}>Why We Built NirmanSetu</h2>
        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1.5rem' }}>
          {[
            ['🤝','Dignity for Workers','India\'s 50+ crore informal labourers deserve fair pay, steady work, and recognition. NirmanSetu gives them a verified identity and a professional profile — no middlemen, no exploitation.'],
            ['🏘️','Local Work, Local Hire','Most skilled workers migrate hundreds of kilometres for work. NirmanSetu creates a hyperlocal economy — workers find jobs within their own village or district, keeping families together.'],
            ['📈','Fair Market Pricing','We display government minimum wages as the floor. Workers can set their own rates higher. Owners compare fairly. No one gets exploited.'],
            ['🌐','Digital India, Real Bharat','Built for feature phones and smartphones equally. WhatsApp alerts, Hindi interface, and village-level search mean NirmanSetu works for every Indian.'],
          ].map(([icon,title,desc])=>(
            <div key={title} style={{ background:'#fff',border:'1.5px solid #E0D0B8',borderRadius:13,padding:'1.8rem' }}>
              <div style={{ fontSize:'2.2rem',marginBottom:'1rem' }}>{icon}</div>
              <div style={{ fontSize:'1rem',fontWeight:800,color:'#1C2833',marginBottom:'.5rem' }}>{title}</div>
              <div style={{ fontSize:'.8rem',color:'#7A6652',lineHeight:1.7 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
