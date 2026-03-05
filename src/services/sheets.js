const SESSIONS_SHEET_ID = "1GHnroHj2gtydIHm7TLpJ1vbIt4vpbbFPLf97eEgaNMk";
const RESIDENTS_SHEET_ID = "1duHfPkP1GY9haCq_uFVNj1Ba3IpDsY0Yrc-onwHpfhg";
const SESSIONS_GID = "1592171569";
const RESIDENTS_GID = "1274528905";

function sheetsUrl(sheetId, gid) {
  return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
}

async function parseCSV(text) {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];
  const headers = parseCSVLine(lines[0]);
  return lines.slice(1).map(line => {
    const values = parseCSVLine(line);
    const obj = {};
    headers.forEach((h, i) => { obj[h.trim()] = (values[i] || '').trim(); });
    return obj;
  }).filter(row => Object.values(row).some(v => v));
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    if (line[i] === '"') { inQuotes = !inQuotes; }
    else if (line[i] === ',' && !inQuotes) { result.push(current); current = ''; }
    else { current += line[i]; }
  }
  result.push(current);
  return result;
}

export async function fetchSessions() {
  try {
    const res = await fetch(sheetsUrl(SESSIONS_SHEET_ID, SESSIONS_GID));
    if (!res.ok) throw new Error('fetch failed');
    const rows = await parseCSV(await res.text());
    return rows.map(normalizeSession).filter(s => s.caseId);
  } catch (err) {
    console.warn('fetchSessions falling back to mock:', err.message);
    return getMockSessions();
  }
}

export async function fetchResidents() {
  try {
    const res = await fetch(sheetsUrl(RESIDENTS_SHEET_ID, RESIDENTS_GID));
    if (!res.ok) throw new Error('fetch failed');
    const rows = await parseCSV(await res.text());
    return rows.map(normalizeResident).filter(r => r.email);
  } catch (err) {
    console.warn('fetchResidents error:', err.message);
    return [];
  }
}

export async function fetchResidentByEmail(email) {
  const residents = await fetchResidents();
  return residents.find(r => r.email?.toLowerCase() === email?.toLowerCase()) || null;
}

export async function detectRole(displayName) {
  if (!displayName) return 'resident';
  const sessions = await fetchSessions();
  const nameLower = displayName.toLowerCase().trim();
  const isSurgeon = sessions.some(s =>
    s.surgeon && s.surgeon.toLowerCase().trim() === nameLower
  );
  return isSurgeon ? 'surgeon' : 'resident';
}

export async function fetchSurgeonSessions(surgeonName) {
  const sessions = await fetchSessions();
  return sessions.filter(s =>
    s.surgeon?.toLowerCase().trim() === surgeonName?.toLowerCase().trim()
  );
}

export async function fetchCaseRegistrants(caseId) {
  return getMockRegistrants(caseId);
}

function getCapacity(sessionType) {
  const t = (sessionType || '').toLowerCase();
  if (t.includes('standard')) return 6;
  return 9999;
}

function normalizeSession(row) {
  return {
    caseId:               row['Case ID'] || row['case_id'] || row['CaseID'] || '',
    title:                row['Title of the case'] || row['Case Title'] || row['Title'] || row['title'] || '',
    date:                 row['Date'] || row['Surgery Date'] || '',
    time:                 row['Time'] || row['Surgery Time'] || '',
    timezone:             row['Surgery Time Zone'] || row['Timezone'] || 'UTC+0',
    surgeon:              row['Lead Surgeon'] || row['Surgeon'] || '',
    institution:          row['Institution'] || row['institution'] || '',
    specialty:            row['Specialty Focus'] || row['Specialty'] || '',
    sessionType:          row['Case type'] || row['Session Type'] || 'Standard Case',
    status:               row['Status'] || row['status'] || 'Active',
    maxCapacity:          getCapacity(row['Case type'] || row['Session Type'] || ''),
    currentRegistrations: parseInt(row['Current Registrations'] || '0') || 0,
    notes:                row['Case Notes'] || row['notes'] || '',
    meetingLink:          row['Meeting Link'] || '',
  };
}

function normalizeResident(row) {
  return {
    name:               row['Full Name'] || row['Name'] || '',
    email:              row['Email Address'] || row['Email'] || '',
    whatsapp:           row['WhatsApp Number'] || '',
    institution:        row['Institution/Facility of Practice'] || row['Institution'] || '',
    location:           row['Location of Practice'] || '',
    specialty:          row['Specialization'] || row['Specialty'] || '',
    level:              row['Position/Title'] || row['Level of Training'] || '',
    sessionsRegistered: parseInt(row['Sessions Registered'] || '0') || 0,
    sessionsAttended:   parseInt(row['Sessions Attended'] || '0') || 0,
    group:              row['Group'] || '',
    status:             row['Status'] || 'Active',
  };
}

