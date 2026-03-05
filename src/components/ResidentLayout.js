import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { HomeIcon, CalendarDaysIcon, BellIcon, BuildingOffice2Icon, UserIcon } from '@heroicons/react/24/outline';
import { HomeIcon as HomeSolid, CalendarDaysIcon as CalSolid, BellIcon as BellSolid, BuildingOffice2Icon as BuildingSolid, UserIcon as UserSolid } from '@heroicons/react/24/solid';

const navItems = [
  { to: '/home',          label: 'Home',      Icon: HomeIcon,            Active: HomeSolid,    end: true },
  { to: '/calendar',      label: 'Calendar',  Icon: CalendarDaysIcon,    Active: CalSolid      },
  { to: '/institutions',  label: 'Hospitals', Icon: BuildingOffice2Icon, Active: BuildingSolid },
  { to: '/notifications', label: 'Alerts',    Icon: BellIcon,            Active: BellSolid     },
  { to: '/profile',       label: 'Profile',   Icon: UserIcon,            Active: UserSolid     },
];

export default function ResidentLayout() {
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <div style={{ flex: 1, overflow: 'hidden' }}><Outlet /></div>
      <nav style={{
        height: 'var(--nav-height)',
        background: 'rgba(10,22,40,0.97)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        paddingBottom: 8,
        flexShrink: 0,
      }}>
        {navItems.map(({ to, label, Icon, Active, end }) => (
          <NavLink key={to} to={to} end={end} style={{ flex: 1, textDecoration: 'none' }}>
            {({ isActive }) => (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 3,
                height: '100%',
                padding: '8px 4px 0',
              }}>
                {isActive
                  ? <Active style={{ width: 21, height: 21, color: 'var(--accent)' }} />
                  : <Icon   style={{ width: 21, height: 21, color: 'var(--muted)' }} />}
                <span style={{
                  fontSize: 9,
                  fontWeight: 600,
                  color: isActive ? 'var(--accent)' : 'var(--muted)',
                  letterSpacing: 0.2,
                }}>
                  {label}
                </span>
              </div>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
