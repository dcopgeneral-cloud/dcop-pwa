import React from 'react';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import { LinkIcon, ClipboardDocumentListIcon, CalendarDaysIcon, BellIcon, ArrowRightOnRectangleIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const REGISTRATION_FORM = 'https://docs.google.com/forms/d/e/1FAIpQLSeR-7AokPpVSLYjWP5qlymEdu5rIvknzubjoMxXSPKaRIrQzQ/viewform?usp=publish-editor';
const FEEDBACK_FORM = 'https://docs.google.com/forms/d/e/1FAIpQLSfsx7NJDr5kvNk2uFt9IM9SSqy8h3OjCQ52iDP_ie-3b0hfqQ/viewform';

export default function ProfileScreen() {
  const { user, resident, signOut } = useAuth();

  const name = resident?.name || user?.displayName || user?.email?.split('@')[0] || 'Resident';
  const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const sessReg = resident?.sessionsRegistered ?? 0;
  const sessAtt = resident?.sessionsAttended ?? 0;
  const isEligible = sessReg >= 4 && sessAtt >= 6;

  const menuItems = [
    { Icon: LinkIcon, label: 'Registration Form', action: () => window.open(REGISTRATION_FORM, '_blank') },
    { Icon: ClipboardDocumentListIcon, label: 'Session Feedback Form', action: () => window.open(FEEDBACK_FORM, '_blank') },
    { Icon: CalendarDaysIcon, label: 'My Registered Sessions' },
    { Icon: BellIcon, label: 'Notification Preferences' },
  ];

  return (
    <div className="screen-content">
      <div className="status-bar"><span>{format(new Date(), 'h:mm a')}</span><span>DCoP</span></div>

      {/* Header */}
      <div style={{ padding: '16px 20px 20px', textAlign: 'center' }}>
        <div style={{ width: 72, height: 72, background: 'linear-gradient(135deg, var(--accent), var(--accent2))', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 600, margin: '0 auto 12px' }}>{initials}</div>
        <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: -0.5, color: 'var(--text)' }}>{name}</div>
        <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{resident?.level && `${resident.level} · `}{resident?.institution || ''}</div>
        {resident?.group && (
          <div style={{ display: 'inline-block', marginTop: 10, background: 'rgba(79,142,247,0.12)', color: 'var(--accent)', padding: '4px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
            Group {resident.group}
          </div>
        )}
      </div>

      {/* Progress */}
      <div style={{ padding: '0 20px 20px' }}>
        <div className="card">
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 16 }}>Program Progress</div>
          {[
            { label: 'Sessions Registered', val: sessReg, max: 6, color: 'var(--accent)' },
            { label: 'Sessions Attended', val: sessAtt, max: 6, color: 'var(--green)' },
          ].map(({ label, val, max, color }) => (
            <div key={label} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                <span>{label}</span>
                <span style={{ color, fontWeight: 600 }}>{val} / {max}{val >= max ? ' ✓' : ''}</span>
              </div>
              <div className="capacity-track">
                <div className="capacity-fill" style={{ width: `${Math.min(100, (val/max)*100)}%`, background: color }} />
              </div>
            </div>
          ))}
          <div style={{ paddingTop: 12, borderTop: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span>Eligibility</span>
              <span style={{ color: isEligible ? 'var(--green)' : 'var(--amber)', fontWeight: 600 }}>{isEligible ? 'Eligible' : 'In progress'}</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
              {isEligible ? 'Meets all requirements' : `Need ${Math.max(0,4-sessReg)} more registered, ${Math.max(0,6-sessAtt)} more attended`}
            </div>
          </div>
        </div>
      </div>

      <div className="section-title"><span>Quick Access</span></div>
      <div style={{ padding: '0 20px' }}>
        {menuItems.map(({ Icon, label, action }) => (
          <div key={label} onClick={action} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--border)', cursor: action ? 'pointer' : 'default' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, background: 'var(--surface2)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon style={{ width: 18, height: 18, color: 'var(--muted)' }} />
              </div>
              <span style={{ fontSize: 14 }}>{label}</span>
            </div>
            <ChevronRightIcon style={{ width: 18, height: 18, color: 'var(--muted)' }} />
          </div>
        ))}

        <div onClick={signOut} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0', cursor: 'pointer' }}>
          <div style={{ width: 36, height: 36, background: 'rgba(239,68,68,0.08)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowRightOnRectangleIcon style={{ width: 18, height: 18, color: 'var(--red)' }} />
          </div>
          <span style={{ fontSize: 14, color: 'var(--red)' }}>Sign Out</span>
        </div>
      </div>

      <div style={{ padding: '20px', textAlign: 'center', fontSize: 12, color: 'var(--subtle)' }}>DCoP v1.0 · Proximie Digital Community</div>
    </div>
  );
}
