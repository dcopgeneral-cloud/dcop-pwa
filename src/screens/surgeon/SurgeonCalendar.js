import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fetchSessions } from '../../services/sheets';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, parseISO } from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon, MapPinIcon, UserGroupIcon, ChevronRightIcon as ChevRight } from '@heroicons/react/24/outline';
import { ProximieLogo } from '../../components/ProximieLogo';

export default function SurgeonCalendar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const surgeonName = user?.displayName || '';

  useEffect(() => {
    fetchSessions().then(data => { setSessions(data); setLoading(false); });
  }, []);

  const mySessions = sessions.filter(s => s.surgeon?.toLowerCase().trim() === surgeonName.toLowerCase().trim());
  const days = eachDayOfInterval({ start: startOfMonth(currentMonth), end: endOfMonth(currentMonth) });
  const startPad = startOfMonth(currentMonth).getDay();

  function getSessionsForDay(day) {
    return mySessions.filter(s => { try { return isSameDay(parseISO(s.date), day); } catch { return false; } });
  }

  // Show all sessions on selected day, highlight surgeon's own
  const allDaySessions = sessions.filter(s => { try { return isSameDay(parseISO(s.date), selectedDay); } catch { return false; } });

  return (
    <div className="screen-content">
      <div className="status-bar"><span>{format(new Date(), 'h:mm a')}</span><span>DCoP</span></div>
      <div className="app-header">
        <ProximieLogo size={24} />
      </div>

      <div style={{ padding: '0 20px 14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <span style={{ fontSize: 20, fontWeight: 600, letterSpacing: -0.5, color: 'var(--text)' }}>{format(currentMonth, 'MMMM yyyy')}</span>
          <div style={{ display: 'flex', gap: 8 }}>
            {[ChevronLeftIcon, ChevronRightIcon].map((Icon, i) => (
              <button key={i} onClick={() => { const d = new Date(currentMonth); d.setMonth(d.getMonth() + (i === 0 ? -1 : 1)); setCurrentMonth(d); }} style={{ width: 30, height: 30, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon style={{ width: 16, height: 16, color: 'var(--text)' }} />
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', textAlign: 'center', fontSize: 11, fontWeight: 600, color: 'var(--muted)', marginBottom: 8 }}>
          {['S','M','T','W','T','F','S'].map((d,i) => <span key={i}>{d}</span>)}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2 }}>
          {Array(startPad).fill(null).map((_,i) => <div key={`pad-${i}`} />)}
          {days.map(day => {
            const mine = getSessionsForDay(day);
            const isSelected = isSameDay(day, selectedDay);
            const isCurrent = isToday(day);
            return (
              <div key={day.toISOString()} onClick={() => setSelectedDay(day)} style={{ aspectRatio: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, fontSize: 12, fontWeight: 500, borderRadius: 10, cursor: 'pointer', background: isSelected ? 'var(--surgeon)' : isCurrent ? 'var(--surface)' : 'transparent', border: isCurrent && !isSelected ? '1px solid var(--border)' : '1px solid transparent', color: isSelected ? 'white' : 'var(--text)' }}>
                <span>{format(day, 'd')}</span>
                {mine.length > 0 && <div style={{ width: 5, height: 5, borderRadius: '50%', background: isSelected ? 'white' : 'var(--surgeon)' }} />}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ padding: '0 20px 12px', display: 'flex', gap: 16, fontSize: 12, color: 'var(--muted)' }}>
        <span><span style={{ color: 'var(--surgeon)' }}>●</span> Your cases</span>
        <span><span style={{ color: 'var(--accent)' }}>●</span> All programme cases</span>
      </div>

      <div className="divider" />
      <div style={{ padding: '14px 20px 0', fontSize: 12, fontWeight: 600, color: 'var(--muted)', marginBottom: 12 }}>{format(selectedDay, 'EEEE, MMMM d')}</div>

      <div style={{ padding: '0 20px' }}>
        {loading ? <div className="spinner" /> : allDaySessions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--muted)', fontSize: 14 }}>No sessions this day</div>
        ) : (
          allDaySessions.map(s => {
            const isMine = s.surgeon?.toLowerCase().trim() === surgeonName.toLowerCase().trim();
            const isOpen = !s.sessionType?.toLowerCase().includes('standard');
            return (
              <div key={s.caseId} onClick={() => isMine && navigate(`/surgeon/roster/${s.caseId}`)} style={{ background: 'var(--surface)', border: `1px solid ${isMine ? 'rgba(244,132,95,0.25)' : 'var(--border)'}`, borderRadius: 12, padding: 14, marginBottom: 10, display: 'flex', gap: 12, alignItems: 'center', cursor: isMine ? 'pointer' : 'default', opacity: isMine ? 1 : 0.6 }}>
                <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--muted)', fontFamily: 'DM Mono, monospace', flexShrink: 0 }}>{s.time}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 3, color: isMine ? 'var(--text)' : 'var(--muted)' }}>{s.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', display: 'flex', gap: 10 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><MapPinIcon style={{ width: 11, height: 11 }} />{s.institution}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><UserGroupIcon style={{ width: 11, height: 11 }} />{s.currentRegistrations}{isOpen ? '' : `/${s.maxCapacity}`}</span>
                  </div>
                </div>
                {isMine && <ChevRight style={{ width: 16, height: 16, color: 'var(--surgeon)' }} />}
                {!isMine && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />}
              </div>
            );
          })
        )}
      </div>
      <div style={{ height: 24 }} />
    </div>
  );
}
