// src/pages/Pricing.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const FAQS = [
  ['Is the ₹1 registration fee refundable?','The ₹1 fee is non-refundable. It is a nominal one-time charge to verify intent and prevent fake profiles. Once registered, your profile is permanent with no recurring charges.'],
  ['Does NirmanSetu take commission from workers\' pay?','No. Workers keep 100% of what they earn. NirmanSetu earns a small booking convenience fee from property owners on completed bookings only.'],
  ['Can workers increase their daily rate later?','Absolutely. Workers can update their daily rate anytime from their dashboard. Government minimum wage is shown as a reference floor. Higher-rated workers typically command better rates.'],
  ['Do workers need a smartphone to use NirmanSetu?','No. Workers can receive job alerts and accept/decline requests via WhatsApp or simple SMS on any mobile phone. Only the ₹1 registration needs internet.'],
  ['How is Aadhaar verification done?','Aadhaar verification is optional but recommended. Workers share their Aadhaar number during registration; our system performs an OTP-based DigiLocker verification. Verified workers get a green badge.'],
  ['Is it really free for property owners?','Yes, completely free to register, search, browse, and contact workers. A small convenience fee is charged only on confirmed bookings via the platform.'],
];

export default function Pricing() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  const PLANS = [
    {
      role: 'For Kaarigar 💼', color: '#C0392B', badge: 'WORKERS',
      price: '0', period: 'completely free',
desc: 'Register free! Submit your profile and admin will activate it within 24 hours. No fees ever.',
      features: ['Permanent verified profile','Set your own daily rate','Appear in hyperlocal searches','WhatsApp & SMS job alerts','Work history & photo portfolio','Rating & review system','Optional Aadhaar verification badge'],
      cta: 'Register Now', route: '/register',
    },
    {
      role: 'For Property Owners 🏠', color: '#1A7A40', badge: 'OWNERS',
      price: '0', period: 'completely free',
      desc: 'Free to search, browse, and connect with workers. Platform earns a small booking fee from completed jobs only.',
      features: ['Free account registration','Unlimited worker searches','Village-level location filter','Compare profiles & daily rates','View work portfolios & reviews','Rate & review after job','In-app secure communication'],
      cta: 'Get Started Free', route: '/register',
    },
  ];

  return (
    <div style={{ paddingTop: 62, fontFamily: "'Sora', sans-serif", background: '#FAFAF7' }}>

      {/* Hero */}
      <div style={{ background: '#1C2833', padding: '3rem 3rem 4rem', textAlign: 'center' }}>
        <div style={{ fontSize: '.68rem', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: '#C0392B', marginBottom: '.5rem' }}>Transparent Pricing</div>
        <h2 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#fff', letterSpacing: '-.04em', marginBottom: '.6rem' }}>Simple. Fair. For Everyone.</h2>
        <p style={{ fontSize: '.85rem', color: 'rgba(255,255,255,.4)', maxWidth: 480, margin: '0 auto' }}>No hidden fees. No subscriptions. No surprises. Just what you need to get hired or hire.</p>
      </div>

      {/* Plans */}
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '3rem 2.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '1.5rem', marginBottom: '3rem', maxWidth: 700, margin: '0 auto 3rem' }}>
          {PLANS.map(plan => (
            <div key={plan.role} style={{ background: '#fff', border: `2px solid ${plan.color}22`, borderRadius: 14, padding: '2rem', position: 'relative', overflow: 'hidden' }}>
              {/* Top color bar */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: plan.color }} />
              <div style={{ display: 'inline-block', background: plan.color, color: '#fff', fontSize: '.6rem', fontWeight: 800, padding: '.2rem .7rem', borderRadius: 999, letterSpacing: '.06em', marginBottom: '.8rem' }}>{plan.badge}</div>
              <div style={{ fontSize: '.68rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: plan.color, marginBottom: '.5rem' }}>{plan.role}</div>
              <div style={{ fontSize: '3rem', fontWeight: 900, color: '#1C2833', lineHeight: 1 }}>
                <sup style={{ fontSize: '1.1rem', verticalAlign: 'super' }}>₹</sup>{plan.price}
              </div>
              <div style={{ fontSize: '.75rem', color: '#7A6652', marginBottom: '.7rem' }}>{plan.period}</div>
              <div style={{ fontSize: '.78rem', color: '#7A6652', lineHeight: 1.6, marginBottom: '1.4rem', paddingBottom: '1.2rem', borderBottom: '1px solid #E0D0B8' }}>{plan.desc}</div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '.6rem', marginBottom: '1.5rem' }}>
                {plan.features.map(f => (
                  <li key={f} style={{ fontSize: '.76rem', color: '#7A6652', display: 'flex', gap: '.5rem', alignItems: 'flex-start' }}>
                    <span style={{ color: '#1A7A40', fontWeight: 800, flexShrink: 0 }}>✓</span>{f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate(plan.route)}
                style={{ width: '100%', padding: '.75rem', border: 'none', borderRadius: 8, fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: '.82rem', cursor: 'pointer', background: plan.color, color: '#fff', boxShadow: `2px 2px 0 ${plan.color}88` }}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#1C2833', marginBottom: '1.2rem' }}>Frequently Asked Questions</h3>
          {FAQS.map(([q, a], i) => (
            <div key={i} style={{ border: '1.5px solid #E0D0B8', borderRadius: 9, marginBottom: '.7rem', overflow: 'hidden' }}>
              <div
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{ padding: '.9rem 1.2rem', fontSize: '.82rem', fontWeight: 700, color: '#1C2833', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: openFaq === i ? '#FDF3E3' : '#fff' }}
              >
                {q}
                <span style={{ fontSize: '.8rem', color: '#7A6652', transition: 'transform .3s', transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)', display: 'inline-block' }}>▼</span>
              </div>
              {openFaq === i && (
                <div style={{ padding: '.8rem 1.2rem', fontSize: '.78rem', color: '#7A6652', lineHeight: 1.65, background: '#FDF3E3', borderTop: '1px solid #E0D0B8' }}>
                  {a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
