import React, { useState, useEffect, useMemo } from 'react';
import { 
  Layout, Calendar, Target, DollarSign, Settings, Plus, Trash2, 
  ChevronLeft, ChevronRight, Wallet, 
  CheckSquare, Save, BarChart2, Check, X,
  ClipboardList, ArrowRight, Edit2, Repeat,
  Clock, Youtube, Instagram, Smartphone, Facebook, PenTool,
  PieChart, ShoppingBag, Coffee, PiggyBank, 
  BookOpen, GraduationCap, School, Book, AlertTriangle, UserCheck, 
  Activity, Sparkles, Star, Download, Share, MoreVertical, Menu
} from 'lucide-react';

// --- UTILITIES ---
const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const formatDate = (date) => new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
const formatCurrency = (amount) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
const MONTH_NAMES = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const DAY_NAMES = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

// Helper to get dates for the current week (starting Monday)
const getWeekDates = (currentDate) => {
  const week = [];
  const current = new Date(currentDate);
  const day = current.getDay();
  const diff = current.getDate() - day + (day === 0 ? -6 : 1); 
  const monday = new Date(current.setDate(diff));

  for (let i = 0; i < 7; i++) {
    const next = new Date(monday);
    next.setDate(monday.getDate() + i);
    week.push(next);
  }
  return week;
};

// --- DATA TEMPLATES ---
const CONTENT_TEMPLATES = {
  'Personal Branding': [
    { dayIndex: 1, time: '08:00', text: '[Story] Motivasi Pagi / Sapa Followers' },
    { dayIndex: 1, time: '12:00', text: '[Reel] Edukasi: Tips Singkat sesuai Niche' },
    { dayIndex: 1, time: '19:00', text: '[Beruntun] Tutorial Lengkap / Infografis' },
    { dayIndex: 2, time: '12:00', text: '[Story] Behind The Scene (BTS) Kegiatan' },
    { dayIndex: 2, time: '20:00', text: '[Live] Sesi Q&A Santai' },
    { dayIndex: 3, time: '12:00', text: '[Reel] Mitos vs Fakta di Industrimu' },
    { dayIndex: 3, time: '18:00', text: '[Story] Interaksi (Polling/Stiker)' },
    { dayIndex: 4, time: '19:00', text: '[Beruntun] Cerita Perjalanan/Struggle (Storytelling)' },
    { dayIndex: 5, time: '12:00', text: '[Reel] Tren/Hiburan yang Relate' },
    { dayIndex: 5, time: '20:00', text: '🌙 ME TIME: Istirahat total, evaluasi santai.' },
    { dayIndex: 6, time: '10:00', text: '[Story] Share rencana weekend / Hobi' },
    { dayIndex: 0, time: '09:00', text: '🏖️ ME TIME: Detoks Sosmed, kumpul keluarga.' },
  ],
  'Jualan / Promosi': [
    { dayIndex: 1, time: '10:00', text: '[Story] Spill Produk Baru / Stok Update' },
    { dayIndex: 1, time: '19:00', text: '[Reel] Soft Selling: Masalah vs Solusi Produk' },
    { dayIndex: 2, time: '12:00', text: '[Beruntun] Testimoni Pelanggan (Bukti Sosial)' },
    { dayIndex: 3, time: '19:00', text: '[Live] Flash Sale / Demo Produk' },
    { dayIndex: 4, time: '12:00', text: '[Reel] Cara Pakai / Tutorial Produk' },
    { dayIndex: 5, time: '15:00', text: '[Story] Promo Weekend / Diskon Terbatas' },
    { dayIndex: 6, time: '10:00', text: '[Beruntun] Katalog Produk Best Seller' },
    { dayIndex: 0, time: '00:00', text: '🏖️ ME TIME: Rekap orderan, istirahat.' },
  ],
  'Engagement / Interaksi': [
    { dayIndex: 1, time: '08:00', text: '[Story] This or That (Stiker)' },
    { dayIndex: 1, time: '20:00', text: '[Reel] Video Lucu/Relate (Meme)' },
    { dayIndex: 3, time: '19:00', text: '[Beruntun] Mini Game / Tebak-tebakan' },
    { dayIndex: 5, time: '15:00', text: '[Story] Ask Me Anything' },
    { dayIndex: 6, time: '20:00', text: '[Live] Ngobrol Santai Malam Minggu' },
    { dayIndex: 0, time: '00:00', text: '🏖️ ME TIME' },
  ]
};

const PRODUCTIVE_HABITS_TEMPLATE = [
  { name: '04:30 Bangun & Air Putih' },
  { name: '04:45 Subuh & Ngaji' },
  { name: '05:15 Jalan Pagi' },
  { name: '06:45 Membaca (20 Menit)' },
  { name: 'Kuliah & Hidrasi' },
  { name: '12:00 Makan Buah Segar' },
  { name: '16:30 Joging Sore' },
  { name: '18:15 Magrib & Ngaji' },
  { name: '19:45 Belajar / Tugas' },
  { name: '22:00 Tidur (Konsisten)' },
  { name: 'Target 8 Gelas Air' }
];

// --- THEME CONSTANTS ---
const THEME = {
  bg: "bg-[#FDF8F5]", 
  sidebar: "bg-white",
  primary: "text-slate-800",
  accent: "bg-[#E8C5C5]", 
  accentText: "text-[#B07070]",
  accentLight: "bg-[#F9E8E8]",
  border: "border-[#EFE1E1]",
  card: "bg-white shadow-sm border border-[#EFE1E1]",
  header: "font-serif tracking-wide text-slate-800"
};

// --- UI COMPONENTS ---
const Card = ({ children, className = "" }) => (
  <div className={`${THEME.card} rounded-xl ${className}`}>
    {children}
  </div>
);

const Button = ({ children, onClick, variant = "primary", className = "", size = "md" }) => {
  const base = "font-medium transition-all flex items-center justify-center gap-2 rounded-md active:scale-95";
  const sizes = { sm: "px-2 py-1 text-xs", md: "px-4 py-2 text-sm", icon: "p-2" };
  const variants = {
    primary: "bg-[#D4A5A5] text-white hover:bg-[#C08585] shadow-sm",
    secondary: "bg-white text-slate-600 border border-[#EFE1E1] hover:bg-[#F9E8E8]",
    danger: "text-red-400 hover:bg-red-50 hover:text-red-600",
    ghost: "text-slate-500 hover:bg-[#F9E8E8]",
    dark: "bg-slate-800 text-white hover:bg-slate-700"
  };
  return (
    <button onClick={onClick} className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

const ProgressBar = ({ value, max, color = "bg-[#D4A5A5]" }) => {
  const percentage = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  return (
    <div className="h-2 w-full bg-[#F2F2F2] rounded-full overflow-hidden">
      <div className={`h-full transition-all duration-500 ${color}`} style={{ width: `${percentage}%` }} />
    </div>
  );
};

const Toast = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);
  
  if (!message) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 md:bottom-6 md:top-auto md:right-6 md:left-auto md:translate-x-0 bg-slate-800 text-white px-4 py-3 rounded-xl shadow-xl text-sm animate-fade-in z-[70] flex items-center gap-3">
      <div className="bg-green-500 p-1 rounded-full"><Check className="w-3 h-3 text-white" /></div>
      <span className="font-medium">{message}</span>
    </div>
  );
};

// --- LANDING PAGE COMPONENTS ---

const LoadingScreen = () => (
  <div className="fixed inset-0 bg-[#FDF8F5] z-[60] flex flex-col items-center justify-center animate-fade-in">
     <div className="w-16 h-16 bg-[#D4A5A5] rounded-2xl flex items-center justify-center shadow-lg mb-4 animate-bounce">
        <Layout className="w-8 h-8 text-white" />
     </div>
     <h1 className="font-serif text-2xl text-slate-800 tracking-tight">Life<span className="text-[#D4A5A5] italic">OS</span></h1>
     <p className="text-slate-400 text-xs tracking-[0.3em] uppercase mt-2">Memuat Aplikasi...</p>
  </div>
);

const InstallModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 z-[60] flex items-end md:items-center justify-center p-4 animate-fade-in">
       <Card className="w-full max-w-sm p-6 bg-white relative animate-slide-up">
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-red-500"><X className="w-5 h-5"/></button>
          
          <h3 className="font-bold text-lg text-slate-800 mb-2">Cara Pasang Aplikasi</h3>
          <p className="text-sm text-slate-500 mb-4">Tambahkan ke layar utama agar mudah diakses seperti aplikasi native.</p>
          
          <div className="space-y-4">
             <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-lg">
                <div className="bg-white p-2 rounded border border-slate-200"><Share className="w-5 h-5 text-blue-500"/></div>
                <div>
                   <h4 className="font-bold text-xs text-slate-700">Pengguna iOS (Safari)</h4>
                   <p className="text-xs text-slate-500 leading-tight mt-1">
                      1. Tekan tombol <strong>Share</strong> di bawah.<br/>
                      2. Pilih <strong>"Add to Home Screen"</strong>.
                   </p>
                </div>
             </div>

             <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-lg">
                <div className="bg-white p-2 rounded border border-slate-200"><MoreVertical className="w-5 h-5 text-slate-700"/></div>
                <div>
                   <h4 className="font-bold text-xs text-slate-700">Pengguna Android (Chrome)</h4>
                   <p className="text-xs text-slate-500 leading-tight mt-1">
                      1. Tekan <strong>Menu Titik Tiga</strong> di pojok kanan atas.<br/>
                      2. Pilih <strong>"Install App"</strong> atau <strong>"Tambahkan ke Layar Utama"</strong>.
                   </p>
                </div>
             </div>
          </div>

          <Button className="w-full mt-6" onClick={onClose}>Saya Mengerti</Button>
       </Card>
    </div>
  );
};

