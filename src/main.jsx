import React, {useEffect, useMemo, useState} from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter, NavLink, Navigate, Route, Routes, useLocation, useNavigate} from 'react-router-dom'
import {AreaChart, Area, BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell, Legend} from 'recharts'
import * as Icons from 'lucide-react'
import * as XLSX from 'xlsx'
import ExcelJS from 'exceljs'
import {supabase} from './lib/supabase'
import './styles.css'
import './syllabus-status.css'
import './responsive.css'
import './government.css'

const defaultSchool = {
  name: 'SAVITRI BALIKA INTER COLLEGE',
  address: 'Khutah Road, Jamunahiya, Mirzapur (U.P.)',
  managerName: 'Manager / Principal',
  logoUrl: '/school-logo.png'
};

function getStoredSchool() {
  try {
    const saved = localStorage.getItem('school_profile_settings');
    if (saved) return { ...defaultSchool, ...JSON.parse(saved) };
  } catch(e) {}
  return defaultSchool;
}

let school = getStoredSchool();

function useSchoolProfile() {
  const [profile, setProfile] = useState(getStoredSchool);
  useEffect(() => {
    const handler = (e) => {
      setProfile(getStoredSchool());
    };
    window.addEventListener('school_settings_updated', handler);
    return () => window.removeEventListener('school_settings_updated', handler);
  }, []);
  return profile;
}

function useAvatarState(user) {
  const [avatarImg, setAvatarImg] = useState(() => {
    return localStorage.getItem('avatarImg') || (user?.email && localStorage.getItem(`avatarImg_${user.email}`)) || null;
  });
  const [avatarColor, setAvatarColor] = useState(() => localStorage.getItem('avatarColor') || '#1264c3');

  useEffect(() => {
    const sync = () => {
      const photo = localStorage.getItem('avatarImg') || (user?.email && localStorage.getItem(`avatarImg_${user.email}`)) || null;
      setAvatarImg(photo);
      setAvatarColor(localStorage.getItem('avatarColor') || '#1264c3');
    };
    sync();
    window.addEventListener('avatar_updated', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('avatar_updated', sync);
      window.removeEventListener('storage', sync);
    };
  }, [user?.email]);

  return { avatarImg, avatarColor };
}
const seed=[
 ['Biology','April','Cell: The Unit of Life','कोशिका : जीवन की इकाई','Done'],['Biology','September','Genetics & Evolution','आनुवंशिकी एवं विकास','Not Done'],['Physics','April','Electric Charges and Fields','वैद्युत आवेश तथा क्षेत्र','Done'],['Physics','September','Electromagnetic Waves','विद्युत चुम्बकीय तरंगें','In Progress'],['Chemistry','August','Chemical Kinetics','रासायनिक बलगतिकी','Done'],['Chemistry','September','Coordination Compounds','उपसहसंयोजन यौगिक','Done'],['Mathematics','September','Integrals','समाकलन','Not Done'],['English','September','The Last Lesson','द लास्ट लेसन','Done'],['Hindi','September','आत्मपरिचय','आत्मपरिचय','In Progress'],['Physics','October','Ray Optics','किरण प्रकाशिकी','Not Done'],['Biology','October','Biotechnology','जैव प्रौद्योगिकी','In Progress']
].map(([subject,month,chapter,hindi,status],i)=>({id:i+1,subject,month,chapter,hindi,topic:`${chapter} — concepts and applications`,assessment:'Unit Test',status,remarks:status==='Not Done'?'Schedule required':'Updated recently'}))
// Offline demo dataset mirrors the Supabase demo-data.sql seed: every class has
// realistic subjects and a complete April–February syllabus for immediate testing.
const demoClasses=['Nursery','LKG','UKG','Class 1','Class 2','Class 3','Class 4','Class 5','Class 6','Class 7','Class 8','Class 9','Class 10','Class 11','Class 12']
const demoTermsPrimary=[{month:'Apr - July',assessment:'PA 1'},{month:'Aug - Oct',assessment:'Half Yearly'},{month:'Nov - Dec',assessment:'PA 2'},{month:'Jan - Feb',assessment:'Annual'}]
const demoTermsSenior=[{month:'Apr - May',assessment:'UT 1'},{month:'July',assessment:'UT 2'},{month:'Aug - Oct',assessment:'Half Yearly'},{month:'Nov - Dec',assessment:'UT 3'},{month:'Jan - Feb',assessment:'UT 4'}]
const demoSubjects=level=>level==='junior'?['English','Hindi','Mathematics','EVS','Computer']:level==='middle'?['English','Hindi','Mathematics','Science','Social Science','Computer']:['English','Physics','Chemistry','Mathematics','Biology']
const demoSubjectsPP=()=>['English','Hindi','Mathematics','EVS','Drawing','GK']
demoClasses.forEach((className,classIndex)=>{
  const isPP=['Nursery','LKG','UKG'].includes(className);
  const level=isPP?'preprimary':classIndex<8?'junior':classIndex<11?'middle':'senior';
  const group=isPP?'preprimary':classIndex<11?'primary':'senior';
  const subjects=isPP?demoSubjectsPP():demoSubjects(level);
  const terms=group==='senior'?demoTermsSenior:demoTermsPrimary;
  subjects.forEach((subject,subjectIndex)=>terms.forEach((term,termIndex)=>seed.push({
    id:`demo-${classIndex}-${subjectIndex}-${termIndex}`,
    className,
    section:termIndex%2?'B':'A',
    group,
    subject,
    month:term.month,
    chapter:`${subject} — ${term.assessment} Syllabus`,
    hindi:'Demo syllabus',
    topic:`${term.assessment} learning objectives and practice`,
    assessment:term.assessment,
    status:['Done','In Progress','Not Done'][(classIndex+subjectIndex+termIndex)%3],
    remarks:'Demo academic data'
  })))
})
const statusValues=['Done','In Progress','Not Done']
const examPatternDefs = {
  preprimary: [
    { id: 'ALL', label: 'All Exams (Full Syllabus)', shortLabel: 'All Exams' },
    { id: 'PA-1', label: 'PA-1 (Periodic Assessment 1)', shortLabel: 'PA-1' },
    { id: 'HALF YEARLY', label: 'Half Yearly Examination', shortLabel: 'Half Yearly' },
    { id: 'PA-2', label: 'PA-2 (Periodic Assessment 2)', shortLabel: 'PA-2' },
    { id: 'ANNUAL', label: 'Annual Examination', shortLabel: 'Annual' }
  ],
  primary: [
    { id: 'ALL', label: 'All Exams (Full Syllabus)', shortLabel: 'All Exams' },
    { id: 'PA-1', label: 'PA-1 (Periodic Assessment 1)', shortLabel: 'PA-1' },
    { id: 'HALF YEARLY', label: 'Half Yearly Examination', shortLabel: 'Half Yearly' },
    { id: 'PA-2', label: 'PA-2 (Periodic Assessment 2)', shortLabel: 'PA-2' },
    { id: 'ANNUAL', label: 'Annual Examination', shortLabel: 'Annual' }
  ],
  senior: [
    { id: 'ALL', label: 'All Exams (Full Syllabus)', shortLabel: 'All Exams' },
    { id: 'UT-1', label: 'UT-1 (Unit Test 1)', shortLabel: 'UT-1' },
    { id: 'UT-2', label: 'UT-2 (Unit Test 2)', shortLabel: 'UT-2' },
    { id: 'HALF YEARLY', label: 'Half Yearly Examination', shortLabel: 'Half Yearly' },
    { id: 'UT-3', label: 'UT-3 (Unit Test 3)', shortLabel: 'UT-3' },
    { id: 'UT-4', label: 'UT-4 (Unit Test 4 / Pre-Board)', shortLabel: 'UT-4' }
  ],
  all: [
    { id: 'ALL', label: 'All Exams (Complete View)', shortLabel: 'All Exams' },
    { id: 'PA-1', label: 'PA-1 (Periodic Assessment 1)', shortLabel: 'PA-1' },
    { id: 'UT-1', label: 'UT-1 (Senior Unit Test 1)', shortLabel: 'UT-1' },
    { id: 'UT-2', label: 'UT-2 (Senior Unit Test 2)', shortLabel: 'UT-2' },
    { id: 'HALF YEARLY', label: 'Half Yearly Examination', shortLabel: 'Half Yearly' },
    { id: 'PA-2', label: 'PA-2 (Periodic Assessment 2)', shortLabel: 'PA-2' },
    { id: 'UT-3', label: 'UT-3 (Senior Unit Test 3)', shortLabel: 'UT-3' },
    { id: 'UT-4', label: 'UT-4 (Senior Unit Test 4)', shortLabel: 'UT-4' },
    { id: 'ANNUAL', label: 'Annual Examination', shortLabel: 'Annual' }
  ]
};

function getClassGroup(className) {
  if (!className || className === 'ALL') return 'all';
  const c = String(className).toLowerCase().trim();
  if (['nursery', 'lkg', 'ukg', 'kg', 'prep'].some(k => c.includes(k))) return 'preprimary';
  const num = parseInt(c.replace(/\D/g, '')) || 0;
  if (num >= 1 && num <= 8) return 'primary';
  if (num >= 9 && num <= 12) return 'senior';
  return 'primary';
}

function compareClasses(classA, classB) {
  const norm = (c) => String(c || '').trim();
  const a = norm(classA);
  const b = norm(classB);
  if (a === b) return 0;
  if (!a) return 1;
  if (!b) return -1;

  const idxA = demoClasses.indexOf(a);
  const idxB = demoClasses.indexOf(b);
  if (idxA !== -1 && idxB !== -1) return idxA - idxB;
  if (idxA !== -1) return -1;
  if (idxB !== -1) return 1;

  // Numerical extraction fallback
  const numA = parseInt(a.replace(/\D/g, '')) || 0;
  const numB = parseInt(b.replace(/\D/g, '')) || 0;
  if (numA !== numB) return numA - numB;

  return a.localeCompare(b);
}

function matchesExam(topic, examId, selectedClass) {
  if (!examId || examId === 'ALL') return true;
  const norm = s => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const target = norm(examId);
  const a = norm(topic.assessment || topic.assessment_en);
  const ch = norm(topic.chapter || topic.unit_chapter_en);
  const m = norm(topic.month);
  const grp = getClassGroup(topic.className || selectedClass);

  // Exact assessment match
  if (a === target) return true;

  if (target === 'pa1') {
    if (a.includes('pa1') || (a.includes('pa') && a.includes('1') && !a.includes('pa2'))) return true;
    if (grp !== 'senior' && !a && ['apr', 'april', 'may', 'june', 'jun', 'july', 'jul', 'aprjul', 'aprjuly'].some(k => m.includes(k))) return true;
    return false;
  }
  if (target === 'ut1') {
    if (a.includes('ut1') || (a.includes('ut') && a.includes('1') && !a.includes('ut2') && !a.includes('ut3') && !a.includes('ut4')) || (a.includes('unit') && a.includes('1') && !a.includes('2') && !a.includes('3') && !a.includes('4'))) return true;
    if (grp === 'senior' && !a && ['apr', 'april', 'may', 'june', 'jun', 'aprmay'].some(k => m.includes(k))) return true;
    return false;
  }
  if (target === 'ut2') {
    if (a.includes('ut2') || (a.includes('ut') && a.includes('2')) || (a.includes('unit') && a.includes('2'))) return true;
    if (grp === 'senior' && !a && ['jul', 'july'].some(k => m.includes(k))) return true;
    return false;
  }
  if (target === 'halfyearly' || target === 'hy') {
    if (a.includes('half') || a.includes('hy') || ch.includes('half')) return true;
    if (!a && ['aug', 'august', 'sep', 'sept', 'september', 'oct', 'october', 'augoct'].some(k => m.includes(k))) return true;
    return false;
  }
  if (target === 'pa2') {
    if (a.includes('pa2') || (a.includes('pa') && a.includes('2'))) return true;
    if (grp !== 'senior' && !a && ['nov', 'november', 'dec', 'december', 'novdec'].some(k => m.includes(k))) return true;
    return false;
  }
  if (target === 'ut3' || target === 't3') {
    if (a.includes('ut3') || (a.includes('ut') && a.includes('3')) || a.includes('t3') || (a.includes('unit') && a.includes('3'))) return true;
    if (grp === 'senior' && !a && ['nov', 'november', 'dec', 'december', 'novdec'].some(k => m.includes(k))) return true;
    return false;
  }
  if (target === 'ut4') {
    if (a.includes('ut4') || (a.includes('ut') && a.includes('4')) || a.includes('preboard') || (a.includes('unit') && a.includes('4'))) return true;
    if (grp === 'senior' && !a && ['jan', 'january', 'feb', 'february', 'janfeb'].some(k => m.includes(k))) return true;
    return false;
  }
  if (target === 'annual' || target === 'final') {
    if (a.includes('annual') || a.includes('final') || ch.includes('annual')) return true;
    if (grp !== 'senior' && !a && ['jan', 'january', 'feb', 'february', 'mar', 'march', 'janfeb'].some(k => m.includes(k))) return true;
    return false;
  }

  return a.includes(target) || ch.includes(target);
}

const examPatterns = {
  all: [
    ['ALL', null],
    ['PA-1', ['April', 'May', 'June', 'July']],
    ['UT-1', ['April', 'May', 'June']],
    ['UT-2', ['July']],
    ['HALF YEARLY', ['April', 'May', 'June', 'July', 'August', 'September']],
    ['PA-2', ['November', 'December']],
    ['UT-3', ['October', 'November']],
    ['UT-4', ['December', 'January', 'February']],
    ['ANNUAL', ['January', 'February']]
  ],
  preprimary: [
    ['ALL', null],
    ['PA-1', ['April', 'May', 'June', 'July']],
    ['HALF YEARLY', ['April', 'May', 'June', 'July', 'August', 'September']],
    ['PA-2', ['November', 'December']],
    ['ANNUAL', ['January', 'February']]
  ],
  primary: [
    ['ALL', null],
    ['PA-1', ['April', 'May', 'June', 'July']],
    ['HALF YEARLY', ['April', 'May', 'June', 'July', 'August', 'September']],
    ['PA-2', ['November', 'December']],
    ['ANNUAL', ['January', 'February']]
  ],
  senior: [
    ['ALL', null],
    ['UT-1', ['April', 'May', 'June']],
    ['UT-2', ['July']],
    ['HALF YEARLY', ['April', 'May', 'June', 'July', 'August', 'September']],
    ['UT-3', ['October', 'November']],
    ['UT-4', ['December', 'January', 'February']]
  ]
};
// monthOrder covers both individual months AND the term-range strings used in seed/official data
const monthOrder = [
  'Apr - July', 'Apr - Jul',                   // Term 1 (PA-1)
  'April', 'May', 'June', 'July',               // individual months
  'Aug - Oct', 'Aug - Sep',                     // Term 2 (Half Yearly)
  'August', 'September', 'October',
  'Nov - Dec',                                  // Term 3 (PA-2)
  'November', 'December',
  'Jan - Feb', 'Jan - Mar',                     // Term 4 (Annual)
  'January', 'February', 'March'
];
function getMonthSortIndex(m) {
  if (!m) return 999;
  const idx = monthOrder.indexOf(m);
  if (idx !== -1) return idx;
  // try case-insensitive
  const mLow = m.toLowerCase();
  const fi = monthOrder.findIndex(x => x.toLowerCase() === mLow);
  return fi !== -1 ? fi : 999;
}
function examTopics(topics, group, exam) { return topics.filter(x => matchesExam(x, exam)); }
const nav=[['/dashboard','Dashboard','LayoutDashboard'],['/classes','Class & Section','School'],['/syllabus','Syllabus Progress','ChartNoAxesCombined'],['/practicals','Practicals','FlaskConical'],['/projects','Projects','FolderOpen'],['/users','User Management','Users','admin'],['/settings','School Settings','Settings'],['/profile','Profile','CircleUser']];
function Logo({size, style, src}){
  const [logoSrc, setLogoSrc] = useState(() => {
    if (src) return src;
    try {
      const stored = localStorage.getItem('school_profile_settings');
      if (stored) {
        const obj = JSON.parse(stored);
        if (obj.logoUrl) return obj.logoUrl;
      }
      const direct = localStorage.getItem('school_logo_custom');
      if (direct) return direct;
    } catch(e) {}
    return '/school-logo.png';
  });

  useEffect(() => {
    if (src) {
      setLogoSrc(src);
      return;
    }
    const handler = (e) => {
      if (e?.detail?.logoUrl) {
        setLogoSrc(e.detail.logoUrl);
      } else {
        try {
          const direct = localStorage.getItem('school_logo_custom') || JSON.parse(localStorage.getItem('school_profile_settings') || '{}').logoUrl;
          if (direct) setLogoSrc(direct || '/school-logo.png');
          else setLogoSrc('/school-logo.png');
        } catch(e) {}
      }
    };
    window.addEventListener('school_settings_updated', handler);
    return () => window.removeEventListener('school_settings_updated', handler);
  }, [src]);

  return <img src={logoSrc} alt="School Logo" className="logo" style={{borderRadius:'50%',objectFit:'cover',background:'transparent',...(size?{width:size,height:size,minWidth:size,minHeight:size}:{}),...style}}/>;
}
function SchoolLogo(props) { return <Logo {...props} />; }
function Status({value}){return <span className={'status '+value.toLowerCase().replaceAll(' ','-')}>{value}</span>}
function ToastNotification({ toast, onClose }) {
  if (!toast) return null;
  const isError = typeof toast === 'string' ? (toast.includes('⚠️') || toast.includes('Error') || toast.includes('Failed') || toast.includes('❌')) : toast.type === 'error';
  const rawText = typeof toast === 'string' ? toast : toast.text;
  const cleanText = rawText.replace(/^[➕✅🎉✨✏️🗑️📥⚠️❌]\s*/, '');
  const isSuccess = !isError;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose?.();
    }, 10000); // 10 seconds
    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <div className={`toast-celebration-wrap ${isSuccess ? 'success' : 'error'}`}>
      <div className="toast-celebration-card">
        <div className="toast-icon-bubble">
          {isSuccess ? <Icons.PartyPopper size={22} className="toast-bounce-icon" /> : <Icons.AlertTriangle size={22} />}
        </div>
        <div className="toast-body">
          <div className="toast-header-row">
            <span className="toast-badge">{isSuccess ? '🎉 CONGRATULATIONS!' : '⚠️ NOTICE'}</span>
            <span className="toast-subbadge">{isSuccess ? 'Action Successful' : 'Action Notice'}</span>
          </div>
          <div className="toast-message-text">
            {cleanText}
          </div>
        </div>
        <button type="button" className="toast-close-btn" onClick={onClose} title="Dismiss">
          <Icons.X size={15} />
        </button>
        <div className="toast-progress-bar" />
      </div>
    </div>
  );
}
function normalizeTopic(row){
  const className=row.classes?.class_name??row.className??'Class 1';
  const section=row.sections?.section_name??row.section??'A';
  const group=getClassGroup(className);
  const practical = row.practical ?? '';
  const project = row.project ?? '';
  const remarks = row.remarks ?? '';
  return {
    ...row,
    id:row.id,
    className,
    section,
    group,
    subject:row.subjects?.subject_name??row.subject??'General',
    month:row.month??'Apr - July',
    chapter:row.unit_chapter_en??row.chapter??'',
    hindi:row.unit_chapter_hi??row.hindi??'',
    topic:row.topic_en??row.topic??'',
    assessment:row.assessment_en??row.assessment??'',
    status:row.status??'Not Done',
    remarks,
    practical,
    project
  };
}
const DEFAULT_ACADEMIC_SESSIONS = [
  { id: '2026-27', name: '2026–27', label: 'Academic Session 2026–27', isCurrent: true, createdAt: '2026-04-01T00:00:00Z' },
  { id: '2025-26', name: '2025–26', label: 'Academic Session 2025–26 (Archive)', isCurrent: false, createdAt: '2025-04-01T00:00:00Z' }
];

const MASTER_PASSWORD = 'AKASH@8299';

function sortSessions(sessionsList) {
  if (!Array.isArray(sessionsList)) return [];
  return [...sessionsList].sort((a, b) => {
    // 1. Current session (isCurrent: true) always comes first at the top
    const aIsCurrent = Boolean(a && a.isCurrent);
    const bIsCurrent = Boolean(b && b.isCurrent);
    if (aIsCurrent && !bIsCurrent) return -1;
    if (!aIsCurrent && bIsCurrent) return 1;

    // 2. Secondary sorting: descending chronological order by year/name
    const nameA = String(a?.name || a?.id || '');
    const nameB = String(b?.name || b?.id || '');
    return nameB.localeCompare(nameA, undefined, { numeric: true, sensitivity: 'base' });
  });
}

function getSessionTopicStats(sessionId) {
  let list = [];
  try {
    const raw = localStorage.getItem('syllabus_topics_' + sessionId);
    if (raw) list = JSON.parse(raw);
    else if (sessionId === '2026-27') list = seed;
  } catch(e) {}
  const total = list.length;
  const done = list.filter(t => t.status === 'Done').length;
  const inProgress = list.filter(t => t.status === 'In Progress').length;
  const pending = list.filter(t => t.status === 'Not Done').length;
  const progress = total ? Math.round((done / total) * 100) : 0;
  return { total, done, inProgress, pending, progress, list };
}

function getStoredSessions() {
  try {
    const saved = localStorage.getItem('school_academic_sessions');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const hasCurrent = parsed.some(s => s && s.isCurrent);
        const activeId = localStorage.getItem('active_academic_session') || '2026-27';
        const list = parsed.map(s => {
          if (!hasCurrent && s.id === activeId) return { ...s, isCurrent: true };
          return s;
        });
        return sortSessions(list);
      }
    }
  } catch(e) {}
  return sortSessions(DEFAULT_ACADEMIC_SESSIONS);
}

function getActiveSessionId() {
  try {
    const saved = localStorage.getItem('active_academic_session');
    if (saved) return saved;
  } catch(e) {}
  return '2026-27';
}

function useTopics(sessionId){
  const activeSession = sessionId || getActiveSessionId();
  const [topics, setTopicsState] = useState(() => {
    try {
      const saved = localStorage.getItem('syllabus_topics_' + activeSession);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed.map(normalizeTopic);
      }
    } catch(e) {}
    if (activeSession === '2026-27') return seed.map(normalizeTopic);
    return [];
  });
  const [dbClasses, setDbClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Reload topics whenever activeSession changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem('syllabus_topics_' + activeSession);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTopicsState(parsed.map(normalizeTopic));
          return;
        }
      }
    } catch(e) {}
    if (activeSession === '2026-27') {
      setTopicsState(seed.map(normalizeTopic));
    } else {
      setTopicsState([]);
    }
  }, [activeSession]);

  const setTopics = (updater) => {
    setTopicsState(prev => {
      const rawNext = typeof updater === 'function' ? updater(prev) : updater;
      const next = Array.isArray(rawNext) ? rawNext.map(normalizeTopic) : rawNext;
      try {
        localStorage.setItem('syllabus_topics_' + activeSession, JSON.stringify(next));
      } catch(e) {}
      return next;
    });
  };

  const reload = async () => {
    if (supabase && activeSession === '2026-27') {
      setLoading(true);
      try {
        let { data, error } = await supabase.from('syllabus_topics').select('*, subjects(subject_name), classes(class_name, class_group), sections(section_name)').order('month');
        let cRes = await supabase.from('classes').select('*, sections(*)').order('class_name');
        if (!cRes.error && cRes.data) setDbClasses(cRes.data);
        if (error) setError(error.message);
        else if (data && data.length > 0) {
          const norm = data.map(normalizeTopic);
          setTopicsState(norm);
          localStorage.setItem('syllabus_topics_' + activeSession, JSON.stringify(norm));
        } else {
          try {
            const saved = localStorage.getItem('syllabus_topics_' + activeSession);
            if (saved) {
              const parsed = JSON.parse(saved);
              if (Array.isArray(parsed) && parsed.length > 0) {
                setTopicsState(parsed.map(normalizeTopic));
                return;
              }
            }
          } catch(err) {}
          const norm = seed.map(normalizeTopic);
          setTopicsState(norm);
        }
      } catch(e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const saved = localStorage.getItem('syllabus_topics_' + activeSession);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setTopicsState(parsed.map(normalizeTopic));
          } else if (activeSession === '2026-27') {
            setTopicsState(seed.map(normalizeTopic));
          }
        } else if (activeSession === '2026-27') {
          setTopicsState(seed.map(normalizeTopic));
        } else {
          setTopicsState([]);
        }
      } catch(e) {}
    }
  };

  useEffect(() => {
    reload();
  }, [activeSession]);

  // Reactive listener for bulk resets and session data updates
  useEffect(() => {
    const handleUpdate = (e) => {
      if (!e.detail || e.detail.sessionId === activeSession || !e.detail.sessionId) {
        reload();
      }
    };
    window.addEventListener('session_topics_updated', handleUpdate);
    return () => window.removeEventListener('session_topics_updated', handleUpdate);
  }, [activeSession]);

  return { topics, dbClasses, loading, error, reload, setTopics, activeSession };
}
async function saveTopic(topic){
  if(!supabase)return null;
  let subjectId=topic.subject_id;
  if(topic.subject){
    let q=await supabase.from('subjects').select('id').eq('subject_name',topic.subject).maybeSingle();
    if(q.error)throw q.error;
    if(!q.data){
      let created=await supabase.from('subjects').insert({subject_name:topic.subject}).select('id').single();
      if(created.error)throw created.error;
      subjectId=created.data.id
    }else subjectId=q.data.id
  }
  const payload={
    month:topic.month,
    unit_chapter_en:topic.chapter,
    unit_chapter_hi:topic.hindi||null,
    topic_en:topic.topic||null,
    assessment_en:topic.assessment||null,
    status:topic.status,
    practical: topic.practical?.trim() || null,
    project: topic.project?.trim() || null,
    remarks:topic.remarks||null,
    subject_id:subjectId
  };
  if(topic.id){
    let r=await supabase.from('syllabus_topics').update(payload).eq('id',topic.id).select().single();
    if(r.error)throw r.error;
    return r.data
  }
  let r=await supabase.from('syllabus_topics').insert(payload).select().single();
  if(r.error)throw r.error;
  return r.data
}
const PERMISSION_MODULES = [
  { id: 'dashboard', name: 'Dashboard Overview', desc: 'View statistics, progress rings, and subject cards', icon: 'LayoutDashboard' },
  { id: 'classes', name: 'Class & Section Setup', desc: 'View, add, and organize classes and sections', icon: 'School' },
  { id: 'syllabus_view', name: 'Syllabus Tracker (View)', desc: 'View monthly syllabus breakdown and topics', icon: 'ChartNoAxesCombined' },
  { id: 'syllabus_edit', name: 'Syllabus (Add / Edit)', desc: 'Add new topics, edit chapter titles, update status, add practical rows', icon: 'Pencil' },
  { id: 'syllabus_delete', name: 'Syllabus (Delete)', desc: 'Delete chapters, topics, or imported syllabus rows', icon: 'Trash2' },
  { id: 'practicals', name: 'Practicals Management', desc: 'Manage practical exams, records, and student assessment', icon: 'FlaskConical' },
  { id: 'projects', name: 'Projects Management', desc: 'Manage student projects, assignments, and submissions', icon: 'FolderOpen' },
  { id: 'users_manage', name: 'User Management', desc: 'Create, edit, manage access permissions, and remove users', icon: 'Users' },
  { id: 'settings', name: 'School Settings', desc: 'Edit school profile, manager name, address, and branding', icon: 'Settings' },
  { id: 'export_print', name: 'Print & Export', desc: 'Print Principal checklists, download PDF reports, and export CSV', icon: 'Printer' },
];

const ALL_PERMISSIONS_KEYS = PERMISSION_MODULES.map(p => p.id);
const DEFAULT_OPERATOR_PERMS = ['dashboard', 'syllabus_view', 'syllabus_edit', 'practicals', 'projects', 'export_print'];
const READ_ONLY_PERMS = ['dashboard', 'syllabus_view', 'export_print'];

const DEFAULT_USERS_LIST = [
  {
    id: 'u1',
    name: 'AKASH YADAV',
    email: 'akash@savitrischool.edu.in',
    role: 'ADMIN',
    active: true,
    created_at: '2026-09-01T10:00:00Z',
    permissions: ALL_PERMISSIONS_KEYS
  },
  {
    id: 'u2',
    name: 'Ashish',
    email: 'ashish@savitrischool.edu.in',
    role: 'ADMIN',
    active: true,
    created_at: '2026-09-02T11:30:00Z',
    permissions: ALL_PERMISSIONS_KEYS
  },
  {
    id: 'u3',
    name: 'Priya Singh',
    email: 'priya@savitrischool.edu.in',
    role: 'COMPUTER_OPERATOR',
    active: true,
    created_at: '2026-09-05T09:15:00Z',
    permissions: ['dashboard', 'classes', 'syllabus_view', 'syllabus_edit', 'practicals', 'projects', 'export_print']
  },
  {
    id: 'u4',
    name: 'Neha Patel',
    email: 'neha@savitrischool.edu.in',
    role: 'COMPUTER_OPERATOR',
    active: true,
    created_at: '2026-09-05T09:30:00Z',
    permissions: ['dashboard', 'syllabus_view', 'syllabus_edit', 'practicals', 'projects', 'export_print']
  },
  {
    id: 'u5',
    name: 'Amit Sharma',
    email: 'amit@savitrischool.edu.in',
    role: 'COMPUTER_OPERATOR',
    active: false,
    created_at: '2026-09-06T14:20:00Z',
    permissions: ['dashboard', 'syllabus_view', 'practicals', 'projects', 'export_print']
  }
];

function getStoredPermissions(email, role) {
  try {
    const permMap = JSON.parse(localStorage.getItem('user_permissions_map') || '{}');
    if (email && permMap[email]) return permMap[email];
    const saved = localStorage.getItem('school_users_list');
    if (saved) {
      const list = JSON.parse(saved);
      const match = list.find(u => u.email?.toLowerCase() === email?.toLowerCase());
      if (match && Array.isArray(match.permissions)) return match.permissions;
    }
  } catch(e) {}
  return role === 'ADMIN' ? ALL_PERMISSIONS_KEYS : DEFAULT_OPERATOR_PERMS;
}

function hasUserPermission(user, permKey) {
  if (!user) return false;
  if (user.role === 'ADMIN') return true;
  if (!permKey || permKey === 'profile') return true;
  const perms = user.permissions || getStoredPermissions(user.email, user.role);
  return Array.isArray(perms) ? perms.includes(permKey) : true;
}

function Footer() {
  return (
    <footer className="dev-footer-card">
      <div className="dev-footer-gradient-border" />
      <div className="dev-footer-inner">
        <div className="dev-footer-main">
          <div className="dev-avatar-wrapper">
            <div className="dev-avatar-ring-live" />
            <img 
              src="/developer-photo.jpg" 
              alt="AKASH YADAV - Software Engineer" 
              className="dev-avatar-img" 
            />
            <div className="dev-online-dot" title="Software Engineer & System Architect - Online">
              <span className="dev-online-ping" />
            </div>
          </div>

          <div className="dev-details">
            <div className="dev-badge-row">
              <span className="dev-badge dev-badge-senior">
                <Icons.Sparkles size={11} /> SOFTWARE ENGINEER
              </span>
              <span className="dev-badge dev-badge-lead">
                <Icons.Code size={11} /> LEAD ARCHITECT
              </span>
              <span className="dev-badge dev-badge-lpu">
                <Icons.GraduationCap size={11} /> B.TECH CS (LPU)
              </span>
            </div>

            <h3 className="dev-name-heading">
              Designed & Developed by <span className="dev-highlight-name">AKASH YADAV</span>
            </h3>

            <p className="dev-role-desc">
              Software Engineer & System Architect — Crafted with high precision, speed, and real-time cloud sync for <b>Savitri Balika Inter College</b>.
            </p>

            <div className="dev-contact-pills">
              <span className="dev-contact-title"><Icons.LifeBuoy size={12} /> Support / Help:</span>
              <a href="mailto:yakash4184@gmail.com" className="dev-contact-pill" title="Send Email for Technical Support">
                <Icons.Mail size={12} /> yakash4184@gmail.com
              </a>
              <a href="tel:+918299388507" className="dev-contact-pill" title="Call for Immediate Help">
                <Icons.Phone size={12} /> +91 8299388507
              </a>
            </div>
          </div>
        </div>

        <div className="dev-tech-chips">
          <div className="dev-chip">
            <div className="dev-chip-icon"><Icons.Cpu size={16} /></div>
            <div className="dev-chip-text">
              <small>CORE ENGINE</small>
              <b>React 18 & Vite Pro</b>
            </div>
          </div>

          <div className="dev-chip">
            <div className="dev-chip-icon"><Icons.Database size={16} /></div>
            <div className="dev-chip-text">
              <small>CLOUD DATABASE</small>
              <b>Supabase Encrypted</b>
            </div>
          </div>

          <div className="dev-chip">
            <div className="dev-chip-icon"><Icons.ShieldCheck size={16} /></div>
            <div className="dev-chip-text">
              <small>SECURITY</small>
              <b>Master Password Auth</b>
            </div>
          </div>
        </div>
      </div>

      <div className="dev-footer-sub">
        <div className="dev-sub-left">
          <Icons.Building2 size={13} />
          <span>© 2026-2027 <b>SAVITRI BALIKA INTER COLLEGE</b> · Syllabus Tracker System</span>
        </div>
      </div>
    </footer>
  );
}
async function profileFor(authUser){
  let avatar_url = authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture || null;
  const {data,error}=await supabase.from('profiles').select('full_name, role, active').eq('id',authUser.id).single();
  if(error)throw error;
  if(!data.active)throw Error('This account is inactive. Please contact the school administrator.');
  const perms = getStoredPermissions(authUser.email, data.role);
  return {id:authUser.id,name:data.full_name,role:data.role,email:authUser.email,permissions:perms,avatar_url,photo:avatar_url}
}
function App(){const [user,setUser]=useState(null),[checking,setChecking]=useState(!!supabase);useEffect(()=>{if(!supabase){setChecking(false);return}let alive=true;const sync=async session=>{if(!session?.user){if(alive){setUser(null);setChecking(false)}return}try{let profile=await profileFor(session.user);if(alive)setUser(profile)}catch(error){if(alive)setUser(null)}finally{if(alive)setChecking(false)}};supabase.auth.getSession().then(({data})=>sync(data.session));const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,session)=>sync(session));return()=>{alive=false;subscription.unsubscribe()}},[]);if(checking)return <main className="login"><section className="login-panel"><div className="login-card"><Icons.LoaderCircle className="spin"/><p>Checking secure session…</p></div></section></main>;return <BrowserRouter>{user?<Shell user={user} setUser={setUser}/>:<Login setUser={setUser}/>}</BrowserRouter>}
function Login({setUser}){const schoolProfile=useSchoolProfile();const [show,setShow]=useState(false),[creating,setCreating]=useState(false),[loading,setLoading]=useState(false),[error,setError]=useState(''),[message,setMessage]=useState('');const submit=async e=>{e.preventDefault();if(!supabase){setError('Supabase is not configured.');return}let d=new FormData(e.target),email=d.get('email').trim(),password=d.get('password');setLoading(true);setError('');setMessage('');try{if(creating){let fullName=d.get('fullName').trim();let {data,error}=await supabase.auth.signUp({email,password,options:{data:{full_name:fullName}}});if(error)throw error;if(data.session){setUser(await profileFor(data.user))}else setMessage('Account created. Check your email and confirm it before signing in.')}else{let {data,error}=await supabase.auth.signInWithPassword({email,password});if(error)throw error;setUser(await profileFor(data.user))}}catch(err){setError(err.message||'Sign-in failed.')}finally{setLoading(false)}};return <main className="login"><section className="login-intro"><div className="intro-brand"><Logo/><div><b>SAVITRI SCHOOL</b><small>SYLLABUS TRACKER</small></div></div><div className="orb o1"/><div className="orb o2"/><div className="intro-copy"><span className="eyebrow light">SCHOOL MANAGEMENT PORTAL</span><h1>Progress, clearly in view.</h1><p>A focused workspace for syllabus planning, monthly tracking, and academic progress across every class.</p><div className="school-line"><Icons.MapPin/> <span><b>{schoolProfile.name}</b><br/>{schoolProfile.address}</span></div></div><div className="intro-bottom">School Syllabus Management & Progress Tracking System</div></section><section className="login-panel"><div className="login-card"><div className="mobile-logo"><Logo/></div><span className="eyebrow">SECURE ACCESS</span><h2>{creating?'Create first admin account':'Welcome back'}</h2><p>{creating?'Use your school administrator email':'Sign in to Syllabus Tracker'}</p><form onSubmit={submit}>{creating&&<label>Full name<input required name="fullName" placeholder="Administrator name"/></label>}<label>Email<input required name="email" placeholder="Enter your email" type="email"/></label><label>Password<div className="password"><input required minLength="6" name="password" type={show?'text':'password'} placeholder="Minimum 6 characters"/><button type="button" onClick={()=>setShow(!show)}>{show?<Icons.EyeOff/>:<Icons.Eye/>}</button></div></label>{error&&<div className="error">{error}</div>}{message&&<p className="notice">{message}</p>}<button className="primary full" disabled={loading}>{loading?<><Icons.LoaderCircle className="spin"/> Please wait…</>:(creating?'Create secure account':'Sign in securely')}<Icons.ArrowRight/></button></form><button className="text-btn" type="button" onClick={()=>{setCreating(v=>!v);setError('');setMessage('')}}>{creating?'Already have an account? Sign in':'First time here? Create the admin account'}</button><div className="secure"><Icons.ShieldCheck/> Protected school workspace</div></div></section></main>}
const defaultSchoolClasses = [
  { name: 'Nursery', sections: ['A'], group: 'preprimary' },
  { name: 'LKG', sections: ['A', 'B'], group: 'preprimary' },
  { name: 'UKG', sections: ['A', 'B'], group: 'preprimary' },
  { name: 'Class 1', sections: ['A'], group: 'primary' },
  { name: 'Class 2', sections: ['A', 'B'], group: 'primary' },
  { name: 'Class 3', sections: ['A'], group: 'primary' },
  { name: 'Class 4', sections: ['A'], group: 'primary' },
  { name: 'Class 5', sections: ['A', 'B'], group: 'primary' },
  { name: 'Class 6', sections: ['A'], group: 'primary' },
  { name: 'Class 7', sections: ['A'], group: 'primary' },
  { name: 'Class 8', sections: ['A', 'B'], group: 'primary' },
  { name: 'Class 9', sections: ['A', 'B'], group: 'senior' },
  { name: 'Class 10', sections: ['A', 'B'], group: 'senior' },
  { name: 'Class 11', sections: ['A', 'B', 'C'], group: 'senior' },
  { name: 'Class 12', sections: ['A', 'B', 'C'], group: 'senior' }
];

const navPermissionsMap = {
  '/dashboard': 'dashboard',
  '/classes': 'classes',
  '/syllabus': 'syllabus_view',
  '/practicals': 'practicals',
  '/projects': 'projects',
  '/users': 'users_manage',
  '/settings': 'settings',
  '/profile': 'profile'
};

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

function Shell({user,setUser}){
  const [open,setOpen]=useState(()=>typeof window !== 'undefined' ? window.innerWidth > 800 : true);
  const [schoolClasses, setSchoolClasses] = useState(defaultSchoolClasses);
  const [dark,setDark]=useState(()=>{const saved=localStorage.getItem('theme');return saved==='dark'});
  const [sessions, setSessions] = useState(getStoredSessions);
  const [currentSession, setCurrentSession] = useState(getActiveSessionId);
  const [createSessionOpen, setCreateSessionOpen] = useState(false);
  const [editSessionTarget, setEditSessionTarget] = useState(null);
  const [deleteSessionTarget, setDeleteSessionTarget] = useState(null);
  const [resetStatusTarget, setResetStatusTarget] = useState(null);
  const [sessionToast, setSessionToast] = useState(null);
  const loc=useLocation();
  const title=nav.find(n=>loc.pathname.startsWith(n[0]))?.[1]||'Dashboard';
  const { avatarImg, avatarColor } = useAvatarState(user);

  React.useEffect(()=>{document.body.classList.toggle('dark',dark);localStorage.setItem('theme',dark?'dark':'light')},[dark]);

  function switchSession(newSessionId) {
    setCurrentSession(newSessionId);
    localStorage.setItem('active_academic_session', newSessionId);
    const target = sessions.find(s => s.id === newSessionId);
    setSessionToast(`Switched to Academic Session ${target?.name || newSessionId}`);
  }

  function handleCreateSession(newSessionData) {
    const newId = newSessionData.id;
    if (sessions.some(s => s.id === newId)) {
      setSessionToast('⚠️ An academic session with this year already exists!');
      return;
    }
    let newTopics = [];
    if (newSessionData.initMode === 'clone_reset') {
      let src = [];
      try {
        const sData = localStorage.getItem('syllabus_topics_' + newSessionData.sourceSessionId);
        if (sData) src = JSON.parse(sData);
        else if (newSessionData.sourceSessionId === '2026-27') src = seed;
      } catch(e) {}
      newTopics = src.map((t, i) => ({
        ...t,
        id: `s_${newId}_${i + 1}`,
        status: 'Not Done',
        remarks: null
      }));
    }
    localStorage.setItem('syllabus_topics_' + newId, JSON.stringify(newTopics));

    const newObj = {
      id: newId,
      name: newSessionData.name,
      label: newSessionData.label,
      isCurrent: newSessionData.makeActive,
      createdAt: new Date().toISOString()
    };
    let updated = [...sessions.filter(s => s.id !== newId)];
    if (newSessionData.makeActive) {
      updated = updated.map(s => ({ ...s, isCurrent: false }));
    }
    updated.push(newObj);
    updated = sortSessions(updated);
    setSessions(updated);
    localStorage.setItem('school_academic_sessions', JSON.stringify(updated));

    if (newSessionData.makeActive) {
      setCurrentSession(newId);
      localStorage.setItem('active_academic_session', newId);
    }
    setCreateSessionOpen(false);
    window.dispatchEvent(new CustomEvent('session_topics_updated', { detail: { sessionId: newId } }));
    setSessionToast(`🎉 Congratulations! Academic Session ${newSessionData.name} created with ${newTopics.length} syllabus records ready for the new year!`);
  }

  function handleUpdateSession(updatedSessionData) {
    let updated = sessions.map(s => {
      if (s.id === updatedSessionData.id) {
        return {
          ...s,
          name: updatedSessionData.name,
          label: updatedSessionData.label,
          isCurrent: updatedSessionData.makeActive
        };
      }
      if (updatedSessionData.makeActive) {
        return { ...s, isCurrent: false };
      }
      return s;
    });
    updated = sortSessions(updated);
    setSessions(updated);
    localStorage.setItem('school_academic_sessions', JSON.stringify(updated));

    if (updatedSessionData.makeActive) {
      setCurrentSession(updatedSessionData.id);
      localStorage.setItem('active_academic_session', updatedSessionData.id);
    }
    setEditSessionTarget(null);
    setSessionToast(`✅ Academic Session ${updatedSessionData.name} updated successfully!`);
  }

  async function handleDeleteSession(sessionId) {
    if (sessions.length <= 1) {
      setSessionToast('⚠️ Cannot delete the only existing academic session!');
      return;
    }
    // --- Server-side cleanup: delete all Supabase topics for this session ---
    if (supabase) {
      try {
        // Get IDs of all locally-stored topics for this session
        let localTopics = [];
        try {
          const raw = localStorage.getItem('syllabus_topics_' + sessionId);
          if (raw) localTopics = JSON.parse(raw);
        } catch(e) {}

        // Delete by real UUID IDs (exclude demo-/custom-/s_ prefixed local-only IDs)
        const realIds = localTopics
          .map(t => t.id)
          .filter(id => id && typeof id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id));

        if (realIds.length > 0) {
          // Delete in chunks of 100 to avoid URL length limits
          const chunkSize = 100;
          for (let i = 0; i < realIds.length; i += chunkSize) {
            const chunk = realIds.slice(i, i + chunkSize);
            await supabase.from('syllabus_topics').delete().in('id', chunk);
          }
        }
      } catch(err) {
        console.warn('Server cleanup warning during session delete:', err);
      }
    }
    // --- Local cleanup ---
    const updated = sortSessions(sessions.filter(s => s.id !== sessionId));
    setSessions(updated);
    localStorage.setItem('school_academic_sessions', JSON.stringify(updated));
    localStorage.removeItem('syllabus_topics_' + sessionId);

    if (currentSession === sessionId) {
      const nextActive = updated[0].id;
      setCurrentSession(nextActive);
      localStorage.setItem('active_academic_session', nextActive);
    }
    setDeleteSessionTarget(null);
    setSessionToast(`🗑️ Academic Session permanently deleted from Server & Local storage.`);
  }

  async function handleResetSessionStatus(sessionId, targetStatus, scopeClass = 'ALL') {
    let list = [];
    try {
      const raw = localStorage.getItem('syllabus_topics_' + sessionId);
      if (raw) list = JSON.parse(raw);
      else if (sessionId === '2026-27') list = seed;
    } catch(e) {}

    let affectedCount = 0;
    const updatedList = list.map(t => {
      if (scopeClass && scopeClass !== 'ALL' && t.className !== scopeClass) {
        return t;
      }
      affectedCount++;
      return { ...t, status: targetStatus };
    });

    localStorage.setItem('syllabus_topics_' + sessionId, JSON.stringify(updatedList));

    // Proper Supabase Database sync fix
    if (supabase) {
      try {
        let query = supabase.from('syllabus_topics').update({ status: targetStatus });
        if (scopeClass && scopeClass !== 'ALL') {
          const ids = updatedList.filter(t => t.className === scopeClass && t.id).map(t => t.id);
          if (ids.length > 0) {
            query = query.in('id', ids);
          }
        } else {
          query = query.neq('id', '00000000-0000-0000-0000-000000000000');
        }
        await query;
      } catch (err) {
        console.warn('Database sync notification:', err);
      }
    }

    // Trigger instant UI re-render across Dashboard, Syllabus, Practicals
    window.dispatchEvent(new CustomEvent('session_topics_updated', { detail: { sessionId } }));

    setResetStatusTarget(null);
    const targetSessionObj = sessions.find(s => s.id === sessionId);
    setSessionToast(`🎉 Master Reset Successful! All ${affectedCount} topics updated to "${targetStatus}" in Database & System for Academic Session ${targetSessionObj?.name || sessionId}!`);
  }

  return (
    <div className={`app ${open ? 'sidebar-open' : 'sidebar-collapsed'}`}>
      <ScrollToTop />
      <ToastNotification toast={sessionToast} onClose={() => setSessionToast(null)} />
      <aside className={open ? 'open' : 'collapsed'}>
        <div className="side-brand">
          <Logo/>
          <div>
            <b>SAVITRI SCHOOL</b>
            <small>SYLLABUS TRACKER</small>
          </div>
          <button className="close" onClick={()=>setOpen(false)} title="Hide Sidebar"><Icons.X/></button>
        </div>
        <nav>
          {nav.filter(([path])=>hasUserPermission(user,navPermissionsMap[path])).map(([path,label,icon])=>{
            let Icon=Icons[icon];
            return <NavLink to={path} key={path} onClick={()=>{ if (window.innerWidth <= 800) setOpen(false); }}><Icon size={19}/><span>{label}</span></NavLink>
          })}
        </nav>
        <div className="side-bottom">
          <div className="mini-user">
            {avatarImg ? (
              <img src={avatarImg} alt={user.name} className="avatar-img" />
            ) : (
              <div className="avatar" style={{ background: avatarColor, color: '#ffffff' }}>{user.name?.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()}</div>
            )}
            <div>
              <b>{user.name}</b>
              <small>{user.role}</small>
            </div>
          </div>
        </div>
      </aside>
      <div className="mobile-overlay" onClick={()=>setOpen(false)}/>
      <section className={`workspace ${!open ? 'sidebar-collapsed' : ''}`}>
        <Header
          title={title}
          user={user}
          sidebarOpen={open}
          onToggleSidebar={()=>setOpen(o=>!o)}
          dark={dark}
          setDark={setDark}
          setUser={setUser}
          sessions={sessions}
          currentSession={currentSession}
          onSwitchSession={switchSession}
          onOpenCreateSession={() => setCreateSessionOpen(true)}
          onOpenResetStatus={(s) => setResetStatusTarget(s || sessions.find(x => x.id === currentSession) || { id: currentSession, name: currentSession })}
        />
        <WelcomeMarquee />
        <main className="content">
          <Routes>
            <Route path="/dashboard" element={hasUserPermission(user,'dashboard') ? <Dashboard user={user} currentSession={currentSession} sessions={sessions} onSwitchSession={switchSession} onOpenCreateSession={() => setCreateSessionOpen(true)} onOpenResetStatus={(s) => setResetStatusTarget(s || sessions.find(x => x.id === currentSession) || { id: currentSession, name: currentSession })} /> : <Navigate to="/profile"/>} />
            <Route path="/classes" element={hasUserPermission(user,'classes') ? <Classes schoolClasses={schoolClasses} setSchoolClasses={setSchoolClasses} currentSession={currentSession} /> : <Navigate to="/dashboard"/>} />
            <Route path="/syllabus" element={hasUserPermission(user,'syllabus_view') ? <Syllabus user={user} schoolClasses={schoolClasses} currentSession={currentSession} /> : <Navigate to="/dashboard"/>} />
            <Route path="/syllabus/:subject" element={hasUserPermission(user,'syllabus_view') ? <Syllabus user={user} schoolClasses={schoolClasses} currentSession={currentSession} /> : <Navigate to="/dashboard"/>} />
            <Route path="/practicals" element={hasUserPermission(user,'practicals') ? <Tracker type="Practical" schoolClasses={schoolClasses} user={user} currentSession={currentSession} /> : <Navigate to="/dashboard"/>} />
            <Route path="/projects" element={hasUserPermission(user,'projects') ? <Tracker type="Project" schoolClasses={schoolClasses} user={user} currentSession={currentSession} /> : <Navigate to="/dashboard"/>} />
            <Route path="/users" element={hasUserPermission(user,'users_manage') ? <Users user={user}/> : <Navigate to="/dashboard"/>} />
            <Route
              path="/settings"
              element={hasUserPermission(user,'settings') ? (
                <Settings
                  user={user}
                  currentSession={currentSession}
                  sessions={sessions}
                  onSwitchSession={switchSession}
                  onOpenCreateSession={() => setCreateSessionOpen(true)}
                  onOpenEditSession={(s) => setEditSessionTarget(s)}
                  onOpenDeleteSession={(s) => setDeleteSessionTarget(s)}
                  onOpenResetStatus={(s) => setResetStatusTarget(s)}
                />
              ) : <Navigate to="/dashboard"/>}
            />
            <Route path="/profile" element={<Profile user={user}/>} />
            <Route path="*" element={<Navigate to="/dashboard"/>} />
          </Routes>
          <Footer/>
        </main>
      </section>

      {createSessionOpen && (
        <CreateSessionModal
          close={() => setCreateSessionOpen(false)}
          onCreateSession={handleCreateSession}
          currentSession={currentSession}
          user={user}
        />
      )}

      {editSessionTarget && (
        <EditSessionModal
          session={editSessionTarget}
          close={() => setEditSessionTarget(null)}
          onUpdateSession={handleUpdateSession}
          user={user}
        />
      )}

      {deleteSessionTarget && (
        <DeleteSessionModal
          session={deleteSessionTarget}
          close={() => setDeleteSessionTarget(null)}
          onDeleteSession={handleDeleteSession}
          user={user}
          totalSessionsCount={sessions.length}
        />
      )}

      {resetStatusTarget && (
        <ResetSessionStatusModal
          session={resetStatusTarget}
          close={() => setResetStatusTarget(null)}
          onResetStatus={handleResetSessionStatus}
          user={user}
        />
      )}
    </div>
  );
}

function WelcomeMarquee() {
  return (
    <div className="welcome-marquee-bar">
      <div className="welcome-marquee-tag">
        <Icons.Volume2 size={13} className="welcome-tag-icon" />
        <span>WELCOME</span>
      </div>
      <div className="welcome-marquee-track">
        <div className="welcome-marquee-content">
          <div className="welcome-marquee-item">
            <img src="/school-gate.jpg" alt="Savitri Balika Inter College Gate" className="marquee-gate-img" />
            <span className="marquee-text">
              Welcome to <b>SAVITRI BALIKA INTER COLLEGE</b>, Jamunahiya, Mirzapur — Official Academic Syllabus Tracker & Progress Portal
            </span>
            <img src="/school-campus.jpg" alt="Savitri Balika Inter College Campus" className="marquee-gate-img" />
            <span className="marquee-text">
              Designed & Developed by <b>AKASH YADAV</b> (Software Engineer)
            </span>
          </div>
          <div className="welcome-marquee-item">
            <img src="/school-gate.jpg" alt="Savitri Balika Inter College Gate" className="marquee-gate-img" />
            <span className="marquee-text">
              Welcome to <b>SAVITRI BALIKA INTER COLLEGE</b>, Jamunahiya, Mirzapur — Official Academic Syllabus Tracker & Progress Portal
            </span>
            <img src="/school-campus.jpg" alt="Savitri Balika Inter College Campus" className="marquee-gate-img" />
            <span className="marquee-text">
              Designed & Developed by <b>AKASH YADAV</b> (Software Engineer)
            </span>
          </div>
          <div className="welcome-marquee-item">
            <img src="/school-gate.jpg" alt="Savitri Balika Inter College Gate" className="marquee-gate-img" />
            <span className="marquee-text">
              Welcome to <b>SAVITRI BALIKA INTER COLLEGE</b>, Jamunahiya, Mirzapur — Official Academic Syllabus Tracker & Progress Portal
            </span>
            <img src="/school-campus.jpg" alt="Savitri Balika Inter College Campus" className="marquee-gate-img" />
            <span className="marquee-text">
              Designed & Developed by <b>AKASH YADAV</b> (Software Engineer)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Header({title,user,sidebarOpen,onToggleSidebar,dark,setDark,setUser,sessions=[],currentSession='2026-27',onSwitchSession=()=>{},onOpenCreateSession=()=>{},onOpenResetStatus=()=>{}}){
  const [now,setNow]=useState(new Date());
  const [bellOpen,setBellOpen]=useState(false);
  const [sessionOpen,setSessionOpen]=useState(false);
  const bellRef=React.useRef(null);
  const sessionRef=React.useRef(null);

  React.useEffect(()=>{let t=setInterval(()=>setNow(new Date()),1000);return()=>clearInterval(t)},[]);
  React.useEffect(()=>{
    const handler=e=>{
      if(bellRef.current&&!bellRef.current.contains(e.target))setBellOpen(false);
      if(sessionRef.current&&!sessionRef.current.contains(e.target))setSessionOpen(false);
    };
    document.addEventListener('mousedown',handler);
    return()=>document.removeEventListener('mousedown',handler);
  },[]);

  const { avatarImg, avatarColor } = useAvatarState(user);
  const loginTime=React.useMemo(()=>new Date(),[]);
  const initials=user.name?.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()||'U';
  const activeSessionObj=sessions.find(s=>s.id===currentSession)||{name:currentSession,label:`Academic Session ${currentSession}`};
  const sortedSessions=React.useMemo(()=>sortSessions(sessions),[sessions]);

  return <header>
    <div className="header-left">
      <button
        className="sidebar-toggle-btn"
        onClick={onToggleSidebar}
        title={sidebarOpen ? "Hide / Collapse Sidebar" : "Show / Expand Sidebar"}
        aria-label="Toggle Sidebar"
      >
        {sidebarOpen ? <Icons.PanelLeftClose size={20}/> : <Icons.PanelLeft size={20}/>}
      </button>
      <div className="header-title-box">
        <span className="crumb">Syllabus Tracker /</span>
        <h3>{title}</h3>
      </div>
    </div>
    <div className="header-right">
      <div className="date"><b>{now.toLocaleDateString('en-IN',{weekday:'long',day:'2-digit',month:'long',year:'numeric'})}</b><small>{now.toLocaleTimeString('en-IN')}</small></div>
      
      {/* Universal Academic Session Dropdown */}
      <div className="session-selector-wrap" ref={sessionRef}>
        <button
          className="session-badge-btn"
          onClick={()=>setSessionOpen(!sessionOpen)}
          title="Switch Academic Session"
        >
          <Icons.CalendarDays size={15}/>
          <span>Session: <b>{activeSessionObj.name}</b></span>
          <Icons.ChevronDown size={14} style={{transition:'transform .2s',transform:sessionOpen?'rotate(180deg)':'none'}}/>
        </button>
        {sessionOpen&&(
          <div className="session-dropdown-menu">
            <div className="session-dropdown-header">
              <Icons.Calendar size={14}/>
              <b>Academic Sessions</b>
            </div>
            <div className="session-list">
              {sortedSessions.map(s=>(
                <div
                  key={s.id}
                  className={`session-item ${s.id===currentSession?'active':''}`}
                  onClick={()=>{onSwitchSession(s.id);setSessionOpen(false);}}
                >
                  <div className="session-item-info">
                    <b>{s.name} {s.isCurrent&&<span className="curr-tag">Current</span>}</b>
                    <small>{s.label}</small>
                  </div>
                  {s.id===currentSession&&<Icons.Check size={16} className="check-icon"/>}
                </div>
              ))}
            </div>
            <div className="session-dropdown-footer" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <button
                type="button"
                className="create-session-btn"
                onClick={()=>{setSessionOpen(false);onOpenCreateSession();}}
              >
                <Icons.Plus size={15}/> Create New Session
              </button>
              <button
                type="button"
                className="create-session-btn"
                style={{ background: '#fff7ed', color: '#c2410c', border: '1px solid #fed7aa' }}
                onClick={()=>{setSessionOpen(false);onOpenResetStatus(activeSessionObj);}}
                title="Reset syllabus status for active session (Master Password Required)"
              >
                <Icons.RotateCcw size={14}/> Reset Session Status
              </button>
            </div>
          </div>
        )}
      </div>

      <button className="theme-toggle" onClick={()=>setDark(!dark)} title={dark?'Switch to Light Mode':'Switch to Dark Mode'}>
        {dark?<Icons.Sun size={18}/>:<Icons.Moon size={18}/>}
      </button>
      <div className="bell-wrap" ref={bellRef}>
        <button className="bell" onClick={()=>setBellOpen(!bellOpen)}><Icons.Bell size={19}/><i/></button>
        {bellOpen&&<div className="bell-dropdown">
          <div className="bell-header"><Icons.Bell size={16}/><b>Notifications</b></div>
          <div className="bell-item bell-welcome">
            <div className="bell-icon-wrap"><Icons.PartyPopper size={20}/></div>
            <div>
              <b>Welcome back, {user.name}! 🎉</b>
              <p>You are logged in as <strong>{user.role==='ADMIN'?'Administrator':'Computer Operator'}</strong></p>
              <small>Logged in at {loginTime.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})}</small>
            </div>
          </div>
          <div className="bell-item">
            <div className="bell-icon-wrap info"><Icons.CalendarDays size={18}/></div>
            <div>
              <b>Active Session: {activeSessionObj.name}</b>
              <p>{activeSessionObj.label}</p>
              <small>SAVITRI BALIKA INTER COLLEGE</small>
            </div>
          </div>
        </div>}
      </div>
      <div className="header-user">
        {avatarImg ? (
          <img src={avatarImg} alt={user.name} className="avatar-img" />
        ) : (
          <div className="avatar" style={{ background: avatarColor, color: '#ffffff' }}>{initials}</div>
        )}
        <div><b>{user.name}</b><Status value={user.role==='ADMIN'?'Admin':'Computer Operator'}/></div>
      </div>
      <button className="header-logout" onClick={()=>setUser(null)} title="Logout"><Icons.LogOut size={18}/></button>
    </div>
  </header>}
function Filters({
  selectedClass='ALL',
  setSelectedClass=()=>{},
  selectedSection='ALL',
  setSelectedSection=()=>{},
  selectedExam='ALL',
  setSelectedExam=()=>{},
  availableClasses=[],
  availableSections=[],
  examOptions=[],
  children
}){
  const classOpts=availableClasses&&availableClasses.length?availableClasses:demoClasses;
  const sectionOpts=availableSections&&availableSections.length?availableSections:['A','B'];
  return (
    <div className="filters" style={{display:'flex',gap:10,alignItems:'center',flexWrap:'wrap',marginBottom:16}}>
      <select value={selectedClass} onChange={e=>{setSelectedClass(e.target.value);setSelectedSection('ALL')}} aria-label="Select Class">
        <option value="ALL">🏫 All Classes (Nursery to 12th)</option>
        <option value="">Select Class</option>
        {classOpts.map(c=><option key={c} value={c}>{c.startsWith('Class')?c:`Class ${c}`}</option>)}
      </select>
      <select value={selectedSection} onChange={e=>setSelectedSection(e.target.value)} aria-label="Select Section">
        <option value="ALL">All Sections</option>
        <option value="">Select Section</option>
        {sectionOpts.map(s=>{const val=String(s).replace(/^section\s+/i,'').trim();return <option key={s} value={val}>Section {val}</option>})}
      </select>
      {examOptions && examOptions.length > 0 && (
        <select 
          value={selectedExam} 
          onChange={e=>setSelectedExam(e.target.value)} 
          aria-label="Select Exam Pattern"
          style={{borderColor: selectedExam !== 'ALL' ? '#1264c3' : undefined, fontWeight: selectedExam !== 'ALL' ? 700 : 400}}
        >
          {examOptions.map(ex=>(
            <option key={ex.id} value={ex.id}>
              {ex.id === 'ALL' ? '📋 ' + ex.label : '📝 ' + ex.label}
            </option>
          ))}
        </select>
      )}
      {children}
    </div>
  );
}

function CustomChartTooltip({ active, payload, isClass, examLabel }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const totalPct = (data.donePct || 0) + (data.inProgressPct || 0);
    const color = totalPct >= 75 ? '#16a34a' : totalPct >= 50 ? '#1d6fd8' : totalPct >= 25 ? '#d97706' : '#dc2626';
    return (
      <div style={{
        background: '#ffffff',
        border: '1px solid #cbd5e1',
        borderRadius: '8px',
        padding: '10px 14px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.12)',
        fontSize: '12px',
        minWidth: 190
      }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:8, marginBottom:4 }}>
          <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '13px' }}>
            {data.name}
          </span>
          {examLabel && (
            <span style={{ fontSize:'10px', background:'#e0f2fe', color:'#0369a1', padding:'2px 6px', borderRadius:'4px', fontWeight:700 }}>
              {examLabel}
            </span>
          )}
        </div>
        <div style={{ display: 'grid', gap: '4px', fontSize: '11px', color: '#475569', marginTop: 4 }}>
          <div style={{display:'flex',alignItems:'center',gap:6}}>
            <span style={{width:10,height:10,borderRadius:2,background:'#16a34a',display:'inline-block',flexShrink:0}}/>
            Done: <b style={{ color: '#16a34a' }}>{data.done}</b> <span style={{color:'#94a3b8'}}>({data.donePct || 0}%)</span>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:6}}>
            <span style={{width:10,height:10,borderRadius:2,background:'#f59e0b',display:'inline-block',flexShrink:0}}/>
            In Progress: <b style={{ color: '#d97706' }}>{data.inProgress}</b> <span style={{color:'#94a3b8'}}>({data.inProgressPct || 0}%)</span>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:6}}>
            <span style={{width:10,height:10,borderRadius:2,background:'#ef4444',display:'inline-block',flexShrink:0}}/>
            Pending: <b style={{ color: '#dc2626' }}>{data.pending}</b>
          </div>
          <div style={{marginTop:3,paddingTop:3,borderTop:'1px dashed #e2e8f0',fontWeight:700,color:'#0f172a'}}>
            Total: {data.total} topics
          </div>
        </div>
        {isClass && (
          <div style={{ marginTop: 6, paddingTop: 4, borderTop: '1px dashed #e2e8f0', fontSize: '10px', color: '#4f46e5', fontWeight: 600 }}>
            👉 Click to view subject details
          </div>
        )}
      </div>
    );
  }
  return null;
}

function Dashboard({ user, currentSession = '2026-27', sessions = [], onSwitchSession, onOpenCreateSession, onOpenResetStatus }) {
  const schoolProfile = useSchoolProfile();
  const { avatarImg, avatarColor } = useAvatarState(user);
  const { topics, dbClasses, reload, setTopics } = useTopics(currentSession),
        [selectedClass,setSelectedClass]=useState('ALL'),
        [selectedSection,setSelectedSection]=useState('ALL'),
        [selectedExam,setSelectedExam]=useState('ALL'),
        [uploadOpen,setUploadOpen]=useState(false),
        [toast,setToast]=useState('');
  
  const currentGroup = useMemo(() => getClassGroup(selectedClass), [selectedClass]);
  const examOptions = useMemo(() => examPatternDefs[currentGroup] || examPatternDefs.all, [currentGroup]);

  // Adjust exam selection if incompatible with newly selected class
  useEffect(() => {
    if (selectedExam !== 'ALL') {
      const valid = examOptions.some(e => e.id === selectedExam);
      if (!valid) {
        if (selectedExam === 'HALF YEARLY') {
          // Keep common exam
        } else {
          setSelectedExam('ALL');
        }
      }
    }
  }, [currentGroup, examOptions, selectedExam]);

  const availableClasses=useMemo(()=>{
    const set=new Set();
    if(dbClasses&&dbClasses.length)dbClasses.forEach(c=>set.add(c.class_name));
    topics.forEach(t=>{if(t.className)set.add(t.className)});
    demoClasses.forEach(c=>set.add(c));
    return Array.from(set).sort((a,b)=>{
      const numA=parseInt(a.replace(/\D/g,''))||0,numB=parseInt(b.replace(/\D/g,''))||0;
      if(numA!==numB)return numA-numB;
      return a.localeCompare(b);
    });
  },[topics,dbClasses]);

  const availableSections=useMemo(()=>{
    const set=new Set();
    let refTopics=topics;
    if(selectedClass && selectedClass!=='ALL'){
      refTopics=topics.filter(t=>t.className===selectedClass);
      const foundClass=dbClasses?.find(c=>c.class_name===selectedClass);
      if(foundClass?.sections)foundClass.sections.forEach(s=>set.add(String(s.section_name).replace(/^section\s+/i,'').trim().toUpperCase()));
    }
    refTopics.forEach(t=>{if(t.section)set.add(String(t.section).replace(/^section\s+/i,'').trim().toUpperCase())});
    if(set.size===0){set.add('A');set.add('B')}
    return Array.from(set).sort();
  },[topics,dbClasses,selectedClass]);

  const normSec=s=>(s||'').replace(/^section\s+/i,'').trim().toUpperCase();

  const isAllClass=!selectedClass||selectedClass==='ALL';

  const filteredTopics=useMemo(()=>{
    return topics.filter(x=>{
      const matchClass=isAllClass||x.className===selectedClass;
      const matchSection=selectedSection==='ALL'||normSec(x.section)===normSec(selectedSection);
      const matchExam=matchesExam(x,selectedExam,selectedClass);
      return matchClass&&matchSection&&matchExam;
    });
  },[topics,selectedClass,selectedSection,selectedExam,isAllClass]);

  const done=filteredTopics.filter(x=>x.status==='Done').length,
        inProgress=filteredTopics.filter(x=>x.status==='In Progress').length,
        pending=filteredTopics.filter(x=>x.status==='Not Done').length,
        total=filteredTopics.length,
        percent=total?Math.round(done/total*100):0;

  const monthData=useMemo(()=>{
    return Object.values(filteredTopics.reduce((a,x)=>{
      let key=x.month||'Other';
      let v=a[key]||(a[key]={month:key,done:0,total:0});
      v.total++;
      if(x.status==='Done')v.done++;
      return a;
    },{})).map(x=>({
      month:x.month.length>7?x.month.slice(0,7):x.month.slice(0,3),
      progress:x.total?Math.round(x.done/x.total*100):0
    }));
  },[filteredTopics]);

  // Class-wise completion data (Used when selectedClass === 'ALL')
  const classWiseData=useMemo(()=>{
    return availableClasses.map(c=>{
      const cTopics=topics.filter(t=>{
        const matchClass=t.className===c;
        const matchSection=selectedSection==='ALL'||normSec(t.section)===normSec(selectedSection);
        const matchExam=matchesExam(t,selectedExam,c);
        return matchClass&&matchSection&&matchExam;
      });
      const cDone=cTopics.filter(x=>x.status==='Done').length;
      const cInProgress=cTopics.filter(x=>x.status==='In Progress').length;
      const cPending=cTopics.filter(x=>x.status==='Not Done').length;
      const cTotal=cTopics.length;
      const donePct=cTotal?Math.round(cDone/cTotal*100):0;
      const inProgressPct=cTotal?Math.round(cInProgress/cTotal*100):0;
      const progress=donePct;
      return {
        name:c,
        shortName:c.replace('Class ','Cl '),
        done:cDone,
        inProgress:cInProgress,
        pending:cPending,
        total:cTotal,
        progress,
        donePct,
        inProgressPct
      };
    });
  },[availableClasses,topics,selectedSection,selectedExam]);

  // Subject-wise completion data (Used when a specific class is selected or for filtered cards)
  const subjectData=useMemo(()=>{
    return Object.values(filteredTopics.reduce((a,x)=>{
      let v=a[x.subject]||(a[x.subject]={name:x.subject,done:0,inProgress:0,pending:0,total:0});
      v.total++;
      if(x.status==='Done')v.done++;
      else if(x.status==='In Progress')v.inProgress++;
      else v.pending++;
      return a;
    },{})).map(x=>{
      const donePct=x.total?Math.round(x.done/x.total*100):0;
      const inProgressPct=x.total?Math.round(x.inProgress/x.total*100):0;
      return {
        ...x,
        progress:donePct,
        donePct,
        inProgressPct
      };
    }).sort((a,b)=>a.name.localeCompare(b.name));
  },[filteredTopics]);

  const isAllExam=selectedExam==='ALL';
  const activeExamObj = examOptions.find(e => e.id === selectedExam) || { shortLabel: 'All Exams', label: 'All Exams' };

  const chartData=isAllClass?classWiseData:subjectData;
  const chartTitle=isAllClass
    ?(isAllExam?'Class-wise Syllabus Completion %':`Class-wise Completion % · ${activeExamObj.shortLabel}`)
    :`Subject-wise Completion % — ${selectedClass} ${!isAllExam?`(${activeExamObj.shortLabel})`:''}`;
  const chartSubtitle=isAllClass
    ?(isAllExam
      ?`Comparing completion across all ${availableClasses.length} classes ${selectedSection!=='ALL'?`(Section ${selectedSection})`:''}`
      :`Exam syllabus progress for ${activeExamObj.label} across all classes`)
    :`Syllabus completion rate by subject for ${selectedClass} · ${activeExamObj.label} ${selectedSection!=='ALL'?`· Section ${selectedSection}`:'· All Sections'}`;

  const getBarColor=(progress)=>{
    if(progress>=75)return '#16a34a'; // Green
    if(progress>=50)return '#1d6fd8'; // Blue
    if(progress>=25)return '#d97706'; // Amber/Orange
    return '#dc2626'; // Red
  };

  const hasAnyFilter = !isAllClass || selectedSection !== 'ALL' || !isAllExam;

  const handleDashboardDownloadExcel = () => {
    exportSyllabusToExcel(filteredTopics, { group: currentGroup, className: selectedClass, exam: selectedExam });
    setToast(`📥 Exported ${filteredTopics.length} filtered syllabus records to Excel.`);
  };

  return <>
    <div className="hero">
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
          <span className="eyebrow" style={{ margin: 0 }}>
            ACADEMIC YEAR {currentSession ? currentSession.replace('-', '–') : '2026–27'}
          </span>
        </div>
        <h1>Welcome to Syllabus Dashboard</h1>
        <p>{schoolProfile.name} <span>•</span> {schoolProfile.address}</p>
      </div>
      <div className="hero-user">
        {avatarImg ? (
          <img src={avatarImg} alt={user.name} className="avatar-img" style={{ width: 44, height: 44, minWidth: 44 }} />
        ) : (
          <div className="avatar" style={{ width: 44, height: 44, minWidth: 44, fontSize: 16, background: avatarColor, color: '#ffffff' }}>
            {user.name?.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()}
          </div>
        )}
        <div>
          <small>LOGGED IN AS</small>
          <b>{user.name}</b>
          <Status value={user.role==='ADMIN'?'Admin':'Computer Operator'}/>
        </div>
      </div>
    </div>

    <Filters
      selectedClass={selectedClass}
      setSelectedClass={setSelectedClass}
      selectedSection={selectedSection}
      setSelectedSection={setSelectedSection}
      selectedExam={selectedExam}
      setSelectedExam={setSelectedExam}
      availableClasses={availableClasses}
      availableSections={availableSections}
      examOptions={examOptions}
    >
      {hasAnyFilter&&(
        <button
          type="button"
          className="secondary"
          onClick={()=>{setSelectedClass('ALL');setSelectedSection('ALL');setSelectedExam('ALL')}}
          style={{display:'inline-flex',alignItems:'center',gap:6,fontSize:12,padding:'9px 12px'}}
        >
          <Icons.RotateCcw size={14}/> Reset Filters
        </button>
      )}
    </Filters>

    <ToastNotification toast={toast} onClose={() => setToast('')} />

    {/* Modern 1-Click Fast Exam Switcher Pills */}
    <div style={{
      display:'flex',
      alignItems:'center',
      gap:8,
      flexWrap:'wrap',
      background:'#ffffff',
      padding:'10px 14px',
      borderRadius:'10px',
      border:'1px solid #e2e8f0',
      marginBottom:18,
      boxShadow:'0 1px 3px rgba(0,0,0,0.02)'
    }}>
      <span style={{fontSize:11,fontWeight:700,color:'#475569',display:'flex',alignItems:'center',gap:6,textTransform:'uppercase',letterSpacing:'0.6px',marginRight:4}}>
        <Icons.ClipboardList size={15} color="#1264c3"/>
        Exam Pattern ({currentGroup === 'primary' ? 'Nursery to 8th' : currentGroup === 'senior' ? '9th to 12th' : 'All Classes'}):
      </span>
      {examOptions.map(ex => {
        const isActive = selectedExam === ex.id;
        const examCount = topics.filter(t => {
          const matchClass = selectedClass === 'ALL' || t.className === selectedClass;
          const matchSec = selectedSection === 'ALL' || normSec(t.section) === normSec(selectedSection);
          return matchClass && matchSec && matchesExam(t, ex.id, selectedClass);
        }).length;

        return (
          <button
            key={ex.id}
            type="button"
            onClick={() => setSelectedExam(ex.id)}
            style={{
              padding:'5px 12px',
              borderRadius:'20px',
              fontSize:'12px',
              fontWeight: isActive ? 700 : 500,
              border: isActive ? '1.5px solid #1264c3' : '1px solid #cbd5e1',
              background: isActive ? '#eff6ff' : '#f8fafc',
              color: isActive ? '#1d4ed8' : '#475569',
              cursor:'pointer',
              display:'inline-flex',
              alignItems:'center',
              gap:6,
              transition:'all 0.15s ease',
              boxShadow: isActive ? '0 2px 6px rgba(29, 78, 216, 0.15)' : 'none'
            }}
          >
            <span>{ex.shortLabel}</span>
            <span style={{
              background: isActive ? '#2563eb' : '#e2e8f0',
              color: isActive ? '#ffffff' : '#64748b',
              padding:'1px 6px',
              borderRadius:'10px',
              fontSize:'10px',
              fontWeight:700
            }}>
              {examCount}
            </span>
          </button>
        );
      })}
    </div>

    <div className="stats">
      {[
        [isAllExam ? "Total Topics" : `${activeExamObj.shortLabel} Topics`, total, 'ListChecks'],
        ['Completed', done, 'CircleCheck'],
        ['In Progress', inProgress, 'Clock3'],
        ['Pending', pending, 'CircleAlert'],
        ['Overall Progress', percent+'%', 'ChartNoAxesCombined']
      ].map(([label,num,ic])=>{
        let I=Icons[ic];
        return <div className="stat" key={label}>
          <div>
            <small>{label}</small>
            <strong>{num}</strong>
          </div>
          <i><I/></i>
        </div>;
      })}
    </div>

    {/* Dynamic Completion Graph: Class-wise when All Classes selected; Subject-wise when a class is selected */}
    <section className="card" style={{marginBottom:20}}>
      <div className="card-title" style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:10}}>
        <div>
          <h2>{chartTitle}</h2>
          <p>{chartSubtitle}</p>
        </div>
        <div style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}>
          <span style={{
            background:isAllClass?'#e0f2fe':'#ecfdf5',
            color:isAllClass?'#0369a1':'#047857',
            fontSize:'11px',
            fontWeight:700,
            padding:'5px 10px',
            borderRadius:'6px',
            display:'inline-flex',
            alignItems:'center',
            gap:4
          }}>
            {isAllClass?'📊 All Classes View':`📘 ${selectedClass} View`}
          </span>
          {!isAllExam&&(
            <span style={{
              background:'#fef3c7',
              color:'#92400e',
              fontSize:'11px',
              fontWeight:700,
              padding:'5px 10px',
              borderRadius:'6px',
              display:'inline-flex',
              alignItems:'center',
              gap:4
            }}>
              📝 {activeExamObj.shortLabel} Syllabus
            </span>
          )}
        </div>
      </div>

      {chartData.length>0?(
        <div style={{width:'100%',height:310,marginTop:10}}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{top:15,right:20,left:-10,bottom:isAllClass?10:35}}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis
                dataKey={isAllClass?"shortName":"name"}
                tick={{fontSize:11,fill:'#4b5563',fontWeight:500}}
                interval={0}
                angle={isAllClass?0:-25}
                textAnchor={isAllClass?"middle":"end"}
                height={isAllClass?30:55}
              />
              <YAxis domain={[0,100]} unit="%" tick={{fontSize:11,fill:'#4b5563'}} />
              <Tooltip content={<CustomChartTooltip isClass={isAllClass} examLabel={activeExamObj.shortLabel}/>} />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="square"
                iconSize={10}
                wrapperStyle={{fontSize:11,fontWeight:600,paddingBottom:4}}
              />
              <Bar
                dataKey="donePct"
                name="✅ Done"
                stackId="status"
                fill="#16a34a"
                maxBarSize={50}
                onClick={(entry)=>{
                  if(isAllClass&&entry?.name){
                    setSelectedClass(entry.name);
                  }
                }}
                cursor={isAllClass?"pointer":"default"}
              />
              <Bar
                dataKey="inProgressPct"
                name="🔄 In Progress"
                stackId="status"
                fill="#f59e0b"
                radius={[6,6,0,0]}
                maxBarSize={50}
                onClick={(entry)=>{
                  if(isAllClass&&entry?.name){
                    setSelectedClass(entry.name);
                  }
                }}
                cursor={isAllClass?"pointer":"default"}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ):(
        <div style={{padding:40,textAlign:'center',color:'#72839a'}}>
          No syllabus records found for the selected filter combination ({selectedExam !== 'ALL' ? activeExamObj.shortLabel : 'Selected criteria'}).
        </div>
      )}

      {/* Interactive Quick Stats / Drill-down cards under the graph */}
      {isAllClass?(
        <div style={{
          display:'grid',
          gridTemplateColumns:'repeat(auto-fill, minmax(130px, 1fr))',
          gap:10,
          marginTop:16,
          borderTop:'1px solid #f1f5f9',
          paddingTop:16
        }}>
          {classWiseData.map(c=>(
            <div
              key={c.name}
              onClick={()=>setSelectedClass(c.name)}
              title={`Click to view ${c.name} subject-wise progress`}
              style={{
                background:'#f8fafc',
                border:'1px solid #e2e8f0',
                borderRadius:'8px',
                padding:'10px 12px',
                cursor:'pointer',
                transition:'all 0.15s ease'
              }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor='#3b82f6';e.currentTarget.style.background='#eff6ff'}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor='#e2e8f0';e.currentTarget.style.background='#f8fafc'}}
            >
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <b style={{fontSize:12,color:'#1e293b'}}>{c.name}</b>
                <strong style={{fontSize:12,color:getBarColor(c.progress)}}>{c.progress}%</strong>
              </div>
              <div style={{margin:'6px 0 4px',height:6,background:'#f1f5f9',borderRadius:3,overflow:'hidden',display:'flex'}}>
                <div style={{width:(c.donePct||0)+'%',background:'#16a34a',transition:'width 0.3s'}}/>
                <div style={{width:(c.inProgressPct||0)+'%',background:'#f59e0b',transition:'width 0.3s'}}/>
              </div>
              <small style={{fontSize:10,color:'#64748b',display:'flex',gap:6}}>
                <span>✅ {c.done}</span>
                {c.inProgress > 0 && <span style={{color:'#d97706'}}>🔄 {c.inProgress}</span>}
                <span style={{color:'#94a3b8'}}>/ {c.total}</span>
              </small>
            </div>
          ))}
        </div>
      ):(
        <div style={{
          display:'grid',
          gridTemplateColumns:'repeat(auto-fill, minmax(140px, 1fr))',
          gap:10,
          marginTop:16,
          borderTop:'1px solid #f1f5f9',
          paddingTop:16
        }}>
          {subjectData.map(s=>(
            <div
              key={s.name}
              style={{
                background:'#f8fafc',
                border:'1px solid #e2e8f0',
                borderRadius:'8px',
                padding:'10px 12px'
              }}
            >
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <b style={{fontSize:12,color:'#1e293b'}}>{s.name}</b>
                <strong style={{fontSize:12,color:getBarColor(s.progress)}}>{s.progress}%</strong>
              </div>
              <div style={{margin:'6px 0 4px',height:6,background:'#f1f5f9',borderRadius:3,overflow:'hidden',display:'flex'}}>
                <div style={{width:(s.donePct||0)+'%',background:'#16a34a',transition:'width 0.3s'}}/>
                <div style={{width:(s.inProgressPct||0)+'%',background:'#f59e0b',transition:'width 0.3s'}}/>
              </div>
              <small style={{fontSize:10,color:'#64748b',display:'flex',gap:6}}>
                <span>✅ {s.done}</span>
                {s.inProgress > 0 && <span style={{color:'#d97706'}}>🔄 {s.inProgress}</span>}
                <span style={{color:'#94a3b8'}}>/ {s.total}</span>
              </small>
            </div>
          ))}
        </div>
      )}
    </section>

    {/* Secondary Metrics: Overall Ring and Monthly Completion */}
    <div className="grid two">
      <section className="card progress-card">
        <CardTitle
          title="Overall progress"
          subtitle={
            (isAllClass && selectedSection === 'ALL' && isAllExam)
              ? 'Complete syllabus data'
              : `${isAllClass ? 'All Classes' : selectedClass} · ${selectedSection === 'ALL' ? 'All Sections' : 'Section ' + selectedSection} ${!isAllExam ? `· ${activeExamObj.shortLabel}` : ''}`
          }
        />
        <div className="progress-main">
          <div className="ring" style={{'--p':percent}}>
            <b>{percent}%</b>
            <small>Complete</small>
          </div>
          <div className="progress-list">
            <p>
              <Status value="Done"/>
              <b>{done}</b>
              <small>Topics completed</small>
            </p>
            <p>
              <Status value="In Progress"/>
              <b>{inProgress}</b>
              <small>Currently active</small>
            </p>
            <p>
              <Status value="Not Done"/>
              <b>{pending}</b>
              <small>Pending topics</small>
            </p>
          </div>
        </div>
      </section>

      <section className="card chart-card">
        <CardTitle
          title="Monthly completion trend"
          subtitle={isAllExam ? "Progress across months" : `Monthly breakdown for ${activeExamObj.shortLabel}`}
        />
        {monthData.length>0?(
          <ResponsiveContainer width="100%" height={235}>
            <AreaChart data={monthData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="month"/>
              <YAxis unit="%" domain={[0,100]}/>
              <Tooltip/>
              <Area type="monotone" dataKey="progress" stroke="#1765c1" fill="#dcecff" strokeWidth={3}/>
            </AreaChart>
          </ResponsiveContainer>
        ):(
          <div style={{padding:40,textAlign:'center',color:'#72839a'}}>
            No monthly data for this filter.
          </div>
        )}
      </section>
    </div>

    {/* Detailed Subject Grid */}
    <section className="card subject-card" style={{marginTop:20}}>
      <CardTitle
        title={isAllClass ? (isAllExam ? "All Subjects Overview" : `All Subjects Overview (${activeExamObj.shortLabel})`) : `${selectedClass} Subject Details ${!isAllExam ? `(${activeExamObj.shortLabel})` : ''}`}
        subtitle={isAllExam ? "Detailed syllabus completion rate" : `Completion rate for ${activeExamObj.label}`}
      />
      {subjectData.length>0?(
        <div className="subjects">
          {subjectData.map(x=><div className="subject" key={x.name}>
            <div className="subject-header-row">
              <div className="subject-icon">{x.name.slice(0,2).toUpperCase()}</div>
              <strong style={{color:getBarColor(x.progress)}}>{x.progress}%</strong>
            </div>
            <b>{x.name}</b>
            <div className="bar">
              <i style={{width:x.progress+'%',background:getBarColor(x.progress)}}/>
            </div>
            <small>{x.progress<50?'⚠️ Needs attention':'✅ On track'} · {x.done}/{x.total} done</small>
          </div>)}
        </div>
      ):(
        <div style={{padding:30,textAlign:'center',color:'#72839a'}}>
          No subjects found for the selected Class & Exam filter.
        </div>
      )}
    </section>

    {uploadOpen && (
      <UploadSyllabusModal
        close={()=>setUploadOpen(false)}
        dbClasses={dbClasses}
        reload={reload}
        setTopics={setTopics}
        onSuccess={(msg)=>setToast(msg)}
      />
    )}
  </>;
}
function exportSyllabusToExcel(data, { group, className, subjectName, exam } = {}) {
  const exportRows = data.map((x, idx) => ({
    'S.No.': idx + 1,
    'Class': x.className || '',
    'Section': x.section || 'A',
    'Subject': x.subject || '',
    'Month / Term': x.month || '',
    'Assessment / Exam': x.assessment || '',
    'Chapter / Title': x.chapter || '',
    'Hindi Title': x.hindi || '',
    'Detailed Syllabus / Topic': x.topic || '',
    'Practical / Lab Work': x.practical || '',
    'Project Work': x.project || '',
    'Status': x.status || 'Not Done',
    'Remarks': x.remarks || ''
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportRows);
  
  // Professional Print-Ready Column Widths
  worksheet['!cols'] = [
    { wch: 8 },  // S.No.
    { wch: 12 }, // Class
    { wch: 10 }, // Section
    { wch: 18 }, // Subject
    { wch: 15 }, // Month / Term
    { wch: 20 }, // Assessment / Exam
    { wch: 28 }, // Chapter / Title
    { wch: 25 }, // Hindi Title
    { wch: 48 }, // Detailed Syllabus / Topic
    { wch: 34 }, // Practical / Lab Work
    { wch: 34 }, // Project Work
    { wch: 14 }, // Status
    { wch: 22 }  // Remarks
  ];

  // Auto-filter for easy filtering and printing in Excel
  if (exportRows.length > 0) {
    worksheet['!autofilter'] = { ref: `A1:M${exportRows.length + 1}` };
  }

  const workbook = XLSX.utils.book_new();
  const sheetName = (className && className !== 'ALL' ? className : (group === 'primary' ? '1st to 8th' : '9th to 12th')).slice(0, 31);
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  const parts = ['Syllabus'];
  if (className && className !== 'ALL') parts.push(className.replace(/\s+/g, '_'));
  else parts.push(group === 'primary' ? 'Class_1-8' : 'Class_9-12');
  if (subjectName && subjectName !== 'ALL') parts.push(subjectName.replace(/\s+/g, '_'));
  if (exam && exam !== 'ALL') parts.push(exam.replace(/[\s\/-]+/g, '_'));
  parts.push('2026-27.xlsx');

  XLSX.writeFile(workbook, parts.join('_'));
}

async function downloadSampleExcelTemplate() {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'Savitri Balika Inter College';
  wb.created = new Date();

  const ws = wb.addWorksheet('Syllabus_Template', {
    views: [{ state: 'frozen', ySplit: 1 }]
  });

  const headersConfig = [
    { title: 'S.No.', required: true, key: 'sno', width: 8 },
    { title: 'Class', required: true, key: 'className', width: 14 },
    { title: 'Section', required: true, key: 'section', width: 10 },
    { title: 'Subject', required: true, key: 'subject', width: 22 },
    { title: 'Month / Term', required: true, key: 'month', width: 18 },
    { title: 'Assessment / Exam', required: true, key: 'assessment', width: 22 },
    { title: 'Chapter / Title', required: true, key: 'chapter', width: 32 },
    { title: 'Hindi Title', required: false, key: 'hindi', width: 26 }, // No asterisk on Hindi Title as requested
    { title: 'Detailed Syllabus / Topic', required: true, key: 'topic', width: 55 },
    { title: 'Practical / Lab Work', required: true, key: 'practical', width: 38 }, // Red * on Practical column
    { title: 'Project Work', required: false, key: 'project', width: 38 },
    { title: 'Status', required: true, key: 'status', width: 16 },
    { title: 'Remarks', required: true, key: 'remarks', width: 25 }
  ];

  ws.columns = headersConfig.map(h => ({
    key: h.key,
    width: h.width
  }));

  // Header Row Styling (Navy Blue & Bold White with Bright Red *)
  const headerRow = ws.getRow(1);
  headerRow.height = 28;

  headersConfig.forEach((h, idx) => {
    const cell = headerRow.getCell(idx + 1);
    if (h.required) {
      cell.value = {
        richText: [
          { text: h.title + ' ', font: { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } } },
          { text: '*', font: { name: 'Calibri', size: 13, bold: true, color: { argb: 'FFFF2222' } } } // Bold Red Asterisk
        ]
      };
    } else {
      cell.value = {
        richText: [
          { text: h.title, font: { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } } }
        ]
      };
    }

    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1E3A8A' }
    };
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FFCBD5E1' } },
      left: { style: 'thin', color: { argb: 'FFCBD5E1' } },
      bottom: { style: 'medium', color: { argb: 'FF0F172A' } },
      right: { style: 'thin', color: { argb: 'FFCBD5E1' } }
    };
  });

  // Exactly 1 Row of Sample / Guide Data (Row 2)
  const sampleRow = ws.addRow({
    sno: 1,
    className: 'Class 1',
    section: 'A',
    subject: 'English',
    month: 'Apr - July',
    assessment: 'PA 1',
    chapter: 'Unit 1: A Happy Child',
    hindi: 'एक खुशहाल बच्चा',
    topic: 'Reading, poem recitation, rhyming words, new vocabulary words',
    practical: 'Activity 1: Draw and colour a happy face & family tree',
    project: 'Project 1: Scrapbook on Family Members & Helpers',
    status: 'Done',
    remarks: 'Completed in July week 2'
  });
  sampleRow.height = 24;
  sampleRow.eachCell((cell, colNumber) => {
    cell.font = { name: 'Calibri', size: 10 };
    cell.alignment = {
      vertical: 'middle',
      horizontal: [1, 2, 3, 5, 6, 11].includes(colNumber) ? 'center' : 'left',
      wrapText: true
    };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
      left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
      bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
      right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
    };
  });

  // Dropdown Options Definitions for Excel Data Validation
  const classValidation = {
    type: 'list',
    allowBlank: true,
    formulae: ['"Nursery,LKG,UKG,Class 1,Class 2,Class 3,Class 4,Class 5,Class 6,Class 7,Class 8,Class 9,Class 10,Class 11,Class 12"'],
    showErrorMessage: true,
    errorTitle: 'Invalid Class',
    error: 'Please select a valid Class from the dropdown list'
  };

  const sectionValidation = {
    type: 'list',
    allowBlank: true,
    formulae: ['"A,B,C,Science,Commerce,Arts,All"'],
    showErrorMessage: false
  };

  const monthValidation = {
    type: 'list',
    allowBlank: true,
    formulae: ['"Apr - July,Aug - Sep,Oct - Dec,Jan - Mar,April,May,July,August,September,October,November,December,January,February,March"'],
    showErrorMessage: true,
    errorTitle: 'Invalid Month / Term',
    error: 'Please select a valid Month / Term from the dropdown list'
  };

  const examValidation = {
    type: 'list',
    allowBlank: true,
    formulae: ['"PA 1,Half Yearly,PA 2,Annual,UT 1,UT 2,UT 3,UT 4,Unit Test,Pre-Board"'],
    showErrorMessage: true,
    errorTitle: 'Invalid Exam Pattern',
    error: 'Please select an Assessment / Exam option from the dropdown list'
  };

  const statusValidation = {
    type: 'list',
    allowBlank: true,
    formulae: ['"Done,In Progress,Not Done"'],
    showErrorMessage: true,
    errorTitle: 'Invalid Status',
    error: 'Please select Done, In Progress, or Not Done'
  };

  // Attach dropdowns to 500 rows for easy quick-fill
  for (let r = 2; r <= 500; r++) {
    const row = ws.getRow(r);
    row.getCell(2).dataValidation = classValidation;   // Class
    row.getCell(3).dataValidation = sectionValidation; // Section
    row.getCell(5).dataValidation = monthValidation;   // Month / Term Dropdown
    row.getCell(6).dataValidation = examValidation;    // Assessment / Exam Dropdown
    row.getCell(11).dataValidation = statusValidation; // Status Dropdown
  }

  // AutoFilter across all 12 columns
  ws.autoFilter = 'A1:L500';

  // Sheet 2: Guidelines & Instructions
  const wsGuide = wb.addWorksheet('Instructions_&_Guidelines');
  wsGuide.columns = [
    { header: 'Column / Header', key: 'col', width: 24 },
    { header: 'Required', key: 'req', width: 14 },
    { header: 'Dropdown / Example Values', key: 'vals', width: 45 },
    { header: 'Description / Instructions', key: 'desc', width: 55 }
  ];

  const guideHeader = wsGuide.getRow(1);
  guideHeader.height = 26;
  guideHeader.eachCell(cell => {
    cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F766E' } }; // Teal
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
  });

  const guideEntries = [
    { col: 'S.No.', req: 'Yes', vals: '1, 2, 3...', desc: 'Sequential serial number (No UUID/ID needed).' },
    { col: 'Class', req: 'Yes (Dropdown)', vals: 'Nursery to Class 12 (Select from Dropdown)', desc: 'Class / Grade level of students.' },
    { col: 'Section', req: 'Optional (Dropdown)', vals: 'A, B, C, Science, Commerce, Arts, All', desc: 'Section / Stream identifier (defaults to A).' },
    { col: 'Subject', req: 'Yes', vals: 'English, Hindi, Mathematics, Science, Physics, etc.', desc: 'Name of the subject.' },
    { col: 'Month / Term', req: 'Yes (Dropdown)', vals: 'Apr - July, Aug - Sep, Oct - Dec, Jan - Mar, etc.', desc: 'Academic period or month (Select from Dropdown).' },
    { col: 'Assessment / Exam', req: 'Recommended (Dropdown)', vals: 'Nursery-8th: [PA 1, Half Yearly, PA 2, Annual] | 9th-12th: [UT 1, UT 2, Half Yearly, UT 3, UT 4]', desc: 'Exam pattern tag for analytics (Select from Dropdown).' },
    { col: 'Chapter / Title', req: 'Yes', vals: 'Chapter 1: Title, Unit 1, etc.', desc: 'English chapter / unit name.' },
    { col: 'Hindi Title', req: 'Optional', vals: 'पाठ १: शीर्षक', desc: 'Hindi translation / Hindi chapter title.' },
    { col: 'Detailed Syllabus / Topic', req: 'Yes', vals: 'Complete curriculum points / topics', desc: 'Detailed syllabus topic and learning points.' },
    { col: 'Practical / Lab Work', req: 'Yes', vals: 'Experiments, practicals, activities, lab demo', desc: 'Laboratory experiment, science practical, or class activity.' },
    { col: 'Project Work', req: 'Optional', vals: 'Projects, models, chart work, assignments', desc: 'Student project work, model making, or assignment topic.' },
    { col: 'Status', req: 'Yes (Dropdown)', vals: 'Done, In Progress, Not Done', desc: 'Current teaching progress (Select from Dropdown).' },
    { col: 'Remarks', req: 'Optional', vals: 'Teacher or Admin notes', desc: 'Any remarks or notes.' }
  ];

  guideEntries.forEach(item => {
    const r = wsGuide.addRow(item);
    r.height = 22;
    r.eachCell((cell, colNum) => {
      cell.font = { name: 'Calibri', size: 10 };
      cell.alignment = { vertical: 'middle', horizontal: colNum <= 2 ? 'center' : 'left', wrapText: true };
    });
  });

  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Savitri_School_Syllabus_Sample_Template_2026-27.xlsx';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function applyExcelUpdates(rows, dbClasses, reload, setTopics) {
  let updatedCount = 0;
  let createdCount = 0;

  if (supabase) {
    const cRes = await supabase.from('classes').select('id, class_name');
    const sRes = await supabase.from('subjects').select('id, subject_name');
    const classMap = new Map((cRes.data || []).map(c => [c.class_name.toLowerCase().trim(), c.id]));
    const subjectMap = new Map((sRes.data || []).map(s => [s.subject_name.toLowerCase().trim(), s.id]));
    const replacedScopes = new Set();

    for (const row of rows) {
      let subjectId = null;
      let classId = null;

      if (row.className) {
        const cKey = row.className.toLowerCase().trim();
        if (classMap.has(cKey)) {
          classId = classMap.get(cKey);
        } else {
          const grp = getClassGroup(row.className) === 'senior' ? 'SENIOR' : getClassGroup(row.className) === 'preprimary' ? 'PREPRIMARY' : 'PRIMARY';
          const { data: newClass } = await supabase.from('classes').insert({ class_name: row.className, class_group: grp }).select('id').single();
          if (newClass) {
            classId = newClass.id;
            classMap.set(cKey, newClass.id);
          }
        }
      }

      if (row.subject) {
        const sKey = row.subject.toLowerCase().trim();
        if (subjectMap.has(sKey)) {
          subjectId = subjectMap.get(sKey);
        } else {
          const { data: newSub } = await supabase.from('subjects').insert({ subject_name: row.subject }).select('id').single();
          if (newSub) {
            subjectId = newSub.id;
            subjectMap.set(sKey, newSub.id);
          }
        }
      }

      // Excel is the source of truth for the uploaded class/section/subject.
      // Clear a subject once before inserting its uploaded rows, so stale practical
      // entries cannot appear in the Practical tab or A4 reports.
      const scopeKey = `${classId || ''}:${subjectId || ''}:${row.section || ''}`;
      if (classId && subjectId && !replacedScopes.has(scopeKey)) {
        let sectionId = null;
        const sectionName = (row.section || 'A').trim();
        const sectionRes = await supabase
          .from('sections')
          .select('id')
          .eq('class_id', classId)
          .eq('section_name', sectionName)
          .maybeSingle();
        if (sectionRes.data?.id) {
          sectionId = sectionRes.data.id;
        } else {
          const { data: newSection, error: sectionError } = await supabase
            .from('sections')
            .insert({ class_id: classId, section_name: sectionName })
            .select('id')
            .single();
          if (sectionError) throw sectionError;
          sectionId = newSection?.id || null;
        }

        let deleteQuery = supabase
          .from('syllabus_topics')
          .delete()
          .eq('class_id', classId)
          .eq('subject_id', subjectId);
        // Legacy Class 9-A records were saved without section_id, so include those
        // only while replacing Section A. Properly mapped other sections stay safe.
        if (sectionId) {
          deleteQuery = sectionName === 'A'
            ? deleteQuery.or(`section_id.eq.${sectionId},section_id.is.null`)
            : deleteQuery.eq('section_id', sectionId);
        }
        const { error: deleteError } = await deleteQuery;
        if (deleteError) throw deleteError;
        replacedScopes.add(scopeKey);
      }

      let sectionId = null;
      if (classId) {
        const sectionName = (row.section || 'A').trim();
        const sectionRes = await supabase.from('sections').select('id').eq('class_id', classId).eq('section_name', sectionName).maybeSingle();
        sectionId = sectionRes.data?.id || null;
      }

      const payload = {
        month: row.month || 'Apr - July',
        unit_chapter_en: row.chapter || '',
        unit_chapter_hi: row.hindi || null,
        topic_en: row.topic || '',
        assessment_en: row.assessment || null,
        status: statusValues.includes(row.status) ? row.status : 'Not Done',
        practical: row.practical?.trim() || null,
        project: row.project?.trim() || null,
        remarks: row.remarks || null
      };
      if (classId) payload.class_id = classId;
      if (subjectId) payload.subject_id = subjectId;
      if (sectionId) payload.section_id = sectionId;

      const { error: insertError } = await supabase.from('syllabus_topics').insert(payload);
      if (insertError) throw insertError;
      createdCount++;
    }
    await reload();
  } else {
    setTopics(prev => {
      const importedScopes = new Set(rows.map(r => `${(r.className || '').toLowerCase()}::${(r.section || 'A').toLowerCase()}::${(r.subject || '').toLowerCase()}`));
      const copy = prev.filter(t => !importedScopes.has(`${(t.className || '').toLowerCase()}::${(t.section || 'A').toLowerCase()}::${(t.subject || '').toLowerCase()}`));
      rows.forEach(r => {
        copy.push({
          id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          className: r.className || 'Class 1',
          section: r.section || 'A',
          group: getClassGroup(r.className || 'Class 1'),
          subject: r.subject || 'General',
          month: r.month || 'Apr - July',
          chapter: r.chapter || '',
          hindi: r.hindi || '',
          topic: r.topic || '',
          practical: r.practical || '',
          project: r.project || '',
          assessment: r.assessment || 'PA 1',
          status: statusValues.includes(r.status) ? r.status : 'Not Done',
          remarks: r.remarks || ''
        });
        createdCount++;
      });
      return copy;
    });
  }

  return { updatedCount, createdCount, total: rows.length };
}

function UploadSyllabusModal({ close, dbClasses, reload, setTopics, onSuccess }) {
  const [file, setFile] = useState(null);
  const [report, setReport] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setError('');
    try {
      const buffer = await f.arrayBuffer();
      const book = XLSX.read(buffer);
      const parsedRows = [];

      for (const sheet of book.SheetNames) {
        const rawRows = XLSX.utils.sheet_to_json(book.Sheets[sheet], { defval: '' });
        for (const r of rawRows) {
          const keys = Object.keys(r);
          const getVal = (possibleKeys) => {
            for (const pk of possibleKeys) {
              const cleanPk = pk.replace(/[\*\s]+/g, ' ').trim().toLowerCase();
              const found = keys.find(k => {
                const cleanK = k.replace(/[\*\s]+/g, ' ').trim().toLowerCase();
                return cleanK === cleanPk || cleanK.startsWith(cleanPk);
              });
              if (found && r[found] !== undefined && String(r[found]).trim() !== '') return String(r[found]).trim();
            }
            return '';
          };

          const id = getVal(['id', 'topic id', 'topic_id']);
          const className = getVal(['class', 'class name', 'classname', 'grade']) || (sheet.toLowerCase().startsWith('class') ? sheet : 'Class 1');
          const section = getVal(['section', 'sec']) || 'A';
          const subject = getVal(['subject', 'subject name', 'subject_name']) || sheet;
          const month = getVal(['month', 'month / term', 'month/term', 'term', 'month_term']) || 'Apr - July';
          const assessment = getVal(['assessment', 'assessment / exam', 'exam', 'assessment_en', 'exam pattern', 'exam_pattern']) || '';
          const chapter = getVal(['chapter', 'chapter / title', 'chapter_title', 'title', 'unit_chapter_en', 'unit / chapter', 'name']);
          const hindi = getVal(['hindi', 'hindi title', 'hindi_title', 'unit_chapter_hi', 'विषय हिन्दी', 'hindi topic']);
          const topic = getVal(['detailed syllabus / topic', 'detailed syllabus', 'syllabus', 'topic', 'topic_en', 'topic english', 'learning objectives']);
          const practical = getVal(['practical', 'practical / lab work', 'practical/lab work', 'lab work', 'practicals', 'experiment', 'lab experiment', 'activity']);
          const project = getVal(['project', 'project work', 'projects', 'assignment', 'project/assignment', 'project / assignment']);
          let status = getVal(['status']);
          const remarks = getVal(['remarks', 'remark', 'notes']);

          if (!statusValues.includes(status)) {
            if (status.toLowerCase().includes('done') && !status.toLowerCase().includes('not')) status = 'Done';
            else if (status.toLowerCase().includes('progress')) status = 'In Progress';
            else status = 'Not Done';
          }

          if (chapter || topic) {
            parsedRows.push({
              id,
              className,
              section,
              group: getClassGroup(className),
              subject,
              month,
              assessment: assessment || 'PA 1',
              chapter: chapter || `${subject} Syllabus`,
              hindi,
              topic: topic || chapter,
              practical,
              project,
              status,
              remarks
            });
          }
        }
      }

      if (parsedRows.length === 0) {
        throw new Error('No valid syllabus rows could be found in the uploaded Excel file. Please ensure columns like Month and Chapter / Topic are present.');
      }

      const doneCount = parsedRows.filter(r => r.status === 'Done').length;
      const progCount = parsedRows.filter(r => r.status === 'In Progress').length;
      const notDoneCount = parsedRows.filter(r => r.status === 'Not Done').length;
      const subjectsList = [...new Set(parsedRows.map(r => r.subject))];
      const classesList = [...new Set(parsedRows.map(r => r.className))];

      setReport({
        valid: true,
        fileName: f.name,
        rows: parsedRows,
        summary: {
          total: parsedRows.length,
          done: doneCount,
          inProgress: progCount,
          notDone: notDoneCount,
          subjects: subjectsList,
          classes: classesList
        }
      });
    } catch (err) {
      setError(err.message || 'Failed to read Excel file.');
      setReport(null);
    }
  };

  const handleUpdate = async () => {
    if (!report?.rows?.length) return;
    setBusy(true);
    setError('');
    try {
      const res = await applyExcelUpdates(report.rows, dbClasses, reload, setTopics);
      onSuccess(`🎉 Congratulations! Excel update successful: ${res.updatedCount} records updated, ${res.createdCount} new records added across ${report.summary.classes.length} classes!`);
      close();
    } catch (err) {
      setError(err.message || 'Error applying updates.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal" style={{ maxWidth: 640, maxHeight: '90vh', overflowY: 'auto' }}>
        <button className="modal-close" onClick={close}><Icons.X/></button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 15 }}>
          <div style={{ width: 42, height: 42, background: '#eff6ff', color: '#1d4ed8', borderRadius: 10, display: 'grid', placeItems: 'center' }}>
            <Icons.FileSpreadsheet size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: 18, margin: 0, color: '#0f172a' }}>Upload & Update Syllabus Excel</h2>
            <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0' }}>Edit syllabus, statuses, or topics in Excel and upload here to update live</p>
          </div>
        </div>

        {/* Dedicated Sample Template Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
          border: '1px solid #bbf7d0',
          borderRadius: 10,
          padding: '12px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          marginBottom: 16
        }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#166534', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Icons.FileSpreadsheet size={16} color="#16a34a"/> Standard Syllabus Excel Template
            </div>
            <div style={{ fontSize: 11, color: '#15803d', marginTop: 2 }}>
              Pre-defined column headers & example formats. Simply enter your syllabus data and upload!
            </div>
          </div>
          <button
            type="button"
            onClick={downloadSampleExcelTemplate}
            style={{
              background: '#16a34a',
              color: '#ffffff',
              border: 'none',
              padding: '8px 13px',
              borderRadius: 6,
              fontWeight: 600,
              fontSize: 11,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 4px rgba(22,163,74,0.2)'
            }}
          >
            <Icons.Download size={13} color="#ffffff"/> Download Sample Template
          </button>
        </div>

        <section className="upload-zone" style={{ padding: 25, margin: '15px 0' }}>
          <Icons.FileUp size={28} color="#2563eb"/>
          <h2 style={{ fontSize: 15, margin: '8px 0 4px' }}>{file ? file.name : 'Select or drop your updated Excel file'}</h2>
          <p style={{ fontSize: 11, color: '#64748b' }}>Upload the exported syllabus file after making your updates or status changes</p>
          <label className="secondary" style={{ marginTop: 12, cursor: 'pointer' }}>
            Browse Excel File (.xlsx)
            <input type="file" accept=".xlsx,.xls" onChange={handleFile}/>
          </label>
        </section>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '10px 14px', borderRadius: 8, fontSize: 12, marginBottom: 15 }}>
            <Icons.AlertTriangle size={15} style={{ verticalAlign: 'middle', marginRight: 6 }}/>
            {error}
          </div>
        )}

        {report && (
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: 16, marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontWeight: 700, fontSize: 13, color: '#1e293b' }}>
                📊 File Analysis Summary
              </span>
              <span style={{ background: '#dcfce7', color: '#15803d', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6 }}>
                {report.rows.length} Total Rows Recognized
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 14 }}>
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 12px' }}>
                <small style={{ fontSize: 10, color: '#64748b', display: 'block' }}>Done</small>
                <b style={{ fontSize: 16, color: '#16a34a' }}>{report.summary.done}</b>
              </div>
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 12px' }}>
                <small style={{ fontSize: 10, color: '#64748b', display: 'block' }}>In Progress</small>
                <b style={{ fontSize: 16, color: '#d97706' }}>{report.summary.inProgress}</b>
              </div>
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 12px' }}>
                <small style={{ fontSize: 10, color: '#64748b', display: 'block' }}>Not Done</small>
                <b style={{ fontSize: 16, color: '#dc2626' }}>{report.summary.notDone}</b>
              </div>
            </div>

            <div style={{ fontSize: 11, color: '#475569', display: 'grid', gap: 4, marginBottom: 12 }}>
              <div><b>Classes Detected:</b> {report.summary.classes.join(', ')}</div>
              <div><b>Subjects Detected:</b> {report.summary.subjects.slice(0, 8).join(', ')}{report.summary.subjects.length > 8 ? ` +${report.summary.subjects.length - 8} more` : ''}</div>
            </div>

            <div style={{ maxHeight: 130, overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: 6, background: '#fff' }}>
              <table style={{ fontSize: 10, width: '100%' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9' }}>
                    <th style={{ padding: '6px 8px' }}>Class</th>
                    <th style={{ padding: '6px 8px' }}>Subject</th>
                    <th style={{ padding: '6px 8px' }}>Chapter / Title</th>
                    <th style={{ padding: '6px 8px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {report.rows.slice(0, 4).map((r, i) => (
                    <tr key={i}>
                      <td style={{ padding: '6px 8px' }}><b>{r.className}</b></td>
                      <td style={{ padding: '6px 8px' }}>{r.subject}</td>
                      <td style={{ padding: '6px 8px', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.chapter}</td>
                      <td style={{ padding: '6px 8px' }}><Status value={r.status}/></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
              <button className="secondary" type="button" onClick={close} disabled={busy}>Cancel</button>
              <button className="primary" type="button" onClick={handleUpdate} disabled={busy}>
                {busy ? <><Icons.LoaderCircle className="spin"/> Updating Database…</> : <><Icons.CheckCircle size={15}/> Confirm & Update Syllabus</>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AddSyllabusModal({ defaultClass, defaultSubject, close, dbClasses, schoolClasses = [], reload, setTopics, onSuccess }) {
  const classList = schoolClasses.length ? schoolClasses.map(c => c.name) : [
    'Nursery', 'LKG', 'UKG',
    'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8',
    'Class 9', 'Class 10', 'Class 11', 'Class 12'
  ];

  const monthsList = [
    'Apr - July', 'Aug - Oct', 'Nov - Dec', 'Jan - Feb',
    'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March'
  ];

  const assessmentList = [
    'PA 1', 'Half Yearly', 'PA 2', 'Annual', 'UT 1', 'UT 2', 'UT 3', 'UT 4', 'Pre-Board', 'Unit Test'
  ];

  const [formData, setFormData] = useState({
    className: defaultClass && defaultClass !== 'ALL' ? defaultClass : '',
    section: '',
    subject: defaultSubject && defaultSubject !== 'ALL' ? defaultSubject : '',
    month: '',
    assessment: '',
    chapter: '',
    hindi: '',
    topic: '',
    practical: '',
    project: '',
    status: 'Not Done',
    remarks: ''
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const selectedClassObj = schoolClasses.find(c => c.name === formData.className);
  const sectionList = (selectedClassObj && selectedClassObj.sections && selectedClassObj.sections.length)
    ? selectedClassObj.sections
    : ['A', 'B', 'C', 'D', 'E'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.className || !formData.subject || !formData.month || !formData.chapter) {
      setError('Please select Class, Month, and enter Subject & Chapter title.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      let newId = `custom-add-${Date.now()}`;
      if (supabase) {
        let subjectId = null;
        if (formData.subject) {
          let sRes = await supabase.from('subjects').select('id').eq('subject_name', formData.subject).maybeSingle();
          if (sRes.error) throw sRes.error;
          if (!sRes.data) {
            let created = await supabase.from('subjects').insert({ subject_name: formData.subject }).select('id').single();
            if (created.error) throw created.error;
            subjectId = created.data.id;
          } else {
            subjectId = sRes.data.id;
          }
        }

        let classId = null;
        if (formData.className) {
          let cRes = await supabase.from('classes').select('id').eq('class_name', formData.className).maybeSingle();
          if (!cRes.error && cRes.data) {
            classId = cRes.data.id;
          }
        }

        const payload = {
          month: formData.month,
          unit_chapter_en: formData.chapter,
          unit_chapter_hi: formData.hindi || null,
          topic_en: formData.topic || null,
          assessment_en: formData.assessment || null,
          status: formData.status,
          practical: formData.practical?.trim() || null,
          project: formData.project?.trim() || null,
          remarks: formData.remarks || null,
          ...(subjectId ? { subject_id: subjectId } : {}),
          ...(classId ? { class_id: classId } : {})
        };

        const { data: insData, error: insErr } = await supabase.from('syllabus_topics').insert(payload).select().single();
        if (insErr) {
          console.warn('Supabase insert notice:', insErr);
        } else if (insData && insData.id) {
          newId = insData.id;
        }
      }

      const newItem = {
        id: newId,
        ...formData,
        group: getClassGroup(formData.className)
      };

      setTopics(prev => [newItem, ...prev]);

      if (reload) await reload();
      onSuccess?.('🎉 Congratulations! New syllabus record added successfully!');
      close();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to add syllabus record.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={close}>
      <div className="modal" style={{ maxWidth: 650, maxHeight: '90vh', overflowY: 'auto', padding: 26 }} onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={close}><Icons.X size={18} /></button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
          <div style={{ width: 42, height: 42, background: '#eff6ff', color: '#1d4ed8', borderRadius: 10, display: 'grid', placeItems: 'center' }}>
            <Icons.PlusCircle size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: 18, margin: 0, color: '#0f172a' }}>Add New Syllabus Record</h2>
            <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0' }}>Manually add a syllabus entry for any class & subject</p>
          </div>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '10px 14px', borderRadius: 8, fontSize: 12, marginBottom: 15 }}>
            <Icons.AlertTriangle size={15} style={{ verticalAlign: 'middle', marginRight: 6 }}/>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="form-grid" style={{ gap: 15 }}>
          <label>
            Class *
            <select
              value={formData.className}
              onChange={e => setFormData({ ...formData, className: e.target.value })}
              required
            >
              <option value="">-- Select Class --</option>
              {classList.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>

          <label>
            Section *
            <select
              value={formData.section}
              onChange={e => setFormData({ ...formData, section: e.target.value })}
              required
            >
              <option value="">-- Select Section --</option>
              {sectionList.map(s => <option key={s} value={s}>Section {s}</option>)}
            </select>
          </label>

          <label>
            Subject *
            <input
              value={formData.subject}
              onChange={e => setFormData({ ...formData, subject: e.target.value })}
              required
              placeholder="e.g. Mathematics, Physics, Hindi"
            />
          </label>

          <label>
            Month / Term *
            <select
              value={formData.month}
              onChange={e => setFormData({ ...formData, month: e.target.value })}
              required
            >
              <option value="">-- Select Month / Term --</option>
              {monthsList.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </label>

          <label>
            Assessment / Exam
            <select
              value={formData.assessment}
              onChange={e => setFormData({ ...formData, assessment: e.target.value })}
            >
              <option value="">-- Select Assessment / Exam --</option>
              {assessmentList.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </label>

          <label className="full-label">
            Chapter / Title (English) *
            <input
              value={formData.chapter}
              onChange={e => setFormData({ ...formData, chapter: e.target.value })}
              required
              placeholder="e.g. Chapter 1: Real Numbers"
            />
          </label>

          <label className="full-label">
            Chapter / Title (Hindi - Optional)
            <input
              value={formData.hindi}
              onChange={e => setFormData({ ...formData, hindi: e.target.value })}
              placeholder="e.g. पाठ 1: वास्तविक संख्याएँ"
            />
          </label>

          <label className="full-label">
            Detailed Syllabus / Topics
            <textarea
              rows={3}
              value={formData.topic}
              onChange={e => setFormData({ ...formData, topic: e.target.value })}
              placeholder="Enter topics, theory concepts, learning objectives..."
              style={{
                width: '100%',
                border: '1px solid #dce5f0',
                borderRadius: 7,
                padding: '10px 12px',
                font: 'inherit',
                fontSize: 12,
                outlineColor: '#2670cd',
                resize: 'vertical'
              }}
            />
          </label>

          <label className="full-label">
            Practical Work / Lab Experiments (Optional)
            <input
              value={formData.practical}
              onChange={e => setFormData({ ...formData, practical: e.target.value })}
              placeholder="e.g. Lab experiment 1, Viva topics, Practical record work"
            />
          </label>

          <label className="full-label">
            Project Work / Student Assignments (Optional)
            <input
              value={formData.project}
              onChange={e => setFormData({ ...formData, project: e.target.value })}
              placeholder="e.g. Science project model, Scrapbook, Presentation topic"
            />
          </label>

          <label>
            Status *
            <select
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value })}
              required
            >
              {statusValues.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>

          <label>
            Remarks (Optional)
            <input
              value={formData.remarks}
              onChange={e => setFormData({ ...formData, remarks: e.target.value })}
              placeholder="e.g. Extra classes required"
            />
          </label>

          <div style={{ gridColumn: '1/-1', display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8, paddingTop: 14, borderTop: '1px solid #e2e8f0' }}>
            <button type="button" className="secondary" onClick={close} disabled={busy}>
              Cancel
            </button>
            <button type="submit" className="primary" disabled={busy} style={{ minWidth: 140, background: '#2563eb' }}>
              {busy ? <><Icons.LoaderCircle className="spin" size={15} /> Adding Record…</> : <><Icons.PlusCircle size={16} /> Add Record</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EditSyllabusModal({ topic, close, dbClasses, schoolClasses = [], reload, setTopics, onSuccess }) {
  const [formData, setFormData] = useState({
    id: topic.id,
    className: topic.className || 'Class 1',
    section: topic.section || 'A',
    subject: topic.subject || 'General',
    month: topic.month || 'Apr - July',
    assessment: topic.assessment || 'PA 1',
    chapter: topic.chapter || '',
    hindi: topic.hindi || '',
    topic: topic.topic || '',
    practical: topic.practical || '',
    project: topic.project || '',
    status: topic.status || 'Not Done',
    remarks: topic.remarks || ''
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const monthsList = [
    'Apr - July', 'Aug - Oct', 'Nov - Dec', 'Jan - Feb',
    'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March'
  ];

  const assessmentList = [
    'PA 1', 'Half Yearly', 'PA 2', 'Annual', 'UT 1', 'UT 2', 'UT 3', 'UT 4', 'Pre-Board', 'Unit Test'
  ];

  const classList = schoolClasses.length ? schoolClasses.map(c => c.name) : [
    'Nursery', 'LKG', 'UKG',
    'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8',
    'Class 9', 'Class 10', 'Class 11', 'Class 12'
  ];

  const selectedClassObj = schoolClasses.find(c => c.name === formData.className);
  const sectionList = (selectedClassObj && selectedClassObj.sections && selectedClassObj.sections.length)
    ? selectedClassObj.sections
    : ['A', 'B', 'C', 'D', 'E'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      if (supabase && formData.id && !String(formData.id).startsWith('custom-')) {
        let subjectId = null;
        if (formData.subject) {
          let sRes = await supabase.from('subjects').select('id').eq('subject_name', formData.subject).maybeSingle();
          if (sRes.error) throw sRes.error;
          if (!sRes.data) {
            let created = await supabase.from('subjects').insert({ subject_name: formData.subject }).select('id').single();
            if (created.error) throw created.error;
            subjectId = created.data.id;
          } else {
            subjectId = sRes.data.id;
          }
        }

        let classId = null;
        if (formData.className) {
          let cRes = await supabase.from('classes').select('id').eq('class_name', formData.className).maybeSingle();
          if (!cRes.error && cRes.data) {
            classId = cRes.data.id;
          }
        }

        const payload = {
          month: formData.month,
          unit_chapter_en: formData.chapter,
          unit_chapter_hi: formData.hindi || null,
          topic_en: formData.topic || null,
          assessment_en: formData.assessment || null,
          status: formData.status,
          practical: formData.practical?.trim() || null,
          project: formData.project?.trim() || null,
          remarks: formData.remarks || null,
          ...(subjectId ? { subject_id: subjectId } : {}),
          ...(classId ? { class_id: classId } : {})
        };

        const { error: upErr } = await supabase.from('syllabus_topics').update(payload).eq('id', formData.id);
        if (upErr) throw upErr;
      }

      const updatedItem = {
        ...formData,
        group: getClassGroup(formData.className)
      };

      setTopics(prev => prev.map(t => t.id === formData.id ? { ...t, ...updatedItem } : t));

      if (reload) await reload();
      onSuccess?.('✨ Congratulations! Syllabus record updated successfully!');
      close();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to update record.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={close}>
      <div className="modal" style={{ maxWidth: 620, maxHeight: '90vh', overflowY: 'auto', padding: 26 }} onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={close}><Icons.X size={18} /></button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
          <div style={{ width: 40, height: 40, background: '#eff6ff', color: '#1d4ed8', borderRadius: 10, display: 'grid', placeItems: 'center' }}>
            <Icons.Pencil size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: 18, margin: 0, color: '#0f172a' }}>Edit Syllabus Record</h2>
            <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0' }}>Update class, chapter, description, or status</p>
          </div>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '10px 14px', borderRadius: 8, fontSize: 12, marginBottom: 15 }}>
            <Icons.AlertTriangle size={15} style={{ verticalAlign: 'middle', marginRight: 6 }}/>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="form-grid" style={{ gap: 15 }}>
          <label>
            Class *
            <select
              value={formData.className}
              onChange={e => setFormData({ ...formData, className: e.target.value })}
              required
            >
              {classList.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>

          <label>
            Section *
            <select
              value={formData.section}
              onChange={e => setFormData({ ...formData, section: e.target.value })}
              required
            >
              {sectionList.map(s => <option key={s} value={s}>Section {s}</option>)}
            </select>
          </label>

          <label>
            Subject *
            <input
              value={formData.subject}
              onChange={e => setFormData({ ...formData, subject: e.target.value })}
              required
              placeholder="e.g. Hindi, Math, English"
            />
          </label>

          <label>
            Month / Term *
            <input
              list="edit-month-options"
              value={formData.month}
              onChange={e => setFormData({ ...formData, month: e.target.value })}
              required
              placeholder="e.g. Apr - July, August"
            />
            <datalist id="edit-month-options">
              {monthsList.map(m => <option key={m} value={m} />)}
            </datalist>
          </label>

          <label>
            Assessment / Exam
            <input
              list="edit-exam-options"
              value={formData.assessment}
              onChange={e => setFormData({ ...formData, assessment: e.target.value })}
              placeholder="e.g. PA 1, Half Yearly, Annual"
            />
            <datalist id="edit-exam-options">
              {assessmentList.map(a => <option key={a} value={a} />)}
            </datalist>
          </label>

          <label className="full-label">
            Chapter / Title (English) *
            <input
              value={formData.chapter}
              onChange={e => setFormData({ ...formData, chapter: e.target.value })}
              required
              placeholder="e.g. Chapter 1: Number System"
            />
          </label>

          <label className="full-label">
            Chapter / Title (Hindi - Optional)
            <input
              value={formData.hindi}
              onChange={e => setFormData({ ...formData, hindi: e.target.value })}
              placeholder="e.g. पाठ 1: संख्या पद्धति"
            />
          </label>

          <label className="full-label">
            Detailed Syllabus / Topics
            <textarea
              rows={4}
              value={formData.topic}
              onChange={e => setFormData({ ...formData, topic: e.target.value })}
              placeholder="Enter topics, detailed syllabus, activities..."
              style={{
                width: '100%',
                border: '1px solid #dce5f0',
                borderRadius: 7,
                padding: '10px 12px',
                font: 'inherit',
                fontSize: 12,
                outlineColor: '#2670cd',
                resize: 'vertical'
              }}
            />
          </label>

          <label className="full-label">
            Practical Work / Lab Experiments (Optional)
            <input
              value={formData.practical}
              onChange={e => setFormData({ ...formData, practical: e.target.value })}
              placeholder="e.g. Lab experiment 1, Viva topics, Practical record work"
              style={{
                width: '100%',
                border: '1.5px solid #2563eb',
                borderRadius: 7,
                padding: '10px 12px',
                font: 'inherit',
                fontSize: 12,
                outlineColor: '#2563eb',
                background: '#f8fafc'
              }}
            />
          </label>

          <label className="full-label">
            Project Work / Student Assignments (Optional)
            <input
              value={formData.project}
              onChange={e => setFormData({ ...formData, project: e.target.value })}
              placeholder="e.g. Science project model, Scrapbook, Presentation topic"
              style={{
                width: '100%',
                border: '1.5px solid #2563eb',
                borderRadius: 7,
                padding: '10px 12px',
                font: 'inherit',
                fontSize: 12,
                outlineColor: '#2563eb',
                background: '#f8fafc'
              }}
            />
          </label>

          <label>
            Status *
            <select
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value })}
              required
            >
              {statusValues.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>

          <label>
            Remarks (Optional)
            <input
              value={formData.remarks}
              onChange={e => setFormData({ ...formData, remarks: e.target.value })}
              placeholder="e.g. Completed with revision"
            />
          </label>

          <div style={{ gridColumn: '1/-1', display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8, paddingTop: 14, borderTop: '1px solid #e2e8f0' }}>
            <button type="button" className="secondary" onClick={close} disabled={busy}>
              Cancel
            </button>
            <button type="submit" className="primary" disabled={busy} style={{ minWidth: 120 }}>
              {busy ? <><Icons.LoaderCircle className="spin" size={15} /> Saving…</> : <><Icons.Check size={16} /> Save Changes</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CardTitle({title,subtitle,action}){return <div className="card-title"><div><h2>{title}</h2><p>{subtitle}</p></div>{action&&<button className="text-btn">{action} <Icons.ArrowRight size={16}/></button>}</div>}
function TopicTable({title,data=seed}){return <section className="card table-card"><CardTitle title={title} subtitle={`${data.length} topics`}/><div className="table-wrap"><table><thead><tr><th>Subject</th><th>Month</th><th>Chapter / Topic</th><th>Status</th></tr></thead><tbody>{data.slice(0,5).map(x=><tr key={x.id}><td><b>{x.subject}</b></td><td>{x.month}</td><td>{x.chapter}</td><td><Status value={x.status}/></td></tr>)}</tbody></table></div></section>}
const classGroups={preprimary:{label:'Nursery / LKG / UKG',classes:['Nursery','LKG','UKG']},primary:{label:'1st To 8th',classes:['Class 1','Class 2','Class 3','Class 4','Class 5','Class 6','Class 7','Class 8']},senior:{label:'9th To 12th',classes:['Class 9','Class 10','Class 11','Class 12']}}

function PasswordDeleteModal({ title, itemDescription, user, close, onConfirm }) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const handleConfirm = async (e) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Please enter your password to authorize deletion.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      if (supabase && user && user.email) {
        const { error: authErr } = await supabase.auth.signInWithPassword({
          email: user.email,
          password: password.trim()
        });
        if (authErr) {
          throw new Error('Incorrect password! Security authorization failed.');
        }
      } else {
        if (password.trim().length < 3) {
          throw new Error('Incorrect password! Minimum 3 characters required.');
        }
      }

      await onConfirm();
      close();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Password verification failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={close} style={{ zIndex: 99999 }}>
      <div
        className="modal"
        style={{
          maxWidth: 480,
          padding: 28,
          borderRadius: 16,
          boxShadow: '0 25px 50px -12px rgba(220, 38, 38, 0.25), 0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          border: '1.5px solid #fecaca',
          background: '#ffffff'
        }}
        onClick={e => e.stopPropagation()}
      >
        <button className="modal-close" onClick={close}><Icons.X size={18} /></button>

        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div
            style={{
              width: 58,
              height: 58,
              background: '#fef2f2',
              color: '#dc2626',
              borderRadius: '50%',
              display: 'grid',
              placeItems: 'center',
              margin: '0 auto 14px',
              border: '2px solid #fecaca',
              boxShadow: '0 4px 12px rgba(220, 38, 38, 0.15)'
            }}
          >
            <Icons.ShieldAlert size={30} />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 6px', color: '#991b1b' }}>
            {title || 'Security Password Authorization'}
          </h2>
          <p style={{ fontSize: 13, color: '#475569', margin: 0, lineHeight: 1.5 }}>
            To delete <b>{itemDescription}</b>, enter your login password to confirm this action.
          </p>
        </div>

        {error && (
          <div
            style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#b91c1c',
              padding: '11px 14px',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <Icons.AlertTriangle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleConfirm} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>
            Login Password *
            <div style={{ marginTop: 6, position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password to delete..."
                style={{
                  width: '100%',
                  padding: '10px 42px 10px 12px',
                  borderRadius: 8,
                  border: '1px solid #cbd5e1',
                  fontSize: 13,
                  outlineColor: '#dc2626'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: 10,
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer',
                  padding: 4,
                  display: 'grid',
                  placeItems: 'center'
                }}
              >
                {showPassword ? <Icons.EyeOff size={16} /> : <Icons.Eye size={16} />}
              </button>
            </div>
          </label>

          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button
              type="button"
              className="secondary"
              onClick={close}
              disabled={busy}
              style={{ flex: 1, padding: '10px 14px', fontWeight: 600 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              style={{
                flex: 1,
                padding: '10px 14px',
                background: '#dc2626',
                color: '#ffffff',
                border: 'none',
                borderRadius: 8,
                fontWeight: 700,
                fontSize: 13,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 7,
                boxShadow: '0 4px 10px rgba(220, 38, 38, 0.2)'
              }}
            >
              {busy ? (
                <><Icons.LoaderCircle className="spin" size={16} /> Verifying Password…</>
              ) : (
                <><Icons.Trash2 size={16} /> Confirm & Delete</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function PrincipalChecklistModal({ data, filters, close }) {
  const [statusFilter, setStatusFilter] = useState('PENDING'); // 'PENDING', 'ALL', 'IN_PROGRESS', 'NOT_DONE'
  const schoolName = 'SAVITRI BALIKA INTER COLLEGE';
  const schoolAddress = 'KHUTAHA, ROAD JAMUANHIYA MIRZAPUR';
  const reportTitle = "PRINCIPAL'S SYLLABUS MONITORING & INSPECTION CHECKLIST";

  const filteredData = useMemo(() => {
    if (statusFilter === 'PENDING') {
      return data.filter(x => x.status === 'In Progress' || x.status === 'Not Done');
    }
    if (statusFilter === 'IN_PROGRESS') {
      return data.filter(x => x.status === 'In Progress');
    }
    if (statusFilter === 'NOT_DONE') {
      return data.filter(x => x.status === 'Not Done');
    }
    return data; // 'ALL'
  }, [data, statusFilter]);

  const stats = useMemo(() => {
    const total = data.length;
    const doneCount = data.filter(x => x.status === 'Done').length;
    const inProgressCount = data.filter(x => x.status === 'In Progress').length;
    const notDoneCount = data.filter(x => x.status === 'Not Done').length;
    const pendingTotal = inProgressCount + notDoneCount;
    const progressPct = total ? Math.round((doneCount / total) * 100) : 0;
    return { total, doneCount, inProgressCount, notDoneCount, pendingTotal, progressPct };
  }, [data]);

  const currentDateStr = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const handleOpenInNewTab = () => {
    const activeLogoUrl = (() => {
      try {
        const direct = localStorage.getItem('school_logo_custom') || JSON.parse(localStorage.getItem('school_profile_settings') || '{}').logoUrl;
        if (direct) return direct;
      } catch(e) {}
      return window.location.origin + '/school-logo.png';
    })();

    const escapeHtml = (str) => {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    };

    const rowsHtml = filteredData.map((x, idx) => {
      const isDone = x.status === 'Done';
      const isInProgress = x.status === 'In Progress';
      const statusBg = isDone ? '#e6f9ed' : isInProgress ? '#fff5d4' : '#fde8ea';
      const statusColor = isDone ? '#19743c' : isInProgress ? '#986900' : '#b32e35';
      const sectionText = x.section ? `<span style="display:block;font-size:9px;color:#2563eb;font-weight:700;">Sec ${escapeHtml(x.section)}</span>` : '';
      const assessmentText = x.assessment ? `<span style="display:block;font-size:9px;color:#64748b;font-weight:600;">${escapeHtml(x.assessment)}</span>` : '';

      return `
        <tr>
          <td style="text-align:center;font-weight:700;font-size:11px;">${idx + 1}</td>
          <td style="font-size:11px;font-weight:700;">${escapeHtml(x.className || '')}${sectionText}</td>
          <td style="font-size:11px;font-weight:700;">${escapeHtml(x.subject || '')}</td>
          <td style="font-size:10px;">${escapeHtml(x.month || '')}${assessmentText}</td>
          <td style="font-size:11px;">
            <div style="font-weight:700;color:#0f172a;margin-bottom:3px;">${escapeHtml(x.chapter || '')}</div>
            <div style="font-size:10px;color:#334155;white-space:pre-line;line-height:1.35;">${escapeHtml(x.topic || '')}</div>
          </td>
          <td style="text-align:center;">
            <span style="display:inline-block;padding:3px 7px;border-radius:4px;font-size:9.5px;font-weight:800;background:${statusBg};color:${statusColor};border:1px solid ${statusColor}55;">
              ${escapeHtml(x.status || 'Not Done')}
            </span>
          </td>
          <td style="text-align:center;vertical-align:middle;">
            <div style="width:16px;height:16px;border:1.5px solid #475569;border-radius:3px;margin:0 auto;"></div>
          </td>
          <td style="vertical-align:bottom;padding-bottom:6px;">
            <div style="border-bottom:1px dotted #94a3b8;min-height:18px;"></div>
          </td>
        </tr>
        ${x.practical ? `
        <tr style="background:#f0fdf4;">
          <td style="text-align:center;font-weight:700;font-size:10px;">${idx + 1}P</td>
          <td style="font-size:10px;font-weight:700;">${escapeHtml(x.className || '')}${sectionText}</td>
          <td style="font-size:10px;font-weight:700;">${escapeHtml(x.subject || '')}</td>
          <td style="font-size:10px;">${escapeHtml(x.month || '')}${assessmentText}</td>
          <td style="font-size:11px;"><div style="font-weight:800;color:#166534;margin-bottom:3px;">🧪 Practical</div><div style="white-space:pre-line;line-height:1.35;color:#14532d;">${escapeHtml(x.practical)}</div></td>
          <td style="text-align:center;"><span style="display:inline-block;padding:3px 7px;border-radius:4px;font-size:9.5px;font-weight:800;background:${statusBg};color:${statusColor};border:1px solid ${statusColor}55;">${escapeHtml(x.status || 'Not Done')}</span></td>
          <td style="text-align:center;vertical-align:middle;"><div style="width:16px;height:16px;border:1.5px solid #475569;border-radius:3px;margin:0 auto;"></div></td>
          <td style="vertical-align:bottom;padding-bottom:6px;"><div style="border-bottom:1px dotted #94a3b8;min-height:18px;"></div></td>
        </tr>` : ''}
        ${x.project ? `
        <tr style="background:#f8fafc;">
          <td style="text-align:center;font-weight:700;font-size:10px;">${idx + 1}Prj</td>
          <td style="font-size:10px;font-weight:700;">${escapeHtml(x.className || '')}${sectionText}</td>
          <td style="font-size:10px;font-weight:700;">${escapeHtml(x.subject || '')}</td>
          <td style="font-size:10px;">${escapeHtml(x.month || '')}${assessmentText}</td>
          <td style="font-size:11px;"><div style="font-weight:800;color:#1e40af;margin-bottom:3px;">📁 Project Work</div><div style="white-space:pre-line;line-height:1.35;color:#1e293b;">${escapeHtml(x.project)}</div></td>
          <td style="text-align:center;"><span style="display:inline-block;padding:3px 7px;border-radius:4px;font-size:9.5px;font-weight:800;background:${statusBg};color:${statusColor};border:1px solid ${statusColor}55;">${escapeHtml(x.status || 'Not Done')}</span></td>
          <td style="text-align:center;vertical-align:middle;"><div style="width:16px;height:16px;border:1.5px solid #475569;border-radius:3px;margin:0 auto;"></div></td>
          <td style="vertical-align:bottom;padding-bottom:6px;"><div style="border-bottom:1px dotted #94a3b8;min-height:18px;"></div></td>
        </tr>` : ''}
      `;
    }).join('');

    const filterSummaryClass = filters.className === 'ALL' ? 'All Classes' : (filters.className || 'Not Selected') + ' (' + (filters.group === 'preprimary' ? 'Nursery-UKG' : filters.group === 'primary' ? '1st-8th' : '9th-12th') + ')';
    const filterSummarySection = filters.sectionName === 'ALL' ? 'All Sections' : (filters.sectionName ? `Section ${filters.sectionName}` : 'All');
    const filterSummarySubject = filters.subjectName === 'ALL' || !filters.subjectName ? 'All Subjects' : filters.subjectName;
    const filterScopeText = statusFilter === 'PENDING' ? 'Pending & In-Progress Only' : statusFilter === 'ALL' ? 'All Topics' : statusFilter;

    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Principal Inspection Checklist - ${escapeHtml(schoolName)}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
    
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Poppins', Arial, sans-serif;
      background: #f1f5f9;
      color: #0f172a;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    .top-action-bar {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: #0b4388;
      color: #ffffff;
      padding: 12px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    .top-action-bar .btn-print {
      background: #dc2626;
      color: white;
      border: none;
      padding: 10px 22px;
      font-size: 14px;
      font-weight: 700;
      border-radius: 8px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 2px 6px rgba(220,38,38,0.4);
      transition: all 0.2s;
    }
    .top-action-bar .btn-print:hover {
      background: #b91c1c;
      transform: translateY(-1px);
    }
    .top-action-bar .btn-close {
      background: rgba(255,255,255,0.15);
      color: white;
      border: 1px solid rgba(255,255,255,0.3);
      padding: 8px 16px;
      font-size: 13px;
      font-weight: 600;
      border-radius: 6px;
      cursor: pointer;
    }
    .top-action-bar .btn-close:hover {
      background: rgba(255,255,255,0.25);
    }

    .page-wrapper {
      max-width: 1060px;
      margin: 24px auto;
      background: #ffffff;
      padding: 32px 30px;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    }

    .school-header {
      text-align: center;
      border-bottom: 2.5px solid #0b4388;
      padding-bottom: 12px;
      margin-bottom: 16px;
    }
    .school-title {
      font-size: 24px;
      font-weight: 900;
      color: #0b4388;
      text-transform: uppercase;
      letter-spacing: 0.8px;
    }
    .school-subtitle {
      font-size: 11px;
      font-weight: 700;
      color: #475569;
      margin-top: 3px;
    }
    .report-title {
      font-size: 14px;
      font-weight: 800;
      color: #dc2626;
      margin-top: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .meta-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      background: #f8fafc;
      padding: 12px 14px;
      border-radius: 6px;
      border: 1px solid #e2e8f0;
      margin-bottom: 18px;
      font-size: 11px;
    }
    .meta-grid b { color: #475569; }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 11px;
      page-break-inside: auto;
      table-layout: fixed;
    }
    thead {
      display: table-header-group;
    }
    tr {
      page-break-inside: avoid;
      page-break-after: auto;
    }
    th {
      background: #f1f5f9 !important;
      color: #0f172a;
      font-weight: 700;
      padding: 8px 6px;
      border: 1px solid #cbd5e1;
      text-align: left;
      font-size: 10.5px;
    }
    td {
      padding: 8px 6px;
      border: 1px solid #cbd5e1;
      vertical-align: top;
      word-wrap: break-word;
    }

    .signatures-section {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
      margin-top: 36px;
      padding-top: 18px;
      border-top: 1.5px solid #cbd5e1;
      page-break-inside: avoid;
    }
    .sig-block {
      text-align: center;
    }
    .sig-line {
      border-bottom: 1.5px dashed #64748b;
      height: 36px;
      width: 80%;
      margin: 0 auto 8px;
    }
    .sig-title {
      font-size: 11px;
      font-weight: 700;
      color: #0f172a;
    }
    .sig-sub {
      font-size: 9.5px;
      color: #64748b;
      margin-top: 2px;
    }

    @media print {
      @page {
        size: A4 portrait;
        margin: 10mm 8mm;
      }
      body {
        background: #ffffff;
      }
      .top-action-bar {
        display: none !important;
      }
      .page-wrapper {
        margin: 0 !important;
        padding: 0 !important;
        box-shadow: none !important;
        max-width: 100% !important;
      }
      th {
        background: #f1f5f9 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .meta-grid {
        background: #f8fafc !important;
        border: 1px solid #cbd5e1 !important;
      }
    }
  </style>
</head>
<body>
  <div class="top-action-bar">
    <div style="display:flex;align-items:center;gap:12px;">
      <span style="font-size:22px;">📄</span>
      <div>
        <div style="font-weight:700;font-size:15px;">Inspection Checklist (A4 Full View)</div>
        <div style="font-size:11px;opacity:0.85;">Pehle yahan pura report verify karein, fir Print button dabayein ya <b>Ctrl + P / Cmd + P</b> karein</div>
      </div>
    </div>
    <div style="display:flex;gap:12px;align-items:center;">
      <button class="btn-print" onclick="window.print()">
        🖨️ Print / Save as PDF (Ctrl + P)
      </button>
      <button class="btn-close" onclick="window.close()">
        ✕ Close Tab
      </button>
    </div>
  </div>

  <div class="page-wrapper">
    <div class="school-header">
      <div style="display:flex;align-items:center;justify-content:center;gap:14px;margin-bottom:6px;">
        <img src="${activeLogoUrl}" alt="School Logo" style="width:58px;height:58px;border-radius:50%;object-fit:cover;background:#ffffff;border:1.5px solid #0b4388;box-shadow:0 2px 6px rgba(0,0,0,0.08);" onerror="this.src='/school-logo.png'" />
        <div style="text-align:left;">
          <div class="school-title">${escapeHtml(schoolName)}</div>
          <div class="school-subtitle">📍 ADDRESS: ${escapeHtml(schoolAddress)}</div>
        </div>
      </div>
      <div class="report-title">${escapeHtml(reportTitle)}</div>
    </div>

    <div class="meta-grid">
      <div><b>Class & Group:</b> <span style="font-weight:700;">${escapeHtml(filterSummaryClass)}</span></div>
      <div><b>Section:</b> <span style="color:#2563eb;font-weight:700;">${escapeHtml(filterSummarySection)}</span></div>
      <div><b>Subject:</b> <span style="font-weight:700;">${escapeHtml(filterSummarySubject)}</span></div>
      <div><b>Exam Pattern:</b> <span style="font-weight:700;">${escapeHtml(filters.exam || 'ALL')}</span></div>
      <div><b>Inspection Date:</b> <span style="font-weight:700;">${escapeHtml(currentDateStr)}</span></div>
      <div><b>Filter Scope:</b> <span style="color:${statusFilter === 'PENDING' ? '#dc2626' : '#0f172a'};font-weight:700;">${escapeHtml(filterScopeText)}</span></div>
      <div><b>Pending Topics:</b> <span style="color:#dc2626;font-weight:800;">${stats.pendingTotal} items</span></div>
      <div><b>Completed:</b> <span style="color:#166534;font-weight:800;">${stats.doneCount} / ${stats.total} (${stats.progressPct}%)</span></div>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width:36px;text-align:center;">S.N.</th>
          <th style="width:75px;">Class/Sec</th>
          <th style="width:90px;">Subject</th>
          <th style="width:85px;">Month/Term</th>
          <th>Chapter & Detailed Syllabus</th>
          <th style="width:90px;text-align:center;">Status</th>
          <th style="width:48px;text-align:center;">Check</th>
          <th style="width:145px;">Principal Remarks</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml || '<tr><td colspan="8" style="text-align:center;padding:24px;color:#64748b;">No records match selected filter</td></tr>'}
      </tbody>
    </table>

    <div class="signatures-section">
      <div class="sig-block">
        <div class="sig-line"></div>
        <div class="sig-title">Subject Teacher Signature</div>
        <div class="sig-sub">Date: ____/____/2026</div>
      </div>
      <div class="sig-block">
        <div class="sig-line"></div>
        <div class="sig-title">Academic Coordinator</div>
        <div class="sig-sub">Savitri School</div>
      </div>
      <div class="sig-block">
        <div class="sig-line"></div>
        <div class="sig-title" style="color:#dc2626;">Principal Seal & Signature</div>
        <div class="sig-sub">Status Approved / Verified</div>
      </div>
    </div>
  </div>
</body>
</html>`;

    try {
      const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
      const blobUrl = URL.createObjectURL(blob);
      const printWindow = window.open(blobUrl, '_blank');
      if (!printWindow) {
        const link = document.createElement('a');
        link.href = blobUrl;
        link.target = '_blank';
        link.rel = 'noopener,noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (e) {
      console.error('Error creating print blob:', e);
      // Fallback
      const fallbackWin = window.open('', '_blank');
      if (fallbackWin) {
        fallbackWin.document.open();
        fallbackWin.document.write(fullHtml);
        fallbackWin.document.close();
      }
    }
  };

  return (
    <div className="modal-backdrop principal-print-backdrop" onClick={close} style={{ zIndex: 99999 }}>
      <div
        className="modal"
        style={{
          maxWidth: 980,
          width: '95%',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          padding: 24,
          borderRadius: 16,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          background: '#ffffff',
          overflow: 'hidden'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Control Toolbar (Hidden during print) */}
        <div className="print-no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 14, borderBottom: '1px solid #e2e8f0', marginBottom: 14, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <span style={{ fontSize: 10, letterSpacing: 1.2, fontWeight: 700, color: '#dc2626', textTransform: 'uppercase' }}>
              🖨️ Principal Inspection Checklist
            </span>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '3px 0 0' }}>
              A4 Ready-to-Print Inspection PDF Report
            </h2>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button
              type="button"
              className="primary"
              onClick={handleOpenInNewTab}
              style={{ background: '#dc2626', borderColor: '#b91c1c', display: 'inline-flex', gap: 8, alignItems: 'center', padding: '10px 18px', fontWeight: 700, borderRadius: 8, cursor: 'pointer' }}
            >
              <Icons.Printer size={18} /> Open in New Tab & Print (Ctrl + P)
            </button>
            <button className="modal-close" onClick={close} style={{ position: 'relative', right: 0, top: 0 }}>
              <Icons.X size={20} />
            </button>
          </div>
        </div>

        {/* Filter Toolbar (Hidden during print) */}
        <div className="print-no-print" style={{ background: '#f8fafc', padding: 12, borderRadius: 10, border: '1px solid #e2e8f0', marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#334155', marginRight: 4 }}>Filter Status:</span>
            <button
              type="button"
              className={statusFilter === 'PENDING' ? 'primary' : 'secondary'}
              onClick={() => setStatusFilter('PENDING')}
              style={{ padding: '6px 12px', fontSize: 11, borderRadius: 6, background: statusFilter === 'PENDING' ? '#dc2626' : undefined, color: statusFilter === 'PENDING' ? '#fff' : undefined }}
            >
              🔴 In-Progress & Pending Only ({stats.pendingTotal})
            </button>
            <button
              type="button"
              className={statusFilter === 'ALL' ? 'primary' : 'secondary'}
              onClick={() => setStatusFilter('ALL')}
              style={{ padding: '6px 12px', fontSize: 11, borderRadius: 6 }}
            >
              🔵 All Topics ({stats.total})
            </button>
            <button
              type="button"
              className={statusFilter === 'IN_PROGRESS' ? 'primary' : 'secondary'}
              onClick={() => setStatusFilter('IN_PROGRESS')}
              style={{ padding: '6px 12px', fontSize: 11, borderRadius: 6 }}
            >
              🟡 In-Progress Only ({stats.inProgressCount})
            </button>
            <button
              type="button"
              className={statusFilter === 'NOT_DONE' ? 'primary' : 'secondary'}
              onClick={() => setStatusFilter('NOT_DONE')}
              style={{ padding: '6px 12px', fontSize: 11, borderRadius: 6 }}
            >
              ⚪ Not Done Only ({stats.notDoneCount})
            </button>
          </div>
          <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>
            Showing <b>{filteredData.length}</b> inspection items
          </span>
        </div>

        {/* Scrollable Document Preview Container */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: 4 }}>
          {/* A4 Document Printable Area */}
          <div className="principal-print-area" style={{ background: '#ffffff', color: '#0f172a', padding: '24px 20px', border: '1px solid #cbd5e1', borderRadius: 8 }}>
            
            {/* Header Section */}
            <div style={{ textAlign: 'center', borderBottom: '2.5px solid #0f172a', paddingBottom: 10, marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 4 }}>
                <SchoolLogo size={52} style={{ border: '1.5px solid #0b4388', padding: 2, background: '#ffffff', boxShadow: '0 2px 6px rgba(0,0,0,0.08)' }} />
                <div style={{ textAlign: 'left' }}>
                  <h1 style={{ fontSize: 20, fontWeight: 900, color: '#0b4388', margin: 0, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                    {schoolName}
                  </h1>
                  <p style={{ fontSize: 10, fontWeight: 700, color: '#475569', margin: '2px 0 0', letterSpacing: 0.4 }}>
                    📍 ADDRESS: {schoolAddress}
                  </p>
                </div>
              </div>
              <h2 style={{ fontSize: 13, fontWeight: 800, color: '#dc2626', margin: '6px 0 0', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {reportTitle}
              </h2>
            </div>

            {/* Filter Meta Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, background: '#f8fafc', padding: 10, borderRadius: 6, border: '1px solid #e2e8f0', marginBottom: 14, fontSize: 11 }}>
              <div><b style={{ color: '#475569' }}>Class & Group:</b> <span style={{ color: '#0f172a', fontWeight: 700 }}>{filters.className === 'ALL' ? 'All Classes' : (filters.className || 'Not Selected')} ({filters.group === 'preprimary' ? 'Nursery-UKG' : filters.group === 'primary' ? '1st-8th' : '9th-12th'})</span></div>
              <div><b style={{ color: '#475569' }}>Section:</b> <span style={{ color: '#2563eb', fontWeight: 700 }}>{filters.sectionName === 'ALL' ? 'All Sections' : (filters.sectionName ? `Section ${filters.sectionName}` : 'All')}</span></div>
              <div><b style={{ color: '#475569' }}>Subject:</b> <span style={{ color: '#0f172a', fontWeight: 700 }}>{filters.subjectName === 'ALL' || !filters.subjectName ? 'All Subjects' : filters.subjectName}</span></div>
              <div><b style={{ color: '#475569' }}>Exam Pattern:</b> <span style={{ color: '#0f172a', fontWeight: 700 }}>{filters.exam || 'ALL'}</span></div>
              <div><b style={{ color: '#475569' }}>Inspection Date:</b> <span style={{ color: '#0f172a', fontWeight: 700 }}>{currentDateStr}</span></div>
              <div><b style={{ color: '#475569' }}>Filter Scope:</b> <span style={{ color: statusFilter === 'PENDING' ? '#dc2626' : '#0f172a', fontWeight: 700 }}>{statusFilter === 'PENDING' ? 'Pending & In-Progress Only' : statusFilter}</span></div>
              <div><b style={{ color: '#475569' }}>Pending Topics:</b> <span style={{ color: '#dc2626', fontWeight: 800 }}>{stats.pendingTotal} items</span></div>
              <div><b style={{ color: '#475569' }}>Completed:</b> <span style={{ color: '#166534', fontWeight: 800 }}>{stats.doneCount} / {stats.total} ({stats.progressPct}%)</span></div>
            </div>

            {/* A4 Inspection Table */}
            {filteredData.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px 10px', color: '#64748b', border: '1px dashed #cbd5e1', borderRadius: 6, fontSize: 13 }}>
                🎉 <b>No syllabus records match the selected inspection criteria!</b>
              </div>
            ) : (
              <table className="principal-print-table" style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 20 }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', color: '#0f172a' }}>
                    <th style={{ width: '36px', textAlign: 'center' }}>S.N.</th>
                    <th style={{ width: '70px' }}>Class/Sec</th>
                    <th style={{ width: '85px' }}>Subject</th>
                    <th style={{ width: '80px' }}>Month/Term</th>
                    <th>Chapter & Detailed Syllabus</th>
                    <th style={{ width: '85px', textAlign: 'center' }}>Status</th>
                    <th style={{ width: '45px', textAlign: 'center' }}>Check</th>
                    <th style={{ width: '140px' }}>Principal Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((x, idx) => {
                    const isDone = x.status === 'Done';
                    const isInProgress = x.status === 'In Progress';
                    const statusBg = isDone ? '#e6f9ed' : isInProgress ? '#fff5d4' : '#fde8ea';
                    const statusColor = isDone ? '#19743c' : isInProgress ? '#986900' : '#b32e35';

                    return (
                      <tr key={x.id || idx}>
                        <td style={{ textAlign: 'center', fontWeight: 700, fontSize: 10 }}>{idx + 1}</td>
                        <td style={{ fontSize: 11, fontWeight: 700 }}>
                          {x.className}
                          {x.section && <div style={{ fontSize: 9, color: '#2563eb' }}>Sec {x.section}</div>}
                        </td>
                        <td style={{ fontSize: 11, fontWeight: 700 }}>{x.subject}</td>
                        <td style={{ fontSize: 10 }}>
                          {x.month}
                          {x.assessment && <div style={{ fontSize: 9, color: '#64748b' }}>{x.assessment}</div>}
                        </td>
                        <td style={{ fontSize: 11 }}>
                          <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: 2 }}>{x.chapter}</div>
                          <div style={{ fontSize: 10, color: '#334155', whiteSpace: 'pre-line', lineHeight: 1.3 }}>{x.topic}</div>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '3px 6px',
                              borderRadius: 4,
                              fontSize: 9,
                              fontWeight: 800,
                              background: statusBg,
                              color: statusColor,
                              border: `1px solid ${statusColor}44`
                            }}
                          >
                            {x.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                          <div style={{ width: 16, height: 16, border: '1.5px solid #475569', borderRadius: 3, margin: '0 auto' }} />
                        </td>
                        <td style={{ verticalAlign: 'bottom', paddingBottom: 4 }}>
                          <div style={{ borderBottom: '1px dotted #94a3b8', minHeight: 18 }} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

            {/* Printable Footer Signatures Section */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginTop: 30, paddingTop: 16, borderTop: '1.5px solid #cbd5e1', pageBreakInside: 'avoid' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ borderBottom: '1.5px dashed #64748b', height: 32, width: '80%', margin: '0 auto 6px' }} />
                <div style={{ fontSize: 11, fontWeight: 700, color: '#0f172a' }}>Subject Teacher Signature</div>
                <div style={{ fontSize: 9, color: '#64748b' }}>Date: ____/____/2026</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ borderBottom: '1.5px dashed #64748b', height: 32, width: '80%', margin: '0 auto 6px' }} />
                <div style={{ fontSize: 11, fontWeight: 700, color: '#0f172a' }}>Academic Coordinator</div>
                <div style={{ fontSize: 9, color: '#64748b' }}>Savitri School</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ borderBottom: '1.5px dashed #64748b', height: 32, width: '80%', margin: '0 auto 6px' }} />
                <div style={{ fontSize: 11, fontWeight: 800, color: '#dc2626' }}>Principal Seal & Signature</div>
                <div style={{ fontSize: 9, color: '#64748b' }}>Status Approved / Verified</div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

function StudentSyllabusModal({ data, filters, currentSession = '2026-27', close }) {
  const schoolProfile = getStoredSchool ? getStoredSchool() : { name: 'SAVITRI BALIKA INTER COLLEGE', address: 'KHUTAHA, ROAD JAMUANHIYA MIRZAPUR' };
  const schoolName = schoolProfile.name || 'SAVITRI BALIKA INTER COLLEGE';
  const schoolAddress = schoolProfile.address || 'KHUTAHA, ROAD JAMUANHIYA MIRZAPUR';
  const sessionLabel = currentSession ? currentSession.replace('-', '–') : '2026–27';
  const reportTitle = `OFFICIAL ACADEMIC SYLLABUS — SESSION ${sessionLabel}`;

  const currentDateStr = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const handleOpenInNewTab = () => {
    const activeLogoUrl = (() => {
      try {
        const direct = localStorage.getItem('school_logo_custom') || JSON.parse(localStorage.getItem('school_profile_settings') || '{}').logoUrl;
        if (direct) return direct;
      } catch(e) {}
      return window.location.origin + '/school-logo.png';
    })();

    const escapeHtml = (str) => {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    };

    const rowsHtml = data.map((x, idx) => {
      const sectionText = x.section ? `<span style="display:inline-block;margin-left:4px;padding:1px 5px;background:#dbeafe;color:#1e40af;border-radius:3px;font-size:9px;font-weight:700;">Sec ${escapeHtml(x.section)}</span>` : '';
      const assessmentText = x.assessment ? `<span style="display:inline-block;padding:2px 6px;background:#f1f5f9;color:#334155;border:1px solid #cbd5e1;border-radius:4px;font-size:9px;font-weight:700;">${escapeHtml(x.assessment)}</span>` : '';
      const hindiText = x.hindi ? `<div style="font-size:10px;color:#475569;font-weight:500;margin-top:2px;">( ${escapeHtml(x.hindi)} )</div>` : '';
      const practicalTag = '';

      return `
        <tr>
          <td style="text-align:center;font-weight:700;font-size:11px;">${idx + 1}</td>
          <td style="font-size:11px;font-weight:700;">${escapeHtml(x.className || '')}${sectionText}</td>
          <td style="font-size:11px;font-weight:700;color:#0b4388;">${escapeHtml(x.subject || '')}</td>
          <td style="font-size:10.5px;font-weight:600;">${escapeHtml(x.month || '')}</td>
          <td style="font-size:10px;text-align:center;">${assessmentText || '—'}</td>
          <td style="font-size:11px;">
            <div style="font-weight:700;color:#0f172a;margin-bottom:2px;font-size:11.5px;">${escapeHtml(x.chapter || '')}</div>
            ${hindiText}
            <div style="font-size:10px;color:#334155;white-space:pre-line;line-height:1.35;margin-top:3px;">${escapeHtml(x.topic || '')}</div>
            ${practicalTag}
          </td>
          <td style="text-align:center;vertical-align:middle;">
            <div style="width:18px;height:18px;border:1.5px solid #64748b;border-radius:4px;margin:0 auto 3px;"></div>
            <span style="font-size:8px;color:#64748b;">Prepared</span>
          </td>
        </tr>
        ${x.practical ? `<tr style="background:#f0fdf4;"><td style="text-align:center;font-weight:700;font-size:10px;">${idx + 1}P</td><td style="font-size:10px;font-weight:700;">${escapeHtml(x.className || '')}${sectionText}</td><td style="font-size:10px;font-weight:700;color:#0b4388;">${escapeHtml(x.subject || '')}</td><td style="font-size:10px;font-weight:600;">${escapeHtml(x.month || '')}</td><td style="font-size:10px;text-align:center;"><span style="display:inline-block;padding:2px 6px;background:#dcfce7;color:#166534;border:1px solid #86efac;border-radius:4px;font-size:9px;font-weight:800;">Practical</span></td><td style="font-size:10px;white-space:pre-line;line-height:1.35;color:#14532d;"><div style="font-weight:800;margin-bottom:2px;">🧪 Practical</div>${escapeHtml(x.practical)}</td><td style="text-align:center;vertical-align:middle;"><div style="width:18px;height:18px;border:1.5px solid #64748b;border-radius:4px;margin:0 auto 3px;"></div><span style="font-size:8px;color:#64748b;">Prepared</span></td></tr>` : ''}
        ${x.project ? `<tr style="background:#f8fafc;"><td style="text-align:center;font-weight:700;font-size:10px;">${idx + 1}Prj</td><td style="font-size:10px;font-weight:700;">${escapeHtml(x.className || '')}${sectionText}</td><td style="font-size:10px;font-weight:700;color:#0b4388;">${escapeHtml(x.subject || '')}</td><td style="font-size:10px;font-weight:600;">${escapeHtml(x.month || '')}</td><td style="font-size:10px;text-align:center;"><span style="display:inline-block;padding:2px 6px;background:#e0e7ff;color:#3730a3;border:1px solid #c7d2fe;border-radius:4px;font-size:9px;font-weight:800;">Project</span></td><td style="font-size:10px;white-space:pre-line;line-height:1.35;color:#1e293b;"><div style="font-weight:800;color:#1e40af;margin-bottom:2px;">📁 Project Work</div>${escapeHtml(x.project)}</td><td style="text-align:center;vertical-align:middle;"><div style="width:18px;height:18px;border:1.5px solid #64748b;border-radius:4px;margin:0 auto 3px;"></div><span style="font-size:8px;color:#64748b;">Prepared</span></td></tr>` : ''}
      `;
    }).join('');

    const filterSummaryClass = filters.className === 'ALL' ? 'All Classes (Nursery–12th)' : (filters.className || 'All Classes');
    const filterSummarySection = filters.sectionName === 'ALL' ? 'All Sections' : (filters.sectionName ? `Section ${filters.sectionName}` : 'All');
    const filterSummarySubject = filters.subjectName === 'ALL' || !filters.subjectName ? 'All Subjects' : filters.subjectName;
    const filterExamText = filters.exam === 'ALL' || !filters.exam ? 'Full Academic Session Syllabus' : filters.exam;

    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Student Academic Syllabus - ${escapeHtml(schoolName)}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
    
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Poppins', Arial, sans-serif;
      background: #f1f5f9;
      color: #0f172a;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    .top-action-bar {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: #1d4ed8;
      color: #ffffff;
      padding: 12px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 14px rgba(0,0,0,0.15);
    }
    .top-action-bar .btn-print {
      background: #ffffff;
      color: #1d4ed8;
      border: none;
      padding: 10px 22px;
      font-size: 14px;
      font-weight: 800;
      border-radius: 8px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      transition: all 0.2s;
    }
    .top-action-bar .btn-print:hover {
      background: #f8fafc;
      transform: translateY(-1px);
    }
    .top-action-bar .btn-close {
      background: rgba(255,255,255,0.2);
      color: white;
      border: 1px solid rgba(255,255,255,0.35);
      padding: 8px 16px;
      font-size: 13px;
      font-weight: 600;
      border-radius: 6px;
      cursor: pointer;
    }
    .top-action-bar .btn-close:hover {
      background: rgba(255,255,255,0.3);
    }

    .page-wrapper {
      max-width: 1060px;
      margin: 24px auto;
      background: #ffffff;
      padding: 32px 30px;
      border-radius: 10px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    }

    .school-header {
      text-align: center;
      border-bottom: 2.5px solid #1d4ed8;
      padding-bottom: 12px;
      margin-bottom: 16px;
    }
    .school-title {
      font-size: 24px;
      font-weight: 900;
      color: #0b4388;
      text-transform: uppercase;
      letter-spacing: 0.8px;
    }
    .school-subtitle {
      font-size: 11px;
      font-weight: 700;
      color: #475569;
      margin-top: 3px;
    }
    .report-badge {
      display: inline-block;
      margin-top: 8px;
      padding: 4px 14px;
      background: #eff6ff;
      color: #1d4ed8;
      border: 1.5px solid #bfdbfe;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.6px;
    }

    .meta-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      background: #f8fafc;
      padding: 12px 14px;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
      margin-bottom: 18px;
      font-size: 11px;
    }
    .meta-grid b { color: #475569; }

    .student-fields-bar {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr;
      gap: 16px;
      background: #ffffff;
      border: 1.5px dashed #cbd5e1;
      padding: 8px 14px;
      border-radius: 6px;
      margin-bottom: 16px;
      font-size: 11px;
    }
    .field-line {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .field-line span {
      border-bottom: 1px solid #94a3b8;
      flex: 1;
      min-height: 16px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 11px;
      page-break-inside: auto;
      table-layout: fixed;
    }
    thead {
      display: table-header-group;
    }
    tr {
      page-break-inside: avoid;
      page-break-after: auto;
    }
    th {
      background: #f8fafc !important;
      color: #0f172a;
      font-weight: 700;
      padding: 8px 6px;
      border: 1px solid #cbd5e1;
      text-align: left;
      font-size: 10.5px;
    }
    td {
      padding: 8px 6px;
      border: 1px solid #cbd5e1;
      vertical-align: top;
      word-wrap: break-word;
    }

    .instructions-box {
      margin-top: 20px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-left: 4px solid #1d4ed8;
      border-radius: 6px;
      padding: 10px 14px;
      font-size: 10.5px;
      color: #334155;
      page-break-inside: avoid;
    }
    .instructions-box b {
      color: #0f172a;
      display: block;
      margin-bottom: 4px;
    }
    .instructions-box ol {
      margin-left: 18px;
    }
    .instructions-box li {
      margin-bottom: 2px;
    }

    .signatures-section {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
      margin-top: 32px;
      padding-top: 16px;
      border-top: 1.5px solid #cbd5e1;
      page-break-inside: avoid;
    }
    .sig-block {
      text-align: center;
    }
    .sig-line {
      border-bottom: 1.5px dashed #64748b;
      height: 34px;
      width: 80%;
      margin: 0 auto 8px;
    }
    .sig-title {
      font-size: 11px;
      font-weight: 700;
      color: #0f172a;
    }
    .sig-sub {
      font-size: 9.5px;
      color: #64748b;
      margin-top: 2px;
    }

    @media print {
      @page {
        size: A4 portrait;
        margin: 8mm 7mm;
      }
      body {
        background: #ffffff;
      }
      .top-action-bar {
        display: none !important;
      }
      .page-wrapper {
        margin: 0 !important;
        padding: 0 !important;
        box-shadow: none !important;
        max-width: 100% !important;
      }
      th {
        background: #f8fafc !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .meta-grid, .student-fields-bar, .instructions-box {
        background: #f8fafc !important;
        border: 1px solid #cbd5e1 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
    }
  </style>
</head>
<body>
  <div class="top-action-bar">
    <div style="display:flex;align-items:center;gap:12px;">
      <span style="font-size:22px;">🎓</span>
      <div>
        <div style="font-weight:800;font-size:15px;">Student Academic Syllabus (A4 Full View & Print)</div>
        <div style="font-size:11px;opacity:0.9;">Verify curriculum and press Print button or press <b>Ctrl + P / Cmd + P</b> to print or save PDF</div>
      </div>
    </div>
    <div style="display:flex;gap:12px;align-items:center;">
      <button class="btn-print" onclick="window.print()">
        🖨️ Print / Save as PDF (Ctrl + P)
      </button>
      <button class="btn-close" onclick="window.close()">
        ✕ Close Tab
      </button>
    </div>
  </div>

  <div class="page-wrapper">
    <div class="school-header">
      <div style="display:flex;align-items:center;justify-content:center;gap:14px;margin-bottom:6px;">
        <img src="${activeLogoUrl}" alt="School Logo" style="width:56px;height:56px;border-radius:50%;object-fit:cover;background:#ffffff;border:1.5px solid #0b4388;box-shadow:0 2px 6px rgba(0,0,0,0.08);" onerror="this.src='/school-logo.png'" />
        <div style="text-align:left;">
          <div class="school-title">${escapeHtml(schoolName)}</div>
          <div class="school-subtitle">📍 ADDRESS: ${escapeHtml(schoolAddress)}</div>
        </div>
      </div>
      <div class="report-badge">📘 ${escapeHtml(reportTitle)}</div>
    </div>

    <div class="meta-grid">
      <div><b>Class & Group:</b> <span style="font-weight:700;color:#0f172a;">${escapeHtml(filterSummaryClass)}</span></div>
      <div><b>Section:</b> <span style="color:#2563eb;font-weight:700;">${escapeHtml(filterSummarySection)}</span></div>
      <div><b>Subject:</b> <span style="font-weight:700;color:#0b4388;">${escapeHtml(filterSummarySubject)}</span></div>
      <div><b>Exam / Pattern:</b> <span style="font-weight:700;">${escapeHtml(filterExamText)}</span></div>
      <div><b>Academic Session:</b> <span style="font-weight:800;color:#16a34a;">${escapeHtml(sessionLabel)}</span></div>
      <div><b>Issue Date:</b> <span style="font-weight:700;">${escapeHtml(currentDateStr)}</span></div>
      <div><b>Total Chapters / Topics:</b> <span style="font-weight:800;color:#1d4ed8;">${data.length} Units</span></div>
      <div><b>Curriculum Type:</b> <span style="font-weight:700;color:#475569;">Official Student Academic Syllabus</span></div>
    </div>

    <div class="student-fields-bar">
      <div class="field-line"><b>Student Name:</b> <span></span></div>
      <div class="field-line"><b>Roll No:</b> <span></span></div>
      <div class="field-line"><b>Admission No:</b> <span></span></div>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width:36px;text-align:center;">S.N.</th>
          <th style="width:75px;">Class/Sec</th>
          <th style="width:90px;">Subject</th>
          <th style="width:85px;">Month</th>
          <th style="width:80px;text-align:center;">Exam Pattern</th>
          <th>Chapter Name & Detailed Topics</th>
          <th style="width:65px;text-align:center;">Study Check</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml || '<tr><td colspan="7" style="text-align:center;padding:24px;color:#64748b;">No syllabus records match the selected filter</td></tr>'}
      </tbody>
    </table>

    <div class="instructions-box">
      <b>📌 Important Instructions for Students & Parents:</b>
      <ol>
        <li>Follow the month-wise chapter plan and complete all syllabus topics before the commencement of examinations.</li>
        <li>Maintain regular class notebooks, homework copies, and practical workbooks as evaluated for internal assessments.</li>
        <li>For any academic doubts or syllabus assistance, consult respective subject teachers during class hours.</li>
      </ol>
    </div>

    <div class="signatures-section">
      <div class="sig-block">
        <div class="sig-line"></div>
        <div class="sig-title">Subject Teacher Signature</div>
        <div class="sig-sub">Date: ____/____/2026</div>
      </div>
      <div class="sig-block">
        <div class="sig-line"></div>
        <div class="sig-title">Class Teacher Signature</div>
        <div class="sig-sub">Savitri Balika Inter College</div>
      </div>
      <div class="sig-block">
        <div class="sig-line"></div>
        <div class="sig-title" style="color:#0b4388;">Principal Seal & Signature</div>
        <div class="sig-sub">Authorized Academic Curriculum</div>
      </div>
    </div>
  </div>
</body>
</html>`;

    try {
      const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
      const blobUrl = URL.createObjectURL(blob);
      const printWindow = window.open(blobUrl, '_blank');
      if (!printWindow) {
        const link = document.createElement('a');
        link.href = blobUrl;
        link.target = '_blank';
        link.rel = 'noopener,noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (e) {
      console.error('Error creating print blob:', e);
      const fallbackWin = window.open('', '_blank');
      if (fallbackWin) {
        fallbackWin.document.open();
        fallbackWin.document.write(fullHtml);
        fallbackWin.document.close();
      }
    }
  };

  return (
    <div className="modal-backdrop principal-print-backdrop" onClick={close} style={{ zIndex: 99999 }}>
      <div
        className="modal"
        style={{
          maxWidth: 980,
          width: '95%',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          padding: 24,
          borderRadius: 16,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          background: '#ffffff',
          overflow: 'hidden'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Control Toolbar */}
        <div className="print-no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 14, borderBottom: '1px solid #e2e8f0', marginBottom: 14, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <span style={{ fontSize: 10, letterSpacing: 1.2, fontWeight: 700, color: '#1d4ed8', textTransform: 'uppercase' }}>
              🎓 Student Academic Syllabus
            </span>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '3px 0 0' }}>
              A4 Ready-to-Print Student Syllabus Document
            </h2>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button
              type="button"
              className="primary"
              onClick={handleOpenInNewTab}
              style={{ background: '#1d4ed8', borderColor: '#1e40af', display: 'inline-flex', gap: 8, alignItems: 'center', padding: '10px 18px', fontWeight: 700, borderRadius: 8, cursor: 'pointer' }}
            >
              <Icons.Printer size={18} /> Open in New Tab & Print (Ctrl + P)
            </button>
            <button className="modal-close" onClick={close} style={{ position: 'relative', right: 0, top: 0 }}>
              <Icons.X size={20} />
            </button>
          </div>
        </div>

        {/* Info Toolbar */}
        <div className="print-no-print" style={{ background: '#eff6ff', padding: '10px 14px', borderRadius: 8, border: '1px solid #bfdbfe', marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 12, color: '#1e40af', fontWeight: 600 }}>
            <span>📄 Total <b>{data.length}</b> Syllabus Topics ready to print for students</span>
          </div>
          <span style={{ fontSize: 11, color: '#64748b' }}>
            Clean student format without completion status
          </span>
        </div>

        {/* Scrollable Document Preview Container */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: 4 }}>
          {/* A4 Document Printable Area */}
          <div className="student-print-area" style={{ background: '#ffffff', color: '#0f172a', padding: '24px 20px', border: '1px solid #cbd5e1', borderRadius: 8 }}>
            {/* Header Section */}
            <div style={{ textAlign: 'center', borderBottom: '2.5px solid #1d4ed8', paddingBottom: 10, marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 4 }}>
                <SchoolLogo size={52} style={{ border: '1.5px solid #0b4388', padding: 2, background: '#ffffff', boxShadow: '0 2px 6px rgba(0,0,0,0.08)' }} />
                <div style={{ textAlign: 'left' }}>
                  <h1 style={{ fontSize: 20, fontWeight: 900, color: '#0b4388', margin: 0, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                    {schoolName}
                  </h1>
                  <p style={{ fontSize: 10, fontWeight: 700, color: '#475569', margin: '2px 0 0', letterSpacing: 0.4 }}>
                    📍 ADDRESS: {schoolAddress}
                  </p>
                </div>
              </div>
              <div style={{ display: 'inline-block', marginTop: 6, padding: '3px 12px', background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', borderRadius: 20, fontSize: 11, fontWeight: 800, textTransform: 'uppercase' }}>
                📘 {reportTitle}
              </div>
            </div>

            {/* Filter Meta Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, background: '#f8fafc', padding: 10, borderRadius: 6, border: '1px solid #e2e8f0', marginBottom: 12, fontSize: 11 }}>
              <div><b style={{ color: '#475569' }}>Class:</b> <span style={{ color: '#0f172a', fontWeight: 700 }}>{filters.className === 'ALL' ? 'All Classes' : (filters.className || 'Not Selected')}</span></div>
              <div><b style={{ color: '#475569' }}>Section:</b> <span style={{ color: '#2563eb', fontWeight: 700 }}>{filters.sectionName === 'ALL' ? 'All Sections' : (filters.sectionName ? `Section ${filters.sectionName}` : 'All')}</span></div>
              <div><b style={{ color: '#475569' }}>Subject:</b> <span style={{ color: '#0b4388', fontWeight: 700 }}>{filters.subjectName === 'ALL' || !filters.subjectName ? 'All Subjects' : filters.subjectName}</span></div>
              <div><b style={{ color: '#475569' }}>Exam / Pattern:</b> <span style={{ color: '#0f172a', fontWeight: 700 }}>{filters.exam || 'ALL'}</span></div>
              <div><b style={{ color: '#475569' }}>Session:</b> <span style={{ color: '#16a34a', fontWeight: 800 }}>{sessionLabel}</span></div>
              <div><b style={{ color: '#475569' }}>Issue Date:</b> <span style={{ color: '#0f172a', fontWeight: 700 }}>{currentDateStr}</span></div>
              <div><b style={{ color: '#475569' }}>Total Units:</b> <span style={{ color: '#1d4ed8', fontWeight: 800 }}>{data.length} Topics</span></div>
              <div><b style={{ color: '#475569' }}>Type:</b> <span style={{ color: '#475569', fontWeight: 700 }}>Student Syllabus</span></div>
            </div>

            {/* Student Fill-in Info Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 14, background: '#ffffff', border: '1.5px dashed #cbd5e1', padding: '6px 12px', borderRadius: 6, marginBottom: 14, fontSize: 11 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <b>Student Name:</b> <div style={{ borderBottom: '1px solid #94a3b8', flex: 1, minHeight: 16 }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <b>Roll No:</b> <div style={{ borderBottom: '1px solid #94a3b8', flex: 1, minHeight: 16 }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <b>Admission No:</b> <div style={{ borderBottom: '1px solid #94a3b8', flex: 1, minHeight: 16 }} />
              </div>
            </div>

            {/* A4 Student Syllabus Table */}
            {data.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px 10px', color: '#64748b', border: '1px dashed #cbd5e1', borderRadius: 6, fontSize: 13 }}>
                🔍 <b>No syllabus records match the selected criteria.</b>
              </div>
            ) : (
              <table className="student-print-table" style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 18 }}>
                <thead>
                  <tr style={{ background: '#f8fafc', color: '#0f172a' }}>
                    <th style={{ width: '36px', textAlign: 'center' }}>S.N.</th>
                    <th style={{ width: '70px' }}>Class/Sec</th>
                    <th style={{ width: '85px' }}>Subject</th>
                    <th style={{ width: '80px' }}>Month</th>
                    <th style={{ width: '75px', textAlign: 'center' }}>Exam</th>
                    <th>Chapter Name & Detailed Topics</th>
                    <th style={{ width: '60px', textAlign: 'center' }}>Check</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((x, idx) => (
                    <tr key={x.id || idx}>
                      <td style={{ textAlign: 'center', fontWeight: 700, fontSize: 10 }}>{idx + 1}</td>
                      <td style={{ fontSize: 11, fontWeight: 700 }}>
                        {x.className}
                        {x.section && <div style={{ fontSize: 9, color: '#2563eb' }}>Sec {x.section}</div>}
                      </td>
                      <td style={{ fontSize: 11, fontWeight: 700, color: '#0b4388' }}>{x.subject}</td>
                      <td style={{ fontSize: 10, fontWeight: 600 }}>{x.month}</td>
                      <td style={{ fontSize: 9, textAlign: 'center' }}>
                        {x.assessment ? (
                          <span style={{ display: 'inline-block', padding: '1px 5px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: 3, fontWeight: 700 }}>
                            {x.assessment}
                          </span>
                        ) : '—'}
                      </td>
                      <td style={{ fontSize: 11 }}>
                        <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: 2 }}>{x.chapter}</div>
                        {x.hindi && <div style={{ fontSize: 10, color: '#475569', fontWeight: 500 }}>( {x.hindi} )</div>}
                        <div style={{ fontSize: 10, color: '#334155', whiteSpace: 'pre-line', lineHeight: 1.3, marginTop: 2 }}>{x.topic}</div>
                      </td>
                      <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                        <div style={{ width: 16, height: 16, border: '1.5px solid #64748b', borderRadius: 3, margin: '0 auto 2px' }} />
                        <span style={{ fontSize: 8, color: '#64748b' }}>Done</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Guidelines Box */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderLeft: '4px solid #1d4ed8', borderRadius: 6, padding: '8px 12px', fontSize: 10.5, color: '#334155', marginBottom: 16 }}>
              <b style={{ color: '#0f172a', display: 'block', marginBottom: 3 }}>📌 Important Instructions for Students & Parents:</b>
              <ol style={{ marginLeft: 16, margin: 0, padding: 0 }}>
                <li>Follow the month-wise chapter plan and complete all syllabus topics before term examinations.</li>
                <li>Maintain regular class notebooks, practical files, and homework copies for internal assessment marking.</li>
                <li>For any syllabus doubts, consult your respective subject teacher during school hours.</li>
              </ol>
            </div>

            {/* Signatures */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, paddingTop: 12, borderTop: '1.5px solid #cbd5e1' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ borderBottom: '1.5px dashed #64748b', height: 28, width: '80%', margin: '0 auto 6px' }} />
                <div style={{ fontSize: 11, fontWeight: 700, color: '#0f172a' }}>Subject Teacher Signature</div>
                <div style={{ fontSize: 9, color: '#64748b' }}>Date: ____/____/2026</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ borderBottom: '1.5px dashed #64748b', height: 28, width: '80%', margin: '0 auto 6px' }} />
                <div style={{ fontSize: 11, fontWeight: 700, color: '#0f172a' }}>Class Teacher Signature</div>
                <div style={{ fontSize: 9, color: '#64748b' }}>Savitri Balika Inter College</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ borderBottom: '1.5px dashed #64748b', height: 28, width: '80%', margin: '0 auto 6px' }} />
                <div style={{ fontSize: 11, fontWeight: 700, color: '#0b4388' }}>Principal Seal & Signature</div>
                <div style={{ fontSize: 9, color: '#64748b' }}>Authorized Academic Curriculum</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SoftBoardSyllabusModal({ data, filters, currentSession = '2026-27', close }) {
  const schoolProfile = getStoredSchool ? getStoredSchool() : { name: 'SAVITRI BALIKA INTER COLLEGE', address: 'KHUTAHA, ROAD JAMUANHIYA MIRZAPUR' };
  const schoolName = schoolProfile.name || 'SAVITRI BALIKA INTER COLLEGE';
  const schoolAddress = schoolProfile.address || 'KHUTAHA, ROAD JAMUANHIYA MIRZAPUR';
  const sessionLabel = currentSession ? currentSession.replace('-', '–') : '2026–27';
  const reportTitle = `OFFICIAL CLASSROOM SOFT BOARD SYLLABUS — SESSION ${sessionLabel}`;

  const currentDateStr = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const handleOpenInNewTab = () => {
    const activeLogoUrl = (() => {
      try {
        const direct = localStorage.getItem('school_logo_custom') || JSON.parse(localStorage.getItem('school_profile_settings') || '{}').logoUrl;
        if (direct) return direct;
      } catch(e) {}
      return window.location.origin + '/school-logo.png';
    })();

    const escapeHtml = (str) => {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    };

    const rowsHtml = data.map((x, idx) => {
      const sectionText = x.section ? `<span style="display:inline-block;margin-left:4px;padding:1px 5px;background:#dbeafe;color:#1e40af;border-radius:3px;font-size:9px;font-weight:700;">Sec ${escapeHtml(x.section)}</span>` : '';
      const assessmentText = x.assessment ? `<span style="display:inline-block;padding:2px 6px;background:#ecfdf5;color:#065f46;border:1px solid #a7f3d0;border-radius:4px;font-size:9px;font-weight:700;">${escapeHtml(x.assessment)}</span>` : '';
      const hindiText = x.hindi ? `<div style="font-size:10px;color:#475569;font-weight:500;margin-top:2px;">( ${escapeHtml(x.hindi)} )</div>` : '';
      const practicalTag = '';

      return `
        <tr>
          <td style="text-align:center;font-weight:700;font-size:11px;">${idx + 1}</td>
          <td style="font-size:11px;font-weight:700;">${escapeHtml(x.className || '')}${sectionText}</td>
          <td style="font-size:11px;font-weight:700;color:#0b4388;">${escapeHtml(x.subject || '')}</td>
          <td style="font-size:10.5px;font-weight:600;">${escapeHtml(x.month || '')}</td>
          <td style="font-size:10px;text-align:center;">${assessmentText || '—'}</td>
          <td style="font-size:11px;">
            <div style="font-weight:700;color:#0f172a;margin-bottom:2px;font-size:11.5px;">${escapeHtml(x.chapter || '')}</div>
            ${hindiText}
            <div style="font-size:10px;color:#334155;white-space:pre-line;line-height:1.35;margin-top:3px;">${escapeHtml(x.topic || '')}</div>
            ${practicalTag}
          </td>
          <td style="text-align:center;vertical-align:middle;">
            <div style="font-size:8.5px;color:#64748b;line-height:1.2;">Target Date:</div>
            <div style="border-bottom:1px solid #94a3b8;width:80%;margin:4px auto 2px;height:10px;"></div>
            <span style="font-size:8px;color:#059669;font-weight:700;">Faculty Sign</span>
          </td>
        </tr>
        ${x.practical ? `<tr style="background:#f0fdf4;"><td style="text-align:center;font-weight:700;font-size:10px;">${idx + 1}P</td><td style="font-size:10px;font-weight:700;">${escapeHtml(x.className || '')}${sectionText}</td><td style="font-size:10px;font-weight:700;color:#0b4388;">${escapeHtml(x.subject || '')}</td><td style="font-size:10px;font-weight:600;">${escapeHtml(x.month || '')}</td><td style="font-size:10px;text-align:center;"><span style="display:inline-block;padding:2px 6px;background:#dcfce7;color:#166534;border:1px solid #86efac;border-radius:4px;font-size:9px;font-weight:800;">Practical</span></td><td style="font-size:10px;white-space:pre-line;line-height:1.35;color:#14532d;"><div style="font-weight:800;margin-bottom:2px;">🧪 Practical</div>${escapeHtml(x.practical)}</td><td style="text-align:center;vertical-align:middle;"><div style="font-size:8.5px;color:#64748b;line-height:1.2;">Target Date:</div><div style="border-bottom:1px solid #94a3b8;width:80%;margin:4px auto 2px;height:10px;"></div><span style="font-size:8px;color:#059669;font-weight:700;">Faculty Sign</span></td></tr>` : ''}
        ${x.project ? `<tr style="background:#f8fafc;"><td style="text-align:center;font-weight:700;font-size:10px;">${idx + 1}Prj</td><td style="font-size:10px;font-weight:700;">${escapeHtml(x.className || '')}${sectionText}</td><td style="font-size:10px;font-weight:700;color:#0b4388;">${escapeHtml(x.subject || '')}</td><td style="font-size:10px;font-weight:600;">${escapeHtml(x.month || '')}</td><td style="font-size:10px;text-align:center;"><span style="display:inline-block;padding:2px 6px;background:#e0e7ff;color:#3730a3;border:1px solid #c7d2fe;border-radius:4px;font-size:9px;font-weight:800;">Project</span></td><td style="font-size:10px;white-space:pre-line;line-height:1.35;color:#1e293b;"><div style="font-weight:800;color:#1e40af;margin-bottom:2px;">📁 Project Work</div>${escapeHtml(x.project)}</td><td style="text-align:center;vertical-align:middle;"><div style="font-size:8.5px;color:#64748b;line-height:1.2;">Target Date:</div><div style="border-bottom:1px solid #94a3b8;width:80%;margin:4px auto 2px;height:10px;"></div><span style="font-size:8px;color:#059669;font-weight:700;">Faculty Sign</span></td></tr>` : ''}
      `;
    }).join('');

    const filterSummaryClass = filters.className === 'ALL' ? 'All Classes (Nursery–12th)' : (filters.className || 'All Classes');
    const filterSummarySection = filters.sectionName === 'ALL' ? 'All Sections' : (filters.sectionName ? `Section ${filters.sectionName}` : 'All');
    const filterSummarySubject = filters.subjectName === 'ALL' || !filters.subjectName ? 'All Subjects' : filters.subjectName;
    const filterExamText = filters.exam === 'ALL' || !filters.exam ? 'Full Academic Session Syllabus' : filters.exam;

    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Classroom Soft Board Syllabus - ${escapeHtml(schoolName)}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
    
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Poppins', Arial, sans-serif;
      background: #f1f5f9;
      color: #0f172a;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    .top-action-bar {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: #059669;
      color: #ffffff;
      padding: 12px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 14px rgba(0,0,0,0.15);
    }
    .top-action-bar .btn-print {
      background: #ffffff;
      color: #059669;
      border: none;
      padding: 10px 22px;
      font-size: 14px;
      font-weight: 800;
      border-radius: 8px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      transition: all 0.2s;
    }
    .top-action-bar .btn-print:hover {
      background: #f0fdf4;
      transform: translateY(-1px);
    }
    .top-action-bar .btn-close {
      background: rgba(255,255,255,0.2);
      color: white;
      border: 1px solid rgba(255,255,255,0.35);
      padding: 8px 16px;
      font-size: 13px;
      font-weight: 600;
      border-radius: 6px;
      cursor: pointer;
    }
    .top-action-bar .btn-close:hover {
      background: rgba(255,255,255,0.3);
    }

    .page-wrapper {
      max-width: 1060px;
      margin: 24px auto;
      background: #ffffff;
      padding: 32px 30px;
      border-radius: 10px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      border: 2px solid #a7f3d0;
    }

    .school-header {
      text-align: center;
      border-bottom: 2.5px solid #059669;
      padding-bottom: 12px;
      margin-bottom: 16px;
    }
    .school-title {
      font-size: 24px;
      font-weight: 900;
      color: #065f46;
      text-transform: uppercase;
      letter-spacing: 0.8px;
    }
    .school-subtitle {
      font-size: 11px;
      font-weight: 700;
      color: #475569;
      margin-top: 3px;
    }
    .report-badge {
      display: inline-block;
      margin-top: 8px;
      padding: 5px 16px;
      background: #ecfdf5;
      color: #047857;
      border: 1.5px solid #a7f3d0;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.6px;
    }

    .notice-board-strip {
      background: #f0fdf4;
      border: 1.5px solid #86efac;
      padding: 10px 16px;
      border-radius: 8px;
      margin-bottom: 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
      font-size: 11px;
    }

    .meta-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      background: #f8fafc;
      padding: 12px 14px;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
      margin-bottom: 18px;
      font-size: 11px;
    }
    .meta-grid b { color: #475569; }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 11px;
      page-break-inside: auto;
      table-layout: fixed;
    }
    thead {
      display: table-header-group;
    }
    tr {
      page-break-inside: avoid;
      page-break-after: auto;
    }
    th {
      background: #ecfdf5 !important;
      color: #065f46;
      font-weight: 700;
      padding: 8px 6px;
      border: 1px solid #86efac;
      text-align: left;
      font-size: 10.5px;
    }
    td {
      padding: 8px 6px;
      border: 1px solid #cbd5e1;
      vertical-align: top;
      word-wrap: break-word;
    }

    .instructions-box {
      margin-top: 20px;
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-left: 4px solid #059669;
      border-radius: 6px;
      padding: 10px 14px;
      font-size: 10.5px;
      color: #166534;
      page-break-inside: avoid;
    }
    .instructions-box b {
      color: #065f46;
      display: block;
      margin-bottom: 4px;
    }
    .instructions-box ol {
      margin-left: 18px;
    }
    .instructions-box li {
      margin-bottom: 2px;
    }

    .signatures-section {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
      margin-top: 32px;
      padding-top: 16px;
      border-top: 1.5px solid #cbd5e1;
      page-break-inside: avoid;
    }
    .sig-block {
      text-align: center;
    }
    .sig-line {
      border-bottom: 1.5px dashed #64748b;
      height: 34px;
      width: 80%;
      margin: 0 auto 8px;
    }
    .sig-title {
      font-size: 11px;
      font-weight: 700;
      color: #0f172a;
    }
    .sig-sub {
      font-size: 9.5px;
      color: #64748b;
      margin-top: 2px;
    }

    @media print {
      @page {
        size: A4 portrait;
        margin: 8mm 7mm;
      }
      body {
        background: #ffffff;
      }
      .top-action-bar {
        display: none !important;
      }
      .page-wrapper {
        margin: 0 !important;
        padding: 0 !important;
        box-shadow: none !important;
        border: none !important;
        max-width: 100% !important;
      }
      th {
        background: #ecfdf5 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .meta-grid, .notice-board-strip, .instructions-box {
        background: #f8fafc !important;
        border: 1px solid #cbd5e1 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
    }
  </style>
</head>
<body>
  <div class="top-action-bar">
    <div style="display:flex;align-items:center;gap:12px;">
      <span style="font-size:22px;">📌</span>
      <div>
        <div style="font-weight:800;font-size:15px;">Classroom Soft Board Syllabus (A4 Display View & Print)</div>
        <div style="font-size:11px;opacity:0.9;">Official classroom notice board copy — press <b>Print / Save as PDF (Ctrl + P)</b> to print and pin in classroom</div>
      </div>
    </div>
    <div style="display:flex;gap:12px;align-items:center;">
      <button class="btn-print" onclick="window.print()">
        🖨️ Print for Soft Board (Ctrl + P)
      </button>
      <button class="btn-close" onclick="window.close()">
        ✕ Close Tab
      </button>
    </div>
  </div>

  <div class="page-wrapper">
    <div class="school-header">
      <div style="display:flex;align-items:center;justify-content:center;gap:14px;margin-bottom:6px;">
        <img src="${activeLogoUrl}" alt="School Logo" style="width:56px;height:56px;border-radius:50%;object-fit:cover;background:#ffffff;border:1.5px solid #065f46;box-shadow:0 2px 6px rgba(0,0,0,0.08);" onerror="this.src='/school-logo.png'" />
        <div style="text-align:left;">
          <div class="school-title">${escapeHtml(schoolName)}</div>
          <div class="school-subtitle">📍 ADDRESS: ${escapeHtml(schoolAddress)}</div>
        </div>
      </div>
      <div class="report-badge">📌 ${escapeHtml(reportTitle)}</div>
    </div>

    <div class="notice-board-strip">
      <div><b>📌 DISPLAY LOCATION:</b> <span style="font-weight:700;color:#065f46;">Classroom Soft Board / Bulletin Board</span></div>
      <div><b>ROOM / HALL NO:</b> <span style="display:inline-block;border-bottom:1px solid #065f46;width:80px;height:14px;"></span></div>
      <div><b>CLASS TEACHER:</b> <span style="display:inline-block;border-bottom:1px solid #065f46;width:140px;height:14px;"></span></div>
    </div>

    <div class="meta-grid">
      <div><b>Class & Group:</b> <span style="font-weight:700;color:#0f172a;">${escapeHtml(filterSummaryClass)}</span></div>
      <div><b>Section:</b> <span style="color:#059669;font-weight:700;">${escapeHtml(filterSummarySection)}</span></div>
      <div><b>Subject Scope:</b> <span style="font-weight:700;color:#0b4388;">${escapeHtml(filterSummarySubject)}</span></div>
      <div><b>Exam / Term:</b> <span style="font-weight:700;">${escapeHtml(filterExamText)}</span></div>
      <div><b>Academic Session:</b> <span style="font-weight:800;color:#16a34a;">${escapeHtml(sessionLabel)}</span></div>
      <div><b>Display Date:</b> <span style="font-weight:700;">${escapeHtml(currentDateStr)}</span></div>
      <div><b>Total Units / Topics:</b> <span style="font-weight:800;color:#059669;">${data.length} Units</span></div>
      <div><b>Document Type:</b> <span style="font-weight:700;color:#047857;">Official Soft Board Notice</span></div>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width:36px;text-align:center;">S.N.</th>
          <th style="width:75px;">Class/Sec</th>
          <th style="width:90px;">Subject</th>
          <th style="width:85px;">Month</th>
          <th style="width:80px;text-align:center;">Exam Pattern</th>
          <th>Chapter Name & Detailed Topics (Hindi & English)</th>
          <th style="width:75px;text-align:center;">Target & Sign</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml || '<tr><td colspan="7" style="text-align:center;padding:24px;color:#64748b;">No syllabus records match the selected filter</td></tr>'}
      </tbody>
    </table>

    <div class="instructions-box">
      <b>📌 Guidelines for Classroom Soft Board & Faculty:</b>
      <ol>
        <li>This official syllabus document must remain pinned on the classroom soft board throughout the academic session.</li>
        <li>Subject teachers are advised to align regular lecture plans, student homework, and notebook checks strictly as per the month schedule.</li>
        <li>Students should monitor their monthly chapter milestones and prepare for scheduled unit tests / terminal examinations accordingly.</li>
      </ol>
    </div>

    <div class="signatures-section">
      <div class="sig-block">
        <div class="sig-line"></div>
        <div class="sig-title">Class Teacher Signature</div>
        <div class="sig-sub">Date: ____/____/2026</div>
      </div>
      <div class="sig-block">
        <div class="sig-line"></div>
        <div class="sig-title">Academic Coordinator</div>
        <div class="sig-sub">Savitri Balika Inter College</div>
      </div>
      <div class="sig-block">
        <div class="sig-line"></div>
        <div class="sig-title" style="color:#065f46;">Principal Seal & Signature</div>
        <div class="sig-sub">Authorized Academic Curriculum</div>
      </div>
    </div>
  </div>
</body>
</html>`;

    try {
      const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
      const blobUrl = URL.createObjectURL(blob);
      const printWindow = window.open(blobUrl, '_blank');
      if (!printWindow) {
        const link = document.createElement('a');
        link.href = blobUrl;
        link.target = '_blank';
        link.rel = 'noopener,noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (e) {
      console.error('Error creating print blob:', e);
      const fallbackWin = window.open('', '_blank');
      if (fallbackWin) {
        fallbackWin.document.open();
        fallbackWin.document.write(fullHtml);
        fallbackWin.document.close();
      }
    }
  };

  return (
    <div className="modal-backdrop principal-print-backdrop" onClick={close} style={{ zIndex: 99999 }}>
      <div
        className="modal"
        style={{
          maxWidth: 980,
          width: '95%',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          padding: 24,
          borderRadius: 16,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          background: '#ffffff',
          overflow: 'hidden'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Control Toolbar */}
        <div className="print-no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 14, borderBottom: '1px solid #e2e8f0', marginBottom: 14, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <span style={{ fontSize: 10, letterSpacing: 1.2, fontWeight: 700, color: '#059669', textTransform: 'uppercase' }}>
              📌 Classroom Soft Board Syllabus
            </span>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '3px 0 0' }}>
              A4 Classroom Soft Board Display Document
            </h2>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button
              type="button"
              className="primary"
              onClick={handleOpenInNewTab}
              style={{ background: '#059669', borderColor: '#047857', display: 'inline-flex', gap: 8, alignItems: 'center', padding: '10px 18px', fontWeight: 700, borderRadius: 8, cursor: 'pointer' }}
            >
              <Icons.Printer size={18} /> Open in New Tab & Print (Ctrl + P)
            </button>
            <button className="modal-close" onClick={close} style={{ position: 'relative', right: 0, top: 0 }}>
              <Icons.X size={20} />
            </button>
          </div>
        </div>

        {/* Info Toolbar */}
        <div className="print-no-print" style={{ background: '#ecfdf5', padding: '10px 14px', borderRadius: 8, border: '1px solid #a7f3d0', marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 12, color: '#065f46', fontWeight: 600 }}>
            <span>📌 Total <b>{data.length}</b> Syllabus Topics formatted for classroom soft board display</span>
          </div>
          <span style={{ fontSize: 11, color: '#047857', fontWeight: 600 }}>
            Official classroom copy with faculty guidelines
          </span>
        </div>

        {/* Scrollable Document Preview Container */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: 4 }}>
          {/* A4 Document Printable Area */}
          <div className="student-print-area" style={{ background: '#ffffff', color: '#0f172a', padding: '24px 20px', border: '1.5px solid #86efac', borderRadius: 8 }}>
            {/* Header Section */}
            <div style={{ textAlign: 'center', borderBottom: '2.5px solid #059669', paddingBottom: 10, marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 4 }}>
                <SchoolLogo size={52} style={{ border: '1.5px solid #065f46', padding: 2, background: '#ffffff', boxShadow: '0 2px 6px rgba(0,0,0,0.08)' }} />
                <div style={{ textAlign: 'left' }}>
                  <h1 style={{ fontSize: 20, fontWeight: 900, color: '#065f46', margin: 0, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                    {schoolName}
                  </h1>
                  <p style={{ fontSize: 10, fontWeight: 700, color: '#475569', margin: '2px 0 0', letterSpacing: 0.4 }}>
                    📍 ADDRESS: {schoolAddress}
                  </p>
                </div>
              </div>
              <div style={{ display: 'inline-block', marginTop: 6, padding: '4px 14px', background: '#ecfdf5', color: '#047857', border: '1px solid #86efac', borderRadius: 20, fontSize: 11, fontWeight: 800, textTransform: 'uppercase' }}>
                📌 {reportTitle}
              </div>
            </div>

            {/* Notice Board Meta Strip */}
            <div style={{ background: '#f0fdf4', border: '1px solid #86efac', padding: '8px 12px', borderRadius: 6, marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6, fontSize: 11 }}>
              <div><b>📌 DISPLAY:</b> <span style={{ color: '#065f46', fontWeight: 700 }}>Classroom Soft Board</span></div>
              <div><b>ROOM NO:</b> <span style={{ display: 'inline-block', borderBottom: '1px solid #065f46', width: 70, height: 12 }}></span></div>
              <div><b>CLASS TEACHER:</b> <span style={{ display: 'inline-block', borderBottom: '1px solid #065f46', width: 120, height: 12 }}></span></div>
            </div>

            {/* Filter Meta Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, background: '#f8fafc', padding: 10, borderRadius: 6, border: '1px solid #e2e8f0', marginBottom: 12, fontSize: 11 }}>
              <div><b style={{ color: '#475569' }}>Class:</b> <span style={{ color: '#0f172a', fontWeight: 700 }}>{filters.className === 'ALL' ? 'All Classes' : (filters.className || 'Not Selected')}</span></div>
              <div><b style={{ color: '#475569' }}>Section:</b> <span style={{ color: '#059669', fontWeight: 700 }}>{filters.sectionName === 'ALL' ? 'All Sections' : (filters.sectionName ? `Section ${filters.sectionName}` : 'All')}</span></div>
              <div><b style={{ color: '#475569' }}>Subject Scope:</b> <span style={{ color: '#0b4388', fontWeight: 700 }}>{filters.subjectName === 'ALL' || !filters.subjectName ? 'All Subjects' : filters.subjectName}</span></div>
              <div><b style={{ color: '#475569' }}>Exam / Pattern:</b> <span style={{ color: '#0f172a', fontWeight: 700 }}>{filters.exam || 'ALL'}</span></div>
              <div><b style={{ color: '#475569' }}>Session:</b> <span style={{ color: '#16a34a', fontWeight: 800 }}>{sessionLabel}</span></div>
              <div><b style={{ color: '#475569' }}>Issue Date:</b> <span style={{ color: '#0f172a', fontWeight: 700 }}>{currentDateStr}</span></div>
              <div><b style={{ color: '#475569' }}>Total Units:</b> <span style={{ color: '#059669', fontWeight: 800 }}>{data.length} Topics</span></div>
              <div><b style={{ color: '#475569' }}>Type:</b> <span style={{ color: '#047857', fontWeight: 700 }}>Soft Board Copy</span></div>
            </div>

            {/* A4 Soft Board Syllabus Table */}
            {data.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px 10px', color: '#64748b', border: '1px dashed #cbd5e1', borderRadius: 6, fontSize: 13 }}>
                🔍 <b>No syllabus records match the selected criteria.</b>
              </div>
            ) : (
              <table className="student-print-table" style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 18 }}>
                <thead>
                  <tr style={{ background: '#ecfdf5', color: '#065f46' }}>
                    <th style={{ width: '36px', textAlign: 'center' }}>S.N.</th>
                    <th style={{ width: '70px' }}>Class/Sec</th>
                    <th style={{ width: '85px' }}>Subject</th>
                    <th style={{ width: '80px' }}>Month</th>
                    <th style={{ width: '75px', textAlign: 'center' }}>Exam</th>
                    <th>Chapter Name & Detailed Topics</th>
                    <th style={{ width: '75px', textAlign: 'center' }}>Target & Sign</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((x, idx) => (
                    <tr key={x.id || idx}>
                      <td style={{ textAlign: 'center', fontWeight: 700, fontSize: 10 }}>{idx + 1}</td>
                      <td style={{ fontSize: 11, fontWeight: 700 }}>
                        {x.className}
                        {x.section && <div style={{ fontSize: 9, color: '#059669' }}>Sec {x.section}</div>}
                      </td>
                      <td style={{ fontSize: 11, fontWeight: 700, color: '#0b4388' }}>{x.subject}</td>
                      <td style={{ fontSize: 10, fontWeight: 600 }}>{x.month}</td>
                      <td style={{ fontSize: 9, textAlign: 'center' }}>
                        {x.assessment ? (
                          <span style={{ display: 'inline-block', padding: '1px 5px', background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', borderRadius: 3, fontWeight: 700 }}>
                            {x.assessment}
                          </span>
                        ) : '—'}
                      </td>
                      <td style={{ fontSize: 11 }}>
                        <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: 2 }}>{x.chapter}</div>
                        {x.hindi && <div style={{ fontSize: 10, color: '#475569', fontWeight: 500 }}>( {x.hindi} )</div>}
                        <div style={{ fontSize: 10, color: '#334155', whiteSpace: 'pre-line', lineHeight: 1.35, marginTop: 3 }}>{x.topic}</div>
                      </td>
                      <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                        <div style={{ fontSize: 8.5, color: '#64748b', lineHeight: 1.1 }}>Target:</div>
                        <div style={{ borderBottom: '1px solid #94a3b8', width: '80%', margin: '3px auto 2px', height: 8 }} />
                        <span style={{ fontSize: 8, color: '#059669', fontWeight: 700 }}>Sign</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Guidelines Box */}
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderLeft: '4px solid #059669', borderRadius: 6, padding: '8px 12px', fontSize: 10.5, color: '#166534', marginBottom: 16 }}>
              <b style={{ color: '#065f46', display: 'block', marginBottom: 3 }}>📌 Guidelines for Classroom Soft Board & Faculty:</b>
              <ol style={{ marginLeft: 16, margin: 0, padding: 0 }}>
                <li>This official syllabus document must remain permanently displayed on the classroom soft board.</li>
                <li>Subject teachers are advised to align regular lecture plans and student notebook checks with this schedule.</li>
                <li>Students should prepare for scheduled unit tests and terminal examinations accordingly.</li>
              </ol>
            </div>

            {/* Signatures */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, paddingTop: 12, borderTop: '1.5px solid #cbd5e1' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ borderBottom: '1.5px dashed #64748b', height: 28, width: '80%', margin: '0 auto 6px' }} />
                <div style={{ fontSize: 11, fontWeight: 700, color: '#0f172a' }}>Class Teacher Signature</div>
                <div style={{ fontSize: 9, color: '#64748b' }}>Date: ____/____/2026</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ borderBottom: '1.5px dashed #64748b', height: 28, width: '80%', margin: '0 auto 6px' }} />
                <div style={{ fontSize: 11, fontWeight: 700, color: '#0f172a' }}>Academic Coordinator</div>
                <div style={{ fontSize: 9, color: '#64748b' }}>Savitri Balika Inter College</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ borderBottom: '1.5px dashed #64748b', height: 28, width: '80%', margin: '0 auto 6px' }} />
                <div style={{ fontSize: 11, fontWeight: 700, color: '#065f46' }}>Principal Seal & Signature</div>
                <div style={{ fontSize: 9, color: '#64748b' }}>Authorized Academic Curriculum</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CreateSessionModal({ close, onCreateSession, currentSession, user }) {
  const [year, setYear] = useState('2027-28');
  const [label, setLabel] = useState('Academic Session 2027–28');
  const [initMode, setInitMode] = useState('clone_reset'); // 'clone_reset' | 'blank'
  const [makeActive, setMakeActive] = useState(true);
  const [masterPassword, setMasterPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const presets = ['2027-28', '2028-29', '2029-30', '2030-31'];

  function handleSelectYear(y) {
    setYear(y);
    setLabel(`Academic Session ${y.replace('-', '–')}`);
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!year.trim()) return;
    if (user?.role !== 'ADMIN') {
      setError('❌ Access Denied: Only Administrator accounts are authorized to create academic sessions.');
      return;
    }
    if (masterPassword.trim() !== MASTER_PASSWORD) {
      setError('❌ Invalid Master Security Password! Authorized Admin access only.');
      return;
    }
    setBusy(true);
    onCreateSession({
      id: year.trim(),
      name: year.trim().replace('-', '–'),
      label: label.trim() || `Academic Session ${year}`,
      initMode,
      makeActive,
      sourceSessionId: currentSession
    });
  }

  return (
    <div className="modal-backdrop" onClick={close}>
      <div className="modal" style={{ maxWidth: 560, padding: 26 }} onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={close}><Icons.X size={18} /></button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
          <div style={{ width: 44, height: 44, background: '#eff6ff', color: '#1d4ed8', borderRadius: 12, display: 'grid', placeItems: 'center' }}>
            <Icons.CalendarPlus size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: 19, margin: 0, color: '#0f172a' }}>Create New Academic Session</h2>
            <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0' }}>Launch a new academic year batch with fresh syllabus tracking</p>
          </div>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '10px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, marginBottom: 12 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-grid">
            <label className="full-label">
              Academic Session Year *
              <input
                required
                value={year}
                onChange={e => { setYear(e.target.value); setLabel(`Academic Session ${e.target.value.replace('-', '–')}`); }}
                placeholder="e.g. 2027-28"
              />
              <div className="year-pills">
                <span style={{ fontSize: 11, color: '#64748b', alignSelf: 'center', marginRight: 4 }}>Quick Suggestions:</span>
                {presets.map(p => (
                  <button
                    key={p}
                    type="button"
                    className={`year-pill ${year === p ? 'active' : ''}`}
                    onClick={() => handleSelectYear(p)}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </label>

            <label className="full-label">
              Display Label
              <input
                value={label}
                onChange={e => setLabel(e.target.value)}
                placeholder="e.g. Academic Session 2027–28"
              />
            </label>
          </div>

          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 14 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#1e293b', display: 'block', marginBottom: 8 }}>
              Syllabus Data Initialization for New Year:
            </span>
            <div style={{ display: 'grid', gap: 10 }}>
              <div
                className={`role-radio-card ${initMode === 'clone_reset' ? 'active' : ''}`}
                onClick={() => setInitMode('clone_reset')}
                style={{ padding: '12px 14px' }}
              >
                <Icons.Sparkles size={22} color={initMode === 'clone_reset' ? '#2563eb' : '#64748b'} />
                <div style={{ flex: 1 }}>
                  <b>🔄 Carry Over Syllabus Structure & Reset Progress (Recommended)</b>
                  <small>Clones all classes, subjects, chapters, and practicals from current session ({currentSession}), but resets all progress to <b>0% (Not Done)</b> for the new year batch!</small>
                </div>
              </div>

              <div
                className={`role-radio-card ${initMode === 'blank' ? 'active' : ''}`}
                onClick={() => setInitMode('blank')}
                style={{ padding: '12px 14px' }}
              >
                <Icons.FilePlus2 size={22} color={initMode === 'blank' ? '#2563eb' : '#64748b'} />
                <div style={{ flex: 1 }}>
                  <b>📄 Fresh Blank Syllabus (0 Records)</b>
                  <small>Start completely clean with 0 syllabus records, ready for fresh manual entries or new Excel upload.</small>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
            <input
              type="checkbox"
              id="make-active-toggle"
              checked={makeActive}
              onChange={e => setMakeActive(e.target.checked)}
              style={{ width: 17, height: 17, accentColor: '#2563eb', cursor: 'pointer' }}
            />
            <label htmlFor="make-active-toggle" style={{ margin: 0, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
              Set as active session immediately after creation
            </label>
          </div>

          {/* Master Password Requirement */}
          <div className="master-pwd-box">
            <div className="master-pwd-badge">
              <Icons.ShieldCheck size={14} /> Master Security Authorization
            </div>
            <p style={{ margin: '0 0 8px 0', fontSize: 12, color: '#92400e', lineHeight: 1.4 }}>
              Admin authorization required. Enter master security password (AKASH@8299) to create new academic session batch.
            </p>
            <div className="pwd-input-wrap">
              <input
                required
                type={showPwd ? 'text' : 'password'}
                value={masterPassword}
                onChange={e => setMasterPassword(e.target.value)}
                placeholder="Enter Master Password"
              />
              <button
                type="button"
                className="pwd-toggle-btn"
                onClick={() => setShowPwd(!showPwd)}
                title={showPwd ? 'Hide Password' : 'Show Password'}
              >
                {showPwd ? <Icons.EyeOff size={16} /> : <Icons.Eye size={16} />}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, borderTop: '1px solid #e2e8f0', paddingTop: 16 }}>
            <button type="button" className="secondary" onClick={close}>Cancel</button>
            <button type="submit" className="primary" disabled={busy}>
              {busy ? <Icons.LoaderCircle className="spin" size={16} /> : <Icons.Plus size={16} />}
              Create & Launch Session
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EditSessionModal({ session, close, onUpdateSession, user }) {
  const [name, setName] = useState(session.name);
  const [label, setLabel] = useState(session.label || `Academic Session ${session.name}`);
  const [makeActive, setMakeActive] = useState(Boolean(session.isCurrent));
  const [masterPassword, setMasterPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!name.trim()) return;
    if (user?.role !== 'ADMIN') {
      setError('❌ Access Denied: Only Administrator accounts are authorized to edit academic sessions.');
      return;
    }
    if (masterPassword.trim() !== MASTER_PASSWORD) {
      setError('❌ Invalid Master Security Password! Authorized Admin access only.');
      return;
    }
    setBusy(true);
    onUpdateSession({
      ...session,
      name: name.trim(),
      label: label.trim(),
      makeActive
    });
  }

  return (
    <div className="modal-backdrop" onClick={close}>
      <div className="modal" style={{ maxWidth: 520, padding: 26 }} onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={close}><Icons.X size={18} /></button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
          <div style={{ width: 44, height: 44, background: '#eff6ff', color: '#1d4ed8', borderRadius: 12, display: 'grid', placeItems: 'center' }}>
            <Icons.Pencil size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: 19, margin: 0, color: '#0f172a' }}>Edit Academic Session</h2>
            <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0' }}>Update session details for {session.name}</p>
          </div>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '10px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, marginBottom: 12 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-grid">
            <label className="full-label">
              Academic Session Name / Year *
              <input
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. 2026–27"
              />
            </label>

            <label className="full-label">
              Display Label
              <input
                value={label}
                onChange={e => setLabel(e.target.value)}
                placeholder="e.g. Academic Session 2026–27"
              />
            </label>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <input
              type="checkbox"
              id="edit-make-active"
              checked={makeActive}
              onChange={e => setMakeActive(e.target.checked)}
              style={{ width: 17, height: 17, accentColor: '#2563eb', cursor: 'pointer' }}
            />
            <label htmlFor="edit-make-active" style={{ margin: 0, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
              Set as current active session
            </label>
          </div>

          {/* Master Password Requirement */}
          <div className="master-pwd-box">
            <div className="master-pwd-badge">
              <Icons.ShieldCheck size={14} /> Master Security Authorization
            </div>
            <p style={{ margin: '0 0 8px 0', fontSize: 12, color: '#92400e', lineHeight: 1.4 }}>
              Enter master security password (AKASH@8299) to authorize session configuration update.
            </p>
            <div className="pwd-input-wrap">
              <input
                required
                type={showPwd ? 'text' : 'password'}
                value={masterPassword}
                onChange={e => setMasterPassword(e.target.value)}
                placeholder="Enter Master Password"
              />
              <button
                type="button"
                className="pwd-toggle-btn"
                onClick={() => setShowPwd(!showPwd)}
                title={showPwd ? 'Hide Password' : 'Show Password'}
              >
                {showPwd ? <Icons.EyeOff size={16} /> : <Icons.Eye size={16} />}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, borderTop: '1px solid #e2e8f0', paddingTop: 16 }}>
            <button type="button" className="secondary" onClick={close}>Cancel</button>
            <button type="submit" className="primary" disabled={busy}>
              {busy ? <Icons.LoaderCircle className="spin" size={16} /> : <Icons.Save size={16} />}
              Save Session
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteSessionModal({ session, close, onDeleteSession, user, totalSessionsCount }) {
  const [masterPassword, setMasterPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const stats = getSessionTopicStats(session.id);

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (totalSessionsCount <= 1) {
      setError('❌ Cannot delete the only existing academic session. At least one session must remain.');
      return;
    }
    if (user?.role !== 'ADMIN') {
      setError('❌ Access Denied: Only Administrator accounts are authorized to delete academic sessions.');
      return;
    }
    if (masterPassword.trim() !== MASTER_PASSWORD) {
      setError('❌ Invalid Master Security Password! Authorized Admin access only.');
      return;
    }
    setBusy(true);
    onDeleteSession(session.id);
  }

  return (
    <div className="modal-backdrop" onClick={close}>
      <div className="modal" style={{ maxWidth: 500, padding: 26 }} onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={close}><Icons.X size={18} /></button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
          <div style={{ width: 44, height: 44, background: '#fef2f2', color: '#dc2626', borderRadius: 12, display: 'grid', placeItems: 'center' }}>
            <Icons.Trash2 size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: 19, margin: 0, color: '#991b1b' }}>Delete Academic Session</h2>
            <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0' }}>Permanently remove {session.name}</p>
          </div>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '10px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, marginBottom: 12 }}>
            {error}
          </div>
        )}

        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: 14, marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: '#334155', fontWeight: 600 }}>
            Session: <b style={{ color: '#0f172a' }}>{session.name}</b> ({session.label})
          </div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
            Contains <b>{stats.total} syllabus topics</b> ({stats.done} Done, {stats.inProgress} In Progress, {stats.pending} Not Done).
          </div>
          <div style={{ fontSize: 11, color: '#dc2626', fontWeight: 700, marginTop: 8 }}>
            ⚠️ WARNING: All syllabus records for this academic session will be permanently erased.
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Master Password Requirement */}
          <div className="master-pwd-box" style={{ background: '#fff5f5', borderColor: '#fed7d7' }}>
            <div className="master-pwd-badge" style={{ color: '#991b1b' }}>
              <Icons.ShieldAlert size={14} /> Master Security Authorization
            </div>
            <p style={{ margin: '0 0 8px 0', fontSize: 12, color: '#991b1b', lineHeight: 1.4 }}>
              Enter master security password (AKASH@8299) to confirm permanent deletion of this academic session.
            </p>
            <div className="pwd-input-wrap">
              <input
                required
                type={showPwd ? 'text' : 'password'}
                value={masterPassword}
                onChange={e => setMasterPassword(e.target.value)}
                placeholder="Enter Master Password"
              />
              <button
                type="button"
                className="pwd-toggle-btn"
                onClick={() => setShowPwd(!showPwd)}
                title={showPwd ? 'Hide Password' : 'Show Password'}
              >
                {showPwd ? <Icons.EyeOff size={16} /> : <Icons.Eye size={16} />}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, borderTop: '1px solid #e2e8f0', paddingTop: 16 }}>
            <button type="button" className="secondary" onClick={close}>Cancel</button>
            <button type="submit" className="primary" style={{ background: '#dc2626', borderColor: '#dc2626' }} disabled={busy}>
              {busy ? <Icons.LoaderCircle className="spin" size={16} /> : <Icons.Trash2 size={16} />}
              Permanently Delete Session
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ResetSessionStatusModal({ session, close, onResetStatus, user }) {
  const [targetStatus, setTargetStatus] = useState('Not Done'); // 'Not Done' | 'In Progress' | 'Done'
  const [scopeClass, setScopeClass] = useState('ALL');
  const [masterPassword, setMasterPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const stats = useMemo(() => getSessionTopicStats(session.id), [session.id]);
  const availableClasses = useMemo(() => {
    const set = new Set();
    stats.list.forEach(t => { if (t.className) set.add(t.className); });
    return Array.from(set).sort((a, b) => {
      const numA = parseInt(a.replace(/\D/g, '')) || 0, numB = parseInt(b.replace(/\D/g, '')) || 0;
      if (numA !== numB) return numA - numB;
      return a.localeCompare(b);
    });
  }, [stats.list]);

  const affectedCount = useMemo(() => {
    if (scopeClass === 'ALL') return stats.total;
    return stats.list.filter(t => t.className === scopeClass).length;
  }, [scopeClass, stats]);

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (user?.role !== 'ADMIN') {
      setError('❌ Access Denied: Only Administrator accounts can reset syllabus statuses.');
      return;
    }
    if (masterPassword.trim() !== MASTER_PASSWORD) {
      setError('❌ Invalid Master Security Password! Authorized Admin access only.');
      return;
    }
    setBusy(true);
    onResetStatus(session.id, targetStatus, scopeClass);
  }

  return (
    <div className="modal-backdrop" onClick={close}>
      <div className="modal" style={{ maxWidth: 580, padding: 26 }} onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={close}><Icons.X size={18} /></button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
          <div style={{ width: 44, height: 44, background: '#fff7ed', color: '#ea580c', borderRadius: 12, display: 'grid', placeItems: 'center' }}>
            <Icons.RotateCcw size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: 19, margin: 0, color: '#0f172a' }}>Reset Syllabus Status in Session</h2>
            <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0' }}>Bulk reset or update all topic statuses for Academic Session {session.name}</p>
          </div>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '10px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, marginBottom: 12 }}>
            {error}
          </div>
        )}

        {/* Current Session Stats Overview */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: 14, marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>
              Academic Session: <b>{session.name}</b>
            </span>
            <span style={{ fontSize: 11, color: '#64748b' }}>{session.label}</span>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span className="session-stat-pill total">Total Topics: {stats.total}</span>
            <span className="session-stat-pill done">Done: {stats.done}</span>
            <span className="session-stat-pill in-progress">In Progress: {stats.inProgress}</span>
            <span className="session-stat-pill pending">Not Done: {stats.pending}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Choice of Target Status */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#1e293b', display: 'block', marginBottom: 8 }}>
              Select Target Status to Apply *
            </label>
            <div style={{ display: 'grid', gap: 8 }}>
              <div
                className={`status-choice-card ${targetStatus === 'Not Done' ? 'active' : ''}`}
                onClick={() => setTargetStatus('Not Done')}
              >
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#fee2e2', color: '#dc2626', display: 'grid', placeItems: 'center', fontWeight: 800 }}>
                  0%
                </div>
                <div style={{ flex: 1 }}>
                  <b style={{ color: '#dc2626', fontSize: 13 }}>Reset All to "Not Done" (0% Progress) — Recommended</b>
                  <small style={{ display: 'block', color: '#64748b', fontSize: 11, marginTop: 2 }}>
                    Clears all completion checks to Not Done. Ideal for starting a fresh academic year or resetting progress.
                  </small>
                </div>
              </div>

              <div
                className={`status-choice-card ${targetStatus === 'In Progress' ? 'active' : ''}`}
                onClick={() => setTargetStatus('In Progress')}
              >
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#fef3c7', color: '#d97706', display: 'grid', placeItems: 'center' }}>
                  <Icons.Clock size={18} />
                </div>
                <div style={{ flex: 1 }}>
                  <b style={{ color: '#d97706', fontSize: 13 }}>Set All to "In Progress" (50% Progress)</b>
                  <small style={{ display: 'block', color: '#64748b', fontSize: 11, marginTop: 2 }}>
                    Marks topics as actively being taught across classes.
                  </small>
                </div>
              </div>

              <div
                className={`status-choice-card ${targetStatus === 'Done' ? 'active' : ''}`}
                onClick={() => setTargetStatus('Done')}
              >
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'grid', placeItems: 'center' }}>
                  <Icons.CheckCircle2 size={18} />
                </div>
                <div style={{ flex: 1 }}>
                  <b style={{ color: '#16a34a', fontSize: 13 }}>Mark All as "Done" (100% Completed)</b>
                  <small style={{ display: 'block', color: '#64748b', fontSize: 11, marginTop: 2 }}>
                    Marks all topics as fully taught and completed for this session.
                  </small>
                </div>
              </div>
            </div>
          </div>

          {/* Scope Filter */}
          <div className="form-grid">
            <label className="full-label">
              Apply Status Reset To
              <select value={scopeClass} onChange={e => setScopeClass(e.target.value)}>
                <option value="ALL">🏫 Entire School ({stats.total} topics across all classes)</option>
                {availableClasses.map(c => (
                  <option key={c} value={c}>Only {c} ({stats.list.filter(t => t.className === c).length} topics)</option>
                ))}
              </select>
            </label>
          </div>

          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '10px 14px', borderRadius: 8, fontSize: 12, color: '#166534', fontWeight: 600 }}>
            ⚡ This operation will update <b>{affectedCount} topics</b> to <b>"{targetStatus}"</b> and sync directly to Supabase Database and Local Storage.
          </div>

          {/* Master Password Requirement */}
          <div className="master-pwd-box">
            <div className="master-pwd-badge">
              <Icons.ShieldAlert size={14} /> Master Security Authorization
            </div>
            <p style={{ margin: '0 0 8px 0', fontSize: 12, color: '#92400e', lineHeight: 1.4 }}>
              Critical Database & Session Operation. Enter master security password (AKASH@8299) to confirm bulk reset.
            </p>
            <div className="pwd-input-wrap">
              <input
                required
                type={showPwd ? 'text' : 'password'}
                value={masterPassword}
                onChange={e => setMasterPassword(e.target.value)}
                placeholder="Enter Master Password"
              />
              <button
                type="button"
                className="pwd-toggle-btn"
                onClick={() => setShowPwd(!showPwd)}
                title={showPwd ? 'Hide Password' : 'Show Password'}
              >
                {showPwd ? <Icons.EyeOff size={16} /> : <Icons.Eye size={16} />}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, borderTop: '1px solid #e2e8f0', paddingTop: 16 }}>
            <button type="button" className="secondary" onClick={close}>Cancel</button>
            <button type="submit" className="primary" style={{ background: '#ea580c', borderColor: '#ea580c' }} disabled={busy}>
              {busy ? <Icons.LoaderCircle className="spin" size={16} /> : <Icons.RotateCcw size={16} />}
              Confirm Status Reset ({affectedCount} Topics)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ManageClassModal({ classObj, close, onUpdate, onDelete, user }) {
  const [name, setName] = useState(classObj.name);
  const [group, setGroup] = useState(classObj.group);
  const [sections, setSections] = useState([...classObj.sections]);
  const [newSection, setNewSection] = useState('');
  const [error, setError] = useState('');
  const [pendingDeleteSec, setPendingDeleteSec] = useState(null);
  const [pendingDeleteClass, setPendingDeleteClass] = useState(false);

  const handleAddSection = (secName) => {
    const s = secName.trim().toUpperCase();
    if (!s) return;
    if (sections.includes(s)) {
      setError(`Section ${s} already exists for this class.`);
      return;
    }
    setError('');
    setSections([...sections, s]);
    setNewSection('');
  };

  const handleRemoveSection = (secName) => {
    setPendingDeleteSec(secName);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Class name cannot be empty.');
      return;
    }
    onUpdate({
      ...classObj,
      name: name.trim(),
      group,
      sections
    });
    close();
  };

  return (
    <div className="modal-backdrop" onClick={close}>
      <div className="modal" style={{ maxWidth: 540, padding: 26 }} onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={close}><Icons.X size={18} /></button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
          <div style={{ width: 42, height: 42, background: '#eff6ff', color: '#1d4ed8', borderRadius: 10, display: 'grid', placeItems: 'center' }}>
            <Icons.Settings size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: 18, margin: 0, color: '#0f172a' }}>Manage Class — {classObj.name}</h2>
            <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0' }}>Edit class name, school group, or add/delete sections</p>
          </div>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '10px 14px', borderRadius: 8, fontSize: 12, marginBottom: 15 }}>
            <Icons.AlertTriangle size={15} style={{ verticalAlign: 'middle', marginRight: 6 }}/>
            {error}
          </div>
        )}

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-grid" style={{ gap: 14 }}>
            <label>
              Class Name *
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                required
                placeholder="e.g. Class 1, Nursery"
              />
            </label>

            <label>
              School Group *
              <select value={group} onChange={e => setGroup(e.target.value)}>
                <option value="preprimary">Nursery / LKG / UKG (Pre-Primary)</option>
                <option value="primary">1st To 8th (Primary / Middle)</option>
                <option value="senior">9th To 12th (Senior Secondary)</option>
              </select>
            </label>
          </div>

          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: 14 }}>
            <label style={{ fontWeight: 600, fontSize: 13, color: '#1e293b', display: 'block', marginBottom: 8 }}>
              Active Sections ({sections.length})
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
              {sections.map(sec => (
                <span
                  key={sec}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: 20,
                    padding: '4px 10px',
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#334155'
                  }}
                >
                  Section {sec}
                  <button
                    type="button"
                    onClick={() => handleRemoveSection(sec)}
                    title={`Delete Section ${sec}`}
                    style={{
                      border: 'none',
                      background: '#fee2e2',
                      color: '#ef4444',
                      borderRadius: '50%',
                      width: 18,
                      height: 18,
                      display: 'grid',
                      placeItems: 'center',
                      cursor: 'pointer',
                      fontSize: 11,
                      padding: 0,
                      fontWeight: 700
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
              {!sections.length && (
                <span style={{ fontSize: 12, color: '#94a3b8', fontStyle: 'italic' }}>No active sections yet.</span>
              )}
            </div>

            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input
                value={newSection}
                onChange={e => setNewSection(e.target.value)}
                placeholder="e.g. C or D"
                style={{ flex: 1, textTransform: 'uppercase', padding: '6px 10px', fontSize: 12, borderRadius: 6, border: '1px solid #cbd5e1' }}
              />
              <button
                type="button"
                className="secondary"
                onClick={() => handleAddSection(newSection)}
                style={{ padding: '6px 12px', fontSize: 12, fontWeight: 600 }}
              >
                <Icons.Plus size={14} /> Add Section
              </button>
            </div>

            <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
              <small style={{ color: '#64748b', width: '100%', fontSize: 11 }}>Quick add:</small>
              {['A', 'B', 'C', 'D', 'E'].map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleAddSection(s)}
                  disabled={sections.includes(s)}
                  style={{
                    padding: '3px 8px',
                    fontSize: 11,
                    borderRadius: 4,
                    border: '1px solid #cbd5e1',
                    background: sections.includes(s) ? '#f1f5f9' : '#fff',
                    color: sections.includes(s) ? '#94a3b8' : '#1e293b',
                    cursor: sections.includes(s) ? 'default' : 'pointer'
                  }}
                >
                  + Section {s}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, paddingTop: 14, borderTop: '1px solid #e2e8f0' }}>
            <button
              type="button"
              onClick={() => setPendingDeleteClass(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 14px',
                background: '#fef2f2',
                color: '#dc2626',
                border: '1px solid #fecaca',
                borderRadius: 7,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Icons.Trash2 size={15} /> Delete Class
            </button>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="button" className="secondary" onClick={close}>Cancel</button>
              <button type="submit" className="primary"><Icons.Check size={16} /> Save Changes</button>
            </div>
          </div>
        </form>

        {pendingDeleteSec && (
          <PasswordDeleteModal
            title="Delete Section"
            itemDescription={`Section ${pendingDeleteSec} from ${classObj.name}`}
            user={user}
            close={() => setPendingDeleteSec(null)}
            onConfirm={() => {
              setSections(prev => prev.filter(s => s !== pendingDeleteSec));
            }}
          />
        )}

        {pendingDeleteClass && (
          <PasswordDeleteModal
            title="Delete Entire Class"
            itemDescription={`Class "${classObj.name}" and all its active sections`}
            user={user}
            close={() => setPendingDeleteClass(false)}
            onConfirm={() => {
              onDelete(classObj.name);
              close();
            }}
          />
        )}
      </div>
    </div>
  );
}

function Classes({ schoolClasses = [], setSchoolClasses, user }) {
  const [group, setGroup] = useState('preprimary');
  const classes = schoolClasses;
  const setClasses = setSchoolClasses;
  const [adding, setAdding] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [toast, setToast] = useState('');

  const addClass = (e) => {
    e.preventDefault();
    const d = new FormData(e.target);
    const c = d.get('class').trim();
    const s = d.get('section').toUpperCase().trim();
    if (!c || !s) return;

    setClasses(v => {
      const existing = v.find(x => x.name.toLowerCase() === c.toLowerCase());
      if (existing) {
        return v.map(x => x === existing ? { ...x, sections: [...new Set([...x.sections, s])] } : x);
      }
      return [...v, { name: c, sections: [s], group }];
    });
    setAdding(false);
    setToast(`✅ Section ${s} added to ${c} successfully.`);
  };

  const handleUpdateClass = (updatedObj) => {
    setClasses(prev => prev.map(c => c.name === editingClass.name ? updatedObj : c));
    setToast(`✏️ ${updatedObj.name} updated successfully.`);
  };

  const handleDeleteClass = (className) => {
    setClasses(prev => prev.filter(c => c.name !== className));
    setToast(`🗑️ ${className} removed successfully.`);
  };

  const handleQuickAddSection = (cObj, secName) => {
    if (cObj.sections.includes(secName)) {
      setToast(`⚠️ Section ${secName} already exists in ${cObj.name}.`);
      return;
    }
    setClasses(prev => prev.map(c => c.name === cObj.name ? { ...c, sections: [...c.sections, secName] } : c));
    setToast(`➕ Added Section ${secName} to ${cObj.name}.`);
  };

  const handleQuickRemoveSection = (cObj, secName) => {
    setClasses(prev => prev.map(c => c.name === cObj.name ? { ...c, sections: c.sections.filter(s => s !== secName) } : c));
    setToast(`🗑️ Removed Section ${secName} from ${cObj.name}.`);
  };

  const visible = classes.filter(x => (x.group || getClassGroup(x.name)) === group);
  const config = classGroups[group];
  const groupSecCount = visible.reduce((acc, c) => acc + (c.sections ? c.sections.length : 0), 0);
  const totalClassesCount = classes.length;
  const totalSectionsCount = classes.reduce((acc, c) => acc + (c.sections ? c.sections.length : 0), 0);

  return (
    <>
      <PageHead
        eyebrow="ACADEMIC STRUCTURE"
        title="Class & Section Management"
        text="Create, edit, and organize classes and sections with full CRUD control"
        action="Create class / section"
        onAction={() => setAdding(true)}
      />

      <div className="filters">
        <button className={group === 'preprimary' ? 'primary' : 'secondary'} onClick={() => setGroup('preprimary')}>
          {classGroups.preprimary.label}
        </button>
        <button className={group === 'primary' ? 'primary' : 'secondary'} onClick={() => setGroup('primary')}>
          {classGroups.primary.label}
        </button>
        <button className={group === 'senior' ? 'primary' : 'secondary'} onClick={() => setGroup('senior')}>
          {classGroups.senior.label}
        </button>
      </div>

      <ToastNotification toast={toast} onClose={() => setToast('')} />

      {/* Dynamic Summary Cards for Class & Section */}
      <section className="stats" style={{ marginBottom: 18 }}>
        <div className="stat">
          <div>
            <small>{config.label} Classes</small>
            <strong>{visible.length}</strong>
          </div>
          <i><Icons.GraduationCap /></i>
        </div>
        <div className="stat">
          <div>
            <small>Active Sections in Group</small>
            <strong>{groupSecCount}</strong>
          </div>
          <i><Icons.Layers /></i>
        </div>
        <div className="stat">
          <div>
            <small>Total School Classes</small>
            <strong>{totalClassesCount}</strong>
          </div>
          <i><Icons.Building2 /></i>
        </div>
        <div className="stat">
          <div>
            <small>Total Active Sections</small>
            <strong>{totalSectionsCount}</strong>
          </div>
          <i><Icons.CheckCircle /></i>
        </div>
      </section>

      <section className="card" style={{ marginBottom: 20, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <b style={{ fontSize: 15 }}>{config.label} Overview</b>
            <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: '#eaf3ff', color: '#1264c3' }}>
              {visible.length} Classes Configured
            </span>
          </div>
          <p style={{ marginTop: 4, fontSize: 12, color: '#72839a' }}>
            Recommended curriculum classes: <b>{config.classes.join(', ')}</b>
          </p>
        </div>
        <button className="primary" onClick={() => setAdding(true)} style={{ display: 'inline-flex', gap: 6, alignItems: 'center', fontSize: 12 }}>
          <Icons.Plus size={15} /> Add New Class
        </button>
      </section>

      {adding && (
        <Modal title={`Create class / section — ${config.label}`} close={() => setAdding(false)}>
          <form onSubmit={addClass} className="form-grid">
            <label>
              Select Class *
              <select name="class" required defaultValue="">
                <option value="" disabled>-- Select Class --</option>
                {config.classes.map(x => <option key={x} value={x}>{x}</option>)}
              </select>
            </label>
            <label>
              Write Section *
              <input name="section" placeholder="Write Section (e.g. A, B, C)" required autoFocus />
            </label>
            <div style={{ gridColumn: '1/-1', display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
              <button type="button" className="secondary" onClick={() => setAdding(false)}>Cancel</button>
              <button type="submit" className="primary">Create section</button>
            </div>
          </form>
        </Modal>
      )}

      {editingClass && (
        <ManageClassModal
          classObj={editingClass}
          close={() => setEditingClass(null)}
          onUpdate={handleUpdateClass}
          onDelete={handleDeleteClass}
          user={user}
        />
      )}

      {pendingDelete && (
        <PasswordDeleteModal
          title={`Delete ${pendingDelete.type === 'CLASS' ? 'Class' : 'Section'}`}
          itemDescription={pendingDelete.description}
          user={user}
          close={() => setPendingDelete(null)}
          onConfirm={() => {
            if (pendingDelete.type === 'CLASS') {
              handleDeleteClass(pendingDelete.target);
            } else if (pendingDelete.type === 'SECTION') {
              handleQuickRemoveSection(pendingDelete.target.cObj, pendingDelete.target.secName);
            }
          }}
        />
      )}

      <section className="class-grid">
        {visible.map(c => (
          <div className="class-box" key={c.name} style={{ position: 'relative' }}>
            <div className="class-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="class-icon"><Icons.GraduationCap /></div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  className="icon-btn"
                  onClick={() => setEditingClass(c)}
                  title="Edit Class & Sections"
                  style={{ width: 32, height: 32, borderRadius: 7, background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', cursor: 'pointer', display: 'grid', placeItems: 'center' }}
                >
                  <Icons.Pencil size={14} />
                </button>
                <button
                  className="icon-btn"
                  onClick={() => setPendingDelete({ type: 'CLASS', target: c.name, description: `Class "${c.name}" and all its active sections` })}
                  title="Delete Class"
                  style={{ width: 32, height: 32, borderRadius: 7, background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', cursor: 'pointer', display: 'grid', placeItems: 'center' }}
                >
                  <Icons.Trash2 size={14} />
                </button>
              </div>
            </div>
            <h2>{c.name}</h2>
            <p style={{ margin: '4px 0 14px', fontSize: 12, color: '#64748b' }}>
              <b>{c.sections.length}</b> active section{c.sections.length === 1 ? '' : 's'}
            </p>

            <div className="section-pills" style={{ display: 'flex', flexWrap: 'wrap', gap: 6, margin: '10px 0 16px' }}>
              {c.sections.map(x => (
                <span key={x} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', background: '#f1f5f9', borderRadius: 14, fontSize: 11.5, fontWeight: 600, color: '#334155' }}>
                  Section {x}
                  <button
                    type="button"
                    onClick={() => setPendingDelete({ type: 'SECTION', target: { cObj: c, secName: x }, description: `Section ${x} from ${c.name}` })}
                    title={`Delete Section ${x}`}
                    style={{ border: 'none', background: 'transparent', color: '#94a3b8', cursor: 'pointer', fontSize: 13, padding: 0, lineHeight: 1 }}
                  >
                    ×
                  </button>
                </span>
              ))}
              <button
                type="button"
                onClick={() => {
                  const nextSec = String.fromCharCode(65 + c.sections.length);
                  handleQuickAddSection(c, nextSec);
                }}
                title="Add next section"
                style={{ border: '1px dashed #cbd5e1', background: '#ffffff', borderRadius: 14, padding: '4px 10px', fontSize: 11.5, color: '#2563eb', cursor: 'pointer', fontWeight: 600 }}
              >
                + Add Section
              </button>
            </div>

            <button className="text-btn" onClick={() => setEditingClass(c)} style={{ marginTop: 'auto', paddingTop: 8 }}>
              Manage sections & settings <Icons.ArrowRight size={15} />
            </button>
          </div>
        ))}
        {!visible.length && (
          <div className="card" style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40, color: '#64748b' }}>
            <p style={{ margin: 0, fontSize: 15 }}>No classes created yet for <b>{config.label}</b>.</p>
            <button className="primary" onClick={() => setAdding(true)} style={{ marginTop: 14, display: 'inline-flex', gap: 6, alignItems: 'center' }}>
              <Icons.Plus size={16} /> Create First Class
            </button>
          </div>
        )}
      </section>
    </>
  );
}
function Syllabus({ user, schoolClasses = [], currentSession = '2026-27' }){
  const {topics,dbClasses,loading,error,reload,setTopics}=useTopics(currentSession),
        [q,setQ]=useState(''),
        [group,setGroup]=useState('all'),
        [className,setClassName]=useState(''),
        [sectionName,setSectionName]=useState(''),
        [subjectName,setSubjectName]=useState(''),
        [exam,setExam]=useState('ALL'),
        [toast,setToast]=useState(''),
        [uploadOpen,setUploadOpen]=useState(false),
        [addOpen,setAddOpen]=useState(false),
        [checklistOpen,setChecklistOpen]=useState(false),
        [studentSyllabusOpen,setStudentSyllabusOpen]=useState(false),
        [softBoardOpen,setSoftBoardOpen]=useState(false),
        [editingTopic,setEditingTopic]=useState(null),
        [pendingDeleteTopic,setPendingDeleteTopic]=useState(null);

  const isAllGroup = group === 'all';
  const groupClassObjs = isAllGroup ? schoolClasses : schoolClasses.filter(x => (x.group || getClassGroup(x.name)) === group),
        groupTopics = isAllGroup ? topics : topics.filter(x => getClassGroup(x.className) === group),
        availableClasses = useMemo(() => {
          const raw = groupClassObjs.length ? groupClassObjs.map(x => x.name) : groupTopics.map(x => x.className);
          return [...new Set(raw.filter(Boolean))].sort(compareClasses);
        }, [groupClassObjs, groupTopics]),
        hasClassSelected = Boolean(className),
        isAllClass = className === 'ALL',
        classTopics = !hasClassSelected ? [] : (isAllClass ? groupTopics : groupTopics.filter(x => x.className === className)),
        
        // Dynamic section calculation synced with active schoolClasses
        targetClassObj = schoolClasses.find(x => x.name === className),
        rawSections = isAllClass
          ? [...new Set(classTopics.map(x => x.section).filter(Boolean))]
          : ((targetClassObj && targetClassObj.sections) ? targetClassObj.sections : [...new Set(classTopics.map(x => x.section).filter(Boolean))]),
        availableSections = (rawSections.length ? rawSections : ['A', 'B']).sort(),
        hasSectionSelected = Boolean(sectionName),
        isAllSection = sectionName === 'ALL',
        sectionTopics = !hasSectionSelected ? [] : (isAllSection ? classTopics : classTopics.filter(x => (x.section || 'A') === sectionName)),

        availableSubjects = (hasClassSelected && hasSectionSelected) ? [...new Set(sectionTopics.map(x => x.subject).filter(Boolean))].sort() : [],
        hasSubjectSelected = Boolean(subjectName),
        isAllSubject = subjectName === 'ALL',
        subjectTopics = !hasSubjectSelected ? [] : (isAllSubject ? sectionTopics : sectionTopics.filter(x => x.subject === subjectName)),
        eligible = examTopics(subjectTopics, group, exam);

  // Strictly sort data in ASCENDING ORDER: Nursery -> LKG -> UKG -> Class 1 -> Class 2 -> ... -> Class 12, then Section A->B
  const data = useMemo(() => {
    const list = eligible.filter(x => (x.chapter + x.subject + x.topic + x.month + x.className + (x.section || '') + (x.assessment || '')).toLowerCase().includes(q.toLowerCase()));
    return list.slice().sort((a, b) => {
      // 1. Sort by Class strictly ascending: Nursery -> LKG -> UKG -> Class 1 -> Class 2 -> ... -> Class 12
      const cDiff = compareClasses(a.className, b.className);
      if (cDiff !== 0) return cDiff;

      // 2. Sort by Section ascending: A -> B -> C...
      const secA = String(a.section || 'A').toUpperCase();
      const secB = String(b.section || 'B').toUpperCase();
      const sDiff = secA.localeCompare(secB);
      if (sDiff !== 0) return sDiff;

      // 3. Sort by Subject alphabetical
      const subjA = String(a.subject || '');
      const subjB = String(b.subject || '');
      const subDiff = subjA.localeCompare(subjB);
      if (subDiff !== 0) return subDiff;

      // 4. Sort by Month in academic calendar order (handles both term-ranges and full month names)
      const mIdxA = getMonthSortIndex(a.month);
      const mIdxB = getMonthSortIndex(b.month);
      if (mIdxA !== mIdxB) return mIdxA - mIdxB;

      return 0;
    });
  }, [eligible, q]);

  const done = eligible.filter(x => x.status === 'Done').length,
        active = eligible.filter(x => x.status === 'In Progress').length,
        progress = eligible.length ? Math.round(done / eligible.length * 100) : 0;

  const chooseGroup = g => {
    setGroup(g);
    setClassName('');
    setSectionName('');
    setSubjectName('');
    setExam('ALL');
  };
  const chooseClass = c => { setClassName(c); setSectionName(''); setSubjectName(''); };
  
  const updateStatus = async (x, status) => {
    try {
      await saveTopic({ ...x, status });
      setTopics(prev => prev.map(t => t.id === x.id ? { ...t, status } : t));
      await reload();
      setToast('Status updated successfully.');
    } catch(e) { setToast(e.message); }
  };

  const remove = async x => {
    try {
      // Determine if this record exists on the server:
      // Real Supabase UUIDs match standard UUID format.
      // Skip local-only IDs: demo-*, custom-*, s_*, or numeric-only IDs.
      const id = String(x.id || '');
      const isServerRecord = supabase && id &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

      if (isServerRecord) {
        let { error } = await supabase.from('syllabus_topics').delete().eq('id', x.id);
        if (error) throw error;
      }
      // Always remove from local state & localStorage
      setTopics(prev => prev.filter(t => t.id !== x.id));
      await reload();
      setToast('🗑️ Record deleted successfully.');
    } catch(e) {
      console.error(e);
      setToast('⚠️ ' + (e.message || 'Failed to delete record.'));
    }
  };

  const handleDownloadExcel = () => {
    if (!hasClassSelected) {
      setToast('⚠️ Please select a Class or "All Classes" first to export to Excel.');
      return;
    }
    if (!hasSectionSelected) {
      setToast('⚠️ Please select a Section or "All Sections" first to export to Excel.');
      return;
    }
    exportSyllabusToExcel(data, { group, className: isAllClass ? 'ALL' : className, subjectName: isAllSubject ? 'ALL' : subjectName, exam });
    setToast(`📥 Exported ${data.length} records to Excel successfully.`);
  };

  return <>
    <div className="page-head" style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:12}}>
      <div>
        <span className="eyebrow">ACADEMIC SESSION {currentSession ? currentSession.replace('-', '–') : '2026–27'} · MONTHLY TRACKER</span>
        <h1>Syllabus Progress</h1>
        <p>Filter by group, class, section, subject, or exam pattern and manage live records via Excel</p>
      </div>
      <div style={{display:'flex',gap:10,alignItems:'center',flexWrap:'wrap'}}>
        <button
          className="secondary"
          type="button"
          onClick={() => {
            if (!hasClassSelected) {
              setToast('⚠️ Please select a Class or "All Classes" first to generate Student Syllabus.');
              return;
            }
            if (!hasSectionSelected) {
              setToast('⚠️ Please select a Section or "All Sections" first to generate Student Syllabus.');
              return;
            }
            setStudentSyllabusOpen(true);
          }}
          style={{ display: 'inline-flex', gap: 7, alignItems: 'center', fontWeight: 700, color: '#1d4ed8', borderColor: '#bfdbfe', background: '#eff6ff' }}
          title="Generate A4 Student Academic Syllabus PDF to distribute to students"
        >
          <Icons.GraduationCap size={16} color="#1d4ed8"/> 🎓 Student Syllabus PDF
        </button>
        <button
          className="secondary"
          type="button"
          onClick={() => {
            if (!hasClassSelected) {
              setToast('⚠️ Please select a Class or "All Classes" first to generate Soft Board Syllabus.');
              return;
            }
            if (!hasSectionSelected) {
              setToast('⚠️ Please select a Section or "All Sections" first to generate Soft Board Syllabus.');
              return;
            }
            setSoftBoardOpen(true);
          }}
          style={{ display: 'inline-flex', gap: 7, alignItems: 'center', fontWeight: 700, color: '#047857', borderColor: '#a7f3d0', background: '#ecfdf5' }}
          title="Generate A4 Classroom Display / Soft Board Syllabus PDF to pin in class"
        >
          <Icons.Pin size={16} color="#059669"/> 📌 Class Soft Board PDF
        </button>
        <button
          className="secondary"
          type="button"
          onClick={() => {
            if (!hasClassSelected) {
              setToast('⚠️ Please select a Class or "All Classes" first to generate Principal checklist.');
              return;
            }
            if (!hasSectionSelected) {
              setToast('⚠️ Please select a Section or "All Sections" first to generate Principal checklist.');
              return;
            }
            setChecklistOpen(true);
          }}
          style={{ display: 'inline-flex', gap: 7, alignItems: 'center', fontWeight: 700, color: '#dc2626', borderColor: '#fecaca', background: '#fef2f2' }}
          title="Generate A4 Principal Syllabus Inspection Checklist PDF"
        >
          <Icons.Printer size={16} color="#dc2626"/> 🖨️ Principal Checklist PDF
        </button>
        <button className="primary" type="button" onClick={()=>setAddOpen(true)} style={{display:'inline-flex',gap:7,alignItems:'center',fontWeight:700,background:'#2563eb'}}>
          <Icons.Plus size={16}/> Add Syllabus Record
        </button>
        <button className="secondary" type="button" onClick={downloadSampleExcelTemplate} style={{display:'inline-flex',gap:7,alignItems:'center',fontWeight:600,color:'#166534',borderColor:'#bbf7d0',background:'#f0fdf4'}} title="Download official Excel template with column formatting">
          <Icons.FileSpreadsheet size={16} color="#16a34a"/> Sample Excel Template
        </button>
        <button className="secondary" type="button" onClick={handleDownloadExcel} style={{display:'inline-flex',gap:7,alignItems:'center',fontWeight:700}}>
          <Icons.Download size={16} color="#1d4ed8"/> Download Filtered Excel ({data.length})
        </button>
        <button className="secondary" type="button" onClick={()=>setUploadOpen(true)} style={{display:'inline-flex',gap:7,alignItems:'center'}}>
          <Icons.Upload size={16}/> Upload & Update Excel
        </button>
      </div>
    </div>

    <div className="filters">
      <button className={group==='all'?'primary':'secondary'} onClick={()=>chooseGroup('all')}>🏫 All Classes (Nursery to 12th)</button>
      <button className={group==='preprimary'?'primary':'secondary'} onClick={()=>chooseGroup('preprimary')}>Nursery / LKG / UKG</button>
      <button className={group==='primary'?'primary':'secondary'} onClick={()=>chooseGroup('primary')}>1st To 8th</button>
      <button className={group==='senior'?'primary':'secondary'} onClick={()=>chooseGroup('senior')}>9th To 12th</button>
      <select value={className} onChange={e=>chooseClass(e.target.value)} aria-label="Filter by class">
        <option value="">Select Class</option>
        <option value="ALL">🏫 All Classes (Nursery to 12th)</option>
        {availableClasses.map(x=><option key={x} value={x}>{x}</option>)}
      </select>
      <select value={sectionName} onChange={e=>setSectionName(e.target.value)} aria-label="Filter by section" disabled={!hasClassSelected}>
        <option value="">Select Section</option>
        <option value="ALL">All Sections</option>
        {availableSections.map(x=><option key={x} value={x}>Section {x}</option>)}
      </select>
      <select value={subjectName} onChange={e=>setSubjectName(e.target.value)} aria-label="Filter by subject" disabled={!hasClassSelected || !hasSectionSelected}>
        <option value="">Select Subject</option>
        <option value="ALL">All Subjects</option>
        {availableSubjects.map(x=><option key={x} value={x}>{x}</option>)}
      </select>
    </div>

    <ToastNotification toast={toast || error} onClose={() => setToast('')} />

    {!hasClassSelected ? (
      <section className="card" style={{ padding: '48px 24px', textAlign: 'center', background: '#f8fafc', border: '1.5px dashed #cbd5e1', borderRadius: 12, marginTop: 16 }}>
        <div style={{ width: 56, height: 56, background: '#eff6ff', color: '#1d4ed8', borderRadius: '50%', display: 'grid', placeItems: 'center', margin: '0 auto 14px' }}>
          <Icons.GraduationCap size={28}/>
        </div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', margin: '0 0 6px' }}>पाठ्यक्रम देखने के लिए कृपया कक्षा का चयन करें</h3>
        <p style={{ fontSize: 13, color: '#64748b', margin: '0 auto', maxWidth: 480 }}>
          पाठ्यक्रम देखने के लिए ऊपर दिए गए ड्रॉपडाउन से अपनी <b>कक्षा (Class)</b> (जैसे <i>Class 1, Class 5...</i>) अथवा <b>"All Classes"</b> का चयन करें।
        </p>
      </section>
    ) : !hasSectionSelected ? (
      <section className="card" style={{ padding: '48px 24px', textAlign: 'center', background: '#f8fafc', border: '1.5px dashed #cbd5e1', borderRadius: 12, marginTop: 16 }}>
        <div style={{ width: 56, height: 56, background: '#eff6ff', color: '#1d4ed8', borderRadius: '50%', display: 'grid', placeItems: 'center', margin: '0 auto 14px' }}>
          <Icons.Layers size={28}/>
        </div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', margin: '0 0 6px' }}>पाठ्यक्रम देखने के लिए कृपया सेक्शन (Section) का चयन करें</h3>
        <p style={{ fontSize: 13, color: '#64748b', margin: '0 auto', maxWidth: 480 }}>
          <b>{isAllClass ? 'सभी कक्षाओं' : className}</b> का पाठ्यक्रम देखने के लिए ऊपर दिए गए ड्रॉपडाउन से अपना <b>सेक्शन (Section)</b> (जैसे <i>Section A, Section B...</i>) अथवा <b>"All Sections"</b> का चयन करें।
        </p>
      </section>
    ) : !hasSubjectSelected ? (
      <section className="card" style={{ padding: '48px 24px', textAlign: 'center', background: '#f8fafc', border: '1.5px dashed #cbd5e1', borderRadius: 12, marginTop: 16 }}>
        <div style={{ width: 56, height: 56, background: '#eff6ff', color: '#1d4ed8', borderRadius: '50%', display: 'grid', placeItems: 'center', margin: '0 auto 14px' }}>
          <Icons.BookOpen size={28}/>
        </div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', margin: '0 0 6px' }}>पाठ्यक्रम देखने के लिए कृपया विषय (Subject) का चयन करें</h3>
        <p style={{ fontSize: 13, color: '#64748b', margin: '0 auto', maxWidth: 480 }}>
          <b>{isAllClass ? 'सभी कक्षाओं' : className}</b> का पाठ्यक्रम देखने के लिए ऊपर दिए गए ड्रॉपडाउन से अपना <b>विषय (Subject)</b> (जैसे <i>English, Physics...</i>) अथवा <b>"All Subjects"</b> का चयन करें।
        </p>
      </section>
    ) : (
      <>
        <section className="card" style={{marginBottom:18}}>
          <span className="eyebrow">
            EXAM PATTERN · {isAllClass ? (group === 'all' ? 'ALL CLASSES (NURSERY TO 12TH)' : (group === 'primary' ? '1ST TO 8TH' : (group === 'preprimary' ? 'NURSERY / LKG / UKG' : '9TH TO 12TH'))) : className}{!isAllSubject ? ` · ${subjectName}` : ''}
          </span>
          <div className="filters" style={{margin:'12px 0 0'}}>
            {(examPatterns[group] || examPatterns.all).map(([name])=>{
              let count=examTopics(subjectTopics,group,name).length;
              return <button key={name} className={exam===name?'primary':'secondary'} onClick={()=>setExam(name)}>{name} ({count})</button>
            })}
          </div>
        </section>

        <div className="stats compact">
          <div className="stat"><div><small>{exam} TOTAL</small><strong>{eligible.length}</strong></div><i><Icons.ListChecks/></i></div>
          <div className="stat"><div><small>DONE</small><strong>{done}</strong></div><i><Icons.CircleCheck/></i></div>
          <div className="stat"><div><small>IN PROGRESS</small><strong>{active}</strong></div><i><Icons.Clock3/></i></div>
          <div className="stat"><div><small>PROGRESS</small><strong>{progress}%</strong></div><i><Icons.ChartNoAxesCombined/></i></div>
        </div>

        <div className="filters" style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:10}}>
          <div className="search" style={{flex:1,maxWidth:450}}>
            <Icons.Search/><input placeholder="Search class, subject, topic or chapter..." onChange={e=>setQ(e.target.value)}/>
          </div>
          <div style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}>
            <button
              className="secondary"
              type="button"
              onClick={() => {
                if (!hasClassSelected || !hasSectionSelected) {
                  setToast('⚠️ Please select Class & Section first to generate Student Syllabus.');
                  return;
                }
                setStudentSyllabusOpen(true);
              }}
              style={{ display: 'inline-flex', gap: 6, alignItems: 'center', color: '#1d4ed8', borderColor: '#bfdbfe', background: '#eff6ff', fontWeight: 700, fontSize: 12 }}
              title="Generate A4 Student Academic Syllabus PDF"
            >
              <Icons.GraduationCap size={15} color="#1d4ed8"/> 🎓 Student Syllabus PDF
            </button>
            <button
              className="secondary"
              type="button"
              onClick={() => {
                if (!hasClassSelected || !hasSectionSelected) {
                  setToast('⚠️ Please select Class & Section first to generate Soft Board Syllabus.');
                  return;
                }
                setSoftBoardOpen(true);
              }}
              style={{ display: 'inline-flex', gap: 6, alignItems: 'center', color: '#047857', borderColor: '#a7f3d0', background: '#ecfdf5', fontWeight: 700, fontSize: 12 }}
              title="Generate A4 Classroom Soft Board Display PDF"
            >
              <Icons.Pin size={15} color="#059669"/> 📌 Class Soft Board PDF
            </button>
            <button
              className="secondary"
              type="button"
              onClick={() => {
                if (!hasClassSelected || !hasSectionSelected) {
                  setToast('⚠️ Please select Class & Section first to generate Principal checklist.');
                  return;
                }
                setChecklistOpen(true);
              }}
              style={{ display: 'inline-flex', gap: 6, alignItems: 'center', color: '#dc2626', borderColor: '#fecaca', background: '#fef2f2', fontWeight: 700, fontSize: 12 }}
              title="Generate A4 Principal Inspection PDF"
            >
              <Icons.Printer size={15} color="#dc2626"/> 🖨️ Principal Checklist PDF
            </button>
            <button className="text-btn" onClick={handleDownloadExcel}>
              <Icons.FileSpreadsheet size={15}/> Export View to Excel
            </button>
          </div>
        </div>

        <section className="card">
          <CardTitle
            title={exam==='ALL'?'Complete month-wise syllabus':`${exam} eligible syllabus`}
            subtitle={loading?'Loading database…':`${data.length} matching records`}
          />
          <div className="table-wrap">
            <table className="wide">
              <thead>
                <tr>
                  <th>Class</th>
                  <th>Month / Term</th>
                  <th>Subject</th>
                  <th>Chapter / Title</th>
                  <th>Detailed Syllabus</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map(x=>(
                  <tr key={x.id} className={'row-'+x.status.toLowerCase().replace(/\s+/g,'-')}>
                    <td><b>{x.className}</b>{x.section && <><br/><small style={{color:'#2563eb',fontWeight:600}}>Sec {x.section}</small></>}</td>
                    <td><span className="badge">{x.month}</span>{x.assessment&&<><br/><small style={{color:'#72839a'}}>{x.assessment}</small></>}</td>
                    <td><b>{x.subject}</b></td>
                    <td>{x.chapter}</td>
                    <td>
                      <div style={{maxHeight:120,overflowY:'auto',whiteSpace:'pre-line'}}>{x.topic}</div>
                      {x.practical && (
                        <div style={{ marginTop: 6, background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '4px 8px', borderRadius: 6, color: '#166534', fontSize: 11, fontWeight: 600, display: 'inline-flex', gap: 5, alignItems: 'center' }}>
                          🔬 <span><b>Practical:</b> {x.practical}</span>
                        </div>
                      )}
                      {x.project && (
                        <div style={{ marginTop: 6, background: '#eff6ff', border: '1px solid #bfdbfe', padding: '4px 8px', borderRadius: 6, color: '#1e40af', fontSize: 11, fontWeight: 600, display: 'inline-flex', gap: 5, alignItems: 'center' }}>
                          📁 <span><b>Project:</b> {x.project}</span>
                        </div>
                      )}
                    </td>
                    <td>
                      <select
                        className={'status-select status-'+x.status.toLowerCase().replace(/\s+/g,'-')}
                        value={x.status}
                        onChange={e=>updateStatus(x,e.target.value)}
                      >
                        {statusValues.map(s=><option key={s}>{s}</option>)}
                      </select>
                    </td>
                    <td>
                      <div className="action-buttons" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <button
                          className="icon-btn"
                          onClick={()=>setEditingTopic(x)}
                          title="Edit syllabus record"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 32,
                            height: 32,
                            borderRadius: 6,
                            background: '#eff6ff',
                            color: '#1d4ed8',
                            border: '1px solid #bfdbfe',
                            cursor: 'pointer'
                          }}
                        >
                          <Icons.Pencil size={15}/>
                        </button>
                        <button
                          className="icon-btn danger"
                          onClick={()=>setPendingDeleteTopic(x)}
                          title="Delete record"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 32,
                            height: 32,
                            borderRadius: 6,
                            background: '#fef2f2',
                            color: '#dc2626',
                            border: '1px solid #fecaca',
                            cursor: 'pointer'
                          }}
                        >
                          <Icons.Trash2 size={15}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </>
    )}

    {studentSyllabusOpen && (
      <StudentSyllabusModal
        data={data}
        filters={{
          group,
          className: isAllClass ? 'ALL' : className,
          sectionName: isAllSection ? 'ALL' : sectionName,
          subjectName: isAllSubject ? 'ALL' : subjectName,
          exam
        }}
        currentSession={currentSession}
        close={() => setStudentSyllabusOpen(false)}
      />
    )}

    {softBoardOpen && (
      <SoftBoardSyllabusModal
        data={data}
        filters={{
          group,
          className: isAllClass ? 'ALL' : className,
          sectionName: isAllSection ? 'ALL' : sectionName,
          subjectName: isAllSubject ? 'ALL' : subjectName,
          exam
        }}
        currentSession={currentSession}
        close={() => setSoftBoardOpen(false)}
      />
    )}

    {checklistOpen && (
      <PrincipalChecklistModal
        data={data}
        filters={{
          group,
          className: isAllClass ? 'ALL' : className,
          sectionName: isAllSection ? 'ALL' : sectionName,
          subjectName: isAllSubject ? 'ALL' : subjectName,
          exam
        }}
        close={() => setChecklistOpen(false)}
      />
    )}

    {pendingDeleteTopic && (
      <PasswordDeleteModal
        title="Delete Syllabus Record"
        itemDescription={`Syllabus Topic "${pendingDeleteTopic.chapter || pendingDeleteTopic.subject}" (${pendingDeleteTopic.className || ''}${pendingDeleteTopic.section ? ' · Sec ' + pendingDeleteTopic.section : ''})`}
        user={user}
        close={() => setPendingDeleteTopic(null)}
        onConfirm={() => remove(pendingDeleteTopic)}
      />
    )}

    {addOpen && (
      <AddSyllabusModal
        defaultClass={className}
        defaultSubject={subjectName}
        close={()=>setAddOpen(false)}
        dbClasses={dbClasses}
        schoolClasses={schoolClasses}
        reload={reload}
        setTopics={setTopics}
        onSuccess={(msg)=>setToast(msg)}
      />
    )}

    {editingTopic && (
      <EditSyllabusModal
        topic={editingTopic}
        close={()=>setEditingTopic(null)}
        dbClasses={dbClasses}
        schoolClasses={schoolClasses}
        reload={reload}
        setTopics={setTopics}
        onSuccess={(msg)=>setToast(msg)}
      />
    )}

    {uploadOpen && (
      <UploadSyllabusModal
        close={()=>setUploadOpen(false)}
        dbClasses={dbClasses}
        reload={reload}
        setTopics={setTopics}
        onSuccess={(msg)=>setToast(msg)}
      />
    )}
  </>;
}

function Tracker({ type, schoolClasses = [], user, currentSession = '2026-27' }) {
  const { topics, dbClasses, loading, error, reload, setTopics } = useTopics(currentSession);
  const [q, setQ] = useState('');
  const [group, setGroup] = useState('all');
  const [className, setClassName] = useState('');
  const [sectionName, setSectionName] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [toast, setToast] = useState('');
  const [editingTopic, setEditingTopic] = useState(null);

  // Filter topics specifically for Practicals vs Projects vs Assessments
  const relevantTopics = useMemo(() => {
    if (type === 'Practical') return topics.filter(x => Boolean(x.practical && x.practical.trim()));
    if (type === 'Project') return topics.filter(x => Boolean(x.project && x.project.trim()));
    return topics; // Assessment tracker uses all topics
  }, [topics, type]);

  const isAllGroup = group === 'all';
  const groupClassObjs = useMemo(() => isAllGroup ? schoolClasses : schoolClasses.filter(x => (x.group || getClassGroup(x.name)) === group), [schoolClasses, group, isAllGroup]);
  const groupTopics = useMemo(() => isAllGroup ? relevantTopics : relevantTopics.filter(x => getClassGroup(x.className) === group), [relevantTopics, group, isAllGroup]);
  
  const availableClasses = useMemo(() => {
    const raw = groupClassObjs.length ? groupClassObjs.map(x => x.name) : groupTopics.map(x => x.className);
    return [...new Set(raw.filter(Boolean))].sort(compareClasses);
  }, [groupClassObjs, groupTopics]);

  const isAllClass = !className || className === 'ALL';
  const classTopics = useMemo(() => {
    return isAllClass ? groupTopics : groupTopics.filter(x => x.className === className);
  }, [isAllClass, groupTopics, className]);

  // Dynamic section calculation synced with active schoolClasses
  const availableSections = useMemo(() => {
    let raw = [];
    if (isAllClass) {
      raw = [...new Set(classTopics.map(x => x.section).filter(Boolean))];
    } else {
      const targetClassObj = schoolClasses.find(x => x.name === className);
      raw = (targetClassObj && targetClassObj.sections) ? targetClassObj.sections : [...new Set(classTopics.map(x => x.section).filter(Boolean))];
    }
    return (raw.length ? raw : ['A', 'B']).sort();
  }, [isAllClass, classTopics, schoolClasses, className]);

  const isAllSection = !sectionName || sectionName === 'ALL';
  const sectionTopics = useMemo(() => {
    return isAllSection ? classTopics : classTopics.filter(x => (x.section || 'A') === sectionName);
  }, [isAllSection, classTopics, sectionName]);

  const availableSubjects = useMemo(() => {
    return [...new Set(sectionTopics.map(x => x.subject).filter(Boolean))].sort();
  }, [sectionTopics]);

  const hasSubjectSelected = Boolean(subjectName);
  const isAllSubject = subjectName === 'ALL';
  const subjectTopics = useMemo(() => {
    if (!hasSubjectSelected) return [];
    return isAllSubject ? sectionTopics : sectionTopics.filter(x => x.subject === subjectName);
  }, [hasSubjectSelected, isAllSubject, sectionTopics, subjectName]);

  const data = useMemo(() => {
    const filtered = subjectTopics.filter(x => {
      const searchStr = `${x.chapter} ${x.subject} ${x.topic} ${x.month} ${x.className} ${x.section || ''} ${x.practical || ''} ${x.project || ''}`.toLowerCase();
      return searchStr.includes(q.toLowerCase());
    });

    return filtered.sort((a, b) => {
      // 1. Sort by Class strictly ascending: Nursery -> LKG -> UKG -> Class 1 -> Class 2 -> ... -> Class 12
      const cDiff = compareClasses(a.className, b.className);
      if (cDiff !== 0) return cDiff;

      // 2. Sort by Section ascending: A -> B -> C...
      const secA = String(a.section || 'A').toUpperCase();
      const secB = String(b.section || 'B').toUpperCase();
      const sDiff = secA.localeCompare(secB);
      if (sDiff !== 0) return sDiff;

      // 3. Subject alphabetical
      const subjA = String(a.subject || '');
      const subjB = String(b.subject || '');
      const subDiff = subjA.localeCompare(subjB);
      if (subDiff !== 0) return subDiff;

      // 4. Month in calendar order (handles both term-ranges and full month names)
      const mIdxA = getMonthSortIndex(a.month);
      const mIdxB = getMonthSortIndex(b.month);
      if (mIdxA !== mIdxB) return mIdxA - mIdxB;

      return 0;
    });
  }, [subjectTopics, q]);

  const doneCount = useMemo(() => data.filter(x => x.status === 'Done').length, [data]);
  const inProgressCount = useMemo(() => data.filter(x => x.status === 'In Progress').length, [data]);
  const progressPct = data.length ? Math.round((doneCount / data.length) * 100) : 0;

  const chooseGroup = g => {
    setGroup(g);
    setClassName('');
    setSectionName('');
    setSubjectName('');
  };

  const updateStatus = async (x, newStatus) => {
    try {
      await saveTopic({ ...x, status: newStatus });
      setTopics(prev => prev.map(t => t.id === x.id ? { ...t, status: newStatus } : t));
      await reload();
      setToast('Status updated successfully.');
    } catch (e) {
      setToast(e.message || 'Failed to update status.');
    }
  };

  return (
    <>
      <div className="page-head">
        <div>
          <span className="eyebrow">ACADEMIC SESSION {currentSession ? currentSession.replace('-', '–') : '2026–27'} · {type === 'Practical' ? 'LABORATORY & ACTIVITY WORK' : type === 'Project' ? 'PROJECT & ASSIGNMENT WORK' : 'ACADEMIC EVALUATION'}</span>
          <h1>{type} Tracker</h1>
          <p>
            {type === 'Practical'
              ? 'Live map of practicals, experiments & lab activities entered in the syllabus tracker'
              : type === 'Project'
              ? 'Live map of student projects, models & assignments entered in the syllabus tracker'
              : 'Monitor subject-wise assessment completion and status across all terms'}
          </p>
        </div>
      </div>

      {/* Live Group Filter Pills */}
      <div className="filters" style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
        <button className={group === 'all' ? 'primary' : 'secondary'} onClick={() => chooseGroup('all')}>
          🏫 All Classes (Nursery to 12th)
        </button>
        <button className={group === 'preprimary' ? 'primary' : 'secondary'} onClick={() => chooseGroup('preprimary')}>
          Nursery / LKG / UKG
        </button>
        <button className={group === 'primary' ? 'primary' : 'secondary'} onClick={() => chooseGroup('primary')}>
          1st To 8th
        </button>
        <button className={group === 'senior' ? 'primary' : 'secondary'} onClick={() => chooseGroup('senior')}>
          9th To 12th
        </button>

        <select value={className} onChange={e => { setClassName(e.target.value); setSectionName(''); setSubjectName(''); }} aria-label="Filter by class">
          <option value="">Select Class</option>
          <option value="ALL">🏫 All Classes (Nursery to 12th)</option>
          {availableClasses.map(x => <option key={x} value={x}>{x}</option>)}
        </select>

        <select value={sectionName} onChange={e => { setSectionName(e.target.value); setSubjectName(''); }} aria-label="Filter by section">
          <option value="">Select Section</option>
          <option value="ALL">All Sections</option>
          {availableSections.map(x => <option key={x} value={x}>Section {x}</option>)}
        </select>

        <select value={subjectName} onChange={e => setSubjectName(e.target.value)} aria-label="Filter by subject">
          <option value="">Select Subject</option>
          <option value="ALL">All Subjects</option>
          {availableSubjects.map(x => <option key={x} value={x}>{x}</option>)}
        </select>
      </div>

      <ToastNotification toast={toast} onClose={() => setToast('')} />

      {/* Stats compact grid */}
      <div className="stats compact" style={{ marginBottom: 18 }}>
        <div className="stat"><div><small>TOTAL {type.toUpperCase()}S</small><strong>{data.length}</strong></div><i>{type === 'Practical' ? <Icons.FlaskConical /> : type === 'Project' ? <Icons.FolderOpen /> : <Icons.BookOpen />}</i></div>
        <div className="stat"><div><small>DONE</small><strong>{doneCount}</strong></div><i><Icons.CircleCheck /></i></div>
        <div className="stat"><div><small>IN PROGRESS</small><strong>{inProgressCount}</strong></div><i><Icons.Clock3 /></i></div>
        <div className="stat"><div><small>PROGRESS</small><strong>{progressPct}%</strong></div><i><Icons.ChartNoAxesCombined /></i></div>
      </div>

      {/* Search Input Bar */}
      <div className="filters" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
        <div className="search" style={{ flex: 1, maxWidth: 450 }}>
          <Icons.Search />
          <input placeholder={`Search ${type.toLowerCase()} subject, class, topic, or ${type === 'Practical' ? 'practical' : type === 'Project' ? 'project' : 'assessment'} entry...`} onChange={e => setQ(e.target.value)} />
        </div>
        <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>
          Showing <b>{data.length}</b> live {type.toLowerCase()} records
        </span>
      </div>

      {/* Table Card */}
      <section className="card">
        <CardTitle
          title={type === 'Practical' ? 'Mapped Practical & Laboratory Records' : type === 'Project' ? 'Mapped Project & Assignment Records' : 'Current Assessment Status'}
          subtitle={loading ? 'Loading database…' : `${data.length} matching live records`}
        />
        <div className="table-wrap">
          {data.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 24px', background: '#f8fafc', border: '1.5px dashed #cbd5e1', borderRadius: 12, margin: '12px 0' }}>
              <div style={{ width: 56, height: 56, background: '#eff6ff', color: '#1d4ed8', borderRadius: '50%', display: 'grid', placeItems: 'center', margin: '0 auto 14px' }}>
                {type === 'Practical' ? <Icons.FlaskConical size={28} /> : type === 'Project' ? <Icons.FolderOpen size={28} /> : <Icons.BookOpen size={28} />}
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', margin: '0 0 6px' }}>
                {type === 'Practical' ? 'कोई प्रैक्टिकल रिकॉर्ड उपलब्ध नहीं है' : type === 'Project' ? 'कोई प्रोजेक्ट रिकॉर्ड उपलब्ध नहीं है' : 'कोई असेसमेंट रिकॉर्ड उपलब्ध नहीं है'}
              </h3>
              <p style={{ fontSize: 13, color: '#64748b', margin: '0 auto', maxWidth: 480 }}>
                {type === 'Practical'
                  ? 'चयनित क्लास या फ़िल्टर में Practical / Lab Work एंट्री वाला कोई रिकॉर्ड नहीं मिला। सिलेबस प्रोग्रेस में जाकर विषय एडिट करें और "Practical / Lab Work" कॉलम में एंट्री दर्ज करें।'
                  : type === 'Project'
                  ? 'चयनित क्लास या फ़िल्टर में Project Work एंट्री वाला कोई रिकॉर्ड नहीं मिला। सिलेबस प्रोग्रेस में जाकर विषय एडिट करें और "Project Work" कॉलम में एंट्री दर्ज करें।'
                  : 'चयनित फ़िल्टर के लिए कोई रिकॉर्ड उपलब्ध नहीं है।'}
              </p>
            </div>
          ) : (
            <table className="wide">
              <thead>
                <tr>
                  <th>Class</th>
                  <th>Month / Term</th>
                  <th>Subject</th>
                  <th>Chapter / Title</th>
                  {type === 'Practical' ? <th>🔬 Practical / Lab Work Entry</th> : type === 'Project' ? <th>📁 Project / Assignment Entry</th> : <th>Detailed Syllabus</th>}
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map(x => (
                  <tr key={x.id} className={'row-' + x.status.toLowerCase().replace(/\s+/g, '-')}>
                    <td><b>{x.className}</b>{x.section && <><br /><small style={{ color: '#2563eb', fontWeight: 600 }}>Sec {x.section}</small></>}</td>
                    <td><span className="badge">{x.month}</span>{x.assessment && <><br /><small style={{ color: '#72839a' }}>{x.assessment}</small></>}</td>
                    <td><b>{x.subject}</b></td>
                    <td>{x.chapter}</td>
                    <td>
                      {type === 'Practical' ? (
                        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '8px 12px', borderRadius: 8, color: '#166534', fontWeight: 600, fontSize: 12, whiteSpace: 'pre-line' }}>
                          🔬 {x.practical}
                        </div>
                      ) : type === 'Project' ? (
                        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '8px 12px', borderRadius: 8, color: '#1e40af', fontWeight: 600, fontSize: 12, whiteSpace: 'pre-line' }}>
                          📁 {x.project}
                        </div>
                      ) : (
                        <div style={{ maxHeight: 120, overflowY: 'auto', whiteSpace: 'pre-line' }}>{x.topic}</div>
                      )}
                    </td>
                    <td>
                      <select
                        className={'status-select status-' + x.status.toLowerCase().replace(/\s+/g, '-')}
                        value={x.status}
                        onChange={e => updateStatus(x, e.target.value)}
                      >
                        {statusValues.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                    <td>
                      <button
                        className="icon-btn"
                        onClick={() => setEditingTopic(x)}
                        title={`Edit ${type.toLowerCase()}/syllabus record`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 32,
                          height: 32,
                          borderRadius: 6,
                          background: '#eff6ff',
                          color: '#1d4ed8',
                          border: '1px solid #bfdbfe',
                          cursor: 'pointer'
                        }}
                      >
                        <Icons.Pencil size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {editingTopic && (
        <EditSyllabusModal
          topic={editingTopic}
          close={() => setEditingTopic(null)}
          dbClasses={dbClasses}
          schoolClasses={schoolClasses}
          reload={reload}
          setTopics={setTopics}
          onSuccess={msg => setToast(msg)}
        />
      )}
    </>
  );
}
function Users({user}){
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('school_users_list');
      if (saved) return JSON.parse(saved);
    } catch(e) {}
    return DEFAULT_USERS_LIST;
  });
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [modalUser, setModalUser] = useState(null); // null or user object
  const [deleteUser, setDeleteUser] = useState(null); // null or user object to delete
  const [toast, setToast] = useState(null); // { type: 'success' | 'error', text }

  function showToast(type, text) {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  }

  // Sync from Supabase profiles if connected
  useEffect(() => {
    if (!supabase) return;
    supabase.from('profiles').select('*').then(({ data, error }) => {
      if (!error && data && data.length > 0) {
        setUsers(prev => {
          const permMap = JSON.parse(localStorage.getItem('user_permissions_map') || '{}');
          const merged = [...prev];
          data.forEach(dbU => {
            const idx = merged.findIndex(u => u.id === dbU.id || u.name === dbU.full_name);
            const email = (idx >= 0 ? merged[idx].email : '') || `${dbU.full_name.toLowerCase().replace(/[^a-z0-9]/g, '')}@savitrischool.edu.in`;
            const perms = permMap[email] || (idx >= 0 ? merged[idx].permissions : null) || (dbU.role === 'ADMIN' ? ALL_PERMISSIONS_KEYS : DEFAULT_OPERATOR_PERMS);
            const updated = {
              id: dbU.id,
              name: dbU.full_name,
              email: email,
              role: dbU.role,
              active: dbU.active !== false,
              created_at: dbU.created_at || (idx >= 0 ? merged[idx].created_at : new Date().toISOString()),
              permissions: perms
            };
            if (idx >= 0) merged[idx] = updated;
            else merged.push(updated);
          });
          localStorage.setItem('school_users_list', JSON.stringify(merged));
          return merged;
        });
      }
    });
  }, []);

  function saveUsersList(updatedList) {
    setUsers(updatedList);
    localStorage.setItem('school_users_list', JSON.stringify(updatedList));
    const permMap = {};
    updatedList.forEach(u => {
      if (u.email) permMap[u.email] = u.permissions;
    });
    localStorage.setItem('user_permissions_map', JSON.stringify(permMap));
  }

  async function handleSaveUser(formData) {
    try {
      if (!formData.name?.trim()) {
        showToast('error', 'Please enter user full name.');
        return;
      }
      if (!formData.email?.trim()) {
        showToast('error', 'Please enter a valid email address.');
        return;
      }

      if (formData.id) {
        // Edit existing user
        const updatedList = users.map(u => u.id === formData.id ? {
          ...u,
          name: formData.name.trim(),
          email: formData.email.trim(),
          role: formData.role,
          active: formData.active,
          permissions: formData.permissions?.length ? formData.permissions : (formData.role === 'ADMIN' ? ALL_PERMISSIONS_KEYS : DEFAULT_OPERATOR_PERMS)
        } : u);
        saveUsersList(updatedList);

        if (supabase) {
          try {
            await supabase.from('profiles').update({
              full_name: formData.name.trim(),
              role: formData.role,
              active: formData.active
            }).eq('id', formData.id);
          } catch(e) {}
        }
        showToast('success', `User "${formData.name}" and access permissions saved!`);
      } else {
        // Create new user
        const newId = 'u_' + Date.now();
        const assignedPerms = formData.permissions?.length ? formData.permissions : (formData.role === 'ADMIN' ? ALL_PERMISSIONS_KEYS : DEFAULT_OPERATOR_PERMS);
        const newUserObj = {
          id: newId,
          name: formData.name.trim(),
          email: formData.email.trim(),
          role: formData.role,
          active: formData.active !== false,
          created_at: new Date().toISOString(),
          permissions: assignedPerms
        };

        if (supabase && formData.password) {
          try {
            const { data: authData, error: authErr } = await supabase.auth.signUp({
              email: formData.email.trim(),
              password: formData.password,
              options: { data: { full_name: formData.name.trim() } }
            });
            if (!authErr && authData?.user?.id) {
              newUserObj.id = authData.user.id;
            }
          } catch(e) {}
        }

        const updatedList = [newUserObj, ...users];
        saveUsersList(updatedList);
        showToast('success', `New user "${formData.name}" created with assigned permissions!`);
      }
      setModalUser(null);
    } catch(err) {
      showToast('error', err.message || 'Failed to save user.');
    }
  }

  function handleToggleActive(targetUser) {
    if (user && (targetUser.id === user.id || targetUser.email === user.email)) {
      showToast('error', 'You cannot deactivate your own logged-in account.');
      return;
    }
    const updatedList = users.map(u => u.id === targetUser.id ? { ...u, active: !u.active } : u);
    saveUsersList(updatedList);
    if (supabase) {
      supabase.from('profiles').update({ active: !targetUser.active }).eq('id', targetUser.id).then(()=>{});
    }
    showToast('success', `Account for "${targetUser.name}" ${targetUser.active ? 'deactivated' : 'activated'}.`);
  }

  function handleDeleteUser() {
    if (!deleteUser) return;
    if (user && (deleteUser.id === user.id || deleteUser.email === user.email)) {
      showToast('error', 'You cannot delete your own logged-in account.');
      setDeleteUser(null);
      return;
    }
    const updatedList = users.filter(u => u.id !== deleteUser.id);
    saveUsersList(updatedList);
    if (supabase) {
      supabase.from('profiles').delete().eq('id', deleteUser.id).then(()=>{});
    }
    showToast('success', `User "${deleteUser.name}" removed successfully.`);
    setDeleteUser(null);
  }

  // Filtered users list
  const filteredUsers = users.filter(u => {
    const q = search.toLowerCase().trim();
    const matchSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const matchRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchStatus = statusFilter === 'ALL' || (statusFilter === 'ACTIVE' ? u.active : !u.active);
    return matchSearch && matchRole && matchStatus;
  });

  const totalUsers = users.length;
  const adminUsers = users.filter(u => u.role === 'ADMIN').length;
  const operatorUsers = users.filter(u => u.role === 'COMPUTER_OPERATOR').length;
  const activeUsers = users.filter(u => u.active).length;

  return (
    <>
      <PageHead
        eyebrow="ACCESS CONTROL & PERMISSIONS"
        title="User Management"
        text="Add staff members, manage roles, and configure fine-grained module access tick settings"
        action="Add New User"
        onAction={() => setModalUser({
          id: null,
          name: '',
          email: '',
          password: '',
          role: 'COMPUTER_OPERATOR',
          active: true,
          permissions: DEFAULT_OPERATOR_PERMS
        })}
      />

      {toast && (
        <div className={`profile-msg profile-msg-${toast.type}`}>
          {toast.type === 'success' ? <Icons.CheckCircle size={16} /> : <Icons.AlertCircle size={16} />}
          <span>{toast.text}</span>
        </div>
      )}

      {/* Dynamic Summary Cards */}
      <div className="stats compact">
        <div className="stat">
          <div><small>Total Users</small><strong>{totalUsers}</strong></div>
          <i><Icons.Users /></i>
        </div>
        <div className="stat">
          <div><small>Admins</small><strong>{adminUsers}</strong></div>
          <i><Icons.ShieldCheck /></i>
        </div>
        <div className="stat">
          <div><small>Computer Operators</small><strong>{operatorUsers}</strong></div>
          <i><Icons.MonitorCog /></i>
        </div>
        <div className="stat">
          <div><small>Active Accounts</small><strong>{activeUsers}</strong></div>
          <i><Icons.UserCheck /></i>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="filters">
        <div className="search">
          <Icons.Search size={16} />
          <input
            placeholder="Search by name or email ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
          <option value="ALL">All Roles ({totalUsers})</option>
          <option value="ADMIN">Admins ({adminUsers})</option>
          <option value="COMPUTER_OPERATOR">Computer Operators ({operatorUsers})</option>
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="ALL">All Status</option>
          <option value="ACTIVE">Active Accounts ({activeUsers})</option>
          <option value="INACTIVE">Inactive Accounts ({totalUsers - activeUsers})</option>
        </select>
        <button
          className="primary"
          style={{ marginLeft: 'auto' }}
          onClick={() => setModalUser({
            id: null,
            name: '',
            email: '',
            password: '',
            role: 'COMPUTER_OPERATOR',
            active: true,
            permissions: DEFAULT_OPERATOR_PERMS
          })}
        >
          <Icons.UserPlus size={16} /> Add User
        </button>
      </div>

      {/* Users Table */}
      <section className="card">
        <CardTitle
          title={`School Staff Users (${filteredUsers.length})`}
          subtitle="Manage credentials, active status, and granular module permissions"
        />
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>User Details</th>
                <th>Role</th>
                <th>Status</th>
                <th>Granted Access Permissions</th>
                <th>Created</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '35px 20px', color: '#94a3b8' }}>
                    <Icons.Users size={32} style={{ margin: '0 auto 8px', display: 'block', opacity: 0.5 }} />
                    No users match the search filters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map(u => {
                  const initials = u.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'U';
                  const userPerms = u.permissions || (u.role === 'ADMIN' ? ALL_PERMISSIONS_KEYS : DEFAULT_OPERATOR_PERMS);
                  const isCurrent = user && (u.id === user.id || u.email === user.email);
                  const dateStr = u.created_at ? new Date(u.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '05 Sep 2026';

                  return (
                    <tr key={u.id}>
                      <td>
                        <div className="user-avatar-cell">
                          <div className={`user-avatar-sm ${u.role === 'ADMIN' ? 'admin' : 'operator'}`}>
                            {initials}
                          </div>
                          <div className="user-details">
                            <b>{u.name} {isCurrent && <span style={{ fontSize: 10, color: '#2563eb', fontWeight: 'bold' }}>(You)</span>}</b>
                            <small>{u.email}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <Status value={u.role === 'ADMIN' ? 'Admin' : 'Computer Operator'} />
                      </td>
                      <td>
                        {u.active ? (
                          <span className="status done" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            <span style={{ fontSize: 14 }}>●</span> Active
                          </span>
                        ) : (
                          <span className="status not-done" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            <span style={{ fontSize: 14 }}>○</span> Inactive
                          </span>
                        )}
                      </td>
                      <td>
                        <div className="perm-badges">
                          {u.role === 'ADMIN' ? (
                            <span className="perm-badge" style={{ background: '#dbeafe', color: '#1d4ed8' }}>
                              <Icons.ShieldCheck size={11} /> Full System Access (All)
                            </span>
                          ) : userPerms.length === 0 ? (
                            <span className="perm-badge" style={{ color: '#ef4444' }}>No Access Assigned</span>
                          ) : (
                            <>
                              {userPerms.slice(0, 4).map(pKey => {
                                const mod = PERMISSION_MODULES.find(m => m.id === pKey);
                                return (
                                  <span key={pKey} className="perm-badge">
                                    {mod?.name || pKey}
                                  </span>
                                );
                              })}
                              {userPerms.length > 4 && (
                                <span className="perm-badge more" title={userPerms.slice(4).map(k => PERMISSION_MODULES.find(m => m.id === k)?.name || k).join(', ')}>
                                  +{userPerms.length - 4} more
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                      <td style={{ whiteSpace: 'nowrap', fontSize: 11, color: '#64748b' }}>
                        {dateStr}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="action-btns-group" style={{ justifyContent: 'flex-end' }}>
                          <button
                            className="action-btn"
                            title="Edit User & Permissions"
                            onClick={() => setModalUser({ ...u, permissions: [...userPerms] })}
                          >
                            <Icons.Pencil size={15} />
                          </button>
                          <button
                            className={`action-btn ${u.active ? 'toggle-active' : 'toggle-inactive'}`}
                            title={u.active ? 'Deactivate Account' : 'Activate Account'}
                            onClick={() => handleToggleActive(u)}
                            disabled={isCurrent}
                            style={isCurrent ? { opacity: 0.4, cursor: 'not-allowed' } : {}}
                          >
                            {u.active ? <Icons.UserCheck size={15} /> : <Icons.UserX size={15} />}
                          </button>
                          <button
                            className="action-btn danger"
                            title="Delete User"
                            onClick={() => setDeleteUser(u)}
                            disabled={isCurrent}
                            style={isCurrent ? { opacity: 0.4, cursor: 'not-allowed' } : {}}
                          >
                            <Icons.Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* User Add / Edit Modal with Permission Tick Settings */}
      {modalUser && (
        <UserEditModal
          userItem={modalUser}
          close={() => setModalUser(null)}
          onSave={handleSaveUser}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteUser && (
        <UserDeleteModal
          userItem={deleteUser}
          close={() => setDeleteUser(null)}
          onConfirm={handleDeleteUser}
        />
      )}
    </>
  );
}

function UserEditModal({ userItem, close, onSave }) {
  const isEditing = !!userItem.id;
  const [name, setName] = useState(userItem.name || '');
  const [email, setEmail] = useState(userItem.email || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState(userItem.role || 'COMPUTER_OPERATOR');
  const [active, setActive] = useState(userItem.active !== false);
  const [permissions, setPermissions] = useState(() => {
    if (userItem.permissions && userItem.permissions.length) return [...userItem.permissions];
    return userItem.role === 'ADMIN' ? ALL_PERMISSIONS_KEYS : DEFAULT_OPERATOR_PERMS;
  });
  const [saving, setSaving] = useState(false);

  function togglePerm(id) {
    setPermissions(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      return [...prev, id];
    });
  }

  function handleRoleChange(newRole) {
    setRole(newRole);
    if (newRole === 'ADMIN') {
      setPermissions(ALL_PERMISSIONS_KEYS);
    } else {
      setPermissions(DEFAULT_OPERATOR_PERMS);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    onSave({
      id: userItem.id,
      name,
      email,
      password,
      role,
      active,
      permissions
    });
  }

  return (
    <div className="modal-backdrop">
      <div className="modal modal-lg">
        <button className="modal-close" onClick={close}><Icons.X size={18} /></button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: '#eff6ff', color: '#2563eb', display: 'grid', placeItems: 'center' }}>
            <Icons.UserCog size={20} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: 18 }}>{isEditing ? 'Edit User & Permissions' : 'Create New User Account'}</h2>
            <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>Configure staff account credentials and accessible software modules</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <label>
              Full Name *
              <input
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Ramesh Kumar"
              />
            </label>
            <label>
              Email Address *
              <input
                required
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="e.g. ramesh@savitrischool.edu.in"
              />
            </label>
            <label>
              {isEditing ? 'New Password (Optional)' : 'Initial Password *'}
              <div className="password">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={isEditing ? 'Leave blank to keep current' : 'Min 6 characters'}
                  required={!isEditing}
                  minLength={isEditing && !password ? undefined : 6}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <Icons.EyeOff size={16} /> : <Icons.Eye size={16} />}
                </button>
              </div>
            </label>
            <label>
              Account Active Status
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 7 }}>
                <input
                  type="checkbox"
                  id="active-toggle"
                  checked={active}
                  onChange={e => setActive(e.target.checked)}
                  style={{ width: 18, height: 18, accentColor: '#2563eb', cursor: 'pointer' }}
                />
                <label htmlFor="active-toggle" style={{ margin: 0, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                  {active ? <span style={{ color: '#16a34a' }}>● Active (Can Login)</span> : <span style={{ color: '#ef4444' }}>○ Inactive (Blocked)</span>}
                </label>
              </div>
            </label>
            <div className="full-label">
              <span style={{ fontSize: 11, fontWeight: 'bold', color: '#4a607a', display: 'block', marginBottom: 6 }}>System Role</span>
              <div className="role-radio-group">
                <div
                  className={`role-radio-card ${role === 'ADMIN' ? 'active' : ''}`}
                  onClick={() => handleRoleChange('ADMIN')}
                >
                  <Icons.ShieldCheck size={20} color={role === 'ADMIN' ? '#2563eb' : '#64748b'} />
                  <div>
                    <b>Administrator</b>
                    <small>Full administrative privileges & user control</small>
                  </div>
                </div>
                <div
                  className={`role-radio-card ${role === 'COMPUTER_OPERATOR' ? 'active' : ''}`}
                  onClick={() => handleRoleChange('COMPUTER_OPERATOR')}
                >
                  <Icons.MonitorCog size={20} color={role === 'COMPUTER_OPERATOR' ? '#2563eb' : '#64748b'} />
                  <div>
                    <b>Computer Operator</b>
                    <small>Staff role with customized module permissions</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Permissions Matrix ("Access Tick Settings") */}
          <div className="perm-section-head">
            <b><Icons.KeyRound size={15} /> Access Tick Settings ({permissions.length}/{PERMISSION_MODULES.length} Granted)</b>
            <div className="perm-presets">
              <button type="button" className="preset-btn" onClick={() => setPermissions(ALL_PERMISSIONS_KEYS)}>
                ✓ Select All
              </button>
              <button type="button" className="preset-btn" onClick={() => setPermissions(DEFAULT_OPERATOR_PERMS)}>
                ⚡ Operator Default
              </button>
              <button type="button" className="preset-btn" onClick={() => setPermissions(READ_ONLY_PERMS)}>
                👁️ Read Only
              </button>
              <button type="button" className="preset-btn" onClick={() => setPermissions([])}>
                ✕ Clear All
              </button>
            </div>
          </div>

          <div className="perm-grid">
            {PERMISSION_MODULES.map(mod => {
              const isChecked = permissions.includes(mod.id);
              const ModIcon = Icons[mod.icon] || Icons.Shield;
              return (
                <div
                  key={mod.id}
                  className={`perm-card ${isChecked ? 'active' : ''}`}
                  onClick={() => togglePerm(mod.id)}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}} // Handled by div click
                    onClick={e => e.stopPropagation()}
                    onChangeCapture={() => togglePerm(mod.id)}
                  />
                  <div className="perm-card-content">
                    <div className="perm-card-title">
                      <ModIcon size={14} />
                      <span>{mod.name}</span>
                    </div>
                    <div className="perm-card-desc">{mod.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, borderTop: '1px solid #e2e8f0', paddingTop: 16 }}>
            <button type="button" className="secondary" onClick={close}>Cancel</button>
            <button type="submit" className="primary" disabled={saving}>
              {saving ? <Icons.LoaderCircle className="spin" size={16} /> : <Icons.Save size={16} />}
              {isEditing ? 'Save Changes & Permissions' : 'Create User Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function UserDeleteModal({ userItem, close, onConfirm }) {
  return (
    <div className="modal-backdrop">
      <div className="modal" style={{ maxWidth: 450 }}>
        <button className="modal-close" onClick={close}><Icons.X size={18} /></button>
        <div style={{ textAlign: 'center', padding: '10px 0 20px' }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#fee2e2', color: '#dc2626', display: 'grid', placeItems: 'center', margin: '0 auto 14px' }}>
            <Icons.Trash2 size={26} />
          </div>
          <h2 style={{ fontSize: 18, marginBottom: 8 }}>Delete User Account?</h2>
          <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>
            Are you sure you want to permanently remove <b>{userItem.name}</b> (<code>{userItem.email}</code>)? This user will immediately lose access to the system.
          </p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, borderTop: '1px solid #e2e8f0', paddingTop: 14 }}>
          <button type="button" className="secondary" onClick={close}>Cancel</button>
          <button type="button" className="primary" style={{ background: '#dc2626', boxShadow: 'none' }} onClick={onConfirm}>
            <Icons.Trash2 size={15} /> Yes, Delete User
          </button>
        </div>
      </div>
    </div>
  );
}

function SchoolSettingsSection() {
  const schoolData = getStoredSchool();
  const [name, setName] = useState(schoolData.name || '');
  const [managerName, setManagerName] = useState(schoolData.managerName || '');
  const [address, setAddress] = useState(schoolData.address || '');
  const [logoUrl, setLogoUrl] = useState(schoolData.logoUrl || '/school-logo.png');
  const [toast, setToast] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = React.useRef(null);

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setToast('⚠️ Please select a valid image file (PNG, JPG, SVG, WebP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setToast('⚠️ Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result;
      if (base64) {
        setLogoUrl(base64);
        setToast('✨ Logo preview loaded! Click "Save school settings" to apply.');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetLogo = () => {
    setLogoUrl('/school-logo.png');
    setToast('ℹ️ Logo reset to default school crest. Click "Save school settings" to apply.');
  };

  const handleSave = (e) => {
    e?.preventDefault?.();
    if (!name.trim()) {
      setToast('⚠️ School name cannot be empty!');
      return;
    }
    setIsSaving(true);
    const updated = {
      name: name.trim(),
      managerName: managerName.trim(),
      address: address.trim(),
      logoUrl: logoUrl || '/school-logo.png',
      updatedAt: new Date().toISOString()
    };

    try {
      localStorage.setItem('school_profile_settings', JSON.stringify(updated));
      localStorage.setItem('school_logo_custom', updated.logoUrl);
      school = updated;
      window.dispatchEvent(new CustomEvent('school_settings_updated', { detail: updated }));
      setToast('🎉 School settings & Logo saved successfully in System!');
    } catch (err) {
      console.error('Failed to save settings:', err);
      setToast('❌ Failed to save settings to local storage.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="card settings" style={{ padding: 24 }}>
      <ToastNotification toast={toast} onClose={() => setToast('')} />
      <div className="setting-logo" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, minWidth: 140 }}>
        <div style={{
          width: 90,
          height: 90,
          borderRadius: '50%',
          overflow: 'hidden',
          border: '2px solid #cbdde5',
          boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
          background: '#f8fafc',
          display: 'grid',
          placeItems: 'center'
        }}>
          <img
            src={logoUrl || '/school-logo.png'}
            alt="School Logo Preview"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleLogoChange}
          accept="image/*"
          style={{ display: 'none' }}
        />
        <button
          type="button"
          className="secondary"
          onClick={() => fileInputRef.current?.click()}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, padding: '7px 12px', cursor: 'pointer' }}
        >
          <Icons.Upload size={14} /> Change logo
        </button>
        {logoUrl && logoUrl !== '/school-logo.png' && (
          <button
            type="button"
            className="text-btn"
            onClick={handleResetLogo}
            style={{ fontSize: 11, color: '#dc2626', cursor: 'pointer', padding: 0 }}
          >
            Reset Default
          </button>
        )}
      </div>

      <form className="form-grid" onSubmit={handleSave} style={{ flex: 1 }}>
        <label>
          School name *
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter school name"
          />
        </label>
        <label>
          Manager / Principal name
          <input
            type="text"
            value={managerName}
            onChange={(e) => setManagerName(e.target.value)}
            placeholder="e.g. Dr. Ramesh Kumar (Principal)"
          />
        </label>
        <label className="full-label">
          School address
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="e.g. Khutaha Road, Jamunahiya, Mirzapur (U.P.)"
          />
        </label>
        <div style={{ gridColumn: '1 / -1', marginTop: 8 }}>
          <button
            type="submit"
            className="primary"
            disabled={isSaving}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 22px', fontWeight: 700 }}
          >
            <Icons.Save size={16} /> Save school settings
          </button>
        </div>
      </form>
    </section>
  );
}

function Settings({
  user,
  currentSession = '2026-27',
  sessions = [],
  onSwitchSession = () => {},
  onOpenCreateSession = () => {},
  onOpenEditSession = () => {},
  onOpenDeleteSession = () => {},
  onOpenResetStatus = () => {}
}) {
  const sortedSessions = React.useMemo(() => sortSessions(sessions), [sessions]);

  return (
    <>
      <PageHead eyebrow="BRANDING & CONFIGURATION" title="School Settings" text="Update school identity used throughout the tracker" />
      <SchoolSettingsSection />

      <div style={{ marginTop: 28 }} />
      <PageHead
        eyebrow="ACADEMIC MULTI-YEAR MANAGEMENT"
        title="Academic Sessions & Syllabus Control"
        text="Manage academic batch years, switch active sessions, clone syllabus structures, or reset syllabus status across database & system (Protected with Master Password)."
      />

      <section className="card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 17, color: '#0f172a' }}>Academic Sessions ({sessions.length})</h3>
            <p style={{ margin: '4px 0 0 0', fontSize: 13, color: '#64748b' }}>
              Create next year's batch, edit session metadata, or bulk reset syllabus completion statuses with Master Password (<code>AKASH@8299</code>).
            </p>
          </div>
          <button
            type="button"
            className="primary"
            onClick={onOpenCreateSession}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontWeight: 700, padding: '10px 16px' }}
          >
            <Icons.Plus size={16} /> + Create New Session
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {sortedSessions.map(s => {
            const stats = getSessionTopicStats(s.id);
            const isActive = s.id === currentSession;

            return (
              <div
                key={s.id}
                className={`session-manage-card ${isActive ? 'active-session' : ''}`}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, flex: 1, minWidth: 260 }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: isActive ? '#dbeafe' : '#f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isActive ? '#1d4ed8' : '#64748b',
                    flexShrink: 0
                  }}>
                    <Icons.CalendarDays size={22} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <h4 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#0f172a' }}>
                        {s.name}
                      </h4>
                      {isActive && (
                        <span style={{ fontSize: 10, background: '#16a34a', color: '#fff', padding: '2px 8px', borderRadius: 999, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          ✓ Current Active
                        </span>
                      )}
                      <span style={{ fontSize: 12, color: '#64748b' }}>• {s.label}</span>
                    </div>

                    {/* Stats overview pills */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                      <span className="session-stat-pill total">Total Topics: {stats.total}</span>
                      <span className="session-stat-pill done">Done: {stats.done} ({stats.progress}%)</span>
                      <span className="session-stat-pill in-progress">In Progress: {stats.inProgress}</span>
                      <span className="session-stat-pill pending">Not Done: {stats.pending}</span>
                    </div>

                    {/* Completion progress bar */}
                    <div style={{ width: '100%', maxWidth: 360, height: 6, background: '#e2e8f0', borderRadius: 999, overflow: 'hidden', marginTop: 10 }}>
                      <div
                        style={{
                          width: `${stats.progress}%`,
                          height: '100%',
                          background: stats.progress >= 75 ? '#16a34a' : (stats.progress >= 35 ? '#2563eb' : '#d97706'),
                          borderRadius: 999,
                          transition: 'width 0.3s ease'
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* CRUD Action Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end', marginLeft: 16 }}>
                  {!isActive && (
                    <button
                      type="button"
                      className="btn-action-sm switch-btn"
                      onClick={() => onSwitchSession(s.id)}
                      title="Switch active workspace to this session"
                    >
                      <Icons.ArrowRightLeft size={13} /> Switch Active
                    </button>
                  )}

                  <button
                    type="button"
                    className="btn-action-sm reset-btn"
                    onClick={() => onOpenResetStatus(s)}
                    title="Bulk reset all statuses (Not Done / In Progress / Done) with Master Password"
                  >
                    <Icons.RotateCcw size={13} /> Reset Status
                  </button>

                  <button
                    type="button"
                    className="btn-action-sm edit-btn"
                    onClick={() => onOpenEditSession(s)}
                    title="Edit session details with Master Password"
                  >
                    <Icons.Pencil size={13} /> Edit
                  </button>

                  <button
                    type="button"
                    className="btn-action-sm del-btn"
                    onClick={() => onOpenDeleteSession(s)}
                    disabled={sessions.length <= 1}
                    title={sessions.length <= 1 ? 'Cannot delete the only remaining session' : 'Delete session with Master Password'}
                  >
                    <Icons.Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
function Profile({user}){
  const initials=user.name?.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()||'U';
  const [editing,setEditing]=useState(false);
  const [tab,setTab]=useState('info'); // 'info' | 'password'
  const [avatarColor,setAvatarColor]=useState(()=>localStorage.getItem('avatarColor')||'#1264c3');
  const [avatarImg,setAvatarImg]=useState(()=>localStorage.getItem('avatarImg')||null);
  const [email,setEmail]=useState(user.email||'');
  const [name,setName]=useState(user.name||'');
  const [curPwd,setCurPwd]=useState('');
  const [newPwd,setNewPwd]=useState('');
  const [confPwd,setConfPwd]=useState('');
  const [msg,setMsg]=useState(null); // {type:'success'|'error', text}
  const [saving,setSaving]=useState(false);
  const [showCur,setShowCur]=useState(false);
  const [showNew,setShowNew]=useState(false);
  const fileRef=React.useRef();
  const colors=['#1264c3','#7c3aed','#0891b2','#059669','#dc2626','#d97706','#be185d','#1e40af','#065f46','#92400e'];

  function flash(type,text){setMsg({type,text});setTimeout(()=>setMsg(null),10000);}

  async function saveInfo(e){
    e.preventDefault();
    if(!email.trim()){flash('error','Email cannot be empty');return;}
    setSaving(true);
    try{
      const updates={};
      if(email!==user.email) updates.email=email.trim();
      if(Object.keys(updates).length>0&&supabase){
        const {error}=await supabase.auth.updateUser(updates);
        if(error)throw error;
      }
      localStorage.setItem('avatarColor',avatarColor);
      flash('success',email!==user.email?'Profile & email updated! Check inbox to confirm new email.':'Profile saved successfully!');
      setEditing(false);
    }catch(err){flash('error',err.message||'Failed to update profile.');}
    finally{setSaving(false);}
  }

  async function changePassword(e){
    e.preventDefault();
    if(!curPwd){flash('error','Please enter your current password.');return;}
    if(newPwd.length<6){flash('error','New password must be at least 6 characters.');return;}
    if(newPwd!==confPwd){flash('error','New passwords do not match.');return;}
    setSaving(true);
    try{
      if(supabase){
        // Re-authenticate with current password first
        const {error:signInErr}=await supabase.auth.signInWithPassword({email:user.email,password:curPwd});
        if(signInErr)throw new Error('Current password is incorrect.');
        const {error}=await supabase.auth.updateUser({password:newPwd});
        if(error)throw error;
      }
      flash('success','Password changed successfully!');
      setCurPwd('');setNewPwd('');setConfPwd('');setEditing(false);
    }catch(err){flash('error',err.message||'Failed to change password.');}
    finally{setSaving(false);}
  }

  function handlePhoto(e){
    const file=e.target.files[0];
    if(!file)return;
    if(file.size>2*1024*1024){flash('error','Image too large. Max 2MB.');return;}
    const reader=new FileReader();
    reader.onload=ev=>{
      const img=ev.target.result;
      try {
        setAvatarImg(img);
        localStorage.setItem('avatarImg',img);
        if(user.email) localStorage.setItem(`avatarImg_${user.email}`,img);
        window.dispatchEvent(new Event('avatar_updated'));
        flash('success','Profile photo updated!');
      } catch(err) {
        flash('error','Photo too large for storage. Try a smaller image.');
      }
    };
    reader.readAsDataURL(file);
  }

  function removePhoto(){
    setAvatarImg(null);
    localStorage.removeItem('avatarImg');
    if(user.email) localStorage.removeItem(`avatarImg_${user.email}`);
    window.dispatchEvent(new Event('avatar_updated'));
    flash('success','Photo removed.');
  }

  return <>
    <PageHead eyebrow="ACCOUNT" title="My Profile" text="Your personal account credentials and institutional settings"/>
    {msg&&<div className={`profile-msg profile-msg-${msg.type}`}>{msg.type==='success'?<Icons.CheckCircle size={16}/>:<Icons.AlertCircle size={16}/>}<span>{msg.text}</span></div>}
    
    <div className="profile-layout">
      {/* Left — Avatar & Overview Card */}
      <section className="card profile-avatar-card">
        <div className="profile-avatar-wrap">
          {avatarImg
            ?<img src={avatarImg} alt="avatar" className="profile-photo"/>
            :<div className="big-avatar" style={{background:avatarColor,width:96,height:96,fontSize:28}}>{initials}</div>}
          {editing&&<button className="avatar-cam-btn" onClick={()=>fileRef.current.click()} title="Change photo"><Icons.Camera size={15}/></button>}
        </div>
        <input type="file" accept="image/*" ref={fileRef} style={{display:'none'}} onChange={handlePhoto}/>
        <h2 style={{marginTop:14,fontSize:20}}>{user.name}</h2>
        <div style={{margin:'6px 0 2px'}}>
          <Status value={user.role==='ADMIN'?'Admin':'Computer Operator'}/>
        </div>
        <p className="profile-email">{user.email}</p>

        <div className="profile-badge-strip">
          <div className="profile-badge-item">
            <Icons.Calendar size={14} style={{color:'#1264c3'}}/>
            <div>
              <small style={{display:'block',fontSize:9,color:'#94a3b8',textTransform:'uppercase',fontWeight:700}}>Session</small>
              <b>2026-27 Active</b>
            </div>
          </div>
          <div className="profile-badge-item">
            <Icons.ShieldCheck size={14} style={{color:'#16a34a'}}/>
            <div>
              <small style={{display:'block',fontSize:9,color:'#94a3b8',textTransform:'uppercase',fontWeight:700}}>Status</small>
              <b>Verified & Synced</b>
            </div>
          </div>
        </div>

        {editing&&<>
          <div className="color-row">
            <small>Avatar Theme Color</small>
            <div className="color-swatches">{colors.map(c=><button key={c} className={'swatch'+(avatarColor===c?' active':'')} style={{background:c}} onClick={()=>{setAvatarColor(c);localStorage.setItem('avatarColor',c);window.dispatchEvent(new Event('avatar_updated'));}}/>)}</div>
          </div>
          {avatarImg&&<button className="remove-photo-btn" onClick={removePhoto}><Icons.Trash2 size={13}/> Remove Custom Photo</button>}
        </>}
        {!editing
          ?<button className="primary" style={{marginTop:18,width:'100%'}} onClick={()=>{setEditing(true);setTab('info')}}><Icons.Pencil size={15}/>Edit Account Settings</button>
          :<button className="secondary" style={{marginTop:14,width:'100%'}} onClick={()=>{setEditing(false);setMsg(null)}}><Icons.X size={15}/>Cancel Editing</button>}
      </section>

      {/* Right — Edit Forms / Rich Account Dashboard */}
      {editing ? (
        <section className="card profile-edit-card">
          <div className="profile-tabs">
            <button className={'profile-tab'+(tab==='info'?' active':'')} onClick={()=>setTab('info')}><Icons.User size={15}/>Personal Information</button>
            <button className={'profile-tab'+(tab==='password'?' active':'')} onClick={()=>setTab('password')}><Icons.Lock size={15}/>Security & Password</button>
          </div>

          {tab==='info'&&<form onSubmit={saveInfo} className="profile-form">
            <label>Full Name<input value={name} onChange={e=>setName(e.target.value)} placeholder="Your full name"/></label>
            <label>Email Address
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com"/>
              <small className="field-hint"><Icons.Info size={11}/> A confirmation link will be sent to new email if changed</small>
            </label>
            <label>Role<input value={user.role==='ADMIN'?'Administrator (Full Access)':'Computer Operator (Operational Access)'} disabled style={{opacity:.65,background:'#f1f5f9'}}/></label>
            <button className="primary full" type="submit" disabled={saving} style={{marginTop:8}}>
              {saving?<Icons.LoaderCircle className="spin" size={16}/>:<Icons.Save size={15}/>}
              {saving?'Saving Changes…':'Save Profile Details'}
            </button>
          </form>}

          {tab==='password'&&<form onSubmit={changePassword} className="profile-form">
            <label>Current Password
              <div className="password">
                <input type={showCur?'text':'password'} value={curPwd} onChange={e=>setCurPwd(e.target.value)} placeholder="Enter current password" autoComplete="current-password"/>
                <button type="button" onClick={()=>setShowCur(!showCur)}>{showCur?<Icons.EyeOff size={17}/>:<Icons.Eye size={17}/>}</button>
              </div>
            </label>
            <label>New Password
              <div className="password">
                <input type={showNew?'text':'password'} value={newPwd} onChange={e=>setNewPwd(e.target.value)} placeholder="Min. 6 characters" autoComplete="new-password"/>
                <button type="button" onClick={()=>setShowNew(!showNew)}>{showNew?<Icons.EyeOff size={17}/>:<Icons.Eye size={17}/>}</button>
              </div>
            </label>
            <label>Confirm New Password
              <div className="password">
                <input type="password" value={confPwd} onChange={e=>setConfPwd(e.target.value)} placeholder="Repeat new password" autoComplete="new-password"/>
              </div>
              {newPwd&&confPwd&&newPwd!==confPwd&&<small className="field-hint error"><Icons.AlertCircle size={11}/> Passwords do not match</small>}
              {newPwd&&confPwd&&newPwd===confPwd&&<small className="field-hint success"><Icons.CheckCircle size={11}/> Passwords match</small>}
            </label>
            <div className="pwd-strength">
              <small>Strength: </small>
              {[1,2,3,4].map(i=><span key={i} className={'pwd-bar'+(newPwd.length>=i*3?' filled':'')} style={{background:newPwd.length>=12?'#4ade80':newPwd.length>=6?'#fbbf24':'#ef4444'}}/>)}
              <small style={{marginLeft:6}}>{newPwd.length===0?'—':newPwd.length<6?'Weak':newPwd.length<12?'Medium':'Strong'}</small>
            </div>
            <button className="primary full" type="submit" disabled={saving||newPwd!==confPwd||newPwd.length<6} style={{marginTop:8}}>
              {saving?<Icons.LoaderCircle className="spin" size={16}/>:<Icons.Lock size={15}/>}
              {saving?'Updating Password…':'Update Account Password'}
            </button>
          </form>}
        </section>
      ) : (
        <section className="card profile-info-card">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18,paddingBottom:12,borderBottom:'2px solid #e5ebf3',flexWrap:'wrap',gap:8}}>
            <h3 style={{margin:0,fontSize:17,color:'#17345b'}}>Account & Institutional Profile</h3>
            <span style={{fontSize:11.5,fontWeight:600,color:'#1264c3',background:'#eaf3ff',padding:'4px 10px',borderRadius:6}}>
              Institutional ID: SBIC-2026
            </span>
          </div>

          <div className="profile-info-grid">
            <div className="profile-detail-box">
              <Icons.User size={18} style={{color:'#1264c3'}}/>
              <div><small>Full Name</small><b>{user.name}</b></div>
            </div>
            <div className="profile-detail-box">
              <Icons.Mail size={18} style={{color:'#1264c3'}}/>
              <div><small>Email Address</small><b>{user.email}</b></div>
            </div>
            <div className="profile-detail-box">
              <Icons.Shield size={18} style={{color:'#7c3aed'}}/>
              <div><small>Role & Clearance</small><b>{user.role==='ADMIN'?'Administrator (Full CRUD)':'Computer Operator (Operational Access)'}</b></div>
            </div>
            <div className="profile-detail-box">
              <Icons.Building2 size={18} style={{color:'#059669'}}/>
              <div><small>School Institution</small><b>SAVITRI BALIKA INTER COLLEGE</b></div>
            </div>
            <div className="profile-detail-box">
              <Icons.MapPin size={18} style={{color:'#dc2626'}}/>
              <div><small>Campus Location</small><b>Khutaha Road, Jamunahiya, Mirzapur</b></div>
            </div>
            <div className="profile-detail-box">
              <Icons.GraduationCap size={18} style={{color:'#d97706'}}/>
              <div><small>Board / Affiliation</small><b>UP Board & English Medium Curriculum</b></div>
            </div>
          </div>

          <div style={{marginTop:20,paddingTop:18,borderTop:'1px solid #f0f4f9'}}>
            <h4 style={{fontSize:13,color:'#475569',textTransform:'uppercase',letterSpacing:.6,marginBottom:12}}>Access & Permissions Overview</h4>
            <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
              {[
                {label:'Syllabus CRUD Management',icon:Icons.BookOpen,color:'#1264c3'},
                {label:'Principal Checklist PDF Export',icon:Icons.Printer,color:'#059669'},
                {label:'Student Academic Syllabus Generator',icon:Icons.FileText,color:'#7c3aed'},
                {label:'Class & Section Configuration',icon:Icons.GraduationCap,color:'#d97706'},
                {label:'Academic Session Switching',icon:Icons.Calendar,color:'#0891b2'},
                {label:'Protected Password Verification',icon:Icons.Lock,color:'#dc2626'}
              ].map((perm,i)=>(
                <span key={i} style={{display:'inline-flex',alignItems:'center',gap:6,background:'#f8fafc',border:'1px solid #e2e8f0',padding:'6px 11px',borderRadius:8,fontSize:11.5,fontWeight:600,color:'#334155'}}>
                  <perm.icon size={13} style={{color:perm.color}}/>
                  {perm.label}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  </>;
}
function PageHead({eyebrow,title,text,action,onAction}){return <div className="page-head"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{text}</p></div>{action&&<button onClick={onAction} className="primary"><Icons.Plus/> {action}</button>}</div>}
function Modal({title,children,close}){return <div className="modal-backdrop"><div className="modal"><button className="modal-close" onClick={close}><Icons.X/></button><h2>{title}</h2>{children}</div></div>}
createRoot(document.getElementById('root')).render(<App/>)
