import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fetchSurgeonSessions } from '../../services/sheets';
import { format, parseISO } from 'date-fns';
import { BellIcon, UserGroupIcon, PlusCircleIcon, CalendarDaysIcon, MapPinIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { ProximieLogo } from '../../components/ProximieLogo';

const CASE_CREATION_FORM = 'https://docs.google.com/forms/d/e/1FAIpQLScAit0SYBnOe2q-iMgWxGU92xpEa0sx3JVxs49b_fP4T_aj-Q/viewform?usp=sharing&ouid=101337914910408991885';

export default function SurgeonDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const surgeonName = user?.displayName || '';
  const firstName = surgeonName.replace(/^Dr\.?\s*/i, '').split(' ')[0] || user?.email?.split('@')[0] || 'Doctor';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  useEffect(() => {
    fetchSurgeonSessions(surgeonName).then(data => {
      setSessions(data.sort((a, b) => new Date(a.date) - new Date(b.date)));
      setLoading(false);
    });
  }, [surgeonName]);

  const totalRegistrants = sessions.reduce((sum, s) => sum + s.currentRegistrations, 0);
  const activeCases = sessions.filter(s => s.status === 'Active' || !s.status).length;

  function getTypeLabel(sessionType) {
    const t = (sessionType || '').toLowerCase();
    if (t.includes('post')) return { label: 'Post-Review', color: 'var(--green)', bg: 'rgba(16,185,129,0.12)' };
    if (t.includes('master')) return { label: 'Master', color: 'var(--green)', bg: 'rgba(16,185,129,0.12)' };
    return { label: 'Standard', color: 'var(--accent)', bg: 'rgba(79,142,247,0.12)' };
  }

  function formatDate(dateStr) {
    try { return format(parseISO(dateStr), 'MMM d'); } catch { return dateStr; }
  }

  return (
    <div className="screen-content">
      <div className="status-bar"><span>{format(new Date(), 'h:mm a')}</span><span>DCoP</span></div>

      <div className="app-header">
        <ProximieLogo size={24} />
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ width: 36, height: 36, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <BellIcon style={{ width: 18, height: 18, color: 'var(--text)' }} />
          </div>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, var(--surgeon), var(--amber))', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600 }}>
            {firstName[0]?.toUpperCase()}
          </div>
        </div>
      </div>

      <div style={{ padding: '0 20px 20px' }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: -0.5, marginBottom: 4, color: 'var(--text)' }}>{greeting}, Dr. {firstName}</h1>
        <p style={{ fontSize: 13, color: 'var(--muted)' }}>{activeCases} active case{activeCases !== 1 ? 's' : ''} this programme</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 10, padding: '0 20px 20px' }}>
        {[
          { val: activeCases, label: 'Active Cases', color: 'var(--surgeon)' },
          { val: totalRegistrants, label: 'Registrants', color: 'var(--accent)' },
          { val: sessions.length > 0 ? '—' : '0', label: 'Attendance', color: 'var(--green)' },
        ].map(({ val, label, color }) => (
          <div key={label} style={{ flex: 1, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '14px 10px', textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 600, fontFamily: 'DM Mono, monospace', color, lineHeight: 1, marginBottom: 4 }}>{val}</div>
            <div style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Create case button */}
      <div style={{ padding: '0 20px 20px' }}>
        <button
          onClick={() => window.open(CASE_CREATION_FORM, '_blank')}
          style={{ width: '100%', background: 'linear-gradient(135deg, var(--surgeon), var(--amber))', color: 'white', border: 'none', borderRadius: 14, padding: '16px 20px', fontSize: 15, fontWeight: 600, fontFamily: 'DM Sans, sans-serif', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          <PlusCircleIcon style={{ width: 22, height: 22 }} />
          Create New Case
        </button>
      </div>

      {/* My Cases */}
      <div className="section-title">
        <span>My Cases</span>
        <span style={{ fontSize: 12, color: 'var(--surgeon)', cursor: 'pointer', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }} onClick={() => navigate('/surgeon/calendar')}>
          <CalendarDaysIcon style={{ width: 14, height: 14 }} /> Calendar
        </span>
      </div>

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {loading ? <div className="spinner" /> : sessions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--muted)', fontSize: 14 }}>
            No cases yet — create your first case above
          </div>
        ) : (
          sessions.map(session => {
            const type = getTypeLabel(session.sessionType);
            const isOpen = !session.sessionType?.toLowerCase().includes('standard');
            return (
              <div key={session.caseId} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 16, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: 'var(--surgeon)', borderRadius: '3px 0 0 3px' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, flex: 1, paddingRight: 10, letterSpacing: -0.2, lineHeight: 1.3, color: 'var(--text)' }}>{session.title}</div>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20, background: type.bg, color: type.color, whiteSpace: 'nowrap' }}>{type.label}</span>
                </div>

                <div style={{ display: 'flex', gap: 14, fontSize: 12, color: 'var(--muted)', marginBottom: 12 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <CalendarDaysIcon style={{ width: 13, height: 13 }} />
                    {formatDate(session.date)} · {session.time} {session.timezone}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <MapPinIcon style={{ width: 13, height: 13 }} />
                    {session.institution}
                  </span>
                </div>

                <div style={{ paddingTop: 12, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <UserGroupIcon style={{ width: 16, height: 16, color: 'var(--muted)' }} />
                    <span style={{ fontSize: 13, color: 'var(--muted)' }}>
                      {session.currentRegistrations}{isOpen ? '' : `/${session.maxCapacity}`} registered
                    </span>
                  </div>
                  <button
                    onClick={() => navigate(`/surgeon/roster/${session.caseId}`)}
                    style={{ background: 'rgba(244,132,95,0.12)', color: 'var(--surgeon)', border: 'none', borderRadius: 10, padding: '7px 14px', fontSize: 12, fontWeight: 600, fontFamily: 'DM Sans, sans-serif', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                  >
                    View roster <ChevronRightIcon style={{ width: 14, height: 14 }} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
      <div style={{ height: 24 }} />
    </div>
  );
}