function getMockSessions() {
  const d = (offset) => {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    return date.toISOString().split('T')[0];
  };
  return [
    { caseId: 'CASE-001', title: 'Laparoscopic Cholecystectomy', date: d(1), time: '09:00', timezone: 'UTC+3', surgeon: 'Dr. Amara Diallo', institution: 'Kenyatta National Hospital', specialty: 'General Surgery', sessionType: 'Standard Case (Max. 6 Participants)', status: 'Active', maxCapacity: 6, currentRegistrations: 5, notes: '', meetingLink: '' },
    { caseId: 'CASE-002', title: 'Laparoscopic Appendectomy', date: d(4), time: '14:00', timezone: 'UTC+3', surgeon: 'Dr. Amara Diallo', institution: 'Kenyatta National Hospital', specialty: 'General Surgery', sessionType: 'Standard Case (Max. 6 Participants)', status: 'Active', maxCapacity: 6, currentRegistrations: 3, notes: '', meetingLink: '' },
    { caseId: 'CASE-003', title: 'Master Class: Advanced Laparoscopy', date: d(7), time: '11:00', timezone: 'UTC+3', surgeon: 'Dr. Fatima Osei', institution: 'Online', specialty: 'General Surgery', sessionType: 'Master Case (No Limit)', status: 'Active', maxCapacity: 9999, currentRegistrations: 34, notes: '', meetingLink: '' },
    { caseId: 'CASE-004', title: 'Post-Surgical Review — Hernia Repair', date: d(9), time: '16:00', timezone: 'UTC+3', surgeon: 'Dr. Amara Diallo', institution: 'Kenyatta National Hospital', specialty: 'General Surgery', sessionType: 'Post-Surgical Review (No Limit)', status: 'Active', maxCapacity: 9999, currentRegistrations: 12, notes: '', meetingLink: '' },
    { caseId: 'CASE-005', title: 'Laparoscopic Hernia Repair', date: d(12), time: '08:30', timezone: 'UTC+3', surgeon: 'Dr. Fatima Osei', institution: 'Mulago National Referral Hospital', specialty: 'General Surgery', sessionType: 'Standard Case (Max. 6 Participants)', status: 'Active', maxCapacity: 6, currentRegistrations: 2, notes: '', meetingLink: '' },
  ];
}

function getMockRegistrants(caseId) {
  const all = {
    'CASE-001': [
      { name: 'Sara Mwangi', email: 'sara@knh.go.ke', institution: 'KNH', level: 'PGY-3', specialty: 'General Surgery', confirmed: true },
      { name: 'James Ochieng', email: 'james@knh.go.ke', institution: 'KNH', level: 'PGY-2', specialty: 'General Surgery', confirmed: true },
      { name: 'Aisha Kamau', email: 'aisha@mulago.go.ug', institution: 'Mulago', level: 'PGY-4', specialty: 'Gynaecology', confirmed: true },
      { name: 'David Kimani', email: 'david@knh.go.ke', institution: 'KNH', level: 'PGY-1', specialty: 'General Surgery', confirmed: false },
      { name: 'Lilian Otieno', email: 'lilian@knh.go.ke', institution: 'KNH', level: 'PGY-3', specialty: 'General Surgery', confirmed: true },
    ],
    'CASE-002': [
      { name: 'Peter Mutua', email: 'peter@knh.go.ke', institution: 'KNH', level: 'PGY-2', specialty: 'General Surgery', confirmed: true },
      { name: 'Grace Wanjiku', email: 'grace@mulago.go.ug', institution: 'Mulago', level: 'PGY-3', specialty: 'Gynaecology', confirmed: false },
      { name: 'Ahmed Hassan', email: 'ahmed@eth.edu', institution: 'Black Lion', level: 'PGY-1', specialty: 'General Surgery', confirmed: true },
    ],
  };
  return all[caseId] || [];
}

// ── Institution analytics ──────────────────────────────────────────────────

/**
 * Returns per-institution aggregated stats from the residents sheet.
 * Shape: [{ name, totalResidents, avgRegistered, avgAttended, eligibleCount }]
 */
export async function fetchInstitutionStats() {
  try {
    const residents = await fetchResidents();
    const map = {};

    residents.forEach(r => {
      const inst = r.institution || 'Unknown';
      if (!map[inst]) {
        map[inst] = { name: inst, residents: [], eligible: 0 };
      }
      map[inst].residents.push(r);
      const eligible = (r.sessionsRegistered >= 4) && (r.sessionsAttended >= 6);
      if (eligible) map[inst].eligible++;
    });

    return Object.values(map).map(({ name, residents, eligible }) => ({
      name,
      totalResidents: residents.length,
      avgRegistered: +(residents.reduce((s, r) => s + r.sessionsRegistered, 0) / residents.length).toFixed(1),
      avgAttended:   +(residents.reduce((s, r) => s + r.sessionsAttended,   0) / residents.length).toFixed(1),
      eligibleCount: eligible,
    })).sort((a, b) => b.avgAttended - a.avgAttended);
  } catch (err) {
    console.warn('fetchInstitutionStats error:', err.message);
    return getMockInstitutionStats();
  }
}

function getMockInstitutionStats() {
  return [
    { name: 'Kenyatta National Hospital',    totalResidents: 12, avgRegistered: 4.2, avgAttended: 5.1, eligibleCount: 7  },
    { name: 'Mulago National Referral',      totalResidents: 8,  avgRegistered: 3.8, avgAttended: 4.6, eligibleCount: 4  },
    { name: 'Black Lion Hospital',           totalResidents: 6,  avgRegistered: 3.5, avgAttended: 4.0, eligibleCount: 2  },
    { name: 'Chris Hani Baragwanath',        totalResidents: 9,  avgRegistered: 4.6, avgAttended: 5.5, eligibleCount: 6  },
    { name: 'Korle Bu Teaching Hospital',    totalResidents: 5,  avgRegistered: 2.9, avgAttended: 3.2, eligibleCount: 1  },
  ];
}
