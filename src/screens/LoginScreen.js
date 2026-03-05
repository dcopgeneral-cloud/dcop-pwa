import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeftIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { ProximieLogo } from '../components/ProximieLogo';

export default function LoginScreen() {
  const { sendOTP, verifyOTP, error } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState('email');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  async function handleSendCode(e) {
    if (e && e.preventDefault) e.preventDefault();
    setLocalError('');
    setLoading(true);
    try {
      await sendOTP(email);
      setStep('code');
    } catch (err) {
      setLocalError(err.message || 'Failed to send code. Check your email address.');
    }
    setLoading(false);
  }

  async function handleVerifyCode(e) {
    e.preventDefault();
    setLocalError('');
    setLoading(true);
    try {
      await verifyOTP(email, code);
    } catch (err) {
      setLocalError(err.message || 'Invalid or expired code. Try again.');
    }
    setLoading(false);
  }

  const displayError = localError || error;

  const cardStyle = {
    background: 'var(--surface)',
    border: '1px solid var(--border2)',
    borderRadius: 16,
    padding: '28px 24px',
    width: '100%',
    maxWidth: 400,
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 24px 32px' }}>

      <div style={{ width: '100%', maxWidth: 400, marginBottom: 32 }}>
        <button onClick={() => step === 'code' ? setStep('email') : navigate('/welcome')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: 'var(--muted)', fontSize: 14, fontFamily: 'Inter, sans-serif', padding: 0 }}>
          <ArrowLeftIcon style={{ width: 17, height: 17 }} />
          {step === 'code' ? 'Change email' : 'Back'}
        </button>
      </div>

      <div style={cardStyle}>
        {/* Logo */}
        <div style={{ marginBottom: 24 }}>
          <ProximieLogo size={26} />
        </div>

        {step === 'email' ? (
          <form onSubmit={handleSendCode}>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 6, color: 'var(--text)' }}>Sign in</div>
              <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>Enter your email to receive a verification code.</div>
            </div>

            <div className="input-group">
              <label className="input-label">Email address</label>
              <div style={{ position: 'relative' }}>
                <EnvelopeIcon style={{ width: 16, height: 16, position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
                <input className="input-field" style={{ paddingLeft: 38 }} type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" required />
              </div>
            </div>

            {displayError && <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '10px 14px', marginBottom: 14, fontSize: 13, color: 'var(--red)' }}>{displayError}</div>}

            <button className="btn btn-primary" type="submit" disabled={loading} style={{ opacity: loading ? 0.6 : 1 }}>
              {loading ? 'Sending...' : 'Continue'}
            </button>

            <div style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'center', marginTop: 16 }}>
              Access level is assigned automatically based on your role.
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode}>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 6, color: 'var(--text)' }}>Check your email</div>
              <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>
                We sent a 6-digit code to <strong style={{ color: 'var(--text)' }}>{email}</strong>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Verification code</label>
              <input className="input-field" type="text" inputMode="numeric" pattern="[0-9]*" maxLength={6} placeholder="000000" value={code} onChange={e => setCode(e.target.value.replace(/\D/g, ''))} style={{ fontSize: 22, letterSpacing: 10, textAlign: 'center', fontFamily: 'DM Mono, monospace' }} autoComplete="one-time-code" required />
            </div>

            {displayError && <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '10px 14px', marginBottom: 14, fontSize: 13, color: 'var(--red)' }}>{displayError}</div>}

            <button className="btn btn-primary" type="submit" disabled={loading || code.length < 6} style={{ opacity: (loading || code.length < 6) ? 0.6 : 1, marginBottom: 14 }}>
              {loading ? 'Verifying...' : 'Verify & Sign In'}
            </button>

            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: 13, color: 'var(--accent)', cursor: 'pointer' }} onClick={handleSendCode}>Resend code</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
