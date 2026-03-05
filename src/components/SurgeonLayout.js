import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { HomeIcon, CalendarDaysIcon, UserGroupIcon, UserIcon } from '@heroicons/react/24/outline';
import { HomeIcon as HomeSolid, CalendarDaysIcon as CalSolid, UserGroupIcon as GroupSolid, UserIcon as UserSolid } from '@heroicons/react/24/solid';

const navItems = [
  { to: '/surgeon',          label: 'Dashboard', Icon: HomeIcon,         Active: HomeSolid,  end: true },
  { to: '/surgeon/calendar', label: 'Calendar',  Icon: CalendarDaysIcon, Active: CalSolid },
  { to: '/surgeon/roster/CASE-001', label: 'Roster', Icon: UserGroupIcon, Active: GroupSolid },
  { to: '/surgeon/profile',  label: 'Profile',   Icon: UserIcon,         Active: UserSolid },
];

export default function SurgeonLayout() {
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <div style={{ flex: 1, overflow: 'hidden' }}><Outlet /></div>
      <nav style={{ height: 'var(--nav-height)', background: 'rgba(10,22,40,0.97)', backdropFilter: 'blur(20px)', borderTop: '1px solid var(--border)', display: 'flex', paddingBottom: 8, flexShrink: 0 }}>
        {navItems.map(({ to, label, Icon, Active, end }) => (
          <NavLink key={to} to={to} end={end} style={{ flex: 1, textDecoration: 'none' }}>
            {({ isActive }) => (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, height: '100%', padding: '8px 4px 0' }}>
                {isActive
                  ? <Active style={{ width: 22, height: 22, color: 'var(--accent)' }} />
                  : <Icon style={{ width: 22, height: 22, color: 'var(--muted)' }} />}
                <span style={{ fontSize: 10, fontWeight: 600, color: isActive ? 'var(--accent)' : 'var(--muted)', letterSpacing: 0.2 }}>{label}</span>
              </div>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
