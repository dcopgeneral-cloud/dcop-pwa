import React from 'react';
import { format, parseISO } from 'date-fns';

export default function CaseCard({ session, isRegistered, onRegister }) {
  const isMaster = session.sessionType?.toLowerCase().includes('master');
  const isFull = !isMaster && session.currentRegistrations >= session.maxCapacity;
  const pct = isMaster ? 0 : Math.min(100, (session.currentRegistrations / session.maxCapacity) * 100);
  const capColor = pct >= 100 ? 'cap-red' : pct >= 80 ? 'cap-amber' : 'cap-blue';

  let dateStr = session.date;
  try { dateStr = format(parseISO(session.date), 'MMM d'); } catch {}

  const borderColor = isRegistered ? 'var(--amber)' : isMaster ? 'var(--green)' : 'var(--accent)';

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 16,
      padding: 16,
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
        background: borderColor, borderRadius: '3px 0 0 3px',
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div style={{ fontSize: 15, fontWeight: 500, letterSpacing: -0.2, flex: 1, paddingRight: 12, lineHeight: 1.3, color: 'var(--text)' }}>
          {session.title}
        </div>
        <span className={`badge ${isRegistered ? 'badge-registered' : isMaster ? 'badge-master' : isFull ? 'badge-full' : 'badge-standard'}`}>
          {isRegistered ? 'Registered' : isMaster ? 'Master' : isFull ? 'Full' : 'Standard'}
        </span>
      </div>

      <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--muted)', marginBottom: 12 }}>
        <span>📅 {dateStr} · {session.time}</span>
        <span>📍 {session.institution}</span>
      </div>

      <div style={{
        paddingTop: 12, borderTop: '1px solid var(--border)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12,
      }}>
        {isMaster ? (
          <span style={{ fontSize: 12, color: 'var(--green)', flex: 1 }}>∞ Open to all — no limit</span>
        ) : (
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--muted)', marginBottom: 5 }}>
              <span>Capacity</span>
              <span>{session.currentRegistrations}/{session.maxCapacity}</span>
            </div>
            <div className="capacity-track">
              <div className={`capacity-fill ${capColor}`} style={{ width: `${pct}%` }} />
            </div>
          </div>
        )}

        {isRegistered ? (
          <button className="btn btn-sm btn-success" disabled>✓ Joined</button>
        ) : isFull ? (
          <button className="btn btn-sm btn-danger" disabled>Full</button>
        ) : (
          <button className="btn btn-sm btn-register" onClick={() => onRegister(session)}>
            {isMaster ? 'Join' : 'Register'}
          </button>
        )}
      </div>
    </div>
  );
}
