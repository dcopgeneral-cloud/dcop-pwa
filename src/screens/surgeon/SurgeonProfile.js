import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';
import { ChevronRightIcon, ArrowRightOnRectangleIcon, PlusCircleIcon, CalendarDaysIcon, UserGroupIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

const CASE_CREATION_FORM = 'https://docs.google.com/forms/d/e/1FAIpQLScAit0SYBnOe2q-iMgWxGU92xpEa0sx3JVxs49b_fP4T_aj-Q/viewform?usp=sharing&ouid=101337914910408991885';

export default function SurgeonProfile() {
  const { user, signOut } = useAuth();

  const name = user?.displayName || user?.email?.split('@')[0] || 'Lead Surgeon';
  const initials = name.replace(/^Dr\.?\s*/i, '').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  const menuItems = [
    { Icon: PlusCircleIcon, label: 'Create New Case', action: () => window.open(CASE_CREATION_FORM, '_blank') },
    { Icon: CalendarDaysIcon, label: 'View Calendar' },
    { Icon: UserGroupIcon, label: 'Programme Roster' },
    { Icon: EnvelopeIcon, label: 'Contact Coordinator' },
  ];

  return (
    <div className="screen-content">
      <div className="status-bar"><span>{format(new Date(), 'h:mm a')}</span><span>DCoP</span></div>

      <div style={{ padding: '16px 20px 24px', textAlign: 'center' }}>
        <div style={{ width: 72, height: 72, background: 'linear-gradient(135deg, var(--surgeon), var(--amber))', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 600, margin: '0 auto 12px' }}>{initials}</div>
        <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: -0.5, color: 'var(--text)' }}>{name}</div>
        <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{user?.email}</div>
        <div style={{ display: 'inline-block', marginTop: 10, background: 'rgba(244,132,95,0.12)', color: 'var(--surgeon)', padding: '4px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
          Lead Surgeon
        </div>
      </div>

      <div className="section-title"><span>Quick Actions</span></div>
      <div style={{ padding: '0 20px' }}>
        {menuItems.map(({ Icon, label, action }) => (
          <div key={label} onClick={action} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--border)', cursor: action ? 'pointer' : 'default' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, background: 'rgba(244,132,95,0.08)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon style={{ width: 18, height: 18, color: 'var(--surgeon)' }} />
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
