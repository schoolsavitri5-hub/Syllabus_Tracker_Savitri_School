import React, {useEffect, useMemo, useState} from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter, NavLink, Navigate, Route, Routes, useLocation, useNavigate} from 'react-router-dom'
import {AreaChart, Area, BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell} from 'recharts'
import * as Icons from 'lucide-react'
import * as XLSX from 'xlsx'
import {supabase} from './lib/supabase'
import './styles.css'
import './syllabus-status.css'
import './responsive.css'
import './government.css'

const school={name:'SAVITRI BALIKA INTER COLLEGE',address:'Khutaha Road, Jamunahiya, Mirzapur (U.P.)'}
const seed=[
 ['Biology','April','Cell: The Unit of Life','कोशिका : जीवन की इकाई','Done'],['Biology','September','Genetics & Evolution','आनुवंशिकी एवं विकास','Not Done'],['Physics','April','Electric Charges and Fields','वैद्युत आवेश तथा क्षेत्र','Done'],['Physics','September','Electromagnetic Waves','विद्युत चुम्बकीय तरंगें','In Progress'],['Chemistry','August','Chemical Kinetics','रासायनिक बलगतिकी','Done'],['Chemistry','September','Coordination Compounds','उपसहसंयोजन यौगिक','Done'],['Mathematics','September','Integrals','समाकलन','Not Done'],['English','September','The Last Lesson','द लास्ट लेसन','Done'],['Hindi','September','आत्मपरिचय','आत्मपरिचय','In Progress'],['Physics','October','Ray Optics','किरण प्रकाशिकी','Not Done'],['Biology','October','Biotechnology','जैव प्रौद्योगिकी','In Progress']
].map(([subject,month,chapter,hindi,status],i)=>({id:i+1,subject,month,chapter,hindi,topic:`${chapter} — concepts and applications`,assessment:'Unit Test',status,remarks:status==='Not Done'?'Schedule required':'Updated recently'}))
// Offline demo dataset mirrors the Supabase demo-data.sql seed: every class has
// realistic subjects and a complete April–February syllabus for immediate testing.
const demoClasses=['Class 1','Class 2','Class 3','Class 4','Class 5','Class 6','Class 7','Class 8','Class 9','Class 10','Class 11','Class 12']
const demoTerms=[{month:'Apr - July',assessment:'PA 1'},{month:'Aug - Oct',assessment:'Half Yearly'},{month:'Nov - Dec',assessment:'PA 2'},{month:'Jan - Feb',assessment:'Annual'}]
const demoSubjects=level=>level==='junior'?['English','Hindi','Mathematics','EVS','Computer']:level==='middle'?['English','Hindi','Mathematics','Science','Social Science','Computer']:['English','Physics','Chemistry','Mathematics','Biology']
demoClasses.forEach((className,classIndex)=>{const level=classIndex<5?'junior':classIndex<8?'middle':'senior',group=classIndex<8?'primary':'senior';demoSubjects(level).forEach((subject,subjectIndex)=>demoTerms.forEach((term,termIndex)=>seed.push({id:`demo-${classIndex}-${subjectIndex}-${termIndex}`,className,section:termIndex%2?'B':'A',group,subject,month:term.month,chapter:`${subject} — ${term.assessment} Syllabus`,hindi:'Demo syllabus',topic:`${term.assessment} learning objectives and practice`,assessment:term.assessment,status:['Done','In Progress','Not Done'][(classIndex+subjectIndex+termIndex)%3],remarks:'Demo academic data'})))})
const statusValues=['Done','In Progress','Not Done']
const examPatterns={primary:[['ALL',null],['PA1',['April','May','June','July']],['HALF YEARLY',['April','May','June','July','August','September']],['PA2',['April','May','June','July','August','September','October','November']],['ANNUAL',['December','January','February']]],senior:[['ALL',null],['UT 1',['April','May','June']],['UT 2',['July']],['HALF YEARLY',['April','May','June','July','August','September']],['UT 3',['October','November']],['UT 4',null]]}
const monthOrder=['April','May','June','July','August','September','October','November','December','January','February']
function examTopics(topics,group,exam){if(!exam||exam==='ALL')return topics;const norm=s=>(s||'').toLowerCase().replace(/[^a-z0-9]/g,''),target=norm(exam);return topics.filter(x=>{const a=norm(x.assessment),m=norm(x.month);if(a===target||a.includes(target))return true;if(group==='primary'){if(target==='pa1')return ['apr','april','may','june','july','aprjul','aprjuly'].some(k=>m.includes(k))||a.includes('pa1');if(target==='halfyearly')return ['apr','april','may','june','july','aug','august','sep','sept','september','oct','october','augoct'].some(k=>m.includes(k))||a.includes('half');if(target==='pa2')return ['nov','november','dec','december','novdec'].some(k=>m.includes(k))||a.includes('pa2');if(target==='annual')return ['jan','january','feb','february','mar','march','janfeb'].some(k=>m.includes(k))||a.includes('annual')}else if(group==='senior'){if(target==='ut1')return ['apr','april','may','june'].some(k=>m.includes(k))||a.includes('ut1');if(target==='ut2')return ['jul','july'].some(k=>m.includes(k))||a.includes('ut2');if(target==='halfyearly')return ['apr','april','may','june','jul','july','aug','august','sep','sept','september'].some(k=>m.includes(k))||a.includes('half');if(target==='ut3')return ['oct','october','nov','november'].some(k=>m.includes(k))||a.includes('ut3');if(target==='ut4')return ['dec','december','jan','january','feb','february'].some(k=>m.includes(k))||a.includes('ut4')}return false})}
const nav=[['/dashboard','Dashboard','LayoutDashboard'],['/classes','Class & Section','School'],['/excel-management','Excel Management','FileSpreadsheet'],['/syllabus','Syllabus Progress','ChartNoAxesCombined'],['/practicals','Practicals','FlaskConical'],['/assessments','Assessments','ClipboardCheck'],['/users','User Management','Users','admin'],['/settings','School Settings','Settings'],['/profile','Profile','CircleUser']]
function Logo({size, style}){return <img src="/school-logo.png" alt="Savitri Balika Inter College" className="logo" style={{borderRadius:'50%',objectFit:'cover',background:'transparent',...(size?{width:size,height:size,minWidth:size,minHeight:size}:{}),...style}}/>}
function Status({value}){return <span className={'status '+value.toLowerCase().replaceAll(' ','-')}>{value}</span>}
function normalizeTopic(row){const className=row.classes?.class_name??row.className??'Class 1';const section=row.sections?.section_name??row.section??'A';const group=row.classes?.class_group==='PRIMARY'?'primary':row.classes?.class_group==='SENIOR'?'senior':(row.group||(['Class 1','Class 2','Class 3','Class 4','Class 5','Class 6','Class 7','Class 8'].includes(className)?'primary':'senior'));return {...row,id:row.id,className,section,group,subject:row.subjects?.subject_name??row.subject??'General',month:row.month??'Apr - July',chapter:row.unit_chapter_en??row.chapter??'',hindi:row.unit_chapter_hi??row.hindi??'',topic:row.topic_en??row.topic??'',assessment:row.assessment_en??row.assessment??'',status:row.status??'Not Done',remarks:row.remarks??''}}
function useTopics(){const [topics,setTopics]=useState(seed),[dbClasses,setDbClasses]=useState([]),[loading,setLoading]=useState(!!supabase),[error,setError]=useState('');const reload=async()=>{if(!supabase)return;setLoading(true);let {data,error}=await supabase.from('syllabus_topics').select('*, subjects(subject_name), classes(class_name, class_group), sections(section_name)').order('month');let cRes=await supabase.from('classes').select('*, sections(*)').order('class_name');if(!cRes.error&&cRes.data)setDbClasses(cRes.data);if(error)setError(error.message);else setTopics(data.map(normalizeTopic));setLoading(false)};useEffect(()=>{reload()},[]);return {topics,dbClasses,loading,error,reload,setTopics}}
async function saveTopic(topic){if(!supabase)return null;let subjectId=topic.subject_id;if(topic.subject){let q=await supabase.from('subjects').select('id').eq('subject_name',topic.subject).maybeSingle();if(q.error)throw q.error;if(!q.data){let created=await supabase.from('subjects').insert({subject_name:topic.subject}).select('id').single();if(created.error)throw created.error;subjectId=created.data.id}else subjectId=q.data.id}const payload={month:topic.month,unit_chapter_en:topic.chapter,unit_chapter_hi:topic.hindi||null,topic_en:topic.topic||null,assessment_en:topic.assessment||null,status:topic.status,remarks:topic.remarks||null,subject_id:subjectId};if(topic.id){let r=await supabase.from('syllabus_topics').update(payload).eq('id',topic.id).select().single();if(r.error)throw r.error;return r.data}let r=await supabase.from('syllabus_topics').insert(payload).select().single();if(r.error)throw r.error;return r.data}
function Footer(){return <footer>© SAVITRI BALIKA INTER COLLEGE · All Rights Reserved to Savitri Balika Inter College <span>Made by Akash Yadav (B.Tech Computer Science, LPU)</span></footer>}
async function profileFor(authUser){const {data,error}=await supabase.from('profiles').select('full_name, role, active').eq('id',authUser.id).single();if(error)throw error;if(!data.active)throw Error('This account is inactive. Please contact the school administrator.');return {id:authUser.id,name:data.full_name,role:data.role,email:authUser.email}}
function App(){const [user,setUser]=useState(null),[checking,setChecking]=useState(!!supabase);useEffect(()=>{if(!supabase){setChecking(false);return}let alive=true;const sync=async session=>{if(!session?.user){if(alive){setUser(null);setChecking(false)}return}try{let profile=await profileFor(session.user);if(alive)setUser(profile)}catch(error){if(alive)setUser(null)}finally{if(alive)setChecking(false)}};supabase.auth.getSession().then(({data})=>sync(data.session));const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,session)=>sync(session));return()=>{alive=false;subscription.unsubscribe()}},[]);if(checking)return <main className="login"><section className="login-panel"><div className="login-card"><Icons.LoaderCircle className="spin"/><p>Checking secure session…</p></div></section></main>;return <BrowserRouter>{user?<Shell user={user} setUser={setUser}/>:<Login setUser={setUser}/>}</BrowserRouter>}
function Login({setUser}){const [show,setShow]=useState(false),[creating,setCreating]=useState(false),[loading,setLoading]=useState(false),[error,setError]=useState(''),[message,setMessage]=useState('');const submit=async e=>{e.preventDefault();if(!supabase){setError('Supabase is not configured.');return}let d=new FormData(e.target),email=d.get('email').trim(),password=d.get('password');setLoading(true);setError('');setMessage('');try{if(creating){let fullName=d.get('fullName').trim();let {data,error}=await supabase.auth.signUp({email,password,options:{data:{full_name:fullName}}});if(error)throw error;if(data.session){setUser(await profileFor(data.user))}else setMessage('Account created. Check your email and confirm it before signing in.')}else{let {data,error}=await supabase.auth.signInWithPassword({email,password});if(error)throw error;setUser(await profileFor(data.user))}}catch(err){setError(err.message||'Sign-in failed.')}finally{setLoading(false)}};return <main className="login"><section className="login-intro"><div className="intro-brand"><Logo/><div><b>SAVITRI SCHOOL</b><small>SYLLABUS TRACKER</small></div></div><div className="orb o1"/><div className="orb o2"/><div className="intro-copy"><span className="eyebrow light">SCHOOL MANAGEMENT PORTAL</span><h1>Progress, clearly in view.</h1><p>A focused workspace for syllabus planning, monthly tracking, and academic progress across every class.</p><div className="school-line"><Icons.MapPin/> <span><b>{school.name}</b><br/>{school.address}</span></div></div><div className="intro-bottom">School Syllabus Management & Progress Tracking System</div></section><section className="login-panel"><div className="login-card"><div className="mobile-logo"><Logo/></div><span className="eyebrow">SECURE ACCESS</span><h2>{creating?'Create first admin account':'Welcome back'}</h2><p>{creating?'Use your school administrator email':'Sign in to Syllabus Tracker'}</p><form onSubmit={submit}>{creating&&<label>Full name<input required name="fullName" placeholder="Administrator name"/></label>}<label>Email<input required name="email" placeholder="Enter your email" type="email"/></label><label>Password<div className="password"><input required minLength="6" name="password" type={show?'text':'password'} placeholder="Minimum 6 characters"/><button type="button" onClick={()=>setShow(!show)}>{show?<Icons.EyeOff/>:<Icons.Eye/>}</button></div></label>{error&&<div className="error">{error}</div>}{message&&<p className="notice">{message}</p>}<button className="primary full" disabled={loading}>{loading?<><Icons.LoaderCircle className="spin"/> Please wait…</>:(creating?'Create secure account':'Sign in securely')}<Icons.ArrowRight/></button></form><button className="text-btn" type="button" onClick={()=>{setCreating(v=>!v);setError('');setMessage('')}}>{creating?'Already have an account? Sign in':'First time here? Create the admin account'}</button><div className="secure"><Icons.ShieldCheck/> Protected school workspace</div></div></section></main>}
function Shell({user,setUser}){const [open,setOpen]=useState(false);const loc=useLocation();const title=nav.find(n=>loc.pathname.startsWith(n[0]))?.[1]||'Dashboard';return <div className="app"><aside className={open?'open':''}><div className="side-brand"><Logo/><div><b>SAVITRI SCHOOL</b><small>SYLLABUS TRACKER</small></div><button className="close" onClick={()=>setOpen(false)}><Icons.X/></button></div><nav>{nav.filter(x=>!x[3]||user.role==='ADMIN').map(([path,label,icon])=>{let Icon=Icons[icon];return <NavLink to={path} key={path} onClick={()=>setOpen(false)}><Icon size={19}/><span>{label}</span></NavLink>})}</nav><div className="side-bottom"><div className="mini-user"><div className="avatar">AY</div><div><b>{user.name}</b><small>{user.role}</small></div></div><button className="logout" onClick={()=>setUser(null)}><Icons.LogOut size={18}/> Logout</button></div></aside><div className="mobile-overlay" onClick={()=>setOpen(false)}/><section className="workspace"><Header title={title} user={user} onMenu={()=>setOpen(true)}/><main className="content"><Routes><Route path="/dashboard" element={<Dashboard user={user}/>}/><Route path="/classes" element={<Classes/>}/><Route path="/excel-management" element={<Excel/>}/><Route path="/syllabus" element={<Syllabus/>}/><Route path="/syllabus/:subject" element={<Syllabus/>}/><Route path="/practicals" element={<Tracker type="Practical"/>}/><Route path="/assessments" element={<Tracker type="Assessment"/>}/><Route path="/users" element={user.role==='ADMIN'?<Users/>:<Navigate to="/dashboard"/>}/><Route path="/settings" element={<Settings/>}/><Route path="/profile" element={<Profile user={user}/>}/><Route path="*" element={<Navigate to="/dashboard"/>}/></Routes><Footer/></main></section></div>}
function Header({title,user,onMenu}){const [now,setNow]=useState(new Date());React.useEffect(()=>{let t=setInterval(()=>setNow(new Date()),1000);return()=>clearInterval(t)},[]);return <header><button className="hamburger" onClick={onMenu}><Icons.Menu/></button><div><span className="crumb">Syllabus Tracker /</span><h3>{title}</h3></div><div className="header-right"><div className="date"><b>{now.toLocaleDateString('en-IN',{weekday:'long',day:'2-digit',month:'long',year:'numeric'})}</b><small>{now.toLocaleTimeString('en-IN')}</small></div><button className="bell"><Icons.Bell size={19}/><i/></button><div className="header-user"><div className="avatar">AY</div><div><b>{user.name}</b><Status value={user.role==='ADMIN'?'Admin':'Computer Operator'}/></div></div></div></header>}
function Filters({selectedClass='ALL',setSelectedClass=()=>{},selectedSection='ALL',setSelectedSection=()=>{},availableClasses=[],availableSections=[],children}){const classOpts=availableClasses&&availableClasses.length?availableClasses:demoClasses;const sectionOpts=availableSections&&availableSections.length?availableSections:['A','B'];return <div className="filters"><select value={selectedClass} onChange={e=>{setSelectedClass(e.target.value);setSelectedSection('ALL')}} aria-label="Select Class"><option value="ALL">All Classes</option>{classOpts.map(c=><option key={c} value={c}>{c.startsWith('Class')?c:`Class ${c}`}</option>)}</select><select value={selectedSection} onChange={e=>setSelectedSection(e.target.value)} aria-label="Select Section"><option value="ALL">All Sections</option>{sectionOpts.map(s=>{const val=String(s).replace(/^section\s+/i,'').trim();return <option key={s} value={val}>Section {val}</option>})}</select>{children}</div>}
function CustomChartTooltip({ active, payload, isClass }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const color = data.progress >= 75 ? '#16a34a' : data.progress >= 50 ? '#1d6fd8' : data.progress >= 25 ? '#d97706' : '#dc2626';
    return (
      <div style={{
        background: '#ffffff',
        border: '1px solid #cbd5e1',
        borderRadius: '8px',
        padding: '10px 14px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
        fontSize: '12px',
        minWidth: 160
      }}>
        <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: 4, fontSize: '13px' }}>
          {data.name}
        </div>
        <div style={{ color, fontWeight: 800, fontSize: '15px', marginBottom: 6 }}>
          {data.progress}% Complete
        </div>
        <div style={{ display: 'grid', gap: '3px', fontSize: '11px', color: '#475569' }}>
          <div>Completed: <b style={{ color: '#16a34a' }}>{data.done}</b> / {data.total} topics</div>
          {data.inProgress > 0 && <div>In Progress: <b style={{ color: '#d97706' }}>{data.inProgress}</b></div>}
          {data.pending > 0 && <div>Pending: <b style={{ color: '#dc2626' }}>{data.pending}</b></div>}
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

