import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { BuildingOffice2Icon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { fetchInstitutionStats } from '../services/sheets';
import { ProximieLogo } from '../components/ProximieLogo';

export default function InstitutionsScreen() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState('avgAttended');
  const [sortDir, setSortDir] = useState('desc');

  useEffect(() => {
    fetchInstitutionStats().then(data => { setStats(data); setLoading(false); });
  }, []);

  function toggleSort(key) {
    if (sortKey === key) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSortKey(key); setSortDir('desc'); }
  }

  const sorted = [...stats].sort((a, b) => {
    const v = sortDir === 'desc' ? b[sortKey] - a[sortKey] : a[sortKey] - b[sortKey];
    return v;
  });

  const maxAttended = Math.max(...stats.map(s => s.avgAttended), 1);

  function SortIcon({ col }) {
    if (sortKey !== col) return <span style={{ color: 'var(--subtle)', fontSize: 10 }}>↕</span>;
    return sortDir === 'desc'
      ? <ChevronDownIcon style={{ width: 12, height: 12, color: 'var(--accent)' }} />
      : <ChevronUpIcon   style={{ width: 12, height: 12, color: 'var(--accent)' }} />;
  }

  const colStyle = (col) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 3,
    cursor: 'pointer',
    color: sortKey === col ? 'var(--accent)' : 'var(--muted)',
    userSelect: 'none',
  });

  return (
    <div className="screen-content">
      <div className="status-bar">
        <span>{format(new Date(), 'h:mm a')}</span>
        <span>DCoP</span>
      </div>

      <div className="app-header">
        <ProximieLogo size={24} />
      </div>

      <div style={{ padding: '0 20px 12px' }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, letterSpacing: -0.5, marginBottom: 4, color: 'var(--text)' }}>
          Institutions
        </h1>
        <p style={{ fontSize: 13, color: 'var(--muted)' }}>
          Programme performance across participating hospitals
        </p>
      </div>

      {/* Summary bar */}
      {!loading && (
        <div style={{ display: 'flex', gap: 10, padding: '0 20px 20px' }}>
          {[
            { val: stats.length,                                            label: 'Hospitals',  color: 'var(--accent)'  },
            { val: stats.reduce((s, i) => s + i.totalResidents, 0),        label: 'Residents',  color: 'var(--green)'   },
            { val: stats.reduce((s, i) => s + i.eligibleCount, 0),         label: 'Eligible',   color: 'var(--amber)'   },
          ].map(({ val, label, color }) => (
            <div key={label} style={{ flex: 1, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '12px 10px', textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'DM Mono, monospace', color, lineHeight: 1, marginBottom: 4 }}>{val}</div>
              <div style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Column headers */}
      <div style={{ padding: '0 20px', display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: 8, marginBottom: 8 }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.8 }}>Institution</div>
        <div onClick={() => toggleSort('avgRegistered')} style={{ ...colStyle('avgRegistered'), fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8 }}>
          Reg <SortIcon col="avgRegistered" />
        </div>
        <div onClick={() => toggleSort('avgAttended')} style={{ ...colStyle('avgAttended'), fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8 }}>
          Att <SortIcon col="avgAttended" />
        </div>
        <div onClick={() => toggleSort('eligibleCount')} style={{ ...colStyle('eligibleCount'), fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8 }}>
          Elig <SortIcon col="eligibleCount" />
        </div>
      </div>

      {/* Institution cards */}
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {loading ? (
          <div className="spinner" />
        ) : sorted.map((inst, rank) => {
          const barWidth = `${(inst.avgAttended / maxAttended) * 100}%`;
          const isTop = rank === 0;
          return (
            <div
              key={inst.name}
              style={{
                background: 'var(--surface)',
                border: `1px solid ${isTop ? 'rgba(0,194,224,0.25)' : 'var(--border)'}`,
                borderRadius: 14,
                padding: '14px 16px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {isTop && (
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'var(--accent)', borderRadius: '14px 14px 0 0' }} />
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: 8, alignItems: 'center', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: isTop ? 'var(--accent-dim)' : 'var(--surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <BuildingOffice2Icon style={{ width: 16, height: 16, color: isTop ? 'var(--accent)' : 'var(--muted)' }} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {inst.name}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>{inst.totalResidents} residents</div>
                  </div>
                </div>
                <div style={{ textAlign: 'center', minWidth: 28 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent)', fontFamily: 'DM Mono, monospace' }}>{inst.avgRegistered}</div>
                </div>
                <div style={{ textAlign: 'center', minWidth: 28 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--green)', fontFamily: 'DM Mono, monospace' }}>{inst.avgAttended}</div>
                </div>
                <div style={{ textAlign: 'center', minWidth: 28 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--amber)', fontFamily: 'DM Mono, monospace' }}>{inst.eligibleCount}</div>
                </div>
              </div>

              {/* Attendance bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ flex: 1, height: 3, background: 'var(--subtle)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: barWidth, height: '100%', background: 'var(--green)', borderRadius: 4, transition: 'width 0.4s ease' }} />
                </div>
                <span style={{ fontSize: 10, color: 'var(--muted)', whiteSpace: 'nowrap' }}>avg {inst.avgAttended} attended</span>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ height: 24 }} />
    </div>
  );
}
