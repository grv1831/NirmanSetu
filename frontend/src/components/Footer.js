// src/components/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';

const S = {
  footer: { background: '#1C2833', padding: '3rem 2.5rem 1.5rem', fontFamily: "'Sora', sans-serif" },
  inner: {
    maxWidth: 1100, margin: '0 auto',
    display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '2.5rem',
    marginBottom: '2rem',
  },
  logo:  { fontSize: '1.3rem', fontWeight: 900, color: '#C0392B', marginBottom: '.2rem' },
  hi:    { fontFamily: "'Noto Sans Devanagari', sans-serif", fontSize: '.62rem', color: 'rgba(255,255,255,.3)', marginBottom: '.8rem' },
  desc:  { fontSize: '.74rem', color: 'rgba(255,255,255,.35)', lineHeight: 1.7 },
  colH:  { fontSize: '.68rem', fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.55)', marginBottom: '.9rem' },
  list:  { listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '.5rem' },
  link:  { fontSize: '.74rem', color: 'rgba(255,255,255,.3)', textDecoration: 'none' },
  bot:   { maxWidth: 1100, margin: '0 auto', paddingTop: '1.2rem', borderTop: '1px solid rgba(255,255,255,.08)', display: 'flex', justifyContent: 'space-between', fontSize: '.68rem', color: 'rgba(255,255,255,.2)' },
  flag:  { display: 'flex', gap: 2, alignItems: 'center' },
  stripe:{ width: 18, height: 5 },
};

export default function Footer() {
  return (
    <footer style={S.footer}>
      <div style={S.inner}>
        <div>
          <div style={S.logo}>NirmanSetu</div>
          <div style={S.hi}>निर्माण का सेतु</div>
          <p style={S.desc}>India's most trusted platform connecting skilled workers with those who need them — from the smallest village to the largest city, across all 28 states.</p>
        </div>
        <div>
          <div style={S.colH}>For Owners</div>
          <ul style={S.list}>
            <li><Link to="/find"     style={S.link}>Browse Workers</Link></li>
            <li><Link to="/post-job" style={S.link}>Post a Job</Link></li>
            <li><Link to="/about"    style={S.link}>How It Works</Link></li>
          </ul>
        </div>
        <div>
          <div style={S.colH}>For Workers</div>
          <ul style={S.list}>
            <li><Link to="/register" style={S.link}>Register (₹1)</Link></li>
            <li><Link to="/dashboard" style={S.link}>My Profile</Link></li>
            <li><Link to="/pricing"  style={S.link}>Pricing</Link></li>
          </ul>
        </div>
        <div>
          <div style={S.colH}>Company</div>
          <ul style={S.list}>
            <li><Link to="/about"   style={S.link}>About Us</Link></li>
            <li><Link to="/pricing" style={S.link}>Pricing</Link></li>
            <li><a href="mailto:hello@nirmansetu.in" style={S.link}>Contact</a></li>
            <li><a href="#" style={S.link}>Privacy Policy</a></li>
          </ul>
        </div>
      </div>
      <div style={S.bot}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
          <div style={S.flag}>
            <div style={{ ...S.stripe, background: '#FF9933', borderRadius: '2px 0 0 2px' }}></div>
            <div style={{ ...S.stripe, background: '#fff' }}></div>
            <div style={{ ...S.stripe, background: '#138808', borderRadius: '0 2px 2px 0' }}></div>
          </div>
          Made with ❤️ for Bharat — © 2025 NirmanSetu Pvt. Ltd.
        </div>
        <div>Helpline: 1800-XXX-XXXX | hello@nirmansetu.in</div>
      </div>
    </footer>
  );
}