const LandingPage = ({ onEnterApp }) => {
  const [showInstallHelp, setShowInstallHelp] = useState(false);

  return (
    <div className="fixed inset-0 bg-[#FDF8F5] z-50 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
       {showInstallHelp && <InstallModal onClose={() => setShowInstallHelp(false)} />}
       
       <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center mb-8 border border-[#EFE1E1] transform rotate-3 hover:rotate-0 transition-all duration-500">
          <div className="w-16 h-16 bg-[#D4A5A5] rounded-xl flex items-center justify-center">
             <Layout className="w-8 h-8 text-white" />
          </div>
       </div>

       <h1 className="font-serif text-4xl text-slate-800 tracking-tight mb-2">Life<span className="text-[#D4A5A5] italic">OS</span></h1>
       <p className="text-slate-500 text-sm max-w-xs mb-10 leading-relaxed">
          Satu aplikasi untuk mengatur Akademik, Konten, Keuangan, dan Kebiasaan Anda secara produktif.
       </p>

       <div className="w-full max-w-xs space-y-3">
          <button 
             onClick={() => setShowInstallHelp(true)}
             className="w-full py-3.5 bg-slate-800 text-white rounded-xl font-medium shadow-lg shadow-slate-200 hover:bg-slate-700 transition-all flex items-center justify-center gap-2 group active:scale-95"
          >
             <Download className="w-5 h-5 group-hover:animate-bounce" />
             Pasang Aplikasi
          </button>
          
          <button 
             onClick={onEnterApp}
             className="w-full py-3 text-slate-400 hover:text-[#B07070] text-sm font-medium transition-colors flex items-center justify-center gap-2 active:scale-95"
          >
             Buka Lewat Web <ArrowRight className="w-4 h-4"/>
          </button>
       </div>

       <p className="absolute bottom-8 text-[10px] text-slate-400 uppercase tracking-widest">
          Versi 2.0 • Data Tersimpan Lokal
       </p>
    </div>
  );
};

// --- MODULES ---

const SetupWizard = ({ settings, setSettings }) => {
  const [step, setStep] = useState(1);
  const [tempSettings, setTempSettings] = useState({ ...settings });
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 animate-fade-in bg-white">
        <div className="text-center mb-6"><h2 className={`${THEME.header} text-2xl font-bold`}>Pengaturan Strategi</h2><p className="text-slate-500 text-sm mt-2">Mari sesuaikan planner dengan target Anda.</p></div>
        {step === 1 && (
          <div className="space-y-4"><label className="block text-sm font-bold text-slate-700">Platform Utama</label>
            <div className="grid grid-cols-2 gap-3">{['TikTok', 'Instagram', 'YouTube', 'Facebook Pro'].map(p => (<button key={p} onClick={() => setTempSettings({ ...tempSettings, platform: p })} className={`p-3 rounded-lg border text-sm font-medium transition-all ${tempSettings.platform === p ? 'bg-[#D4A5A5] text-white border-[#D4A5A5]' : 'bg-white text-slate-600 border-slate-200'}`}>{p}</button>))}</div>
            <Button className="w-full mt-4" onClick={() => setStep(2)}>Lanjut <ArrowRight className="w-4 h-4" /></Button>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4"><label className="block text-sm font-bold text-slate-700">Tujuan Konten (Goals)</label>
            <div className="space-y-2">{['Personal Branding', 'Jualan / Promosi', 'Engagement / Interaksi'].map(g => (<button key={g} onClick={() => setTempSettings({ ...tempSettings, goal: g })} className={`w-full p-3 rounded-lg border text-left text-sm font-medium transition-all flex justify-between items-center ${tempSettings.goal === g ? 'bg-[#F9E8E8] border-[#D4A5A5] text-[#B07070]' : 'bg-white text-slate-600 border-slate-200'}`}><span>{g}</span>{tempSettings.goal === g && <Check className="w-4 h-4" />}</button>))}</div>
            <div className="flex gap-2 mt-6"><Button variant="secondary" className="flex-1" onClick={() => setStep(1)}>Kembali</Button><Button className="flex-1" onClick={() => setSettings({ ...tempSettings, showSetup: false })}>Selesai</Button></div>
          </div>
        )}
      </Card>
    </div>
  );
};

