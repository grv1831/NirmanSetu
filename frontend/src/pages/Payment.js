// src/pages/Payment.js
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const BASE = 'https://nirmansetu-api.onrender.com';

const inp = {
  width:'100%', padding:'.65rem .85rem', border:'1.5px solid #E0D0B8',
  borderRadius:7, fontFamily:"'Sora',sans-serif", fontSize:'.85rem',
  background:'#FDF3E3', outline:'none', marginTop:'.3rem', boxSizing:'border-box'
};

export default function Payment() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [params] = useSearchParams();
  const role = params.get('role') || (user?.role || 'owner');
  const workerId = params.get('workerId') || '';

  const [txnId,   setTxnId]   = useState('');
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);
  const [error,   setError]   = useState('');

  // Payment details
  const isWorker = role === 'worker';
  const amount   = isWorker ? 10 : 1;
  const UPI_ID   = '7050292701@upi'; // ← CHANGE THIS to your UPI ID

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!txnId.trim()) { setError('Please enter the UPI Transaction ID'); return; }
    setLoading(true); setError('');

    try {
      if (isWorker) {
        await axios.post(`${BASE}/api/payment/worker-register`, { upiTransactionId: txnId });
      } else {
        await axios.post(`${BASE}/api/payment/hire`, { upiTransactionId: txnId, workerId });
      }
      setDone(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed. Please try again.');
    } finally { setLoading(false); }
  };

  if (!user) { navigate('/login'); return null; }

  if (done) return (
    <div style={{ paddingTop:62, minHeight:'100vh', background:'#FAFAF7', fontFamily:"'Sora',sans-serif", display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ textAlign:'center', padding:'3rem', maxWidth:400 }}>
        <div style={{ fontSize:'4rem', marginBottom:'1rem' }}>🎉</div>
        <h2 style={{ fontSize:'1.5rem', fontWeight:900, color:'#1A7A40', marginBottom:'.5rem' }}>Payment Submitted!</h2>
        <p style={{ fontSize:'.85rem', color:'#7A6652', lineHeight:1.7, marginBottom:'1.5rem' }}>
          {isWorker
            ? 'Your ₹10 payment is under review. Your profile will be activated within 2 hours.'
            : 'Your ₹1 payment is under review. You can hire the worker within 2 hours after confirmation.'}
        </p>
        <button onClick={() => navigate('/dashboard')} style={{ padding:'.8rem 2rem', background:'#C0392B', color:'#fff', border:'none', borderRadius:9, fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:'.9rem', cursor:'pointer' }}>
          Go to Dashboard
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ paddingTop:62, minHeight:'100vh', background:'#FAFAF7', fontFamily:"'Sora',sans-serif" }}>
      {/* Header */}
      <div style={{ background:'#1C2833', padding:'2.5rem', textAlign:'center' }}>
        <h2 style={{ fontSize:'1.8rem', fontWeight:900, color:'#fff', letterSpacing:'-.03em', marginBottom:'.4rem' }}>
          {isWorker ? '💼 Activate Your Profile' : '🤝 Hire a Worker'}
        </h2>
        <p style={{ fontSize:'.85rem', color:'rgba(255,255,255,.45)' }}>
          {isWorker ? 'Pay ₹10 once — your profile stays active forever' : 'Pay ₹1 to hire this worker'}
        </p>
      </div>

      <div style={{ maxWidth:480, margin:'2rem auto', padding:'0 1.5rem 4rem' }}>

        {/* Amount Card */}
        <div style={{ background:'#fff', border:'2px solid #C0392B', borderRadius:14, padding:'2rem', textAlign:'center', marginBottom:'1.5rem' }}>
          <div style={{ fontSize:'.72rem', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'#C0392B', marginBottom:'.4rem' }}>
            {isWorker ? 'One-time Registration Fee' : 'Per Hire Fee'}
          </div>
          <div style={{ fontSize:'4rem', fontWeight:900, color:'#1C2833', lineHeight:1 }}>
            ₹{amount}
          </div>
          <div style={{ fontSize:'.78rem', color:'#7A6652', marginTop:'.4rem' }}>
            {isWorker ? 'Lifetime active profile' : 'For this one hire'}
          </div>
        </div>

        {/* UPI Payment Instructions */}
        <div style={{ background:'#fff', border:'1.5px solid #E0D0B8', borderRadius:14, padding:'1.8rem', marginBottom:'1.5rem' }}>
          <h3 style={{ fontSize:'1rem', fontWeight:800, color:'#1C2833', marginBottom:'1.2rem' }}>
            📱 How to Pay via UPI
          </h3>

          {/* Step 1 */}
          <div style={{ display:'flex', gap:'1rem', marginBottom:'1rem', alignItems:'flex-start' }}>
            <div style={{ width:28, height:28, borderRadius:'50%', background:'#FEF0EE', border:'1.5px solid #F5C4B3', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.78rem', fontWeight:800, color:'#C0392B', flexShrink:0 }}>1</div>
            <div>
              <div style={{ fontSize:'.85rem', fontWeight:700, color:'#1C2833', marginBottom:'.2rem' }}>Open any UPI app</div>
              <div style={{ fontSize:'.75rem', color:'#7A6652' }}>Google Pay, PhonePe, Paytm, BHIM — any app works</div>
            </div>
          </div>

          {/* Step 2 */}
          <div style={{ display:'flex', gap:'1rem', marginBottom:'1rem', alignItems:'flex-start' }}>
            <div style={{ width:28, height:28, borderRadius:'50%', background:'#FEF0EE', border:'1.5px solid #F5C4B3', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.78rem', fontWeight:800, color:'#C0392B', flexShrink:0 }}>2</div>
            <div>
              <div style={{ fontSize:'.85rem', fontWeight:700, color:'#1C2833', marginBottom:'.2rem' }}>Send ₹{amount} to this UPI ID</div>
              <div style={{ background:'#FDF3E3', border:'1.5px solid #E0D0B8', borderRadius:8, padding:'.6rem 1rem', marginTop:'.4rem', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:'.95rem', color:'#C0392B' }}>{UPI_ID}</span>
                <button onClick={() => navigator.clipboard.writeText(UPI_ID)} style={{ background:'transparent', border:'none', fontSize:'.72rem', color:'#7A6652', cursor:'pointer', fontFamily:"'Sora',sans-serif" }}>
                  Copy
                </button>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div style={{ display:'flex', gap:'1rem', alignItems:'flex-start' }}>
            <div style={{ width:28, height:28, borderRadius:'50%', background:'#FEF0EE', border:'1.5px solid #F5C4B3', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.78rem', fontWeight:800, color:'#C0392B', flexShrink:0 }}>3</div>
            <div>
              <div style={{ fontSize:'.85rem', fontWeight:700, color:'#1C2833', marginBottom:'.2rem' }}>Copy the Transaction ID</div>
              <div style={{ fontSize:'.75rem', color:'#7A6652' }}>After payment, UPI app shows a Transaction ID like UPI123456789 — copy it</div>
            </div>
          </div>
        </div>

        {/* Submit Transaction ID */}
        <form onSubmit={handleSubmit} style={{ background:'#fff', border:'1.5px solid #E0D0B8', borderRadius:14, padding:'1.8rem' }}>
          <h3 style={{ fontSize:'1rem', fontWeight:800, color:'#1C2833', marginBottom:'1rem' }}>
            ✅ Submit Your Payment
          </h3>

          {error && (
            <div style={{ background:'#FDECEA', border:'1px solid #FADBD8', color:'#C0392B', padding:'.75rem 1rem', borderRadius:8, fontSize:'.78rem', marginBottom:'1rem' }}>
              {error}
            </div>
          )}

          <div>
            <label style={{ fontSize:'.65rem', fontWeight:700, letterSpacing:'.09em', textTransform:'uppercase', color:'#7A6652' }}>
              UPI Transaction ID *
            </label>
            <input
              required
              style={inp}
              value={txnId}
              onChange={e => setTxnId(e.target.value)}
              placeholder="e.g. UPI123456789012"
            />
            <div style={{ fontSize:'.68rem', color:'#7A6652', marginTop:'.3rem' }}>
              Found in your UPI app after payment — under Payment History
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width:'100%', padding:'.9rem', border:'none', borderRadius:9, fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:'.9rem', background:'#C0392B', color:'#fff', cursor:loading?'not-allowed':'pointer', marginTop:'1.2rem', boxShadow:'3px 3px 0 #7B241C', opacity:loading?.7:1 }}
          >
            {loading ? 'Submitting…' : `Submit ₹${amount} Payment`}
          </button>

          <p style={{ textAlign:'center', fontSize:'.72rem', color:'#7A6652', marginTop:'.8rem', lineHeight:1.5 }}>
            Your payment will be verified manually within 2 hours.<br/>
            Need help? Call: <strong>1800-XXX-XXXX</strong>
          </p>
        </form>
      </div>
    </div>
  );
}
