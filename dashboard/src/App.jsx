import React, { useState, useEffect, forwardRef } from 'react';
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
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock data for initial development if file doesn't exist yet
import initialData from './data/jobs.json';

const THEME = {
  blue: '#60a5fa',
  purple: '#a78bfa',
  pink: '#f472b6',
  green: '#4ade80',
  orange: '#fb923c'
};

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
            badge="New" 
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
            <h1 className="text-4xl lg:text-5xl font-outfit font-black tracking-tight text-white mb-2">
              Intelligence <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-neon-blue to-cyber-neon-purple">{activeView}</span>
            </h1>
            <p className="text-slate-400 font-medium tracking-wide">Autonomous recruitment analysis for junior engineering roles.</p>
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

        {activeView === 'Dashboard' || activeView === 'Jobs' ? (
          <>
            {/* STATS OVERVIEW */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <StatCard 
                label="Total Opportunities" 
                value={data.stats.totalJobs} 
                icon={<Briefcase className="text-cyber-neon-blue" />}
                accent="border-cyber-neon-blue"
                onClick={() => setActiveView('Jobs')}
              />
              <StatCard 
                label="Peak Match Score" 
                value={`${data.stats.topScore}%`} 
                icon={<Target className="text-cyber-neon-purple" />}
                accent="border-cyber-neon-purple"
                onClick={() => setActiveView('Boost')}
              />
              <StatCard 
                label="Active Run Cycles" 
                value="Daily 9AM" 
                icon={<Activity className="text-cyber-neon-green" />}
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
          </>
        ) : (
          <div className="glass p-20 text-center">
            <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">{activeView} module initializing...</h2>
            <p className="text-slate-400 font-medium max-w-md mx-auto">This neural segment is being populated with real-time data from your next agent run.</p>
            <button 
              onClick={() => setActiveView('Dashboard')}
              className="mt-8 px-8 py-3 bg-cyber-neon-blue text-white font-black rounded-xl uppercase tracking-widest text-xs hover:scale-105 transition-transform"
            >
              Return to Core
            </button>
          </div>
        )}

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

      <div className="p-4 bg-white/5 rounded-2xl border border-white/5 mb-4 italic text-sm text-slate-400 line-clamp-2 leading-relaxed group-hover:text-slate-300 transition-colors">
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
              className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
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
                <div className="p-6 glass bg-white/[0.02]">
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
