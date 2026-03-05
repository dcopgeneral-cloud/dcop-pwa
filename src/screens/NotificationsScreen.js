import React, { useState } from 'react';
import { format } from 'date-fns';
import { ExclamationCircleIcon, CheckCircleIcon, InformationCircleIcon, ClockIcon, AcademicCapIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

const MOCK_NOTIFS = [
  { id: 1, Icon: ExclamationCircleIcon, bg: 'rgba(244,63,94,0.1)', color: 'var(--red)', title: 'Registration Closing Soon', body: 'Cardiac Bypass case closes in 2 hours — only 3 spots remain', time: '15 min ago', read: false },
  { id: 2, Icon: CheckCircleIcon, bg: 'rgba(16,185,129,0.1)', color: 'var(--green)', title: 'Registration Confirmed', body: "You're in for Laparoscopic Cholecystectomy. Check your email for the Proximie link.", time: '2 hours ago', read: false },
  { id: 3, Icon: InformationCircleIcon, bg: 'rgba(79,142,247,0.1)', color: 'var(--accent)', title: 'New Case Posted', body: 'Laparoscopic Appendectomy — Standard case, 6 spots available', time: '5 hours ago', read: false },
  { id: 4, Icon: ClockIcon, bg: 'rgba(245,158,11,0.1)', color: 'var(--amber)', title: 'Session Tomorrow', body: 'Laparoscopic Cholecystectomy starts at 9:00 AM. Check your Proximie dashboard', time: 'Yesterday', read: true },
  { id: 5, Icon: AcademicCapIcon, bg: 'rgba(16,185,129,0.1)', color: 'var(--green)', title: 'Master Class Open', body: 'Advanced Laparoscopy Techniques — no registration needed. Join anytime', time: 'Yesterday', read: true },
  { id: 6, Icon: ClipboardDocumentListIcon, bg: 'rgba(79,142,247,0.1)', color: 'var(--accent)', title: 'Feedback Requested', body: 'Please fill in feedback for your session from last week', time: '2 days ago', read: true },
];

export default function NotificationsScreen() {
  const [notifs, setNotifs] = useState(() => {
    try { return JSON.parse(localStorage.getItem('dcop_notifs') || 'null') || MOCK_NOTIFS; } catch { return MOCK_NOTIFS; }
  });

  function markAllRead() {
    const updated = notifs.map(n => ({ ...n, read: true }));
    setNotifs(updated);
    localStorage.setItem('dcop_notifs', JSON.stringify(updated));
  }

  function markRead(id) {
    const updated = notifs.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifs(updated);
    localStorage.setItem('dcop_notifs', JSON.stringify(updated));
  }

  const unreadCount = notifs.filter(n => !n.read).length;

  return (
    <div className="screen-content">
      <div className="status-bar"><span>{format(new Date(), 'h:mm a')}</span><span>DCoP</span></div>
      <div className="app-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)' }}>Alerts</div>
          {unreadCount > 0 && <span style={{ background: 'var(--red)', color: 'white', fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 20 }}>{unreadCount}</span>}
        </div>
        {unreadCount > 0 && <span style={{ fontSize: 13, color: 'var(--accent)', cursor: 'pointer', fontWeight: 500 }} onClick={markAllRead}>Mark all read</span>}
      </div>

      <div style={{ padding: '0 20px' }}>
        {notifs.map(({ id, Icon, bg, color, title, body, time, read }) => (
          <div key={id} onClick={() => markRead(id)} style={{ display: 'flex', gap: 14, padding: '14px 0', borderBottom: '1px solid var(--border)', cursor: 'pointer', opacity: read ? 0.65 : 1 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon style={{ width: 20, height: 20, color }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 3, color: 'var(--text)' }}>{title}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.4 }}>{body}</div>
              <div style={{ fontSize: 11, color: 'var(--subtle)', marginTop: 5 }}>{time}</div>
            </div>
            {!read && <div style={{ width: 8, height: 8, background: 'var(--accent)', borderRadius: '50%', flexShrink: 0, marginTop: 6 }} />}
          </div>
        ))}
      </div>
      <div style={{ height: 24 }} />
    </div>
  );
}
