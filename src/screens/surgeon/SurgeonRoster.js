import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchSurgeonSessions, fetchCaseRegistrants } from '../../services/sheets';
import { useAuth } from '../../context/AuthContext';
import { format, parseISO } from 'date-fns';
import { ChevronLeftIcon, MapPinIcon, CalendarDaysIcon, UserGroupIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckSolid } from '@heroicons/react/24/solid';

export default function SurgeonRoster() {
  const { caseId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [registrants, setRegistrants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmed, setConfirmed] = useState({});

  useEffect(() => {
    const surgeonName = user?.displayName || '';
    Promise.all([
      fetchSurgeonSessions(surgeonName),
      fetchCaseRegistrants(caseId),
    ]).then(([sessions, regs]) => {
      const found = sessions.find(s => s.caseId === caseId) || sessions[0];
      setSession(found);
      setRegistrants(regs);
      const init = {};
      regs.forEach(r => { if (r.confirmed) init[r.email] = true; });
      setConfirmed(init);
      setLoading(false);
    });
  }, [caseId, user]);

  function toggleConfirm(email) {
    setConfirmed(prev => ({ ...prev, [email]: !prev[email] }));
  }

  function formatDate(dateStr) {
    try { return format(parseISO(dateStr), 'MMMM d, yyyy'); } catch { return dateStr; }
  }

  const confirmedCount = Object.values(confirmed).filter(Boolean).length;

  if (loading) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}><div className="spinner" /></div>;

  return (
    <div className="screen-content">
      <div className="status-bar"><span>{format(new Date(), 'h:mm a')}</span><span>DCoP</span></div>

      {/* Header */}
      <div style={{ padding: '12px 20px 16px' }}>
        <button onClick={() => navigate('/surgeon')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: 'var(--muted)', fontSize: 13, fontFamily: 'DM Sans, sans-serif', padding: 0, marginBottom: 16 }}>
          <ChevronLeftIcon style={{ width: 18, height: 18 }} /> Dashboard
        </button>

        {session && (
          <div style={{ background: 'var(--surface)', border: '1px solid rgba(244,132,95,0.2)', borderRadius: 14, padding: 16 }}>
            <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: -0.3, marginBottom: 10, color: 'var(--text)' }}>{session.title}</div>
            <div style={{ display: 'flex', gap: 14, fontSize: 12, color: 'var(--muted)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <CalendarDaysIcon style={{ width: 13, height: 13 }} />
                {formatDate(session.date)} · {session.time}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <MapPinIcon style={{ width: 13, height: 13 }} />
                {session.institution}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Registrants count */}
      <div className="section-title">
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <UserGroupIcon style={{ width: 14, height: 14 }} />
          {registrants.length} Registrant{registrants.length !== 1 ? 's' : ''}
        </span>
        <span style={{ color: 'var(--green)', fontWeight: 500, fontSize: 12 }}>{confirmedCount} confirmed</span>
      </div>

      {/* Roster list */}
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {registrants.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--muted)', fontSize: 14 }}>No registrants yet</div>
        ) : (
          registrants.map((r, i) => {
            const initials = r.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
            const colors = ['#3b82f6','#10b981','#f59e0b','#8b5cf6','#ef4444','#06b6d4'];
            const bg = colors[i % colors.length];
            const isConfirmed = confirmed[r.email];

            return (
              <div key={r.email} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ width: 42, height: 42, borderRadius: '50%', background: `linear-gradient(135deg, ${bg}, ${bg}99)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, flexShrink: 0 }}>
                  {initials}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 3, color: 'var(--text)' }}>{r.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>{r.specialty} · {r.level} · {r.institution}</div>
                </div>
                <button
                  onClick={() => toggleConfirm(r.email)}
                  style={{ background: isConfirmed ? 'rgba(16,185,129,0.12)' : 'var(--surface2)', border: `1px solid ${isConfirmed ? 'rgba(16,185,129,0.3)' : 'var(--border)'}`, borderRadius: 10, padding: '6px 12px', fontSize: 12, fontWeight: 600, fontFamily: 'DM Sans, sans-serif', cursor: 'pointer', color: isConfirmed ? 'var(--green)' : 'var(--muted)', display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  {isConfirmed
                    ? <><CheckSolid style={{ width: 14, height: 14 }} /> Attended</>
                    : <><ClockIcon style={{ width: 14, height: 14 }} /> Pending</>
                  }
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Confirm all button */}
      {registrants.length > 0 && (
        <div style={{ padding: '20px' }}>
          <button
            onClick={() => {
              const all = {};
              registrants.forEach(r => { all[r.email] = true; });
              setConfirmed(all);
            }}
            style={{ width: '100%', background: 'linear-gradient(135deg, var(--surgeon), var(--amber))', color: 'white', border: 'none', borderRadius: 14, padding: 16, fontSize: 14, fontWeight: 600, fontFamily: 'DM Sans, sans-serif', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            <CheckCircleIcon style={{ width: 20, height: 20 }} />
            Confirm All Attendance
          </button>
          <div style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'center', marginTop: 8 }}>
            Attendance updates are sent to the programme coordinator
          </div>
        </div>
      )}
      <div style={{ height: 10 }} />
    </div>
  );
}
