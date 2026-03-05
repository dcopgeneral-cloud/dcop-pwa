import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BellIcon, CalendarDaysIcon, ChartBarIcon,
  ArrowRightIcon, ClipboardDocumentListIcon,
  ScissorsIcon, BuildingOffice2Icon,
} from '@heroicons/react/24/outline';
import { ProximieLogo } from '../components/ProximieLogo';

const RESIDENT_FORM = 'https://docs.google.com/forms/d/e/1FAIpQLSeR-7AokPpVSLYjWP5qlymEdu5rIvknzubjoMxXSPKaRIrQzQ/viewform?usp=publish-editor';
const SURGEON_FORM  = 'https://docs.google.com/forms/d/e/1FAIpQLScAit0SYBnOe2q-iMgWxGU92xpEa0sx3JVxs49b_fP4T_aj-Q/viewform?usp=sharing&ouid=101337914910408991885';

const features = [
  { icon: BellIcon,            color: 'var(--accent)', bg: 'var(--accent-dim)',        title: 'Never miss a case',          desc: 'Push notifications when new sessions open'        },
  { icon: CalendarDaysIcon,    color: 'var(--green)',  bg: 'rgba(16,185,129,0.1)',     title: 'Shared calendar',            desc: 'All upcoming surgeries at a glance'               },
  { icon: ChartBarIcon,        color: 'var(--amber)',  bg: 'rgba(245,158,11,0.1)',     title: 'Track progress',             desc: 'Sessions registered, attended, eligibility'       },
  { icon: BuildingOffice2Icon, color: '#a78bfa',       bg: 'rgba(167,139,250,0.1)',   title: 'Institution benchmarking',   desc: 'Compare performance across hospitals'             },
];

const registrationOptions = [
  {
    label: 'Register as Resident',
    sub: 'Fill the case load questionnaire',
    Icon: ClipboardDocumentListIcon,
    color: 'var(--accent)',
    bg: 'var(--accent-dim)',
    url: RESIDENT_FORM,
  },
  {
    label: 'Register as Lead Surgeon',
    sub: 'Submit your first case to get access',
    Icon: ScissorsIcon,
    color: 'var(--surgeon)',
    bg: 'rgba(244,132,95,0.1)',
    url: SURGEON_FORM,
  },
];

export default function LandingScreen() {
  const nav = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      overflowY: 'auto',
    }}>
      {/* ── Top header bar ── */}
      <header style={{
        width: '100%',
        maxWidth: 480,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 24px 16px',
        borderBottom: '1px solid var(--border)',
        flexShrink: 0,
      }}>
        <ProximieLogo size={30} />
      </header>

      {/* ── Main content ── */}
      <main style={{ flex: 1, padding: '36px 24px 0', width: '100%', maxWidth: 480 }}>

        {/* Hero */}
        <section style={{ marginBottom: 32 }}>
          <h1 style={{
            fontSize: 30,
            fontWeight: 700,
            letterSpacing: -0.8,
            lineHeight: 1.2,
            marginBottom: 10,
            color: 'var(--text)',
          }}>
            Surgical training,<br />made simple
          </h1>
          <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.65 }}>
            Cases, notifications and progress tracking for the Proximie DCoP programme
          </p>
        </section>

        {/* Sign in CTA */}
        <button
          onClick={() => nav('/login')}
          style={{
            width: '100%',
            background: 'var(--accent)',
            color: '#0a1628',
            border: 'none',
            borderRadius: 12,
            padding: '15px 20px',
            fontSize: 15,
            fontWeight: 700,
            fontFamily: 'Inter, sans-serif',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            marginBottom: 28,
          }}
        >
          Sign in <ArrowRightIcon style={{ width: 18, height: 18 }} />
        </button>

        {/* New to DCoP divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <span style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            New to DCoP?
          </span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>

        {/* Registration options — link style, not primary buttons */}
        {registrationOptions.map(({ label, sub, Icon, color, bg, url }) => (
          <a
            key={label}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              width: '100%',
              background: 'var(--surface)',
              color: 'var(--text)',
              border: '1px solid var(--border2)',
              borderRadius: 12,
              padding: '13px 16px',
              fontSize: 14,
              fontWeight: 500,
              fontFamily: 'Inter, sans-serif',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 10,
              textDecoration: 'none',
              boxSizing: 'border-box',
            }}
          >
            <div style={{
              width: 36,
              height: 36,
              background: bg,
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Icon style={{ width: 18, height: 18, color }} />
            </div>
            <div>
              <div style={{ fontWeight: 600, marginBottom: 2 }}>{label}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>{sub}</div>
            </div>
          </a>
        ))}

        {/* ── Feature list — informational, NOT interactive ── */}
        <div style={{
          marginTop: 32,
          paddingTop: 24,
          borderTop: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {features.map(({ icon: Icon, color, bg, title, desc }, i) => (
            <div
              key={title}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                paddingTop: i === 0 ? 0 : 16,
                paddingBottom: 16,
                borderBottom: i < features.length - 1 ? '1px solid var(--border)' : 'none',
              }}
            >
              <div style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Icon style={{ width: 19, height: 19, color }} />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2, color: 'var(--text)' }}>{title}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.4 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* ── Footer ── */}
      <footer style={{
        width: '100%',
        maxWidth: 480,
        textAlign: 'center',
        padding: '24px 24px 32px',
        fontSize: 12,
        color: 'var(--subtle)',
        borderTop: '1px solid var(--border)',
        marginTop: 24,
      }}>
        Proximie · DCoP Digital Community of Practice
      </footer>
    </div>
  );
}
