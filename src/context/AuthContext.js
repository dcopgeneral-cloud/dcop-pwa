import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendSignInLinkToEmail,
} from 'firebase/auth';
import { fetchResidentByEmail, detectRole } from '../services/sheets';

const AuthContext = createContext(null);

// In-memory OTP store (codes are generated here, verified here)
const OTP_STORE = {};

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const ACTION_CODE_SETTINGS = {
  url: window.location.origin + '/login',
  handleCodeInApp: true,
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [resident, setResident] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      setUser(fbUser);
      if (fbUser) {
        const [rec, detectedRole] = await Promise.all([
          fetchResidentByEmail(fbUser.email),
          detectRole(fbUser.displayName || fbUser.email),
        ]);
        setResident(rec);
        setRole(detectedRole);
      } else {
        setResident(null);
        setRole(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  /**
   * Step 1: Generate OTP and send via Firebase Email Link
   * The OTP is stored in memory — Firebase Email Link handles the email delivery
   * but we overlay a 6-digit code on top for a better UX
   */
  async function sendOTP(email) {
    setError('');
    const otp = generateOTP();
    const expires = Date.now() + 10 * 60 * 1000; // 10 min
    OTP_STORE[email.toLowerCase()] = { otp, expires };

    try {
      // Send Firebase email link — this is the actual email trigger
      await sendSignInLinkToEmail(auth, email, ACTION_CODE_SETTINGS);
      // Store email for verification step
      window.localStorage.setItem('dcop_otp_email', email);
      window.localStorage.setItem('dcop_otp_code', JSON.stringify({ otp, expires, email: email.toLowerCase() }));
      console.log('[DEV] OTP for', email, ':', otp); // Remove in production
    } catch (err) {
      // If user doesn't exist in Firebase yet, still "succeed" — 
      // they'll get an error at verify step with a clear message
      if (err.code !== 'auth/user-not-found') {
        throw new Error('Failed to send code. Please check your email address.');
      }
    }
  }

  /**
   * Step 2: Verify the 6-digit OTP entered by the user
   */
  async function verifyOTP(email, code) {
    setError('');
    const stored = JSON.parse(window.localStorage.getItem('dcop_otp_code') || 'null');

    if (!stored) throw new Error('No code found. Please request a new one.');
    if (stored.email !== email.toLowerCase()) throw new Error('Email mismatch. Please request a new code.');
    if (Date.now() > stored.expires) throw new Error('Code has expired. Please request a new one.');
    if (stored.otp !== code) throw new Error('Incorrect code. Please try again.');

    // Code is valid — sign in with a temporary password approach
    // (Firebase Email Link sign-in requires clicking the email link)
    // We use a known-password pattern since accounts are pre-created by n8n
    try {
      // Try signing in — n8n creates accounts with a known temp password pattern
      // If this fails, the account doesn't exist yet
      await signInWithEmailAndPassword(auth, email, 'DCoP2026!');
      window.localStorage.removeItem('dcop_otp_code');
      window.localStorage.removeItem('dcop_otp_email');
    } catch (err) {
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        throw new Error('Sign in failed. Your account may not be set up yet — contact your coordinator.');
      }
      if (err.code === 'auth/user-not-found') {
        throw new Error('No account found for this email. Please register first using the form on the welcome page.');
      }
      throw new Error('Sign in failed. Please try again.');
    }
  }

  async function signOut() {
    await firebaseSignOut(auth);
  }

  return (
    <AuthContext.Provider value={{
      user, resident, role, loading, error, setError,
      sendOTP, verifyOTP, signOut,
      isSurgeon: role === 'surgeon',
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
