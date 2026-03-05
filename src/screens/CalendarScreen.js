import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, parseISO } from 'date-fns';
import { fetchSessions } from '../services/sheets';
import { ChevronLeftIcon, ChevronRightIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { ProximieLogo } from '../components/ProximieLogo';

export default function CalendarScreen() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myRegistrations] = useState(() => {
    try { return JSON.parse(localStorage.getItem('dcop_registrations') || '[]'); } catch { return []; }
  });

  useEffect(() => {
    fetchSessions().then(data => { setSessions(data); setLoading(false); });
  }, []);

  const days = eachDayOfInterval({ start: startOfMonth(currentMonth), end: endOfMonth(currentMonth) });
  const startPad = startOfMonth(currentMonth).getDay();

  function getSessionsForDay(day) {
    return sessions.filter(s => { try { return isSameDay(parseISO(s.date), day); } catch { return false; } });
  }

  const selectedSessions = getSessionsForDay(selectedDay);

  function dotColor(s) {
    if (myRegistrations.includes(s.caseId)) return 'var(--amber)';
    if (!s.sessionType?.toLowerCase().includes('standard')) return 'var(--green)';
    return 'var(--accent)';
  }

  function prevMonth() { const d = new Date(currentMonth); d.setMonth(d.getMonth() - 1); setCurrentMonth(d); }
  function nextMonth() { const d = new Date(currentMonth); d.setMonth(d.getMonth() + 1); setCurrentMonth(d); }

  return (
    <div className="screen-content">
      <div className="status-bar"><span>{format(new Date(), 'h:mm a')}</span><span>DCoP</span></div>
      <div className="app-header"><ProximieLogo size={24} /></div>

      <div style={{ padding: '0 20px 14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <span style={{ fontSize: 20, fontWeight: 600, letterSpacing: -0.5, color: 'var(--text)' }}>{format(currentMonth, 'MMMM yyyy')}</span>
          <div style={{ display: 'flex', gap: 8 }}>
            {[{ fn: prevMonth, Icon: ChevronLeftIcon }, { fn: nextMonth, Icon: ChevronRightIcon }].map(({ fn, Icon }, i) => (
              <button key={i} onClick={fn} style={{ width: 30, height: 30, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon style={{ width: 16, height: 16 }} />
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', fontSize: 11, fontWeight: 600, color: 'var(--muted)', marginBottom: 8 }}>
          {['S','M','T','W','T','F','S'].map((d, i) => <span key={i}>{d}</span>)}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
          {Array(startPad).fill(null).map((_, i) => <div key={`pad-${i}`} />)}
          {days.map(day => {
            const daySessions = getSessionsForDay(day);
            const isSelected = isSameDay(day, selectedDay);
            const isCurrentDay = isToday(day);
            return (
              <div key={day.toISOString()} onClick={() => setSelectedDay(day)} style={{ aspectRatio: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, fontSize: 13, fontWeight: 500, borderRadius: 10, cursor: 'pointer', background: isSelected ? 'var(--accent)' : isCurrentDay ? 'var(--surface)' : 'transparent', border: isCurrentDay && !isSelected ? '1px solid var(--border)' : '1px solid transparent', color: isSelected ? 'white' : 'var(--text)' }}>
                <span>{format(day, 'd')}</span>
                {daySessions.length > 0 && <div style={{ width: 5, height: 5, borderRadius: '50%', background: isSelected ? 'white' : dotColor(daySessions[0]) }} />}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ padding: '0 20px 14px', display: 'flex', gap: 16, fontSize: 12, color: 'var(--muted)' }}>
        {[['var(--accent)', 'Standard'], ['var(--green)', 'Master / Review'], ['var(--amber)', 'Registered']].map(([color, label]) => (
          <span key={label}><span style={{ color }}>●</span> {label}</span>
        ))}
      </div>

      <div className="divider" />

      <div style={{ padding: '14px 20px 0', fontSize: 12, fontWeight: 600, color: 'var(--muted)', marginBottom: 12 }}>
        {format(selectedDay, 'EEEE, MMMM d')}
      </div>

      <div style={{ padding: '0 20px' }}>
        {loading ? <div className="spinner" /> : selectedSessions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--muted)', fontSize: 14 }}>No sessions this day</div>
        ) : (
          selectedSessions.map(s => {
            const isOpen = !s.sessionType?.toLowerCase().includes('standard');
            const isReg = myRegistrations.includes(s.caseId);
            return (
              <div key={s.caseId} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 14, marginBottom: 10, display: 'flex', gap: 14, alignItems: 'center' }}>
                <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--muted)', fontFamily: 'DM Mono, monospace', flexShrink: 0 }}>{s.time}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 3, color: 'var(--text)' }}>{s.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <MapPinIcon style={{ width: 12, height: 12 }} />
                    {s.institution} · {isOpen ? 'Open access' : `${s.currentRegistrations}/${s.maxCapacity} spots`}
                  </div>
                </div>
                <div style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, background: isReg ? 'var(--amber)' : isOpen ? 'var(--green)' : 'var(--accent)' }} />
              </div>
            );
          })
        )}
      </div>
      <div style={{ height: 24 }} />
    </div>
  );
}