const Academic = ({ academicSchedule, setAcademicSchedule, academicDetails, setAcademicDetails, assignments, setAssignments }) => {
  const [view, setView] = useState('schedule'); 
  const [newClass, setNewClass] = useState({ day: 'Senin', time: '', subject: '', room: '' });
  const [newAssignment, setNewAssignment] = useState({ subject: '', title: '', deadline: '' });

  const uniqueSubjects = useMemo(() => {
    const subjects = academicSchedule.map(s => s.subject.trim());
    return [...new Set(subjects)];
  }, [academicSchedule]);

  useEffect(() => {
    const newDetails = { ...academicDetails };
    let hasChanges = false;
    uniqueSubjects.forEach(sub => {
      if (!newDetails[sub]) {
        newDetails[sub] = { attendance: 0, alphas: 0, permissions: 0, totalMeetings: 0, uts: false, uas: false };
        hasChanges = true;
      }
    });
    if (hasChanges) setAcademicDetails(newDetails);
  }, [uniqueSubjects, academicDetails, setAcademicDetails]);

  const { attendancePct, assignmentPct, examPct } = useMemo(() => {
    if (uniqueSubjects.length === 0) return { attendancePct: 0, assignmentPct: 0, examPct: 0 };
    let totalAttendanceRate = 0;
    uniqueSubjects.forEach(sub => {
      const detail = academicDetails[sub] || { attendance: 0, totalMeetings: 0 };
      const rate = detail.totalMeetings > 0 ? (detail.attendance / detail.totalMeetings) : 0;
      totalAttendanceRate += rate;
    });
    const attPct = Math.round((totalAttendanceRate / uniqueSubjects.length) * 100);
    const totalAssignments = assignments.length;
    const completedAssignments = assignments.filter(a => a.completed).length;
    const assPct = totalAssignments > 0 ? Math.round((completedAssignments / totalAssignments) * 100) : 0;
    let completedExams = 0;
    const totalExams = uniqueSubjects.length * 2;
    uniqueSubjects.forEach(sub => {
      if (academicDetails[sub]?.uts) completedExams++;
      if (academicDetails[sub]?.uas) completedExams++;
    });
    const exPct = totalExams > 0 ? Math.round((completedExams / totalExams) * 100) : 0;
    return { attendancePct: attPct, assignmentPct: assPct, examPct: exPct };
  }, [uniqueSubjects, academicDetails, assignments]);

  const updateAttendance = (subject, type) => {
    const detail = academicDetails[subject];
    if (detail.totalMeetings >= 14) return;
    const updatedDetail = {
      ...detail,
      totalMeetings: detail.totalMeetings + 1,
      attendance: type === 'present' ? detail.attendance + 1 : detail.attendance,
      alphas: type === 'alpha' ? detail.alphas + 1 : detail.alphas,
      permissions: type === 'permission' ? detail.permissions + 1 : detail.permissions
    };
    setAcademicDetails({ ...academicDetails, [subject]: updatedDetail });
  };
  const toggleExam = (subject, type) => {
    const detail = academicDetails[subject];
    setAcademicDetails({ ...academicDetails, [subject]: { ...detail, [type]: !detail[type] } });
  };
  const resetAttendance = (subject) => {
    setAcademicDetails({ ...academicDetails, [subject]: { ...academicDetails[subject], attendance: 0, alphas: 0, permissions: 0, totalMeetings: 0 } });
  };
  const getDaysRemaining = (deadline) => Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
  const addClass = (e) => {
    e.preventDefault();
    if(!newClass.subject) return;
    setAcademicSchedule([...academicSchedule, { id: Date.now(), ...newClass }]);
    setNewClass({ ...newClass, subject: '', room: '' });
  };
  const addAssignment = (e) => {
    e.preventDefault();
    if(!newAssignment.title) return;
    setAssignments([...assignments, { id: Date.now(), ...newAssignment, completed: false }]);
    setNewAssignment({ subject: '', title: '', deadline: '' });
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans pb-24 md:pb-0">
       <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-[#EFE1E1]">
          <div><h2 className={`${THEME.header} text-2xl font-bold`}>Akademik</h2><p className="text-slate-400 text-xs tracking-widest uppercase">Student Dashboard</p></div>
          {/* Menu Desktop */}
          <div className="hidden md:flex gap-2 bg-slate-100 p-1 rounded-lg">
            <button onClick={() => setView('schedule')} className={`p-2 rounded-md transition-all ${view === 'schedule' ? 'bg-white shadow text-[#B07070]' : 'text-slate-400'}`}><Calendar className="w-5 h-5"/></button>
            <button onClick={() => setView('attendance')} className={`p-2 rounded-md transition-all ${view === 'attendance' ? 'bg-white shadow text-[#B07070]' : 'text-slate-400'}`}><UserCheck className="w-5 h-5"/></button>
            <button onClick={() => setView('progress')} className={`p-2 rounded-md transition-all ${view === 'progress' ? 'bg-white shadow text-[#B07070]' : 'text-slate-400'}`}><BarChart2 className="w-5 h-5"/></button>
            <button onClick={() => setView('assignments')} className={`p-2 rounded-md transition-all ${view === 'assignments' ? 'bg-white shadow text-[#B07070]' : 'text-slate-400'}`}><BookOpen className="w-5 h-5"/></button>
          </div>
       </div>

       {/* Menu Mobile (Chip Style) */}
       <div className="flex md:hidden overflow-x-auto gap-2 pb-2">
            <button onClick={() => setView('schedule')} className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border ${view === 'schedule' ? 'bg-[#D4A5A5] text-white border-[#D4A5A5]' : 'bg-white text-slate-500 border-slate-200'}`}>Jadwal</button>
            <button onClick={() => setView('attendance')} className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border ${view === 'attendance' ? 'bg-[#D4A5A5] text-white border-[#D4A5A5]' : 'bg-white text-slate-500 border-slate-200'}`}>Presensi</button>
            <button onClick={() => setView('progress')} className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border ${view === 'progress' ? 'bg-[#D4A5A5] text-white border-[#D4A5A5]' : 'bg-white text-slate-500 border-slate-200'}`}>Progres</button>
            <button onClick={() => setView('assignments')} className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border ${view === 'assignments' ? 'bg-[#D4A5A5] text-white border-[#D4A5A5]' : 'bg-white text-slate-500 border-slate-200'}`}>Tugas</button>
       </div>

       {view === 'schedule' && (
         <div className="space-y-6">
            <Card className="p-6 border-l-4 border-l-[#D4A5A5] bg-white"><h3 className="font-bold text-slate-700 mb-4">Input Jadwal</h3><form onSubmit={addClass} className="flex flex-col md:flex-row flex-wrap gap-3 items-end"><div className="w-full md:w-32"><label className="text-[10px] font-bold text-slate-400 uppercase">Hari</label><select className="w-full border rounded p-2 text-sm bg-white" value={newClass.day} onChange={e => setNewClass({...newClass, day: e.target.value})}>{['Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'].map(d => <option key={d} value={d}>{d}</option>)}</select></div><div className="w-full md:w-24"><label className="text-[10px] font-bold text-slate-400 uppercase">Jam</label><input type="time" className="w-full border rounded p-2 text-sm" value={newClass.time} onChange={e => setNewClass({...newClass, time: e.target.value})}/></div><div className="w-full md:flex-1"><label className="text-[10px] font-bold text-slate-400 uppercase">Mata Kuliah</label><input className="w-full border rounded p-2 text-sm" placeholder="Contoh: Algoritma" value={newClass.subject} onChange={e => setNewClass({...newClass, subject: e.target.value})}/></div><div className="w-full md:w-24"><label className="text-[10px] font-bold text-slate-400 uppercase">Ruang</label><input className="w-full border rounded p-2 text-sm" placeholder="R.101" value={newClass.room} onChange={e => setNewClass({...newClass, room: e.target.value})}/></div><Button type="submit" className="w-full md:w-auto"><Plus className="w-4 h-4"/> Simpan</Button></form></Card>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">{['Senin','Selasa','Rabu','Kamis','Jumat'].map(day => { const classes = academicSchedule.filter(c => c.day === day).sort((a,b) => a.time.localeCompare(b.time)); return (<div key={day} className="bg-white rounded-xl border border-[#EFE1E1] flex flex-col min-h-[150px]"><div className="p-3 bg-[#FAF5F5] border-b border-[#EFE1E1] rounded-t-xl text-center font-bold text-slate-600 text-sm uppercase tracking-wider">{day}</div><div className="p-2 space-y-2 flex-1">{classes.map(c => (<div key={c.id} className="bg-[#FCFCFC] p-2 rounded border border-slate-100 hover:border-[#D4A5A5] transition-all group"><div className="flex justify-between items-start"><span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-bold text-slate-500">{c.time}</span><button onClick={() => setAcademicSchedule(academicSchedule.filter(x => x.id !== c.id))} className="text-slate-300 hover:text-red-500"><X className="w-3 h-3"/></button></div><p className="font-bold text-slate-700 text-xs mt-1">{c.subject}</p><p className="text-[10px] text-slate-400 flex items-center gap-1"><School className="w-3 h-3"/> {c.room}</p></div>))}{classes.length === 0 && <p className="text-center text-[10px] text-slate-300 py-4 italic">Libur</p>}</div></div>) })}</div>
         </div>
       )}
       {view === 'attendance' && (
         <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{uniqueSubjects.length === 0 && <div className="col-span-full text-center py-12 text-slate-400 italic bg-white rounded-xl border border-dashed border-slate-200">Belum ada mata kuliah. Input di menu Jadwal dulu.</div>}
               {uniqueSubjects.map(sub => { const detail = academicDetails[sub] || { attendance: 0, alphas: 0, permissions: 0, totalMeetings: 0 }; const remainingAlphas = 3 - detail.alphas; const isDanger = remainingAlphas <= 0; const isWarning = remainingAlphas === 1; return (<Card key={sub} className={`p-5 border-t-4 bg-white ${isDanger ? 'border-t-red-500' : isWarning ? 'border-t-orange-400' : 'border-t-[#D4A5A5]'}`}><div className="flex justify-between items-start mb-3"><h4 className="font-bold text-slate-800">{sub}</h4><button onClick={() => resetAttendance(sub)} className="text-slate-300 hover:text-slate-500"><Repeat className="w-3 h-3"/></button></div><div className="mb-4"><div className="flex justify-between text-xs mb-1 font-medium text-slate-500"><span>Pertemuan ke-{detail.totalMeetings} / 14</span><span className={isDanger ? 'text-red-600 font-bold' : ''}>{detail.attendance} Hadir</span></div><ProgressBar value={detail.totalMeetings} max={14} color={isDanger ? 'bg-red-500' : 'bg-[#D4A5A5]'} /></div><div className="bg-white p-3 rounded-lg border border-slate-100 mb-3"><div className="flex justify-between items-center"><span className="text-xs font-bold uppercase text-slate-400">Jatah Alpa</span><div className="flex gap-1">{[1,2,3].map(i => (<div key={i} className={`w-3 h-3 rounded-full ${i <= detail.alphas ? 'bg-red-500' : 'bg-slate-200'}`} />))}</div></div>{isDanger && <p className="text-[10px] text-red-500 mt-1 font-bold flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> Batas Alpa Habis! Hati-hati DO.</p>}</div><div className="grid grid-cols-3 gap-2"><button onClick={() => updateAttendance(sub, 'present')} className="py-2 rounded border border-green-200 bg-green-50 text-green-700 text-xs font-bold hover:bg-green-100">Hadir</button><button onClick={() => updateAttendance(sub, 'permission')} className="py-2 rounded border border-yellow-200 bg-yellow-50 text-yellow-700 text-xs font-bold hover:bg-yellow-100">Izin</button><button onClick={() => updateAttendance(sub, 'alpha')} className="py-2 rounded border border-red-200 bg-red-50 text-red-700 text-xs font-bold hover:bg-red-100">Alpa</button></div></Card>) })}</div>
         </div>
       )}
       {view === 'progress' && (
         <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <Card className="p-5 flex items-center gap-4 border-l-4 border-l-blue-500 bg-white"><div className="p-3 rounded-full bg-blue-50 text-blue-600"><UserCheck className="w-6 h-6" /></div><div><p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Kehadiran</p><h3 className="text-2xl font-bold text-slate-700">{attendancePct}%</h3></div></Card>
               <Card className="p-5 flex items-center gap-4 border-l-4 border-l-purple-500 bg-white"><div className="p-3 rounded-full bg-purple-50 text-purple-600"><BookOpen className="w-6 h-6" /></div><div><p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Tugas Selesai</p><h3 className="text-2xl font-bold text-slate-700">{assignmentPct}%</h3></div></Card>
               <Card className="p-5 flex items-center gap-4 border-l-4 border-l-green-500 bg-white"><div className="p-3 rounded-full bg-green-50 text-green-600"><Activity className="w-6 h-6" /></div><div><p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Ujian (UTS/UAS)</p><h3 className="text-2xl font-bold text-slate-700">{examPct}%</h3></div></Card>
            </div>
            <Card className="p-6 bg-white"><h3 className="font-bold text-slate-700 mb-2">Pelacak Ujian</h3><p className="text-xs text-slate-400 mb-6">Centang jika sudah menyelesaikan ujian.</p><div className="overflow-x-auto"><table className="w-full text-sm text-left"><thead className="bg-[#FAF5F5] text-slate-500 font-bold text-xs uppercase"><tr><th className="p-3">Mata Kuliah</th><th className="p-3 text-center">UTS</th><th className="p-3 text-center">UAS</th><th className="p-3 text-center">Status</th></tr></thead><tbody className="divide-y divide-slate-100">{uniqueSubjects.map(sub => { const detail = academicDetails[sub] || { uts: false, uas: false }; const isDone = detail.uts && detail.uas; return (<tr key={sub} className="hover:bg-slate-50 transition-colors"><td className="p-3 font-medium text-slate-700">{sub}</td><td className="p-3 text-center"><button onClick={() => toggleExam(sub, 'uts')} className={`w-5 h-5 border rounded mx-auto flex items-center justify-center transition-colors ${detail.uts ? 'bg-blue-500 border-blue-500 text-white' : 'bg-white border-slate-300'}`}>{detail.uts && <Check className="w-3 h-3" />}</button></td><td className="p-3 text-center"><button onClick={() => toggleExam(sub, 'uas')} className={`w-5 h-5 border rounded mx-auto flex items-center justify-center transition-colors ${detail.uas ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-slate-300'}`}>{detail.uas && <Check className="w-3 h-3" />}</button></td><td className="p-3 text-center">{isDone ? (<span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full">SELESAI</span>) : (<span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-full">PROSES</span>)}</td></tr>) })}{uniqueSubjects.length === 0 && <tr><td colSpan="4" className="p-6 text-center text-slate-400 italic text-xs">Belum ada mata kuliah.</td></tr>}</tbody></table></div></Card>
         </div>
       )}

       {view === 'assignments' && (
         <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               <Card className="p-6 h-fit bg-white"><h3 className="font-bold text-slate-700 mb-4">Input Tugas Baru</h3><form onSubmit={addAssignment} className="space-y-3"><select className="w-full border rounded p-2 text-sm bg-white" value={newAssignment.subject} onChange={e => setNewAssignment({...newAssignment, subject: e.target.value})}><option value="">-- Pilih Matkul --</option>{uniqueSubjects.map(s => <option key={s} value={s}>{s}</option>)}</select><input className="w-full border rounded p-2 text-sm" placeholder="Judul Tugas (Misal: Makalah Bab 1)" value={newAssignment.title} onChange={e => setNewAssignment({...newAssignment, title: e.target.value})} /><div><label className="text-[10px] font-bold text-slate-400 uppercase">Deadline</label><input type="date" className="w-full border rounded p-2 text-sm" value={newAssignment.deadline} onChange={e => setNewAssignment({...newAssignment, deadline: e.target.value})} /></div><Button type="submit" className="w-full">Tambah Tugas</Button></form></Card>
               <div className="lg:col-span-2 space-y-4">{assignments.sort((a,b) => new Date(a.deadline) - new Date(b.deadline)).map(task => { const daysLeft = getDaysRemaining(task.deadline); return (<Card key={task.id} className={`p-4 flex items-center gap-4 bg-white ${task.completed ? 'opacity-50' : ''}`}><button onClick={() => setAssignments(assignments.map(a => a.id === task.id ? {...a, completed: !a.completed} : a))} className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${task.completed ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300 hover:border-green-500'}`}>{task.completed && <Check className="w-4 h-4"/>}</button><div className="flex-1"><div className="flex justify-between items-start"><h4 className={`font-bold ${task.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>{task.title}</h4><span className={`text-[10px] px-2 py-1 rounded font-bold ${task.completed ? 'bg-slate-200 text-slate-500' : daysLeft < 0 ? 'bg-red-100 text-red-600' : daysLeft < 3 ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>{task.completed ? 'Selesai' : daysLeft < 0 ? 'Terlambat' : daysLeft === 0 ? 'Hari Ini' : `${daysLeft} Hari Lagi`}</span></div><p className="text-xs text-slate-500 mt-1 flex items-center gap-2"><Book className="w-3 h-3"/> {task.subject} • {formatDate(task.deadline)}</p></div><button onClick={() => setAssignments(assignments.filter(a => a.id !== task.id))} className="text-slate-300 hover:text-red-500"><Trash2 className="w-4 h-4"/></button></Card>) })}{assignments.length === 0 && <div className="text-center py-10 text-slate-400 italic">Tidak ada tugas aktif.</div>}</div>
            </div>
         </div>
       )}
    </div>
  );
};

// --- MODULE: CONTENT PLANNER (MODIFIED WITH TEMPLATES & TOAST) ---
const ContentPlanner = ({ 
  plannerItems, setPlannerItems, 
  recurringItems, setRecurringItems,
  completions, setCompletions,
  settings, setSettings
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('schedule'); 
  const [notification, setNotification] = useState(null); 
  
  const [addingFor, setAddingFor] = useState(null); 
  const [inputText, setInputText] = useState("");
  const [inputTime, setInputTime] = useState(""); 
  const [editingId, setEditingId] = useState(null); 
  
  const weekDates = getWeekDates(currentDate);
  const startOfWeek = weekDates[0];
  const endOfWeek = weekDates[6];

  const getDateKey = (date) => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  const currentPlatform = settings.platform || 'TikTok';
  
  const getDayItems = (date) => {
    const dateKey = getDateKey(date);
    const dayIndex = date.getDay();

    const templates = recurringItems
      .filter(i => i.dayIndex === dayIndex && i.platform === currentPlatform)
      .map(i => ({
        ...i,
        isRecurring: true,
        uniqueKey: `${i.id}_${dateKey}`,
        completed: !!completions[`${i.id}_${dateKey}`]
      }));

    const manuals = plannerItems
      .filter(i => i.dateKey === dateKey && i.platform === currentPlatform)
      .map(i => ({
        ...i,
        isRecurring: false,
        uniqueKey: i.id,
        completed: i.completed
      }));

    return [...templates, ...manuals].sort((a, b) => (a.time || '00:00').localeCompare(b.time || '00:00'));
  };

  const saveItem = (dateOrDayIndex, isTemplate) => {
    if (!inputText.trim()) { setAddingFor(null); return; }

    const newItem = {
      id: Date.now(),
      text: inputText,
      time: inputTime || '09:00',
      platform: currentPlatform
    };

    if (isTemplate) {
      setRecurringItems([...recurringItems, { ...newItem, dayIndex: dateOrDayIndex }]);
    } else {
      setPlannerItems([...plannerItems, { ...newItem, dateKey: dateOrDayIndex, completed: false, type: 'Content' }]);
    }
    setAddingFor(null); setInputText(""); setInputTime("");
  };

  const startEditing = (item) => {
    setEditingId(item.id);
    setInputText(item.text);
    setInputTime(item.time);
    setAddingFor(null);
  };

  const saveEdit = () => {
    if (!inputText.trim()) return;
    setRecurringItems(prev => prev.map(item => 
      item.id === editingId ? { ...item, text: inputText, time: inputTime } : item
    ));
    setEditingId(null);
    setInputText("");
    setInputTime("");
    setNotification("Item berhasil diubah!");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setInputText("");
    setInputTime("");
  };

  const toggleItem = (item) => {
    if (item.isRecurring) {
      const key = item.uniqueKey;
      const newCompletions = { ...completions };
      if (newCompletions[key]) delete newCompletions[key]; else newCompletions[key] = true;
      setCompletions(newCompletions);
    } else {
      setPlannerItems(plannerItems.map(i => i.id === item.id ? { ...i, completed: !i.completed } : i));
    }
  };

  const deleteItem = (item) => {
    if (item.isRecurring) setRecurringItems(recurringItems.filter(i => i.id !== item.id));
    else setPlannerItems(plannerItems.filter(i => i.id !== item.id));
  };

  const applyTemplate = (templateKey) => {
    const template = CONTENT_TEMPLATES[templateKey];
    if (!template) return;

    const otherPlatformItems = recurringItems.filter(item => item.platform !== currentPlatform);

    const newItems = template.map((item, idx) => ({
      id: Date.now() + idx,
      dayIndex: item.dayIndex,
      text: item.text,
      time: item.time,
      platform: currentPlatform
    }));
    
    setRecurringItems([...otherPlatformItems, ...newItems]);
    setNotification(`Template ${templateKey} berhasil diterapkan!`);
  };

  let totalTasks = 0;
  let completedTasks = 0;
  weekDates.forEach(d => {
    const items = getDayItems(d);
    totalTasks += items.length;
    completedTasks += items.filter(i => i.completed).length;
  });
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6 animate-fade-in font-sans pb-24 md:pb-0">
      <Toast message={notification} onClose={() => setNotification(null)} />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 rounded-xl border border-[#EFE1E1] gap-4">
        <div>
          <h2 className={`${THEME.header} text-2xl font-bold flex items-center gap-2`}>
            {currentPlatform === 'TikTok' && <Smartphone className="w-6 h-6 text-black"/>}
            {currentPlatform === 'Instagram' && <Instagram className="w-6 h-6 text-pink-600"/>}
            {currentPlatform === 'YouTube' && <Youtube className="w-6 h-6 text-red-600"/>}
            {currentPlatform === 'Facebook Pro' && <Facebook className="w-6 h-6 text-blue-600"/>}
            Perencana {currentPlatform}
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-bold uppercase tracking-wider">Tujuan: {settings.goal}</span>
            <button onClick={() => setSettings({...settings, showSetup: true})} className="text-[10px] text-[#B07070] hover:underline">Ubah</button>
          </div>
        </div>
        
        {/* Platform Switcher (Mobile Scrollable) */}
        <div className="flex flex-wrap md:flex-nowrap gap-2">
           {['TikTok', 'Instagram', 'YouTube', 'Facebook Pro'].map(p => (
             <button key={p} onClick={() => setSettings({ ...settings, platform: p })} className={`text-xs px-3 py-1.5 rounded-full border transition-all ${currentPlatform === p ? 'bg-[#D4A5A5] text-white border-[#D4A5A5]' : 'bg-white text-slate-500 border-slate-200'}`}>{p}</button>
           ))}
        </div>
      </div>

      <div className="flex justify-between items-center">
         <div className="flex gap-2">
            <Button size="sm" variant={viewMode === 'schedule' ? 'primary' : 'secondary'} onClick={() => setViewMode('schedule')}><Calendar className="w-4 h-4" /> Jadwal</Button>
            <Button size="sm" variant={viewMode === 'template' ? 'primary' : 'secondary'} onClick={() => setViewMode('template')}><Settings className="w-4 h-4" /> Template</Button>
         </div>
         {viewMode === 'schedule' && (
           <div className="flex items-center bg-[#FAF5F5] rounded-full p-1 border border-[#EFE1E1]">
              <button onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 7)))} className="p-1 hover:bg-white rounded-full transition-colors"><ChevronLeft className="w-4 h-4 text-slate-600" /></button>
              <span className="text-xs font-medium text-slate-700 px-3 min-w-[120px] text-center">{formatDate(startOfWeek)} - {formatDate(endOfWeek)}</span>
              <button onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 7)))} className="p-1 hover:bg-white rounded-full transition-colors"><ChevronRight className="w-4 h-4 text-slate-600" /></button>
           </div>
         )}
      </div>

      {viewMode === 'schedule' && (
        <>
          <Card className="p-6 bg-gradient-to-r from-[#FFFBFB] to-white">
             <div className="flex justify-between items-end mb-2">
                <div><h3 className="text-sm font-bold text-[#B07070] uppercase tracking-wider mb-1">Disiplin Upload</h3><p className="text-xs text-slate-500">{completedTasks} dari {totalTasks} konten terupload tepat waktu</p></div>
                <span className="text-3xl font-serif text-slate-700">{completionRate}%</span>
             </div>
             <ProgressBar value={completedTasks} max={totalTasks} />
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4 overflow-x-auto pb-4">
            {weekDates.map((date, index) => {
              const dateKey = getDateKey(date);
              const items = getDayItems(date);
              const isToday = getDateKey(new Date()) === dateKey;
              const isAddingThisDay = addingFor === dateKey;
              return (
                <div key={index} className={`flex flex-col min-w-[200px] md:min-w-0 rounded-xl border ${isToday ? 'border-[#D4A5A5] bg-white shadow-md' : 'border-[#EFE1E1] bg-white'} h-full min-h-[350px]`}>
                  <div className={`p-3 text-center border-b ${isToday ? 'bg-[#F9E8E8]' : 'bg-[#FAF5F5]'} rounded-t-xl`}>
                    <div className={`text-xs font-bold tracking-widest mb-1 ${isToday ? 'text-[#B07070]' : 'text-slate-400'}`}>{DAY_NAMES[date.getDay()]}</div>
                    <div className={`text-lg font-serif ${isToday ? 'text-slate-800 font-bold' : 'text-slate-600'}`}>{date.getDate()}</div>
                  </div>
                  <div className="flex-1 p-3 space-y-2 overflow-y-auto max-h-[400px]">
                     {items.map(item => (
                        <div key={item.uniqueKey} className={`group p-2 rounded border border-slate-50 hover:border-[#EFE1E1] transition-all ${item.text.includes("ME TIME") ? 'bg-purple-50 border-purple-100' : 'bg-[#FCFCFC]'}`}>
                           <div className="flex justify-between items-start mb-1">
                              <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded"><Clock className="w-3 h-3"/> {item.time}</span>
                              <button onClick={() => toggleItem(item)} className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${item.completed ? 'bg-[#98BEAC] border-[#98BEAC]' : 'bg-white border-slate-300'}`}>{item.completed && <Check className="w-3 h-3 text-white" />}</button>
                           </div>
                           <span className={`text-xs block leading-tight ${item.completed ? 'text-slate-400 line-through' : 'text-slate-700'} ${item.text.includes("ME TIME") ? 'font-bold text-purple-700' : ''}`}>{item.text}</span>
                           {!item.isRecurring && (<button onClick={() => deleteItem(item)} className="mt-2 text-[10px] text-red-300 hover:text-red-500 opacity-0 group-hover:opacity-100 flex items-center gap-1"><X className="w-3 h-3" /> Hapus</button>)}
                        </div>
                     ))}
                     {items.length === 0 && !isAddingThisDay && <div className="text-center py-6 text-slate-300 text-[10px] italic">Kosong</div>}
                  </div>
                  <div className="p-2 border-t border-[#EFE1E1]">
                     {isAddingThisDay ? (
                       <div className="flex flex-col gap-2">
                         <input type="time" value={inputTime} onChange={e => setInputTime(e.target.value)} className="text-xs p-1 border rounded w-full"/>
                         <textarea autoFocus value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={(e) => { if(e.key === 'Enter') saveItem(dateKey, false); else if(e.key === 'Escape') setAddingFor(null); }} placeholder="Isi konten..." className="w-full text-xs p-2 border border-[#D4A5A5] rounded focus:outline-none bg-white resize-none" rows={2}/>
                         <Button size="sm" onClick={() => saveItem(dateKey, false)}>Simpan</Button>
                       </div>
                     ) : (
                       <button onClick={() => { setAddingFor(dateKey); setInputTime("12:00"); setInputText(""); }} className="w-full py-2 flex items-center justify-center gap-1 text-xs text-slate-400 hover:text-[#B07070] hover:bg-[#F9E8E8] rounded transition-colors"><Plus className="w-3 h-3" /> Jadwal</button>
                     )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {viewMode === 'template' && (
        <div className="space-y-6">
          <Card className="p-6 bg-gradient-to-r from-[#FFFBFB] to-white border border-[#EFE1E1]">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-700 flex items-center gap-2"><Sparkles className="w-5 h-5 text-yellow-500"/> Generator Template Otomatis</h3>
                <p className="text-xs text-slate-500 mt-1">Pilih strategi konten untuk diterapkan secara otomatis ke jadwal mingguan Anda.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.keys(CONTENT_TEMPLATES).map(key => {
                   const isRecommended = key === settings.goal;
                   return (
                     <Button 
                        key={key} 
                        size="sm" 
                        variant={isRecommended ? "primary" : "secondary"} 
                        onClick={() => applyTemplate(key)}
                        className={isRecommended ? "shadow-md shadow-red-100 border border-[#D4A5A5]" : ""}
                     >
                        {key}
                        {isRecommended && <Star className="w-3 h-3 ml-1 fill-white text-white" />}
                     </Button>
                   );
                })}
              </div>
              {settings.goal && <p className="text-[10px] text-[#B07070] italic">*Rekomendasi berdasarkan tujuan {settings.goal}</p>}
            </div>
          </Card>

          <Card className="p-6 bg-blue-50/50 border-blue-100">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded text-blue-600"><Repeat className="w-5 h-5"/></div>
              <div><h3 className="font-bold text-slate-700">Editor Rutinitas Mingguan ({currentPlatform})</h3><p className="text-xs text-slate-500 mt-1">Atur rencana yang selalu berulang setiap minggunya di sini. Pastikan Anda berada di tab platform yang benar di bagian atas.</p></div>
            </div>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
             {[1, 2, 3, 4, 5, 6, 0].map((dayIndex) => { 
               const items = recurringItems.filter(i => i.dayIndex === dayIndex && i.platform === currentPlatform).sort((a,b) => a.time.localeCompare(b.time));
               const isAdding = addingFor === `day-${dayIndex}`;
               return (
                 <div key={dayIndex} className="bg-white rounded-xl border border-[#EFE1E1] flex flex-col h-full min-h-[300px]">
                    <div className="p-3 bg-[#FAF5F5] border-b border-[#EFE1E1] rounded-t-xl text-center"><span className="text-xs font-bold tracking-widest text-[#B07070]">{DAY_NAMES[dayIndex].toUpperCase()}</span></div>
                    <div className="flex-1 p-3 space-y-2 overflow-y-auto">
                       {items.map(item => (
                          <div key={item.id} className={`group p-2 rounded border border-slate-50 hover:border-[#EFE1E1] transition-all ${item.text.includes("ME TIME") ? 'bg-purple-50 border-purple-100' : 'bg-[#FCFCFC]'}`}>
                             {editingId === item.id ? (
                               <div className="flex flex-col gap-2">
                                  <input type="time" className="text-xs p-1 border rounded w-full" value={inputTime} onChange={e => setInputTime(e.target.value)} />
                                  <textarea className="text-xs border p-1 rounded w-full resize-none" rows={3} value={inputText} onChange={e => setInputText(e.target.value)} autoFocus />
                                  <div className="flex gap-2">
                                    <Button size="sm" onClick={saveEdit}>Simpan</Button>
                                    <Button size="sm" variant="ghost" onClick={cancelEdit}>Batal</Button>
                                  </div>
                               </div>
                             ) : (
                               <>
                                 <div className="flex justify-between items-center mb-1">
                                   <span className="text-[10px] bg-slate-100 px-1 rounded text-slate-500 font-medium">{item.time}</span>
                                   <div className="flex gap-1">
                                     <button onClick={() => startEditing(item)} className="text-slate-300 hover:text-blue-500"><Edit2 className="w-3 h-3"/></button>
                                     <button onClick={() => setRecurringItems(recurringItems.filter(i => i.id !== item.id))} className="text-slate-300 hover:text-red-500"><Trash2 className="w-3 h-3"/></button>
                                   </div>
                                 </div>
                                 <div className={`text-xs text-slate-700 ${item.text.includes("ME TIME") ? 'font-bold text-purple-700' : ''}`}>{item.text}</div>
                               </>
                             )}
                          </div>
                       ))}
                    </div>
                    <div className="p-2 border-t border-[#EFE1E1]">
                       {isAdding ? (
                          <div className="flex flex-col gap-2">
                             <input type="time" value={inputTime} onChange={e => setInputTime(e.target.value)} className="text-xs p-1 border rounded w-full"/>
                             <input autoFocus value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={(e) => { if(e.key === 'Enter') saveItem(dayIndex, true); }} placeholder="Rutinitas..." className="w-full text-xs p-2 border border-[#D4A5A5] rounded focus:outline-none"/>
                             <Button size="sm" onClick={() => saveItem(dayIndex, true)}>Ok</Button>
                          </div>
                       ) : (
                          <button onClick={() => { setAddingFor(`day-${dayIndex}`); setInputTime("12:00"); setInputText(""); }} className="w-full py-2 flex items-center justify-center gap-1 text-xs text-slate-400 hover:text-[#B07070] hover:bg-[#F9E8E8] rounded transition-colors"><Plus className="w-3 h-3" /> Tambah</button>
                       )}
                    </div>
                 </div>
               );
             })}
          </div>
        </div>
      )}
    </div>
  );
};

// --- MODULE: HABIT TRACKER (GRID STYLE) ---
const HabitTracker = ({ habits, setHabits, notification, setNotification }) => {
  const [date, setDate] = useState(new Date());
  const year = date.getFullYear();
  const month = date.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const [newHabit, setNewHabit] = useState('');
  const monthLabel = `${MONTH_NAMES[month]} ${year}`;
  const days = useMemo(() => Array.from({ length: daysInMonth }, (_, i) => i + 1), [daysInMonth]);

  const toggleHabit = (habitId, day) => {
    const dateKey = `${year}-${month}-${day}`;
    setHabits(habits.map(h => {
      if (h.id === habitId) {
        const newHistory = { ...h.history };
        if (newHistory[dateKey]) delete newHistory[dateKey];
        else newHistory[dateKey] = true;
        return { ...h, history: newHistory };
      }
      return h;
    }));
  };

  const addHabit = (e) => {
    e.preventDefault();
    const habitName = newHabit.trim();
    if (!habitName) return;
    setHabits([...habits, { id: Date.now(), name: habitName, history: {} }]);
    setNewHabit('');
  };
  
  const applyProductiveRoutine = () => {
    const newHabits = PRODUCTIVE_HABITS_TEMPLATE.map((h, i) => ({
      id: Date.now() + i,
      name: h.name,
      history: {}
    }));
    setHabits(newHabits);
    setNotification("Rutinitas produktif berhasil diterapkan!");
  };

  const getStats = (habit) => {
    let count = 0;
    for (let d = 1; d <= daysInMonth; d++) {
      if (habit.history[`${year}-${month}-${d}`]) count++;
    }
    const pct = Math.round((count / daysInMonth) * 100);
    return { count, pct };
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans pb-24 md:pb-0">
      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center bg-white p-4 md:p-5 rounded-2xl border border-[#EFE1E1] shadow-sm">
        <div className="space-y-1">
           <h2 className={`${THEME.header} text-2xl font-bold`}>Pelacak Kebiasaan</h2>
           <p className="text-slate-400 text-xs tracking-widest uppercase">Bangun Konsistensi</p>
        </div>

        <div className="flex md:hidden items-center justify-between rounded-xl bg-[#FAF5F5] border border-[#EFE1E1] px-3 py-2">
           <button onClick={() => setDate(new Date(year, month - 1))} className="p-1.5 text-slate-500 hover:text-[#B07070] hover:bg-white rounded-lg transition-colors">
             <ChevronLeft className="w-5 h-5" />
           </button>
           <span className="text-sm font-bold text-slate-700">{monthLabel}</span>
           <button onClick={() => setDate(new Date(year, month + 1))} className="p-1.5 text-slate-500 hover:text-[#B07070] hover:bg-white rounded-lg transition-colors">
             <ChevronRight className="w-5 h-5" />
           </button>
        </div>

        <div className="hidden md:flex items-center gap-4">
           <Button size="sm" variant="secondary" onClick={applyProductiveRoutine} className="h-10 px-4">
              <Sparkles className="w-4 h-4 text-yellow-500 mr-2"/>
              Isi Rutinitas Produktif
           </Button>
           <div className="flex items-center gap-2">
              <button onClick={() => setDate(new Date(year, month - 1))} className="p-2 hover:bg-[#F9E8E8] rounded-full transition-colors"><ChevronLeft className="w-5 h-5 text-slate-600" /></button>
              <span className="text-xl font-light text-slate-700 min-w-[170px] text-center">{monthLabel}</span>
              <button onClick={() => setDate(new Date(year, month + 1))} className="p-2 hover:bg-[#F9E8E8] rounded-full transition-colors"><ChevronRight className="w-5 h-5 text-slate-600" /></button>
           </div>
        </div>
      </div>

      <div className="md:hidden">
        <Button size="sm" variant="secondary" onClick={applyProductiveRoutine} className="w-full h-11">
          <Sparkles className="w-4 h-4 text-yellow-500 mr-2"/> Template Produktif
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#EFE1E1] overflow-hidden">
        <div className="md:hidden p-4 space-y-4 bg-[#FCFCFC]">
          {habits.length === 0 && (
            <div className="rounded-xl border border-dashed border-[#E8C5C5] bg-white p-6 text-center text-sm text-slate-400">
              Belum ada kebiasaan. Tambahkan kebiasaan pertamamu di bawah.
            </div>
          )}
          {habits.map((habit, index) => {
            const stats = getStats(habit);
            return (
              <div
                key={habit.id}
                className="rounded-2xl border border-[#EFE1E1] bg-white p-4 shadow-sm animate-fade-in"
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-sm font-semibold text-slate-700 leading-snug">{habit.name}</h3>
                  <button onClick={() => setHabits(habits.filter(h => h.id !== habit.id))} className="p-2 text-slate-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-3 mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] uppercase tracking-widest text-slate-400 font-bold">Kemajuan</span>
                    <span className="text-xs font-bold text-slate-600">{stats.count}/{daysInMonth} hari</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-[#E8C5C5] transition-all duration-500" style={{ width: `${stats.pct}%` }} />
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {days.map(day => {
                    const checked = !!habit.history[`${year}-${month}-${day}`];
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleHabit(habit.id, day)}
                        className={`h-10 rounded-lg border text-[11px] font-semibold transition-all duration-200 active:scale-95 ${
                          checked
                            ? 'bg-[#98BEAC] border-[#98BEAC] text-white shadow-sm animate-pop'
                            : 'bg-white border-[#E9E9E9] text-slate-500 hover:border-[#D4A5A5] hover:text-[#B07070]'
                        }`}
                        aria-label={`Tandai ${habit.name} hari ${day}`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="hidden md:block overflow-x-auto">
          <div className="min-w-[1180px]">
            <div className="flex border-b border-[#EFE1E1] bg-[#FAF5F5]">
              <div className="w-72 flex-shrink-0 p-4 text-xs font-bold text-[#B07070] tracking-widest border-r border-[#EFE1E1]">KEBIASAAN</div>
              <div className="flex-1 flex">
                {days.map(day => (
                  <div key={day} className="flex-1 min-w-[36px] text-center p-3 text-[11px] text-slate-500 border-r border-slate-100 font-semibold">{day}</div>
                ))}
              </div>
              <div className="w-36 flex-shrink-0 p-4 text-center text-xs font-bold text-[#B07070] tracking-widest border-l border-[#EFE1E1]">KEMAJUAN</div>
            </div>

            {habits.map((habit, index) => {
              const stats = getStats(habit);
              return (
                <div key={habit.id} className="flex border-b border-slate-100 group hover:bg-[#FFFBFB] transition-colors animate-fade-in" style={{ animationDelay: `${index * 25}ms` }}>
                  <div className="w-72 flex-shrink-0 p-4 text-sm font-medium text-slate-700 border-r border-[#EFE1E1] flex justify-between items-center bg-white sticky left-0 z-10">
                    <span>{habit.name}</span>
                    <button onClick={() => setHabits(habits.filter(h => h.id !== habit.id))} className="p-2 text-slate-200 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all rounded-lg hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex-1 flex">
                    {days.map(day => {
                      const checked = !!habit.history[`${year}-${month}-${day}`];
                      return (
                        <div key={day} className="flex-1 min-w-[36px] border-r border-slate-100 p-1.5">
                          <button
                            type="button"
                            onClick={() => toggleHabit(habit.id, day)}
                            className={`w-full h-9 rounded-md border transition-all duration-200 ${
                              checked
                                ? 'bg-[#98BEAC] border-[#98BEAC] text-white shadow-sm animate-pop'
                                : 'bg-white border-[#E9E9E9] hover:border-[#D4A5A5]'
                            }`}
                            aria-label={`Tandai ${habit.name} hari ${day}`}
                          >
                            {checked ? <Check className="w-4 h-4 mx-auto" /> : <span className="text-[11px] text-slate-400">{day}</span>}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  <div className="w-36 flex-shrink-0 p-4 border-l border-[#EFE1E1] flex items-center gap-3">
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#E8C5C5] transition-all duration-500" style={{ width: `${stats.pct}%` }} />
                    </div>
                    <span className="text-xs font-bold text-slate-500 w-9 text-right">{stats.pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-4 border-t border-[#EFE1E1] bg-[#FCFCFC]">
          <form onSubmit={addHabit} className="flex flex-col md:flex-row gap-2 md:max-w-lg">
            <input 
              type="text" 
              value={newHabit}
              onChange={e => setNewHabit(e.target.value)}
              placeholder="+ Tambah kebiasaan baru" 
              className="text-sm p-3 border border-[#EFE1E1] rounded-lg w-full focus:outline-none focus:border-[#D4A5A5] bg-white"
            />
            <Button type="submit" className="shrink-0 h-11 px-5">
              <Plus className="w-4 h-4" /> Tambah
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

// --- MODULE: FINANCE (50/30/20 & 60/25/15 LOGIC) ---
const Finance = ({ transactions, setTransactions, budgetPlan, setBudgetPlan, incomeGoal, setIncomeGoal, budgetMethod, setBudgetMethod }) => {
  const [view, setView] = useState('overview'); 
  const [newTrans, setNewTrans] = useState({ desc: '', amount: '', type: 'expense', category: 'Kebutuhan' });
  const [newPlanItem, setNewPlanItem] = useState({ name: '', amount: '', category: 'Kebutuhan' });

  // 1. Calculate Actuals (Expenses so far)
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((a, b) => a + b.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((a, b) => a + b.amount, 0);
  
  // Group actual expenses by Categories
  const actuals = transactions.filter(t => t.type === 'expense').reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, { 'Kebutuhan': 0, 'Keinginan': 0, 'Tabungan': 0 });

  // 2. Planning Calculations (The Limits based on Method)
  const getPercentages = () => {
     if (budgetMethod === '60/25/15') return { need: 0.60, want: 0.25, save: 0.15 };
     return { need: 0.50, want: 0.30, save: 0.20 };
  };

  const pct = getPercentages();
  const limits = {
    'Kebutuhan': incomeGoal * pct.need,
    'Keinginan': incomeGoal * pct.want,
    'Tabungan': incomeGoal * pct.save
  };

  // Group planned items (The specific list user creates, e.g. "Cinema", "Kos")
  const plannedItems = budgetPlan.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = { total: 0, items: [] };
    acc[item.category].total += item.amount;
    acc[item.category].items.push(item);
    return acc;
  }, { 
    'Kebutuhan': { total: 0, items: [] }, 
    'Keinginan': { total: 0, items: [] }, 
    'Tabungan': { total: 0, items: [] } 
  });

  const addTransaction = (e) => {
    e.preventDefault();
    if (!newTrans.desc || !newTrans.amount) return;
    setTransactions([{ id: Date.now(), ...newTrans, amount: Number(newTrans.amount), date: new Date().toISOString() }, ...transactions]);
    setNewTrans({ desc: '', amount: '', type: 'expense', category: 'Kebutuhan' });
  };

  const addPlanItem = (e) => {
    e.preventDefault();
    if (!newPlanItem.name || !newPlanItem.amount) return;
    setBudgetPlan([...budgetPlan, { id: Date.now(), name: newPlanItem.name, amount: Number(newPlanItem.amount), category: newPlanItem.category }]);
    setNewPlanItem({ name: '', amount: '', category: 'Kebutuhan' });
  };

  const renderCategoryCard = (category, limit, icon, colorClass) => {
    const planned = plannedItems[category] || { total: 0, items: [] };
    const remainingPlan = limit - planned.total; 
    
    return (
      <Card className={`p-5 border-t-4 ${colorClass}`}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h4 className="font-bold text-slate-700 flex items-center gap-2">
              {icon} {category}
            </h4>
            <p className="text-xs text-slate-500">Jatah: {formatCurrency(limit)}</p>
          </div>
          <div className="text-right">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${remainingPlan < 0 ? 'text-red-500' : 'text-slate-400'}`}>
              Sisa Alokasi
            </span>
            <div className={`font-bold text-sm ${remainingPlan < 0 ? 'text-red-500' : 'text-slate-700'}`}>
              {formatCurrency(remainingPlan)}
            </div>
          </div>
        </div>

        {/* List of Planned Items */}
        <div className="space-y-2 mb-4 bg-slate-50 p-2 rounded-lg min-h-[100px] max-h-[150px] overflow-y-auto">
          {planned.items.length === 0 && <p className="text-[10px] text-slate-400 text-center py-4">Belum ada item rencana.</p>}
          {planned.items.map(item => (
            <div key={item.id} className="flex justify-between text-xs border-b border-slate-200 last:border-none pb-1 mb-1">
              <span className="text-slate-600">{item.name}</span>
              <div className="flex items-center gap-2">
                <span className="font-medium text-slate-800">{formatCurrency(item.amount)}</span>
                <button onClick={() => setBudgetPlan(budgetPlan.filter(i => i.id !== item.id))} className="text-slate-300 hover:text-red-500"><Trash2 className="w-3 h-3"/></button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans pb-24 md:pb-0">
       <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-[#EFE1E1]">
          <div><h2 className={`${THEME.header} text-2xl font-bold`}>Keuangan</h2><p className="text-slate-400 text-xs tracking-widest uppercase">Metode Cerdas</p></div>
          <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
            <button onClick={() => setView('overview')} className={`p-2 rounded-md transition-all ${view === 'overview' ? 'bg-white shadow text-[#B07070]' : 'text-slate-400'}`}><PieChart className="w-5 h-5"/></button>
            <button onClick={() => setView('planning')} className={`p-2 rounded-md transition-all ${view === 'planning' ? 'bg-white shadow text-[#B07070]' : 'text-slate-400'}`}><Settings className="w-5 h-5"/></button>
            <button onClick={() => setView('transactions')} className={`p-2 rounded-md transition-all ${view === 'transactions' ? 'bg-white shadow text-[#B07070]' : 'text-slate-400'}`}><Plus className="w-5 h-5"/></button>
          </div>
       </div>
       
       {view === 'overview' && (
         <div className="space-y-6">
            <div className="flex justify-between items-center mb-2">
               <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Ringkasan Metode: {budgetMethod}</span>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-6 border-l-4 border-l-[#98BEAC]"><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Pemasukan</p><h3 className="text-2xl font-serif text-slate-700">{formatCurrency(totalIncome)}</h3></Card>
              <Card className="p-6 border-l-4 border-l-[#D4A5A5]"><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Pengeluaran</p><h3 className="text-2xl font-serif text-slate-700">{formatCurrency(totalExpense)}</h3></Card>
              <Card className="p-6 border-l-4 border-l-[#A5B4D4]"><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Sisa Uang</p><h3 className="text-2xl font-serif text-slate-700">{formatCurrency(totalIncome - totalExpense)}</h3></Card>
            </div>
            
            {/* Progress Bars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               {['Kebutuhan', 'Keinginan', 'Tabungan'].map(cat => {
                 const limit = limits[cat] || 0;
                 const spent = actuals[cat] || 0;
                 const pct = limit > 0 ? Math.min(100, (spent / limit) * 100) : 0;
                 const color = cat === 'Kebutuhan' ? 'bg-blue-400' : cat === 'Keinginan' ? 'bg-purple-400' : 'bg-green-400';
                 
                 return (
                   <Card key={cat} className="p-5">
                      <div className="flex justify-between mb-2">
                         <span className="font-bold text-sm text-slate-700">{cat} ({cat === 'Kebutuhan' ? Math.round(pct.need * 100) : cat === 'Keinginan' ? Math.round(pct.want * 100) : Math.round(pct.save * 100)}%)</span>
                         <span className="text-xs text-slate-500">{formatCurrency(spent)} / {formatCurrency(limit)}</span>
                      </div>
                      <ProgressBar value={spent} max={limit} color={color} />
                      <p className="text-right text-[10px] text-slate-400 mt-1">{Math.round(pct)}% Terpakai</p>
                   </Card>
                 );
               })}
            </div>
         </div>
       )}
       
       {view === 'planning' && (
         <div className="space-y-6">
            <Card className="p-6 bg-white border border-slate-200">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
                  <label className="text-xs font-bold text-slate-500 uppercase block">Langkah 1: Metode & Pemasukan</label>
                  <div className="flex bg-slate-100 rounded p-1 w-full md:w-auto">
                     <button onClick={() => setBudgetMethod('50/30/20')} className={`flex-1 md:flex-none text-xs px-3 py-1 rounded ${budgetMethod === '50/30/20' ? 'bg-white shadow text-slate-800 font-bold' : 'text-slate-500'}`}>50/30/20</button>
                     <button onClick={() => setBudgetMethod('60/25/15')} className={`flex-1 md:flex-none text-xs px-3 py-1 rounded ${budgetMethod === '60/25/15' ? 'bg-white shadow text-slate-800 font-bold' : 'text-slate-500'}`}>60/25/15</button>
                  </div>
               </div>
               
               <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-serif">Rp</span>
                  <input 
                     type="number" 
                     className="text-3xl font-bold bg-transparent border-b-2 border-slate-100 focus:border-[#D4A5A5] focus:outline-none w-full py-2 text-slate-700"
                     value={incomeGoal || ''}
                     onChange={(e) => setIncomeGoal(Number(e.target.value))}
                     placeholder="0"
                  />
               </div>
               <p className="text-[10px] text-slate-400 mt-2 italic">
                  {budgetMethod === '50/30/20' 
                     ? 'Metode Klasik: 50% Kebutuhan, 30% Keinginan, 20% Tabungan.' 
                     : 'Metode Aman: 60% Kebutuhan, 25% Keinginan, 15% Tabungan.'}
               </p>
            </Card>

            <Card className="p-6 bg-[#FAF5F5]">
               <label className="text-xs font-bold text-slate-500 uppercase block mb-4">Langkah 2: Rencanakan Detail Pengeluaran</label>
               <form onSubmit={addPlanItem} className="flex flex-col md:flex-row gap-3">
                  <input className="flex-1 border rounded p-2 text-sm focus:border-[#D4A5A5] outline-none" placeholder="Nama (Misal: Kos, Netflix)" value={newPlanItem.name} onChange={e => setNewPlanItem({...newPlanItem, name: e.target.value})} />
                  <input type="number" className="w-full md:w-32 border rounded p-2 text-sm focus:border-[#D4A5A5] outline-none" placeholder="Rp" value={newPlanItem.amount} onChange={e => setNewPlanItem({...newPlanItem, amount: e.target.value})} />
                  <select className="border rounded p-2 text-sm bg-white focus:border-[#D4A5A5] outline-none" value={newPlanItem.category} onChange={e => setNewPlanItem({...newPlanItem, category: e.target.value})}>
                     <option value="Kebutuhan">Kebutuhan ({Math.round(pct.need * 100)}%)</option>
                     <option value="Keinginan">Keinginan ({Math.round(pct.want * 100)}%)</option>
                     <option value="Tabungan">Tabungan ({Math.round(pct.save * 100)}%)</option>
                  </select>
                  <Button type="submit" className="w-full md:w-auto"><Plus className="w-4 h-4"/> Tambah</Button>
               </form>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {renderCategoryCard('Kebutuhan', limits['Kebutuhan'], <ShoppingBag className="w-4 h-4 text-blue-500"/>, 'border-t-blue-400', 'bg-blue-400')}
               {renderCategoryCard('Keinginan', limits['Keinginan'], <Coffee className="w-4 h-4 text-purple-500"/>, 'border-t-purple-400', 'bg-purple-400')}
               {renderCategoryCard('Tabungan', limits['Tabungan'], <PiggyBank className="w-4 h-4 text-green-500"/>, 'border-t-green-400', 'bg-green-400')}
            </div>
         </div>
       )}
       
       {view === 'transactions' && (
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="p-6 h-fit">
               <h3 className="font-serif text-lg text-slate-700 mb-4">Catat Transaksi</h3>
               <form onSubmit={addTransaction} className="space-y-4">
                  <div>
                     <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Deskripsi</label>
                     <input required className="w-full border p-2 rounded text-sm bg-[#FCFCFC] focus:border-[#D4A5A5] outline-none" placeholder="Contoh: Makan Siang" value={newTrans.desc} onChange={e => setNewTrans({...newTrans, desc: e.target.value})} />
                  </div>
                  <div>
                     <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Nominal (Rp)</label>
                     <input required type="number" className="w-full border p-2 rounded text-sm bg-[#FCFCFC] focus:border-[#D4A5A5] outline-none" placeholder="0" value={newTrans.amount} onChange={e => setNewTrans({...newTrans, amount: e.target.value})} />
                  </div>
                  <div>
                     <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Tipe</label>
                     <div className="flex gap-2 mb-3">
                        <button type="button" onClick={() => setNewTrans({...newTrans, type: 'expense'})} className={`flex-1 py-2 text-xs font-bold rounded transition-all ${newTrans.type === 'expense' ? 'bg-[#D4A5A5] text-white' : 'bg-slate-100 text-slate-500'}`}>Pengeluaran</button>
                        <button type="button" onClick={() => setNewTrans({...newTrans, type: 'income', category: 'Income'})} className={`flex-1 py-2 text-xs font-bold rounded transition-all ${newTrans.type === 'income' ? 'bg-[#98BEAC] text-white' : 'bg-slate-100 text-slate-500'}`}>Pemasukan</button>
                     </div>
                  </div>
                  {newTrans.type === 'expense' && (
                     <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Kategori</label>
                        <select className="w-full border p-2 rounded text-sm bg-white focus:border-[#D4A5A5] outline-none" value={newTrans.category} onChange={e => setNewTrans({...newTrans, category: e.target.value})}>
                           <option value="Kebutuhan">Kebutuhan (Wajib)</option>
                           <option value="Keinginan">Keinginan (Hiburan/Jajan)</option>
                           <option value="Tabungan">Tabungan (Masa Depan)</option>
                        </select>
                     </div>
                  )}
                  <Button type="submit" className="w-full mt-2">Simpan</Button>
               </form>
            </Card>
            <Card className="lg:col-span-2 overflow-hidden">
               <div className="p-4 border-b border-slate-100 bg-[#FAF5F5]">
                  <h4 className="font-bold text-slate-600 text-sm uppercase tracking-wide">Riwayat Transaksi</h4>
               </div>
               <div className="overflow-y-auto max-h-[500px]">
                  {transactions.length === 0 ? (
                     <div className="p-10 text-center text-slate-400 italic text-sm">Belum ada transaksi tercatat.</div>
                  ) : (
                     <table className="w-full text-sm text-left">
                        <thead className="bg-white text-slate-400 font-bold text-[10px] uppercase tracking-wider border-b border-slate-100">
                           <tr><th className="p-4 font-normal">Tanggal</th><th className="p-4 font-normal">Deskripsi</th><th className="p-4 font-normal">Kategori</th><th className="p-4 text-right font-normal">Jumlah</th><th className="p-4 w-10"></th></tr>
                        </thead>
                        <tbody className="divide-y divide-[#EFE1E1]">
                           {transactions.map(t => (
                              <tr key={t.id} className="hover:bg-[#FFFBFB] group">
                                 <td className="p-4 text-slate-500 text-xs">{formatDate(t.date)}</td>
                                 <td className="p-4 font-medium text-slate-700">{t.desc}</td>
                                 <td className="p-4"><span className={`px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wide ${t.category === 'Kebutuhan' ? 'bg-blue-100 text-blue-600' : t.category === 'Keinginan' ? 'bg-purple-100 text-purple-600' : t.category === 'Tabungan' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'}`}>{t.type === 'income' ? 'Pemasukan' : t.category}</span></td>
                                 <td className={`p-4 text-right font-bold ${t.type === 'income' ? 'text-[#98BEAC]' : 'text-[#D4A5A5]'}`}>{t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}</td>
                                 <td className="p-4 text-center"><button onClick={() => setTransactions(transactions.filter(x => x.id !== t.id))} className="text-slate-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4"/></button></td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  )}
               </div>
            </Card>
         </div>
       )}
    </div>
  );
};

// --- MODULE: ROADMAP (UPDATED WITH CHECKBOX PLANNER) ---
const Roadmap = ({ goals, setGoals }) => {
   const [isAdding, setIsAdding] = useState(false);
   const [newTitle, setNewTitle] = useState("");
   const [newDeadline, setNewDeadline] = useState("");
   const [newTarget, setNewTarget] = useState(""); 
   const [newSavingsAbility, setNewSavingsAbility] = useState(""); 

   const handleAddGoal = (e) => {
      e.preventDefault();
      if (!newTitle.trim()) return;
      setGoals([...goals, { 
        id: Date.now(), 
        title: newTitle, 
        deadline: newDeadline || '2030', 
        targetAmount: Number(newTarget) || 0, 
        currentAmount: 0,
        savingsAbility: Number(newSavingsAbility) || 0 
      }]);
      setNewTitle(""); setNewDeadline(""); setNewTarget(""); setNewSavingsAbility(""); setIsAdding(false);
   };

   // New function to update amount by clicking a specific "milestone" box
   const toggleSavingStep = (goal, stepIndex) => {
      const stepValue = goal.savingsAbility;
      const targetStepAmount = (stepIndex + 1) * stepValue;
      
      const currentStep = Math.floor(goal.currentAmount / stepValue);
      let newAmount = 0;

      if (stepIndex + 1 === currentStep) {
         // Unchecking the last checked box
         newAmount = stepIndex * stepValue;
      } else {
         // Checking a new box (or an earlier one, setting it to that level)
         newAmount = (stepIndex + 1) * stepValue;
      }
      
      // Cap at target amount just in case, though math should hold
      newAmount = Math.min(newAmount, goal.targetAmount);

      setGoals(goals.map(g => g.id === goal.id ? { ...g, currentAmount: newAmount } : g));
   };

   return (
      <div className="space-y-6 animate-fade-in font-sans pb-24 md:pb-0">
         <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-[#EFE1E1]">
           <div><h2 className={`${THEME.header} text-2xl font-bold`}>Peta Jalan Hidup</h2><p className="text-slate-400 text-xs tracking-widest uppercase">Visi Jangka Panjang & Tabungan</p></div>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.map(goal => {
               const progress = goal.targetAmount > 0 ? Math.min(100, (goal.currentAmount / goal.targetAmount) * 100) : 0;
               // Calculate steps
               const stepValue = goal.savingsAbility || 0;
               const totalSteps = stepValue > 0 ? Math.ceil(goal.targetAmount / stepValue) : 0;
               const currentStep = stepValue > 0 ? Math.floor(goal.currentAmount / stepValue) : 0;

               return (
               <Card key={goal.id} className="p-6 relative group hover:border-[#D4A5A5] transition-colors">
                  <div className="flex justify-between mb-4"><h3 className="font-serif font-bold text-lg text-slate-700">{goal.title}</h3><span className="bg-[#F9E8E8] text-[#B07070] px-3 py-1 rounded-full text-xs font-bold">{goal.deadline}</span></div>
                  
                  <div className="mb-4 space-y-2">
                     <div className="flex justify-between items-end">
                        <span className="text-xs text-slate-500 uppercase tracking-wider">Terkumpul</span>
                        <div className="text-right">
                           <span className="text-lg font-bold text-[#B07070]">{formatCurrency(goal.currentAmount || 0)}</span>
                           <span className="text-xs text-slate-400 ml-1">/ {formatCurrency(goal.targetAmount || 0)}</span>
                        </div>
                     </div>
                     <ProgressBar value={goal.currentAmount} max={goal.targetAmount} />
                     <p className="text-right text-xs font-bold text-slate-400">{Math.round(progress)}%</p>
                  </div>

                  {/* CHECKBOX PLANNER */}
                  {totalSteps > 0 && (
                     <div className="mt-4">
                        <p className="text-xs font-bold text-slate-500 uppercase mb-2">Rencana Tabungan ({formatCurrency(stepValue)} / kotak)</p>
                        <div className="grid grid-cols-5 gap-2 max-h-40 overflow-y-auto pr-1">
                           {Array.from({ length: totalSteps }).map((_, idx) => {
                              const isChecked = idx < currentStep;
                              return (
                                 <button
                                    key={idx}
                                    onClick={() => toggleSavingStep(goal, idx)}
                                    className={`h-8 rounded flex items-center justify-center text-xs font-bold border transition-all ${
                                       isChecked 
                                       ? 'bg-[#98BEAC] border-[#98BEAC] text-white' 
                                       : 'bg-white border-slate-200 text-slate-300 hover:border-[#98BEAC]'
                                    }`}
                                    title={`Tabungan ke-${idx + 1}: ${formatCurrency((idx + 1) * stepValue)}`}
                                 >
                                    {isChecked ? <Check className="w-3 h-3"/> : idx + 1}
                                 </button>
                              );
                           })}
                        </div>
                     </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end">
                     <Button size="sm" variant="ghost" onClick={() => setGoals(goals.filter(g => g.id !== goal.id))}>Hapus</Button>
                  </div>
               </Card>
            )})}
            
            {isAdding ? (
               <Card className="p-6 border-2 border-dashed border-[#D4A5A5] flex flex-col justify-center min-h-[200px]"><form onSubmit={handleAddGoal} className="space-y-3"><div><label className="text-xs font-bold text-slate-500 uppercase">Judul Tujuan</label><input autoFocus value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="w-full border-b border-slate-300 py-1 text-slate-700 focus:outline-none focus:border-[#D4A5A5]" placeholder="Misal: Beli Laptop"/></div><div className="grid grid-cols-2 gap-4"><div><label className="text-xs font-bold text-slate-500 uppercase">Target Tahun</label><input type="number" value={newDeadline} onChange={(e) => setNewDeadline(e.target.value)} className="w-full border-b border-slate-300 py-1 text-slate-700 focus:outline-none focus:border-[#D4A5A5]" placeholder="2025"/></div><div><label className="text-xs font-bold text-slate-500 uppercase">Target Dana (Rp)</label><input type="number" value={newTarget} onChange={(e) => setNewTarget(e.target.value)} className="w-full border-b border-slate-300 py-1 text-slate-700 focus:outline-none focus:border-[#D4A5A5]" placeholder="15000000"/></div></div><div><label className="text-xs font-bold text-slate-500 uppercase">Kemampuan Nabung (Per Kali)</label><input type="number" value={newSavingsAbility} onChange={(e) => setNewSavingsAbility(e.target.value)} className="w-full border-b border-slate-300 py-1 text-slate-700 focus:outline-none focus:border-[#D4A5A5]" placeholder="Misal: 50000"/><p className="text-[10px] text-slate-400 mt-1">Isi nominal yang sanggup kamu sisihkan setiap kali menabung.</p></div><div className="flex gap-2 pt-2"><Button type="submit" size="sm" className="flex-1">Simpan</Button><Button type="button" size="sm" variant="ghost" onClick={() => setIsAdding(false)}>Batal</Button></div></form></Card>
            ) : (<button onClick={() => setIsAdding(true)} className="border-2 border-dashed border-[#EFE1E1] rounded-xl flex flex-col items-center justify-center p-6 text-slate-400 hover:border-[#D4A5A5] hover:text-[#D4A5A5] hover:bg-[#FFFBFB] transition-all min-h-[200px]"><Plus className="w-8 h-8 mb-2 opacity-50"/> <span className="text-sm font-medium tracking-wide">TAMBAH TUJUAN BARU</span></button>)}
         </div>
      </div>
   );
};

// --- MAIN APP COMPONENT ---
const MainApp = () => {
  const [activeTab, setActiveTab] = useState('planner'); 
  const [notification, setNotification] = useState(null); 

  // --- GLOBAL STATE ---
  const [settings, setSettings] = useState(() => JSON.parse(localStorage.getItem('los_settings')) || { 
    platform: 'TikTok', goal: 'Personal Branding', showSetup: true 
  });
  
  const [plannerItems, setPlannerItems] = useState(() => JSON.parse(localStorage.getItem('los_planner')) || []);
  const [recurringItems, setRecurringItems] = useState(() => JSON.parse(localStorage.getItem('los_recurring')) || []);
  const [completions, setCompletions] = useState(() => JSON.parse(localStorage.getItem('los_completions')) || {}); 

  // Other modules state
  const [habits, setHabits] = useState(() => JSON.parse(localStorage.getItem('los_habits')) || [{ id: 1, name: 'Rutinitas Pagi', history: {} }]);
  const [transactions, setTransactions] = useState(() => JSON.parse(localStorage.getItem('los_finance')) || []);
  const [budgetPlan, setBudgetPlan] = useState(() => JSON.parse(localStorage.getItem('los_budget_plan')) || []);
  const [incomeGoal, setIncomeGoal] = useState(() => JSON.parse(localStorage.getItem('los_income_goal')) || 0);
  const [goals, setGoals] = useState(() => JSON.parse(localStorage.getItem('los_goals')) || []);
  const [academicSchedule, setAcademicSchedule] = useState(() => JSON.parse(localStorage.getItem('los_academic_schedule')) || []);
  const [academicDetails, setAcademicDetails] = useState(() => JSON.parse(localStorage.getItem('los_academic_details')) || {});
  const [assignments, setAssignments] = useState(() => JSON.parse(localStorage.getItem('los_assignments')) || []);
  const [budgetMethod, setBudgetMethod] = useState(() => JSON.parse(localStorage.getItem('los_budget_method')) || '50/30/20');

  // --- PERSISTENCE ---
  useEffect(() => localStorage.setItem('los_settings', JSON.stringify(settings)), [settings]);
  useEffect(() => localStorage.setItem('los_planner', JSON.stringify(plannerItems)), [plannerItems]);
  useEffect(() => localStorage.setItem('los_recurring', JSON.stringify(recurringItems)), [recurringItems]);
  useEffect(() => localStorage.setItem('los_completions', JSON.stringify(completions)), [completions]);
  useEffect(() => localStorage.setItem('los_habits', JSON.stringify(habits)), [habits]);
  useEffect(() => localStorage.setItem('los_finance', JSON.stringify(transactions)), [transactions]);
  useEffect(() => localStorage.setItem('los_budget_plan', JSON.stringify(budgetPlan)), [budgetPlan]);
  useEffect(() => localStorage.setItem('los_income_goal', JSON.stringify(incomeGoal)), [incomeGoal]);
  useEffect(() => localStorage.setItem('los_goals', JSON.stringify(goals)), [goals]);
  useEffect(() => localStorage.setItem('los_academic_schedule', JSON.stringify(academicSchedule)), [academicSchedule]);
  useEffect(() => localStorage.setItem('los_academic_details', JSON.stringify(academicDetails)), [academicDetails]);
  useEffect(() => localStorage.setItem('los_assignments', JSON.stringify(assignments)), [assignments]);
  useEffect(() => localStorage.setItem('los_budget_method', JSON.stringify(budgetMethod)), [budgetMethod]);

  const navItems = [
    { id: 'academic', label: 'Akademik', icon: GraduationCap },
    { id: 'planner', label: 'Konten', icon: ClipboardList },
    { id: 'habits', label: 'Kebiasaan', icon: CheckSquare },
    { id: 'finance', label: 'Keuangan', icon: DollarSign },
    { id: 'roadmap', label: 'Peta Jalan', icon: Target },
  ];

  const handleResetData = () => {
    if (confirm("Apakah Anda yakin ingin menghapus SEMUA data aplikasi? Tindakan ini tidak bisa dibatalkan.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className={`min-h-screen ${THEME.bg} flex flex-col md:flex-row font-sans text-slate-600`}>
      <Toast message={notification} onClose={() => setNotification(null)} />
      {settings.showSetup && <SetupWizard settings={settings} setSettings={setSettings} />}

      <aside className={`hidden md:flex md:w-64 ${THEME.sidebar} border-r border-[#EFE1E1] flex-shrink-0 flex-col h-screen sticky top-0 z-20`}>
        <div className="p-8 border-b border-[#EFE1E1] text-center"><h1 className="font-serif text-3xl text-slate-800 tracking-tight">Life<span className="text-[#D4A5A5] italic">OS</span></h1><p className="text-[10px] text-slate-400 tracking-[0.2em] uppercase mt-2">Dasbor Pribadi</p></div>
        <nav className="flex-1 p-6 space-y-2">{navItems.map(item => (<button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex items-center gap-4 px-4 py-3 rounded-lg w-full transition-all duration-300 text-sm tracking-wide ${activeTab === item.id ? 'bg-[#F9E8E8] text-[#B07070] font-bold shadow-sm' : 'text-slate-500 hover:bg-[#FDF8F5] hover:text-slate-700'}`}><item.icon className={`w-4 h-4 ${activeTab === item.id ? 'text-[#B07070]' : 'text-slate-400'}`} /> {item.label}</button>))}</nav>
        <div className="p-6 border-t border-[#EFE1E1] space-y-3">
           <div className="bg-[#FAF5F5] rounded-xl p-4 text-center border border-[#EFE1E1]"><div className="flex justify-center items-center gap-2 mb-1 text-[#98BEAC]"><Save className="w-3 h-3" /><span className="text-[10px] font-bold uppercase tracking-widest">Tersimpan</span></div></div>
           <button onClick={handleResetData} className="w-full flex items-center justify-center gap-2 p-2 text-xs text-red-400 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-3 h-3"/> Reset Data Pabrik</button>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAVIGATION */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-3 z-50 shadow-lg">
        {navItems.map(item => (
          <button 
            key={item.id} 
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 ${activeTab === item.id ? 'text-[#B07070]' : 'text-slate-400'}`}
          >
            <item.icon className={`w-6 h-6 ${activeTab === item.id ? 'fill-current/10' : ''}`} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
        {/* Mobile Reset Button (Small) */}
        <button onClick={handleResetData} className="flex flex-col items-center gap-1 text-red-300">
           <Trash2 className="w-6 h-6" />
           <span className="text-[10px]">Reset</span>
        </button>
      </div>

      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen pb-24 md:pb-0">
        <div className="max-w-6xl mx-auto">
           {activeTab === 'academic' && <Academic academicSchedule={academicSchedule} setAcademicSchedule={setAcademicSchedule} academicDetails={academicDetails} setAcademicDetails={setAcademicDetails} assignments={assignments} setAssignments={setAssignments} />}
           {activeTab === 'planner' && <ContentPlanner plannerItems={plannerItems} setPlannerItems={setPlannerItems} recurringItems={recurringItems} setRecurringItems={setRecurringItems} completions={completions} setCompletions={setCompletions} settings={settings} setSettings={setSettings} />}
           {activeTab === 'habits' && <HabitTracker habits={habits} setHabits={setHabits} notification={notification} setNotification={setNotification} />}
           {activeTab === 'finance' && <Finance transactions={transactions} setTransactions={setTransactions} budgetPlan={budgetPlan} setBudgetPlan={setBudgetPlan} incomeGoal={incomeGoal} setIncomeGoal={setIncomeGoal} budgetMethod={budgetMethod} setBudgetMethod={setBudgetMethod} />}
           {activeTab === 'roadmap' && <Roadmap goals={goals} setGoals={setGoals} />}
        </div>
      </main>
    </div>
  );
}

// --- ROOT COMPONENT (HANDLES APP FLOW) ---
export default function App() {
  const [appState, setAppState] = useState('loading'); // 'loading' | 'landing' | 'app'

  useEffect(() => {
    const timer = setTimeout(() => {
      setAppState('landing');
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const enterApp = () => setAppState('app');

  if (appState === 'loading') return <LoadingScreen />;
  if (appState === 'landing') return <LandingPage onEnterApp={enterApp} />;
  
  return <MainApp />;
}
