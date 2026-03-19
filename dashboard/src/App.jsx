import React, { useState, useEffect, forwardRef, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { 
  LayoutDashboard, 
  Briefcase, 
  MapPin, 
  TrendingUp, 
  Search, 
  Filter, 
  ExternalLink,
  Cpu,
  Zap,
  Target,
  ChevronRight,
  Activity,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Brain
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock data for initial development if file doesn't exist yet
import initialData from './data/jobs.json';

const COLORS = ['#60a5fa', '#a78bfa', '#f472b6', '#4ade80', '#fb923c'];

const App = () => {
  const [data, setData] = useState(initialData);
  const [selectedCity, setSelectedCity] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [activeView, setActiveView] = useState('Dashboard');

  const cities = ['All', ...new Set(data.jobs.map(j => j.city || 'Other'))];
  
  const filteredJobs = data.jobs.filter(job => {
    const cityMatch = selectedCity === 'All' || job.city === selectedCity;
    const searchMatch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      job.company.toLowerCase().includes(searchQuery.toLowerCase());
    return cityMatch && searchMatch;
  });

  return (
    <div className="min-h-screen flex text-slate-200">
      {/* SIDEBAR */}
      <aside className="w-20 lg:w-64 border-r border-cyber-border bg-cyber-bg/50 backdrop-blur-xl flex flex-col items-center lg:items-start py-8 px-4 fixed h-full z-50">
        <div className="flex items-center gap-3 mb-12 px-2 cursor-pointer" onClick={() => setActiveView('Dashboard')}>
          <div className="bg-gradient-to-br from-cyber-accent to-cyber-neon-purple p-2 rounded-xl shadow-lg neon-glow-blue">
            <Cpu size={24} className="text-white" />
          </div>
          <span className="hidden lg:block font-outfit font-black text-xl tracking-tight uppercase italic text-white">Naukri <span className="text-cyber-neon-blue">AI</span></span>
        </div>

        <nav className="flex-1 w-full space-y-2">
          <NavItem 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            active={activeView === 'Dashboard'} 
            onClick={() => setActiveView('Dashboard')}
          />
          <NavItem 
            icon={<Briefcase size={20} />} 
            label="Jobs" 
            active={activeView === 'Jobs'} 
            onClick={() => setActiveView('Jobs')}
          />
          <NavItem 
            icon={<TrendingUp size={20} />} 
            label="Analytics" 
            active={activeView === 'Analytics'} 
            onClick={() => setActiveView('Analytics')}
          />
          <NavItem 
            icon={<Target size={20} />} 
            label="Profile Boost" 
            badge="92%" 
            active={activeView === 'Boost'}
            onClick={() => setActiveView('Boost')}
          />
        </nav>

        <div className="mt-auto w-full">
           <div className="glass p-4 hidden lg:block overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity">
                <Zap size={14} className="text-cyber-neon-green" />
              </div>
              <p className="text-[10px] font-black text-cyber-neon-green mb-1 uppercase tracking-widest">System Status</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyber-neon-green animate-pulse" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Core Active</span>
              </div>
           </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-20 lg:ml-64 p-4 lg:p-8">
        
        {/* TOP BAR */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12 mt-4">
          <div>
            <h1 className="text-4xl lg:text-5xl font-outfit font-black tracking-tight text-white mb-2 uppercase italic">
              AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-neon-blue to-cyber-neon-purple">{activeView}</span>
            </h1>
            <p className="text-slate-400 font-medium tracking-wide">Autonomous recruitment intelligence for junior engineers.</p>
          </div>

          <div className="flex items-center gap-4 w-full lg:w-auto">
            <div className="relative flex-1 lg:flex-none">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" 
                placeholder="Search elite roles..." 
                className="glass pl-12 pr-6 py-3 w-full outline-none focus:border-cyber-neon-blue transition-colors font-medium text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeView === 'Dashboard' && <MainDashboard key="dash" data={data} filteredJobs={filteredJobs} cities={cities} selectedCity={selectedCity} setSelectedCity={setSelectedCity} setSelectedJob={setSelectedJob} setActiveView={setActiveView} />}
          {activeView === 'Jobs' && <MainDashboard key="jobs" data={data} filteredJobs={filteredJobs} cities={cities} selectedCity={selectedCity} setSelectedCity={setSelectedCity} setSelectedJob={setSelectedJob} setActiveView={setActiveView} />}
          {activeView === 'Analytics' && <AnalyticsView key="analytics" data={data} />}
          {activeView === 'Boost' && <ProfileBoostView key="boost" data={data} />}
        </AnimatePresence>

        {/* JOB DETAIL SIDEBAR (Overlay) */}
        <AnimatePresence>
          {selectedJob && (
            <JobDetailOverlay job={selectedJob} onClose={() => setSelectedJob(null)} />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

/* --- SUB-VIEWS --- */

const MainDashboard = ({ data, filteredJobs, cities, selectedCity, setSelectedCity, setSelectedJob, setActiveView }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
    {/* STATS OVERVIEW */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <StatCard 
        label="Total Opportunities" 
        value={data.stats.totalJobs} 
        icon={<Briefcase className="text-cyber-neon-blue" />}
        accent="border-cyber-neon-blue"
        onClick={() => setSelectedCity('All')}
      />
      <StatCard 
        label="Peak Match Score" 
        value={`${data.stats.topScore}%`} 
        icon={<Target className="text-cyber-neon-purple" />}
        accent="border-cyber-neon-purple"
        onClick={() => setActiveView('Boost')}
      />
      <StatCard 
        label="Target Sectors" 
        value={data.stats.cities} 
        icon={<MapPin className="text-cyber-neon-green" />}
        accent="border-cyber-neon-green"
      />
    </div>

    {/* FILTERS */}
    <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-2 scrollbar-none">
      <div className="flex items-center gap-2 mr-4 text-slate-500 font-bold uppercase text-[10px] tracking-widest whitespace-nowrap">
        <Filter size={14} /> Refine Radar:
      </div>
      {cities.map(city => (
        <button 
          key={city}
          onClick={() => setSelectedCity(city)}
          className={`px-5 py-2 rounded-full text-xs font-black tracking-widest uppercase transition-all whitespace-nowrap ${
            selectedCity === city 
            ? 'bg-cyber-neon-blue text-white shadow-lg neon-glow-blue' 
            : 'bg-white/5 border border-white/10 text-slate-400 hover:border-white/20'
          }`}
        >
          {city}
        </button>
      ))}
    </div>

    {/* JOB GRID */}
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-12">
      <AnimatePresence mode="popLayout">
        {filteredJobs.map((job, idx) => (
          <JobGridCard key={job.id || idx} job={job} onClick={() => setSelectedJob(job)} />
        ))}
      </AnimatePresence>
      {filteredJobs.length === 0 && (
        <div className="col-span-full py-20 text-center glass">
          <p className="text-slate-500 font-bold uppercase tracking-widest">No matching frequencies detected in this sector.</p>
        </div>
      )}
    </div>
  </motion.div>
);

const AnalyticsView = ({ data }) => {
  const cityData = useMemo(() => {
    const counts = {};
    data.jobs.forEach(j => {
      counts[j.city] = (counts[j.city] || 0) + 1;
    });
    return Object.keys(counts).map(name => ({ name, value: counts[name] }));
  }, [data]);

  const skillData = useMemo(() => {
    return data.skillGapSummary.slice(0, 5).map(s => ({ 
      name: s.skill, 
      count: s.count 
    }));
  }, [data]);

  const scoreData = useMemo(() => {
    return data.jobs.map((j, i) => ({ 
      index: i + 1, 
      score: j.aiScore?.score || 0 
    })).sort((a, b) => b.score - a.score);
  }, [data]);

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* MARKET SHARE BY CITY */}
        <div className="glass p-8">
           <h3 className="text-white font-black uppercase tracking-widest text-sm mb-8 flex items-center gap-2">
             <MapPin size={18} className="text-cyber-neon-purple" /> Geographic Distribution
           </h3>
           <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={cityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {cityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff', fontSize: '10px', textTransform: 'uppercase', fontWeight: 900 }}
                  />
                </PieChart>
              </ResponsiveContainer>
           </div>
           <div className="grid grid-cols-2 gap-4 mt-8">
              {cityData.map((c, i) => (
                <div key={c.name} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-[10px] font-black uppercase text-slate-400">{c.name}: {c.value} Jobs</span>
                </div>
              ))}
           </div>
        </div>

        {/* SKILL GAP INTENSITY */}
        <div className="glass p-8">
           <h3 className="text-white font-black uppercase tracking-widest text-sm mb-8 flex items-center gap-2">
             <Zap size={18} className="text-cyber-neon-orange" /> Critical Skill Gaps
           </h3>
           <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillData} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} width={80} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                  />
                  <Bar dataKey="count" fill="#60a5fa" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
           </div>
           <p className="text-[10px] font-bold text-slate-500 mt-4 uppercase tracking-tighter">Frequency of missing skills in current market opportunities.</p>
        </div>
      </div>

      {/* AI MATCH SCORE DISTRIBUTION */}
      <div className="glass p-8">
         <h3 className="text-white font-black uppercase tracking-widest text-sm mb-8 flex items-center gap-2">
           <Brain size={18} className="text-cyber-neon-blue" /> Match Quality Spectrum
         </h3>
         <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={scoreData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#60a5fa" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="index" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 10 }} />
                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 10 }} />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                />
                <Area type="monotone" dataKey="score" stroke="#3b82f6" fillOpacity={1} fill="url(#colorScore)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
         </div>
      </div>
    </motion.div>
  );
};

const ProfileBoostView = ({ data }) => {
  const boost = data.boostReport;
  
  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-8 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COMPLEATNESS GAUGE */}
        <div className="lg:col-span-1 glass p-8 flex flex-col items-center justify-center text-center">
           <h3 className="text-slate-500 font-black uppercase tracking-widest text-[10px] mb-8">Force Readiness Score</h3>
           <div className="relative w-48 h-48 flex items-center justify-center mb-8">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="96" cy="96" r="80" fill="none" stroke="#1e293b" strokeWidth="12" />
                <circle cx="96" cy="96" r="80" fill="none" stroke="#4ade80" strokeWidth="12" 
                  strokeDasharray={2 * Math.PI * 80} 
                  strokeDashoffset={2 * Math.PI * 80 * (1 - boost.profileScore.percentage / 100)} 
                  className="transition-all duration-1000 shadow-lg"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-black text-white">{boost.profileScore.percentage}%</span>
                <span className="text-[10px] font-black text-cyber-neon-green uppercase tracking-widest mt-1 italic">Optimized</span>
              </div>
           </div>
           <div className="flex items-center gap-2 text-cyber-neon-blue font-black uppercase text-[10px] tracking-widest mt-4">
             <ShieldCheck size={16} /> Verified Protocol
           </div>
        </div>

        {/* TOP ACTIONS */}
        <div className="lg:col-span-2 glass p-8">
           <h3 className="text-white font-black uppercase tracking-widest text-sm mb-8 flex items-center gap-2">
             <Activity size={18} className="text-cyber-neon-green" /> Immediate Optimization Protocol
           </h3>
           <div className="space-y-4">
              {boost.todaysActions.map((action, i) => (
                <div key={i} className="flex items-center gap-6 p-4 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-cyber-bg border border-cyber-neon-green flex items-center justify-center font-black text-cyber-neon-green text-sm shadow-lg neon-glow-green">
                    {action.step}
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-200 font-bold text-sm tracking-tight">{action.text}</p>
                  </div>
                  <a href={action.url} target="_blank" className="bg-cyber-neon-green/20 text-cyber-neon-green px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest border border-cyber-neon-green/30 hover:bg-cyber-neon-green hover:text-white transition-all">
                    {action.btn || 'Execute'}
                  </a>
                </div>
              ))}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* DAILY SIGNALS */}
        <div className="glass p-8">
           <h3 className="text-white font-black uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
             <Zap size={18} className="text-cyber-neon-blue" /> Growth Signals
           </h3>
           <div className="space-y-4">
              {boost.todaysSignals.map((signal, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="text-cyber-neon-blue mt-0.5 shrink-0" />
                  <p className="text-sm text-slate-400 font-medium leading-relaxed">{signal}</p>
                </div>
              ))}
           </div>
        </div>

        {/* SKILL RESOURCES */}
        <div className="glass p-8 border-cyber-neon-purple/20">
           <h3 className="text-white font-black uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
             <AlertCircle size={18} className="text-cyber-neon-purple" /> Intelligence Requirements
           </h3>
           <div className="space-y-4">
              {data.skillGapSummary.slice(0, 4).map((skill, i) => (
                <div key={i} className="p-4 bg-cyber-neon-purple/5 rounded-2xl border border-cyber-neon-purple/10 flex justify-between items-center group cursor-pointer hover:border-cyber-neon-purple/30 transition-all">
                  <div>
                    <h4 className="text-xs font-black text-cyber-neon-purple uppercase tracking-widest mb-1">{skill.skill}</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Recommendation: {skill.resource}</p>
                  </div>
                  <ChevronRight size={16} className="text-cyber-neon-purple group-hover:translate-x-1 transition-transform" />
                </div>
              ))}
           </div>
        </div>
      </div>
    </motion.div>
  );
};

/* --- SHARED COMPONENTS --- */

const NavItem = ({ icon, label, active = false, badge, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all group ${
      active ? 'bg-cyber-accent/20 text-cyber-neon-blue border border-cyber-accent/30 shadow-[0_0_15px_rgba(30,144,255,0.1)]' : 'text-slate-400 hover:bg-white/5 hover:text-white'
    }`}
  >
    <div className={active ? 'neon-glow-blue text-cyber-neon-blue' : 'text-current group-hover:text-white transition-colors'}>{icon}</div>
    <span className="hidden lg:block font-bold text-sm tracking-tight">{label}</span>
    {badge && <span className="hidden lg:inline-block ml-auto text-[8px] font-black bg-cyber-neon-purple text-white px-1.5 py-0.5 rounded italic uppercase leading-none shadow-sm">{badge}</span>}
  </button>
);

const StatCard = ({ label, value, icon, accent, onClick }) => (
  <div 
    onClick={onClick}
    className={`glass p-6 relative overflow-hidden group hover:scale-[1.02] transition-all cursor-pointer border-b-4 ${accent} active:scale-95`}
  >
    <div className="flex justify-between items-start relative z-10">
      <div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
        <h3 className="text-3xl font-black text-white font-outfit tracking-tighter">{value}</h3>
      </div>
      <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-white/10 transition-colors">
        {icon}
      </div>
    </div>
    <div className={`absolute -bottom-6 -right-6 w-24 h-24 bg-current opacity-[0.03] rounded-full group-hover:scale-150 transition-transform duration-700 ${accent.replace('border-', 'text-')}`} />
  </div>
);

// Fixed JobGridCard with forwardRef for Framer Motion compatibility
const JobGridCard = forwardRef(({ job, onClick, ...props }, ref) => {
  const isElite = job.aiScore?.score >= 85;
  
  return (
    <motion.div 
      ref={ref}
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`glass p-6 cursor-pointer group hover:border-cyber-neon-blue transition-all relative ${isElite ? 'neon-glow-blue bg-gradient-to-br from-cyber-card to-blue-900/10 border-cyber-neon-blue/30' : 'border-white/5'}`}
      {...props}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center font-black text-xl text-cyber-neon-blue border border-white/10 group-hover:scale-110 transition-transform">
            {job.company[0]}
          </div>
          <div>
            <h4 className="text-lg font-black text-white group-hover:text-cyber-neon-blue transition-colors line-clamp-1">{job.title}</h4>
            <p className="text-slate-400 font-bold text-sm tracking-tight">{job.company}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
           <div className="flex items-center gap-1.5 px-3 py-1 bg-cyber-bg/80 border border-cyber-border rounded-full shadow-inner">
             <div className="w-2 h-2 rounded-full bg-cyber-neon-green animate-pulse" />
             <span className="text-[10px] font-black tracking-widest text-cyber-neon-green uppercase">{job.aiScore?.score}% Match</span>
           </div>
           {isElite && <span className="text-[8px] font-black bg-cyber-neon-blue text-white px-2 py-0.5 rounded-full uppercase tracking-widest italic animate-pulse">ELITE MATCH</span>}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <IconBadge icon={<MapPin size={12} />} label={job.city} color="text-cyber-neon-purple" />
        <IconBadge icon={<Zap size={12} />} label={job.experience || job.exp} color="text-cyber-neon-orange" />
        <IconBadge icon={<Activity size={12} />} label={job.salary} color="text-cyber-neon-green" />
      </div>

      <div className="p-4 bg-white/5 rounded-2xl border border-white/5 mb-4 italic text-sm text-slate-400 line-clamp-2 leading-relaxed group-hover:text-slate-300 transition-colors border-l-2 border-cyber-neon-blue/20">
        "{job.aiScore?.matchReason || job.aiScore?.reason || 'Excellent match for your specialized tech stack and experience level.'}"
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{job.posted || 'Recent Opportunity'}</span>
        <div className="flex items-center gap-2 text-cyber-neon-blue font-black text-[10px] uppercase tracking-widest group-hover:translate-x-1 transition-transform">
           Analyze Deeply <ChevronRight size={14} />
        </div>
      </div>
    </motion.div>
  );
});

const IconBadge = ({ icon, label, color }) => (
  <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-xl border border-white/5">
    <span className={color}>{icon}</span>
    <span className="text-[9px] font-black uppercase tracking-tighter text-slate-300">{label}</span>
  </div>
);

const JobDetailOverlay = ({ job, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-cyber-bg/80 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative w-full max-w-2xl bg-cyber-bg border-l border-cyber-border h-full shadow-2xl flex flex-col"
      >
        <div className="p-8 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-white/10">
          <div className="flex justify-between items-start mb-8">
            <div className="bg-gradient-to-br from-cyber-accent to-cyber-neon-purple p-4 rounded-3xl neon-glow-blue inline-flex">
              <Cpu size={32} className="text-white" />
            </div>
            <button 
              onClick={onClose}
              className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors text-slate-400 hover:text-white border border-white/10"
            >
              <ChevronRight size={24} className="rotate-0" />
            </button>
          </div>

          <h2 className="text-3xl font-black font-outfit text-white mb-2 leading-tight">{job.title}</h2>
          <p className="text-xl font-bold text-cyber-neon-blue mb-8 uppercase tracking-tighter">{job.company}</p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <DetailStat label="Matching Confidence" value={`${job.aiScore?.score}%`} color="text-cyber-neon-green" />
            <DetailStat label="Location Priority" value={job.city} color="text-cyber-neon-purple" />
            <DetailStat label="Experience Band" value={job.experience || job.exp} color="text-cyber-neon-orange" />
            <DetailStat label="Est. Compensation" value={job.salary} color="text-cyber-neon-blue" />
          </div>

          <div className="space-y-8">
             <section>
                <div className="flex items-center gap-2 mb-4 text-cyber-neon-purple uppercase font-black tracking-widest text-xs">
                  <Target size={16} /> Semantic Analysis
                </div>
                <div className="p-6 glass bg-white/[0.02] border-l-2 border-cyber-neon-purple/50">
                  <p className="text-slate-300 leading-relaxed font-medium italic">"{job.aiScore?.matchReason || job.aiScore?.reason}"</p>
                </div>
             </section>

             <section>
                <div className="flex items-center gap-2 mb-4 text-cyber-neon-blue uppercase font-black tracking-widest text-xs">
                  <Zap size={16} /> Knowledge Optimization
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  {job.aiScore?.skillGaps?.length > 0 ? job.aiScore.skillGaps.map(skill => (
                    <span key={skill} className="px-3 py-1 bg-cyber-neon-pink/10 border border-cyber-neon-pink/20 text-cyber-neon-pink rounded-lg font-black uppercase tracking-wider italic">
                      {skill} GAP
                    </span>
                  )) : (
                    <span className="px-3 py-1 bg-cyber-neon-green/10 border border-cyber-neon-green/20 text-cyber-neon-green rounded-lg font-black uppercase tracking-wider italic">
                      FULL SKILL ALIGNMENT
                    </span>
                  )}
                </div>
             </section>

             <section>
                <div className="flex items-center gap-2 mb-4 text-cyber-neon-green uppercase font-black tracking-widest text-xs">
                   <Activity size={16} /> AI Strategy Engine
                </div>
                <div className="p-6 bg-slate-950/50 rounded-2xl border border-white/5">
                   <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Personalized Intelligence</h5>
                   <p className="text-xs text-slate-400 leading-relaxed font-medium font-inter">
                     {job.coverLetterPreview || "Strategic narrative generation active... apply now to leverage the full intelligence stack for this role."}
                   </p>
                </div>
             </section>
          </div>
        </div>

        <div className="p-8 border-t border-cyber-border bg-black/20 flex gap-4">
          <a 
            href={job.url || job.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex-1 bg-white text-cyber-bg font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-200 transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] uppercase tracking-widest text-sm active:scale-95"
          >
            Apply Now <ExternalLink size={18} />
          </a>
        </div>
      </motion.div>
    </div>
  );
};

const DetailStat = ({ label, value, color }) => (
  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
    <p className={`text-lg font-black ${color} tracking-tight`}>{value}</p>
  </div>
);

export default App;
