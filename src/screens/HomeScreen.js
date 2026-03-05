import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchSessions } from '../services/sheets';
import CaseCard from '../components/CaseCard';
import { format, parseISO, isToday, isTomorrow } from 'date-fns';
import { BellIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import { ClockIcon } from '@heroicons/react/24/outline';
import { ProximieLogo } from '../components/ProximieLogo';

const REGISTRATION_FORM = 'https://docs.google.com/forms/d/e/1FAIpQLSeR-7AokPpVSLYjWP5qlymEdu5rIvknzubjoMxXSPKaRIrQzQ/viewform?usp=publish-editor';

export default function HomeScreen() {
  const { user, resident } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [toast, setToast] = useState(null);
  const [myRegistrations] = useState(() => {
    try { return JSON.parse(localStorage.getItem('dcop_registrations') || '[]'); } catch { return []; }
  });

  useEffect(() => {
    fetchSessions().then(data => {
      const upcoming = data
        .filter(s => s.status === 'Active' || !s.status)
        .sort((a, b) => new Date(a.date + 'T' + (a.time || '00:00')) - new Date(b.date + 'T' + (b.time || '00:00')));
      setSessions(upcoming);
      setLoading(false);
    });
  }, []);

  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  function handleRegister(session) {
    window.open(REGISTRATION_FORM, '_blank');
    showToast('Opening registration form...');
  }

  const nextSession = sessions.find(s => myRegistrations.includes(s.caseId));
  const nextSessionLabel = nextSession ? (() => {
    try {
      const d = parseISO(nextSession.date);
      if (isToday(d)) return 'Today';
      if (isTomorrow(d)) return 'Tomorrow';
      return format(d, 'MMM d');
    } catch { return nextSession.date; }
  })() : null;

  const filters = ['all', 'available', 'registered', 'master'];
  const filtered = sessions.filter(s => {
    if (filter === 'available') return !myRegistrations.includes(s.caseId) && s.currentRegistrations < s.maxCapacity;
    if (filter === 'registered') return myRegistrations.includes(s.caseId);
    if (filter === 'master') return !s.sessionType?.toLowerCase().includes('standard');
    return true;
  });

  const firstName = resident?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'Doctor';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="screen-content">
      <div className="status-bar">
        <span>{format(new Date(), 'h:mm a')}</span>
        <span>DCoP</span>
      </div>

      <div className="app-header">
        <ProximieLogo size={24} />
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ width: 36, height: 36, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }} onClick={() => navigate('/notifications')}>
            <BellIcon style={{ width: 18, height: 18, color: 'var(--text)' }} />
            <div style={{ position: 'absolute', top: 6, right: 7, width: 8, height: 8, background: 'var(--red)', borderRadius: '50%', border: '1.5px solid var(--bg)' }} />
          </div>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, var(--accent), var(--accent2))', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, cursor: 'pointer' }} onClick={() => navigate('/profile')}>
            {firstName[0]?.toUpperCase()}
          </div>
        </div>
      </div>

      <div style={{ padding: '0 20px 20px' }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: -0.5, marginBottom: 4, color: 'var(--text)' }}>
          {greeting}, {firstName}
        </h1>
        <p style={{ fontSize: 13, color: 'var(--muted)' }}>
          {myRegistrations.length > 0 ? `${myRegistrations.length} registered session${myRegistrations.length > 1 ? 's' : ''}` : 'Browse available cases below'}
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 10, padding: '0 20px 20px' }}>
        {[
          { val: resident?.sessionsRegistered ?? myRegistrations.length, label: 'Registered', color: 'var(--accent)' },
          { val: resident?.sessionsAttended ?? 0, label: 'Attended', color: 'var(--green)' },
          { val: resident?.group || '—', label: 'Group', color: 'var(--amber)' },
        ].map(({ val, label, color }) => (
          <div key={label} style={{ flex: 1, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '14px 12px', textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 600, fontFamily: 'DM Mono, monospace', color, lineHeight: 1, marginBottom: 4 }}>{val}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Reminder */}
      {nextSession && (
        <div style={{ margin: '0 20px 20px', background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.18)', borderRadius: 12, padding: '12px 14px', display: 'flex', gap: 10, alignItems: 'center' }}>
          <ClockIcon style={{ width: 20, height: 20, color: 'var(--amber)', flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--amber)' }}>Reminder: {nextSessionLabel} {nextSession.time}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{nextSession.title} · {nextSession.institution}</div>
          </div>
        </div>
      )}

      {/* Section header */}
      <div className="section-title">
        <span>Upcoming Cases</span>
        <span className="section-link" onClick={() => navigate('/calendar')} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <CalendarDaysIcon style={{ width: 14, height: 14 }} /> Calendar
        </span>
      </div>

      {/* Filter pills */}
      <div style={{ display: 'flex', gap: 8, padding: '0 20px 16px', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {filters.map(f => (
          <div key={f} onClick={() => setFilter(f)} style={{ flexShrink: 0, fontSize: 12, padding: '5px 12px', borderRadius: 20, fontWeight: 600, cursor: 'pointer', background: filter === f ? 'var(--accent)' : 'var(--surface)', color: filter === f ? 'white' : 'var(--muted)', border: `1px solid ${filter === f ? 'var(--accent)' : 'var(--border)'}`, textTransform: 'capitalize' }}>
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
          </div>
        ))}
      </div>

      {/* Cases list */}
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {loading ? <div className="spinner" /> : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--muted)', fontSize: 14 }}>No cases found</div>
        ) : (
          filtered.map(session => (
            <CaseCard key={session.caseId} session={session} isRegistered={myRegistrations.includes(session.caseId)} onRegister={handleRegister} />
          ))
        )}
      </div>
      <div style={{ height: 24 }} />
      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
    </div>
  );
}
