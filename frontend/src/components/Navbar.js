// src/components/Navbar.js
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const S = {
  nav: {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 500,
    height: 62, display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', padding: '0 2rem',
    background: 'rgba(250,250,247,0.95)', backdropFilter: 'blur(14px)',
    borderBottom: '2px solid #C0392B', fontFamily: "'Sora', sans-serif",
  },
  logo: {
    display: 'flex', alignItems: 'center', gap: '.5rem',
    textDecoration: 'none',
  },
  logoBox: {
    width: 36, height: 36, background: '#C0392B', borderRadius: 8,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '1.1rem', boxShadow: '3px 3px 0 #7B241C', flexShrink: 0,
  },
  logoEn: { fontWeight: 900, fontSize: '1.2rem', color: '#C0392B', letterSpacing: '-.03em' },
  logoHi: { fontFamily: "'Noto Sans Devanagari', sans-serif", fontSize: '.55rem', color: '#7A6652' },
  tabs: { display: 'flex', gap: '.15rem' },
  tab: (active) => ({
    padding: '.42rem 1rem', borderRadius: 7, fontSize: '.78rem', fontWeight: 700,
    cursor: 'pointer', border: 'none', textDecoration: 'none', display: 'inline-flex',
    alignItems: 'center', gap: '.3rem', transition: 'all .18s',
    background: active ? '#C0392B' : 'transparent',
    color: active ? '#fff' : '#7A6652',
    fontFamily: "'Sora', sans-serif",
  }),
  right: { display: 'flex', gap: '.6rem', alignItems: 'center' },
  btnOut: {
    padding: '.42rem 1.1rem', borderRadius: 7, fontSize: '.78rem', fontWeight: 700,
    cursor: 'pointer', border: '1.5px solid #C0392B', background: 'transparent',
    color: '#C0392B', fontFamily: "'Sora', sans-serif", textDecoration: 'none',
    display: 'inline-flex', alignItems: 'center',
  },
  btnFill: {
    padding: '.42rem 1.1rem', borderRadius: 7, fontSize: '.78rem', fontWeight: 700,
    cursor: 'pointer', border: 'none', background: '#C0392B', color: '#fff',
    fontFamily: "'Sora', sans-serif", textDecoration: 'none',
    display: 'inline-flex', alignItems: 'center', boxShadow: '2px 2px 0 #7B241C',
  },
  userChip: {
    padding: '.35rem .9rem', borderRadius: 7, fontSize: '.75rem', fontWeight: 700,
    background: '#FDF3E3', border: '1.5px solid #E2CCA0', color: '#C0392B',
    fontFamily: "'Sora', sans-serif",
  }
};

const TABS = [
  { path: '/',        label: '🏠 Home'         },
  { path: '/find',    label: '🔍 Find Labour'  },
  { path: '/about',   label: 'ℹ️ About'        },
  { path: '/pricing', label: '💰 Pricing'      },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav style={S.nav}>
      {/* Logo */}
      <Link to="/" style={S.logo}>
        <div style={S.logoBox}>🏗️</div>
        <div>
          <div style={S.logoEn}>NirmanSetu</div>
          <div style={S.logoHi}>निर्माण का सेतु</div>
        </div>
      </Link>

      {/* Tab Links */}
      <div style={S.tabs}>
        {TABS.map(t => (
          <Link
            key={t.path}
            to={t.path}
            style={S.tab(location.pathname === t.path)}
          >{t.label}</Link>
        ))}
        {user && (
          <Link to="/dashboard" style={S.tab(location.pathname === '/dashboard')}>
            📊 Dashboard
          </Link>
        )}
      </div>

      {/* Right Buttons */}
      <div style={S.right}>
        {user ? (
          <>
            <span style={S.userChip}>👤 {user.name.split(' ')[0]}</span>
            {(user.role === 'owner' || user.role === 'contractor') && (
              <Link to="/post-job" style={S.btnOut}>+ Post Job</Link>
            )}
            <button style={S.btnOut} onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login"    style={S.btnOut}>Login</Link>
            <Link to="/register" style={S.btnFill}>Join Free</Link>
          </>
        )}
      </div>
    </nav>
  );
}