function Dashboard({user}){
  const {topics,dbClasses}=useTopics(),[selectedClass,setSelectedClass]=useState('ALL'),[selectedSection,setSelectedSection]=useState('ALL');
  
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
    if(selectedClass!=='ALL'){
      refTopics=topics.filter(t=>t.className===selectedClass);
      const foundClass=dbClasses?.find(c=>c.class_name===selectedClass);
      if(foundClass?.sections)foundClass.sections.forEach(s=>set.add(String(s.section_name).replace(/^section\s+/i,'').trim().toUpperCase()));
    }
    refTopics.forEach(t=>{if(t.section)set.add(String(t.section).replace(/^section\s+/i,'').trim().toUpperCase())});
    if(set.size===0){set.add('A');set.add('B')}
    return Array.from(set).sort();
  },[topics,dbClasses,selectedClass]);

  const normSec=s=>(s||'').replace(/^section\s+/i,'').trim().toUpperCase();

  const filteredTopics=useMemo(()=>{
    return topics.filter(x=>{
      const matchClass=selectedClass==='ALL'||x.className===selectedClass;
      const matchSection=selectedSection==='ALL'||normSec(x.section)===normSec(selectedSection);
      return matchClass&&matchSection;
    });
  },[topics,selectedClass,selectedSection]);

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
        return matchClass&&matchSection;
      });
      const cDone=cTopics.filter(x=>x.status==='Done').length;
      const cInProgress=cTopics.filter(x=>x.status==='In Progress').length;
      const cPending=cTopics.filter(x=>x.status==='Not Done').length;
      const cTotal=cTopics.length;
      const progress=cTotal?Math.round(cDone/cTotal*100):0;
      return {
        name:c,
        shortName:c.replace('Class ','Cl '),
        done:cDone,
        inProgress:cInProgress,
        pending:cPending,
        total:cTotal,
        progress
      };
    });
  },[availableClasses,topics,selectedSection]);

  // Subject-wise completion data (Used when a specific class is selected or for filtered cards)
  const subjectData=useMemo(()=>{
    return Object.values(filteredTopics.reduce((a,x)=>{
      let v=a[x.subject]||(a[x.subject]={name:x.subject,done:0,inProgress:0,pending:0,total:0});
      v.total++;
      if(x.status==='Done')v.done++;
      else if(x.status==='In Progress')v.inProgress++;
      else v.pending++;
      return a;
    },{})).map(x=>({
      ...x,
      progress:x.total?Math.round(x.done/x.total*100):0
    })).sort((a,b)=>a.name.localeCompare(b.name));
  },[filteredTopics]);

  const isAllClass=selectedClass==='ALL';
  const chartData=isAllClass?classWiseData:subjectData;
  const chartTitle=isAllClass?'Class-wise Syllabus Completion %':`Subject-wise Completion % — ${selectedClass}`;
  const chartSubtitle=isAllClass
    ?`Comparing completion across all ${availableClasses.length} classes ${selectedSection!=='ALL'?`(Section ${selectedSection})`:''}`
    :`Syllabus completion rate by subject for ${selectedClass} ${selectedSection!=='ALL'?`· Section ${selectedSection}`:'· All Sections'}`;

  const getBarColor=(progress)=>{
    if(progress>=75)return '#16a34a'; // Green
    if(progress>=50)return '#1d6fd8'; // Blue
    if(progress>=25)return '#d97706'; // Amber/Orange
    return '#dc2626'; // Red
  };

  return <>
    <div className="hero">
      <div>
        <span className="eyebrow">ACADEMIC YEAR 2026–27</span>
        <h1>Welcome to Syllabus Dashboard</h1>
        <p>{school.name} <span>•</span> {school.address}</p>
      </div>
      <div className="hero-user">
        <Logo/>
        <div>
          <small>LOGGED IN AS</small>
          <b>{user.name}</b>
          <Status value="Admin"/>
        </div>
      </div>
    </div>

    <Filters
      selectedClass={selectedClass}
      setSelectedClass={setSelectedClass}
      selectedSection={selectedSection}
      setSelectedSection={setSelectedSection}
      availableClasses={availableClasses}
      availableSections={availableSections}
    >
      {!isAllClass&&(
        <button
          type="button"
          className="secondary"
          onClick={()=>{setSelectedClass('ALL');setSelectedSection('ALL')}}
          style={{display:'inline-flex',alignItems:'center',gap:6,fontSize:12}}
        >
          <Icons.RotateCcw size={14}/> Reset to All Classes
        </button>
      )}
    </Filters>

    <div className="stats">
      {[
        ["Total Topics",total,'ListChecks'],
        ['Completed',done,'CircleCheck'],
        ['In Progress',inProgress,'Clock3'],
        ['Pending',pending,'CircleAlert'],
        ['Overall Progress',percent+'%','ChartNoAxesCombined']
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
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
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
        </div>
      </div>

      {chartData.length>0?(
        <div style={{width:'100%',height:280,marginTop:10}}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{top:15,right:20,left:-10,bottom:isAllClass?10:30}}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis
                dataKey={isAllClass?"shortName":"name"}
                tick={{fontSize:11,fill:'#4b5563'}}
                interval={0}
                angle={isAllClass?0:-25}
                textAnchor={isAllClass?"middle":"end"}
                height={isAllClass?30:50}
              />
              <YAxis domain={[0,100]} unit="%" tick={{fontSize:11,fill:'#4b5563'}} />
              <Tooltip content={<CustomChartTooltip isClass={isAllClass}/>} />
              <Bar
                dataKey="progress"
                radius={[6,6,0,0]}
                maxBarSize={50}
                onClick={(entry)=>{
                  if(isAllClass&&entry?.name){
                    setSelectedClass(entry.name);
                  }
                }}
                cursor={isAllClass?"pointer":"default"}
              >
                {chartData.map((entry,index)=>(
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.progress)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ):(
        <div style={{padding:40,textAlign:'center',color:'#72839a'}}>
          No syllabus records available for this filter.
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
              <div className="bar" style={{margin:'6px 0 4px',height:4}}>
                <i style={{width:c.progress+'%',background:getBarColor(c.progress)}}/>
              </div>
              <small style={{fontSize:10,color:'#64748b',display:'block'}}>{c.done}/{c.total} topics</small>
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
              <div className="bar" style={{margin:'6px 0 4px',height:4}}>
                <i style={{width:s.progress+'%',background:getBarColor(s.progress)}}/>
              </div>
              <small style={{fontSize:10,color:'#64748b',display:'block'}}>{s.done}/{s.total} done</small>
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
          subtitle={isAllClass&&selectedSection==='ALL'?'Complete syllabus data':`${isAllClass?'All Classes':selectedClass} · ${selectedSection==='ALL'?'All Sections':'Section '+selectedSection}`}
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
        <CardTitle title="Monthly completion trend" subtitle="Progress across months"/>
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
        title={isAllClass?"All Subjects Overview":`${selectedClass} Subject Details`}
        subtitle="Detailed syllabus completion rate"
      />
      {subjectData.length>0?(
        <div className="subjects">
          {subjectData.map(x=><div className="subject" key={x.name}>
            <div className="subject-icon">{x.name.slice(0,2).toUpperCase()}</div>
            <b>{x.name}</b>
            <strong style={{color:getBarColor(x.progress)}}>{x.progress}%</strong>
            <div className="bar">
              <i style={{width:x.progress+'%',background:getBarColor(x.progress)}}/>
            </div>
            <small>{x.progress<50?'⚠️ Needs attention':'✅ On track'}</small>
          </div>)}
        </div>
      ):(
        <div style={{padding:30,textAlign:'center',color:'#72839a'}}>
          No subjects found for the selected Class & Section filter.
        </div>
      )}
    </section>
  </>;
}
function CardTitle({title,subtitle,action}){return <div className="card-title"><div><h2>{title}</h2><p>{subtitle}</p></div>{action&&<button className="text-btn">{action} <Icons.ArrowRight size={16}/></button>}</div>}
function TopicTable({title,data=seed}){return <section className="card table-card"><CardTitle title={title} subtitle={`${data.length} topics`}/><div className="table-wrap"><table><thead><tr><th>Subject</th><th>Month</th><th>Chapter / Topic</th><th>Status</th></tr></thead><tbody>{data.slice(0,5).map(x=><tr key={x.id}><td><b>{x.subject}</b></td><td>{x.month}</td><td>{x.chapter}</td><td><Status value={x.status}/></td></tr>)}</tbody></table></div></section>}
const classGroups={primary:{label:'1st To 8th',classes:['Class 1','Class 2','Class 3','Class 4','Class 5','Class 6','Class 7','Class 8']},senior:{label:'9th To 12th',classes:['Class 9','Class 10','Class 11','Class 12']}}
function Classes(){const [group,setGroup]=useState('primary');const [classes,setClasses]=useState([{name:'Class 1',sections:['A'],group:'primary'},{name:'Class 5',sections:['A','B'],group:'primary'},{name:'Class 8',sections:['A'],group:'primary'},{name:'Class 9',sections:['A','B'],group:'senior'},{name:'Class 10',sections:['A'],group:'senior'},{name:'Class 11',sections:['A','B'],group:'senior'},{name:'Class 12',sections:['A','B'],group:'senior'}]);const [adding,setAdding]=useState(false);const add=e=>{e.preventDefault();let d=new FormData(e.target),c=d.get('class'),s=d.get('section').toUpperCase();setClasses(v=>{let existing=v.find(x=>x.name===c&&x.group===group);return existing?v.map(x=>x===existing?{...x,sections:[...new Set([...x.sections,s])]}:x):[...v,{name:c,sections:[s],group}]});setAdding(false)};let visible=classes.filter(x=>x.group===group),config=classGroups[group];return <><PageHead eyebrow="ACADEMIC STRUCTURE" title="Class & Section Management" text="Classes are kept separately for each school group" action="Create class / section" onAction={()=>setAdding(true)}/><div className="filters"><button className={group==='primary'?'primary':'secondary'} onClick={()=>setGroup('primary')}>{classGroups.primary.label}</button><button className={group==='senior'?'primary':'secondary'} onClick={()=>setGroup('senior')}>{classGroups.senior.label}</button></div><section className="card" style={{marginBottom:18,padding:14}}><b>{config.label}</b><p style={{marginTop:5,fontSize:12,color:'#72839a'}}>Only {config.classes.join(', ')} can be created in this group.</p></section>{adding&&<Modal title={`Create class / section — ${config.label}`} close={()=>setAdding(false)}><form onSubmit={add} className="form-grid"><label>Class<select name="class">{config.classes.map(x=><option key={x}>{x}</option>)}</select></label><label>Section<input name="section" placeholder="e.g. A" required/></label><button className="primary">Create section</button></form></Modal>}<section className="class-grid">{visible.map(c=><div className="class-box" key={c.name}><div className="class-top"><div className="class-icon"><Icons.GraduationCap/></div><button><Icons.MoreHorizontal/></button></div><h2>{c.name}</h2><p>{c.sections.length} active sections</p><div className="section-pills">{c.sections.map(x=><span key={x}>Section {x}</span>)}</div><button className="text-btn">Manage sections <Icons.ArrowRight size={15}/></button></div>)}{!visible.length&&<p>No classes created yet for {config.label}.</p>}</section></>}
function Excel(){const [report,setReport]=useState(null),[file,setFile]=useState(null),[busy,setBusy]=useState(false),[message,setMessage]=useState('');const choose=async e=>{let f=e.target.files[0];if(!f)return;setFile(f);try{let book=XLSX.read(await f.arrayBuffer());let rows=[];for(const sheet of book.SheetNames){for(const r of XLSX.utils.sheet_to_json(book.Sheets[sheet],{defval:''})){let month=r.Month||r.month,chapter=r.Chapter||r['Chapter / Topic']||r.Name||r.Title,topic=r['Topic English']||r.Topic||r.Syllabus||'' ,status=r.Status||'Not Done';if(!month||!chapter||!statusValues.includes(status))throw Error(`Invalid row in ${sheet}: Month, Chapter/Name and a valid Status are required.`);rows.push({subject:sheet,month,chapter,topic,hindi:r['विषय हिन्दी']||r.Hindi||'',assessment:r.Assessment||'',status,remarks:r.Remarks||''})}}setReport({sheets:book.SheetNames,rows,valid:rows.length>0})}catch(err){setReport({valid:false,error:err.message||'This file could not be read as an Excel workbook.'})}};const replace=async()=>{if(!supabase){setMessage('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable importing.');return}setBusy(true);try{let {error}=await supabase.rpc('replace_syllabus_import',{import_rows:report.rows});if(error)throw error;setMessage(`Import complete: ${report.rows.length} records replaced. Open Syllabus Progress to see the latest data.`);setReport(null)}catch(e){setMessage(e.message)}setBusy(false)};return <><PageHead eyebrow="MASTER DATA" title="Class & Section Excel Management" text="Validated Excel imports replace the current database data"/><section className="upload-zone"><Icons.FileUp/><h2>{file?file.name:'Upload a new syllabus Excel'}</h2><p>Each sheet is a subject. Required columns: Month and Chapter/Name; Status must be Done, In Progress or Not Done.</p><label className="secondary">Browse files<input type="file" accept=".xlsx,.xls" onChange={choose}/></label></section>{report&&<section className={'analysis '+(report.valid?'':'invalid')}><div><Icons.ShieldCheck/><div><h2>{report.valid?'Excel analysis complete':'Upload rejected'}</h2><p>{report.valid?`${file.name} · ${report.rows.length} validated rows` : report.error}</p></div></div>{report.valid&&<><div className="sheet-list">{report.sheets.map(x=><span key={x}><Icons.Check/> {x}</span>)}</div><div className="analysis-actions"><button className="secondary" onClick={()=>setReport(null)}>Cancel</button><button className="primary" disabled={busy} onClick={replace}>{busy?'Replacing…':'Confirm & Replace'} <Icons.ArrowRight/></button></div></>}</section>}{message&&<p className="notice">{message}</p>}</>}
function Syllabus(){const {topics,loading,error,reload}=useTopics(),[q,setQ]=useState(''),[group,setGroup]=useState('primary'),[className,setClassName]=useState('ALL'),[subjectName,setSubjectName]=useState('ALL'),[exam,setExam]=useState('ALL'),[toast,setToast]=useState('');const groupTopics=topics.filter(x=>(x.group||'primary')===group),availableClasses=[...new Set(groupTopics.map(x=>x.className).filter(Boolean))].sort((a,b)=>demoClasses.indexOf(a)-demoClasses.indexOf(b)),classTopics=className==='ALL'?groupTopics:groupTopics.filter(x=>x.className===className),availableSubjects=[...new Set(classTopics.map(x=>x.subject).filter(Boolean))].sort(),subjectTopics=subjectName==='ALL'?classTopics:classTopics.filter(x=>x.subject===subjectName),eligible=examTopics(subjectTopics,group,exam),data=eligible.filter(x=>(x.chapter+x.subject+x.topic+x.month+x.className+(x.assessment||'')).toLowerCase().includes(q.toLowerCase())),done=eligible.filter(x=>x.status==='Done').length,active=eligible.filter(x=>x.status==='In Progress').length,progress=eligible.length?Math.round(done/eligible.length*100):0;const chooseGroup=g=>{setGroup(g);setClassName('ALL');setSubjectName('ALL');setExam('ALL')};const chooseClass=c=>{setClassName(c);setSubjectName('ALL')};const updateStatus=async(x,status)=>{try{await saveTopic({...x,status});await reload();setToast('Status updated successfully.')}catch(e){setToast(e.message)}};const remove=async x=>{if(!confirm('Are you sure you want to delete this syllabus record?'))return;try{if(supabase){let {error}=await supabase.from('syllabus_topics').delete().eq('id',x.id);if(error)throw error}await reload();setToast('Record deleted successfully.')}catch(e){setToast(e.message)}};return <><PageHead eyebrow="MONTHLY TRACKER" title="Syllabus Progress" text="Filter by group, class, subject, or exam pattern"/><div className="filters"><button className={group==='primary'?'primary':'secondary'} onClick={()=>chooseGroup('primary')}>1st To 8th</button><button className={group==='senior'?'primary':'secondary'} onClick={()=>chooseGroup('senior')}>9th To 12th</button><select value={className} onChange={e=>chooseClass(e.target.value)} aria-label="Filter by class"><option value="ALL">All Classes</option>{availableClasses.map(x=><option key={x} value={x}>{x}</option>)}</select><select value={subjectName} onChange={e=>setSubjectName(e.target.value)} aria-label="Filter by subject"><option value="ALL">All Subjects</option>{availableSubjects.map(x=><option key={x} value={x}>{x}</option>)}</select></div><section className="card" style={{marginBottom:18}}><span className="eyebrow">EXAM PATTERN · {className==='ALL'?(group==='primary'?'1ST TO 8TH':'9TH TO 12TH'):className}{subjectName!=='ALL'?` · ${subjectName}`:''}</span><div className="filters" style={{margin:'12px 0 0'}}>{examPatterns[group].map(([name])=>{let count=examTopics(subjectTopics,group,name).length;return <button key={name} className={exam===name?'primary':'secondary'} onClick={()=>setExam(name)}>{name} ({count})</button>})}</div></section><div className="stats compact"><div className="stat"><div><small>{exam} TOTAL</small><strong>{eligible.length}</strong></div><i><Icons.ListChecks/></i></div><div className="stat"><div><small>DONE</small><strong>{done}</strong></div><i><Icons.CircleCheck/></i></div><div className="stat"><div><small>IN PROGRESS</small><strong>{active}</strong></div><i><Icons.Clock3/></i></div><div className="stat"><div><small>PROGRESS</small><strong>{progress}%</strong></div><i><Icons.ChartNoAxesCombined/></i></div></div><div className="filters"><div className="search"><Icons.Search/><input placeholder="Search class, subject, topic or chapter..." onChange={e=>setQ(e.target.value)}/></div></div>{(toast||error)&&<p className="notice">{toast||error}</p>}<section className="card"><CardTitle title={exam==='ALL'?'Complete month-wise syllabus':`${exam} eligible syllabus`} subtitle={loading?'Loading database…':`${data.length} matching records`}/><div className="table-wrap"><table className="wide"><thead><tr><th>Class</th><th>Month / Term</th><th>Subject</th><th>Chapter / Title</th><th>Detailed Syllabus</th><th>Status</th><th>Actions</th></tr></thead><tbody>{data.map(x=><tr key={x.id} className={'row-'+x.status.toLowerCase().replace(/\s+/g,'-')}><td><b>{x.className}</b></td><td><span className="badge">{x.month}</span>{x.assessment&&<><br/><small style={{color:'#72839a'}}>{x.assessment}</small></>}</td><td><b>{x.subject}</b></td><td>{x.chapter}</td><td><div style={{maxHeight:120,overflowY:'auto',whiteSpace:'pre-line'}}>{x.topic}</div></td><td><select className={'status-select status-'+x.status.toLowerCase().replace(/\s+/g,'-')} value={x.status} onChange={e=>updateStatus(x,e.target.value)}>{statusValues.map(s=><option key={s}>{s}</option>)}</select></td><td><button className="icon-btn" onClick={()=>setToast('Edit this record from the existing edit workflow.')}><Icons.Pencil size={16}/></button><button className="icon-btn danger" onClick={()=>remove(x)}><Icons.Trash2 size={16}/></button></td></tr>)}</tbody></table></div></section></>}
function Tracker({type}){return <><PageHead eyebrow={type==='Practical'?'LABORATORY WORK':'ACADEMIC EVALUATION'} title={`${type} Tracker`} text={`Monitor subject-wise ${type.toLowerCase()} completion and status`}/><Filters/><TopicTable title={`Current ${type.toLowerCase()} status`} data={seed.slice(0,6)}/></>}
function Users(){return <><PageHead eyebrow="ADMIN ONLY" title="User Management" text="Create and manage secure user access" action="Create user" onAction={()=>alert('Create user securely through a Supabase Edge Function.')}/><div className="stats compact">{[['Total Users',8,'Users'],['Admins',2,'ShieldCheck'],['Computer Operators',6,'MonitorCog'],['Active Users',7,'UserCheck']].map(([x,y,z])=>{let I=Icons[z];return <div className="stat"><div><small>{x}</small><strong>{y}</strong></div><i><I/></i></div>})}</div><section className="card"><CardTitle title="School users" subtitle="Role and account status"/><div className="table-wrap"><table><thead><tr><th>Name</th><th>User ID</th><th>Role</th><th>Status</th><th>Created</th><th/></tr></thead><tbody>{[['Akash Yadav','akash@savitrischool.edu.in','Admin'],['Priya Singh','priya@savitrischool.edu.in','Computer Operator'],['Neha Patel','neha@savitrischool.edu.in','Computer Operator']].map(x=><tr><td><b>{x[0]}</b></td><td>{x[1]}</td><td><Status value={x[2]}/></td><td><span className="active-dot">Active</span></td><td>05 Sep 2026</td><td><button className="icon-btn"><Icons.MoreHorizontal/></button></td></tr>)}</tbody></table></div></section></>}
function Settings(){return <><PageHead eyebrow="BRANDING & CONFIGURATION" title="School Settings" text="Update school identity used throughout the tracker"/><section className="card settings"><div className="setting-logo"><Logo/><button className="secondary">Change logo</button></div><div className="form-grid"><label>School name<input defaultValue={school.name}/></label><label>Manager / Principal name<input placeholder="Set a configurable manager name"/></label><label className="full-label">School address<input defaultValue={school.address}/></label><button className="primary">Save school settings <Icons.Save/></button></div></section></>}
function Profile({user}){return <><PageHead eyebrow="ACCOUNT" title="My Profile" text="Your personal account settings"/><section className="card profile"><div className="big-avatar">AY</div><h2>{user.name}</h2><Status value="Admin"/><p>{user.email}</p><button className="secondary">Edit profile</button></section></>}
function PageHead({eyebrow,title,text,action,onAction}){return <div className="page-head"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{text}</p></div>{action&&<button onClick={onAction} className="primary"><Icons.Plus/> {action}</button>}</div>}
function Modal({title,children,close}){return <div className="modal-backdrop"><div className="modal"><button className="modal-close" onClick={close}><Icons.X/></button><h2>{title}</h2>{children}</div></div>}
createRoot(document.getElementById('root')).render(<App/>)
