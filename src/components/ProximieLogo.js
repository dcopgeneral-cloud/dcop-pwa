import React from 'react';

// Proximie 4-dot logo — top-left is cyan, other 3 are white (per brand reference)
export function LogoMark({ size = 28 }) {
  const dot = size * 0.42;
  const gap = size * 0.1;
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap,
      width: size,
      height: size,
      flexShrink: 0,
    }}>
      <div style={{ width: dot, height: dot, borderRadius: '50%', background: '#00c2e0' }} />
      <div style={{ width: dot, height: dot, borderRadius: '50%', background: '#ffffff' }} />
      <div style={{ width: dot, height: dot, borderRadius: '50%', background: '#ffffff' }} />
      <div style={{ width: dot, height: dot, borderRadius: '50%', background: '#ffffff' }} />
    </div>
  );
}

// Full inline logo: [dots] Proximie | DCoP
export function ProximieLogo({ size = 28, showPortal = true }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <LogoMark size={size} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{
          fontSize: size * 0.57,
          fontWeight: 700,
          color: '#f0f4ff',
          fontFamily: 'Inter, sans-serif',
          letterSpacing: -0.3,
        }}>
          Proximie
        </span>
        {showPortal && (
          <>
            <div style={{ width: 1, height: size * 0.6, background: 'rgba(255,255,255,0.2)' }} />
            <span style={{
              fontSize: size * 0.5,
              fontWeight: 500,
              color: '#5a7499',
              fontFamily: 'Inter, sans-serif',
            }}>
              DCoP
            </span>
          </>
        )}
      </div>
    </div>
  );
}

export default ProximieLogo;
