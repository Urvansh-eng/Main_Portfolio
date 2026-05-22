const { useState, useEffect, useRef } = React;

/* ── Constants ── */
const GITHUB  = 'https://github.com/Urvansh-eng';
const LINKEDIN = 'https://www.linkedin.com/in/urvansh-kumar-2b01a532b';
const EMAIL   = 'urvansh11350@gmail.com';
const PHONE   = '+917014662680';

/* ── Scroll reveal ── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver(entries =>
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.08 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/* ── Cursor ── */
function useCursor() {
  useEffect(() => {
    const cur  = document.getElementById('cursor');
    const ring = document.getElementById('cursorRing');
    if (!cur || !ring) return;
    let rx = 0, ry = 0, af;
    const onMove = e => {
      cur.style.left = e.clientX + 'px';
      cur.style.top  = e.clientY + 'px';
      cancelAnimationFrame(af);
      af = requestAnimationFrame(() => {
        rx += (e.clientX - rx) * 0.13;
        ry += (e.clientY - ry) * 0.13;
        ring.style.left = rx + 'px';
        ring.style.top  = ry + 'px';
      });
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);
}

/* ── Active section tracker ── */
function useActiveSection() {
  const [active, setActive] = useState('home');
  useEffect(() => {
    const ids = ['home','projects','about','skills','certs','contact'];
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
    }, { threshold: 0.3 });
    ids.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);
  return active;
}

/* ── Navbar hide on scroll down ── */
function useNavScroll() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastY = useRef(0);
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > lastY.current && y > 120);
      lastY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return { hidden, scrolled };
}

/* ── Smooth scroll helper ── */
const scrollTo = id => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
};

/* ── Cross ── */
const Cross = ({ className = '' }) => <div className={`cross-marker ${className}`} />;

/* ── Code signature ── */
function CodeSig() {
  const lines = [
    { t:'const urvansh = {',        d:.4  },
    { t:'  role: "AI/DS Student",', d:.58 },
    { t:'  stack: ["Python","C++"],',d:.76 },
    { t:'  loves: "AI & Games",',   d:.94 },
    { t:'  open: true',             d:1.12},
    { t:'};',                       d:1.30},
  ];
  return (
    <div className="code-sig">
      {lines.map((l, i) => (
        <div key={i} className="line" style={{ animationDelay:`${l.d}s` }}>{l.t}</div>
      ))}
      <span className="blink" style={{ color:'#6366F1' }}>▍</span>
    </div>
  );
}

/* ── Toast ── */
function Toast({ msg, type }) {
  if (!msg) return null;
  const bg = type === 'error' ? '#ef4444' : '#6366F1';
  return (
    <div style={{
      position:'fixed', bottom:'2rem', right:'2rem', zIndex:9999,
      background: bg, color:'#fff',
      fontFamily:"'Space Mono',monospace", fontSize:'.72rem',
      letterSpacing:'.1em', textTransform:'uppercase',
      padding:'14px 24px', boxShadow:'0 8px 32px rgba(0,0,0,.5)',
      animation:'fadeUp .3s ease',
    }}>
      {msg}
    </div>
  );
}

/* ── Back to top ── */
function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const fn = () => setShow(window.scrollY > 600);
    window.addEventListener('scroll', fn, { passive:true });
    return () => window.removeEventListener('scroll', fn);
  }, []);
  if (!show) return null;
  return (
    <button
      onClick={() => {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
      style={{
        position:'fixed', bottom:'2rem', left:'2rem', zIndex:9990,
        width:'42px', height:'42px',
        border:'1px solid rgba(99,102,241,.5)', background:'rgba(99,102,241,.12)',
        color:'#a78bfa', fontSize:'1.2rem',
        display:'flex', alignItems:'center', justifyContent:'center',
        transition:'background .2s, border-color .2s, transform .2s',
        cursor:'pointer', pointerEvents:'all',
        outline:'none',
      }}
      onMouseEnter={e => { e.currentTarget.style.background='rgba(99,102,241,.35)'; e.currentTarget.style.transform='translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.background='rgba(99,102,241,.12)'; e.currentTarget.style.transform='translateY(0)'; }}
      title="Back to top"
    >↑</button>
  );
}

/* ── Nav ── */
function Nav({ menuOpen, setMenuOpen }) {
  const { hidden, scrolled } = useNavScroll();
  const active = useActiveSection();
  const links = [
    { label:'Projects', id:'projects' },
    { label:'About',    id:'about'    },
    { label:'Skills',   id:'skills'   },
    { label:'Contact',  id:'contact'  },
  ];
  return (
    <nav style={{
      position:'fixed', top: hidden ? '-80px' : '0',
      left:0, right:0, zIndex:50,
      display:'flex', alignItems:'center', justifyContent:'space-between',
      padding:'1.25rem 2.5rem',
      background: scrolled ? 'rgba(7,7,15,.55)' : 'rgba(7,7,15,.25)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,.06)',
      transition:'top .5s cubic-bezier(0.16, 1, 0.3, 1), background .4s ease, backdrop-filter .4s ease',
    }}>
      <button onClick={() => window.location.reload()}
        className="font-mono text-white text-sm tracking-widest uppercase"
        style={{cursor:'none', background:'none', border:'none'}}>
        Portfolio
      </button>

      {/* Desktop links */}
      <div className="hidden md:flex items-center gap-8">
        {links.map(l => (
          <button key={l.id}
            onClick={() => scrollTo(l.id)}
            className="nav-link"
            style={{
              background:'none', border:'none', cursor:'none',
              color: active === l.id ? '#6366F1' : '#fff',
            }}>
            {l.label}
          </button>
        ))}
      </div>

      {/* Hamburger */}
      <button className="md:hidden flex flex-col gap-1.5 z-50 relative"
        style={{cursor:'none', background:'none', border:'none'}}
        onClick={() => setMenuOpen(o => !o)}>
        <span className={`block w-6 h-px bg-white transition-all duration-300 ${menuOpen?'rotate-45 translate-y-2':''}`} />
        <span className={`block w-6 h-px bg-white transition-all duration-300 ${menuOpen?'opacity-0':''}`} />
        <span className={`block w-6 h-px bg-white transition-all duration-300 ${menuOpen?'-rotate-45 -translate-y-2':''}`} />
      </button>
    </nav>
  );
}

/* ── Mobile menu ── */
function MobileMenu({ open, setOpen }) {
  const links = [
    { label:'Projects', id:'projects' },
    { label:'About',    id:'about'    },
    { label:'Skills',   id:'skills'   },
    { label:'Contact',  id:'contact'  },
  ];
  return (
    <div className={`mobile-menu fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 ${open?'open':''}`}
      style={{background:'#07070f'}}>
      {links.map(l => (
        <button key={l.id}
          onClick={() => { scrollTo(l.id); setOpen(false); }}
          className="font-bebas text-6xl text-white tracking-widest hover:text-indigo-400 transition-colors"
          style={{background:'none', border:'none', cursor:'none'}}>
          {l.label}
        </button>
      ))}
      <div className="flex gap-6 mt-4">
        <a href={GITHUB}   target="_blank" rel="noopener" className="bracket-btn text-lg" onClick={() => setOpen(false)}>
          <span>[</span> GITHUB <span>]</span>
        </a>
        <a href={LINKEDIN} target="_blank" rel="noopener" className="bracket-btn text-lg" onClick={() => setOpen(false)}>
          <span>[</span> LINKEDIN <span>]</span>
        </a>
      </div>
    </div>
  );
}

/* ── Hero ── */
function Hero() {
  return (
    <section id="home" className="relative min-h-screen overflow-hidden flex flex-col">
      <div className="orb" />
      <div className="portrait-wrap">
        <div className="absolute bottom-0 left-0 right-0 h-48 z-10"
          style={{background:'linear-gradient(to top,#07070f 0%,transparent 100%)'}} />
      </div>

      {/* Name */}
      <div className="relative z-20 mt-24 md:mt-28 px-6 md:px-10">
        <h1 className="font-bebas text-[clamp(5rem,14vw,13rem)] leading-none text-white tracking-tight select-none">
          URVANSH
        </h1>
      </div>

      {/* Left meta */}
      <div className="absolute left-6 md:left-10 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-6">
        <div className="meta-label"><div>OPEN TO INTERN</div><div>@.2025</div></div>
        <div className="meta-label"><div>JAIPUR</div><div>RAJASTHAN, IN</div></div>
      </div>

      {/* Body copy */}
      <div className="absolute left-6 md:left-10 bottom-52 md:bottom-72 z-20 max-w-xs">
        <p className="text-xs text-white/55 font-dm leading-relaxed">
          B.Tech AI &amp; Data Science student with a strong foundation in
          programming, problem-solving, and core CS concepts. Building
          systems that learn, adapt, and delight.
        </p>
      </div>

      <div className="absolute z-20 right-[8%] md:right-[15%] top-[34%]">
        <CodeSig />
      </div>

      {/* Right sidebar */}
      <div className="absolute right-6 md:right-10 top-1/3 z-20 flex flex-col gap-8 items-end">
        <div className="sidebar-label"><div>ARYA COLLEGE</div><div>OF ENGG &amp; IT</div></div>
        <div className="sidebar-label mt-10"><div>BTECH</div><div>2023 — PRESENT</div></div>
      </div>

      <Cross className="absolute right-[22%] top-[52%] z-20" />
      <div className="accent-line z-20" />

      {/* Bottom big text */}
      <div className="relative z-20 mt-auto px-6 md:px-10 pb-24 md:pb-20">
        <h1 className="font-bebas text-[clamp(5rem,14vw,13rem)] leading-none tracking-tight select-none">
          <span className="text-white">AI</span>
          <span className="text-white/25"> &amp; </span>
          <span className="text-white">DS</span>
        </h1>
      </div>

      {/* CTAs */}
      <div className="absolute bottom-6 left-6 md:left-10 z-30 flex flex-wrap gap-6 md:gap-10">
        <button onClick={() => scrollTo('contact')} className="bracket-btn" style={{background:'none',border:'none',cursor:'none'}}>
          <span>[</span> HIRE ME <span>]</span>
        </button>
        <button onClick={() => scrollTo('projects')} className="bracket-btn" style={{background:'none',border:'none',cursor:'none'}}>
          <span>[</span> MY WORK <span>]</span>
        </button>
        <a href={GITHUB} target="_blank" rel="noopener" className="bracket-btn hidden md:inline-flex">
          <span>[</span> GITHUB <span>]</span>
        </a>
        <a href={LINKEDIN} target="_blank" rel="noopener" className="bracket-btn hidden md:inline-flex">
          <span>[</span> LINKEDIN <span>]</span>
        </a>
      </div>
    </section>
  );
}

/* ── Projects ── */
const realProjects = [
  {
    title:'EVORI',
    sub:'Cross-Platform AI Music Streaming Platform', year:'2024',
    stack:['React','Next.js','TypeScript','Tailwind CSS','Supabase','Socket.io','Capacitor'],
    desc:[
      'Engineered a client-side Hybrid Recommendation System combining K-Nearest Neighbors (KNN) and Cosine Similarity over a normalized 5D audio feature space.',
      'Bundled the web ecosystem into a native Android APK using Capacitor, configuring Foreground Services for true background audio playback and system media controls.',
      'Designed a Metadata Re-Hydration layer to dynamically restore expiring streaming URLs from Audius/YouTube tokens upon page reloads, fixing playback crash bugs.',
      'Secured backend workflows by implementing Supabase Row-Level Security (RLS) policies to safeguard user databases.'
    ],
    links: [
      { label: 'Launch Web App', url: 'https://evori-1.onrender.com' },
      { label: 'Source Code', url: GITHUB },
      { label: 'Download APK', url: '#' }
    ],
    image: 'images/evori-bg.png'
  },
  {
    title:'Personal Portfolio Website',
    sub:'Portfolio', year:'2024',
    stack:['Next.js','Tailwind CSS','JavaScript','Vercel'],
    desc:[
      'Designed and developed a dark-mode, cyber-inspired portfolio site utilizing modern React composition patterns.',
      'Integrated micro-interactions including a custom trailing cursor script and scroll-triggered fade-in UI animations.',
      'Configured automated deployment workflows utilizing Vercel\'s native CI/CD pipelines.'
    ],
    links: [
      { label: 'Source Code', url: GITHUB }
    ]
  },
];

const placeholderProjects = [
  { label:'PROJECT 03', hint:'Coming Soon' },
  { label:'PROJECT 04', hint:'Coming Soon' },
  { label:'PROJECT 05', hint:'Coming Soon' },
];

function PlaceholderCard({ label, hint }) {
  return (
    <div className="proj-placeholder reveal" style={{ height:'clamp(200px,28vw,340px)' }}>
      <div className="proj-placeholder-grid" />
      <div className="proj-placeholder-inner">
        <div className="proj-placeholder-icon">＋</div>
        <div style={{fontFamily:"'Space Mono',monospace",fontSize:'.6rem',letterSpacing:'.18em',color:'#a78bfa'}}>{label}</div>
        <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:'.7rem',color:'rgba(255,255,255,.3)'}}>{hint}</div>
      </div>
      <Cross className="absolute top-4 right-4 z-10" />
    </div>
  );
}

function Works() {
  return (
    <section id="projects" className="py-28 px-6 md:px-10">
      <div className="reveal flex items-end justify-between mb-12">
        <div>
          <p className="meta-label mb-2">SELECTED WORK</p>
          <h2 className="font-bebas text-[clamp(3rem,7vw,7rem)] leading-none">PROJECTS</h2>
        </div>
        <a href={GITHUB} target="_blank" rel="noopener" className="bracket-btn hidden md:inline-flex">
          <span>[</span> VIEW GITHUB <span>]</span>
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {realProjects.map((p, i) => (
          <div key={i}
            className="proj-card reveal"
            style={{
              minHeight: 'clamp(440px, 40vw, 550px)',
              transitionDelay:`${i*.08}s`, display:'block', textDecoration:'none',
            }}>
            <div style={{
              position:'absolute',inset:0,
              background: i===0
                ?'linear-gradient(135deg,#0f0f2a 0%,#1a1040 50%,#0d1a2a 100%)'
                :'linear-gradient(135deg,#0a0a1f 0%,#12102a 100%)',
            }} />
            {p.image && <img src={p.image} alt={p.title} />}
            <div className="proj-card-overlay" />
            <div className="absolute top-4 left-4 right-12 z-10 flex gap-2 flex-wrap">
              {p.stack.map(t => <span key={t} className="stack-pill">{t}</span>)}
            </div>
            <div className="absolute bottom-0 left-0 p-6 z-10 w-full">
              <p className="meta-label text-white/40 mb-1">{p.sub} — {p.year}</p>
              <h3 className="font-bebas text-2xl md:text-3xl tracking-wide mb-3">{p.title}</h3>
              <ul className="text-white/45 font-dm text-[0.65rem] md:text-xs mt-2 max-w-lg leading-relaxed hidden md:flex flex-col gap-1.5 list-disc pl-4 mb-5">
                {Array.isArray(p.desc) ? p.desc.map((bullet, idx) => <li key={idx}>{bullet}</li>) : <li>{p.desc}</li>}
              </ul>
              <div className="flex gap-4 flex-wrap">
                {p.links?.map(link => (
                  <a key={link.label} href={link.url} target="_blank" rel="noopener" className="bracket-btn text-[0.6rem]" style={{cursor:'none'}}>
                    <span>[</span> {link.label} <span>]</span>
                  </a>
                ))}
              </div>
            </div>
            <Cross className="absolute top-4 right-4 z-10" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {placeholderProjects.map((p, i) => (
          <PlaceholderCard key={i} label={p.label} hint={p.hint} />
        ))}
      </div>
    </section>
  );
}

/* ── About ── */
function About() {
  return (
    <section id="about" className="py-28 px-6 md:px-10 relative overflow-hidden">
      <span className="absolute -right-8 top-8 font-bebas text-[20vw] text-white/[0.03] leading-none select-none pointer-events-none">02</span>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div>
          <p className="meta-label reveal mb-3">ABOUT ME</p>
          <h2 className="font-bebas text-[clamp(3rem,7vw,7rem)] leading-none reveal mb-8">
            CURIOUS<br />BUILDER
          </h2>
          <div className="w-12 h-px reveal mb-8" style={{background:'#6366F1'}} />
          <p className="text-white/55 font-dm text-sm leading-relaxed reveal mb-5">
            I'm Urvansh — a motivated B.Tech Artificial Intelligence and Data Science student at
            Arya College of Engineering and IT, Kikas Jaipur (Aug 2023 – Present). I thrive on
            problem-solving, exploring core computer science concepts, and bringing ideas to life through code.
          </p>
          <p className="text-white/55 font-dm text-sm leading-relaxed reveal">
            Skilled in C++, Python, and basic web development, with hands-on experience in academic
            projects and game programming. Eager to apply technical knowledge, learn new technologies,
            and contribute effectively through a proactive and disciplined approach.
          </p>
          <div className="mt-10 flex flex-wrap gap-4 reveal">
            <a href={`mailto:${EMAIL}`} className="bracket-btn"><span>[</span> EMAIL ME <span>]</span></a>
            <a href={GITHUB}   target="_blank" rel="noopener" className="bracket-btn"><span>[</span> GITHUB <span>]</span></a>
            <a href={LINKEDIN} target="_blank" rel="noopener" className="bracket-btn"><span>[</span> LINKEDIN <span>]</span></a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {[
            { num:'3+',   label:'Certificates Earned' },
            { num:'2',    label:'Shipped Projects'    },
            { num:'5+',   label:'Courses Completed'   },
            { num:'2023', label:'Started Journey'     },
          ].map((s, i) => (
            <div key={i} className="stat-block reveal" style={{transitionDelay:`${i*.1}s`}}>
              <div className="font-bebas text-4xl md:text-6xl" style={{color:'#6366F1'}}>{s.num}</div>
              <div className="meta-label mt-2">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Skills ── */
const expertise = [
  { n:'01', title:'Python',                      desc:'Data manipulation, scripting, and automation — from basic scripts to academic ML projects.' },
  { n:'02', title:'C++',                          desc:'Strong foundation in OOP, memory management, and algorithmic problem-solving.' },
  { n:'03', title:'Data Structures & Algorithms', desc:'Core CS fundamentals applied to competitive programming and efficient solution design.' },
  { n:'04', title:'Game Development',             desc:'2D game design and development using Unity with hands-on project experience.' },
  { n:'05', title:'Communication & Teamwork',     desc:'Effective communicator and collaborative team player with a disciplined, proactive mindset.' },
];

function Skills() {
  return (
    <section id="skills" className="py-28 px-6 md:px-10">
      <div className="flex items-end justify-between mb-14 reveal">
        <div>
          <p className="meta-label mb-2">WHAT I KNOW</p>
          <h2 className="font-bebas text-[clamp(3rem,7vw,7rem)] leading-none">SKILLS</h2>
        </div>
      </div>

      <div>
        {expertise.map((s, i) => (
          <div key={i} className="exp-item reveal py-6 md:py-8 group cursor-none"
            style={{transitionDelay:`${i*.07}s`}}>
            <div className="flex items-start md:items-center justify-between gap-4">
              <div className="flex items-start md:items-center gap-6 md:gap-10">
                <span className="exp-num">{s.n}</span>
                <h3 className="font-bebas text-3xl md:text-5xl text-white group-hover:text-indigo-400 transition-colors tracking-wide">
                  {s.title}
                </h3>
              </div>
              <p className="hidden md:block text-white/40 font-dm text-sm max-w-sm text-right leading-relaxed">{s.desc}</p>
              <span className="text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity text-2xl ml-2">→</span>
            </div>
            <p className="md:hidden text-white/40 font-dm text-xs mt-3 leading-relaxed pl-12">{s.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 reveal">
        <p className="meta-label mb-6">TECHNOLOGIES</p>
        <div className="flex flex-wrap gap-3">
          {['Python','C++','Data Structures','Algorithms','Unity','C#','HTML','CSS','JavaScript','Git','English'].map(t => (
            <span key={t} className="stack-pill">{t}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Certificates & Courses ── */
const certificates = [
  { title:'Game Programming With Unity Certificate', issuer:'Unity / Academic',       year:'2024' },
  { title:'Zephyr-2024',                             issuer:'Competition Certificate', year:'2024' },
  { title:'Scientillation Certificate',              issuer:'Academic Event',          year:'2024' },
  { title:'Victory 24',                              issuer:'Academic Achievement',    year:'2024' },
];
const courses = ['Cyber Security','Data Science','Spoken Tutorial','CRT','Game Programming'];

function CertsAndCourses() {
  return (
    <section id="certs" className="py-28 px-6 md:px-10 relative overflow-hidden">
      <span className="absolute -left-4 top-8 font-bebas text-[20vw] text-white/[0.03] leading-none select-none pointer-events-none">03</span>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <div>
          <p className="meta-label reveal mb-3">ACHIEVEMENTS</p>
          <h2 className="font-bebas text-[clamp(2.5rem,5vw,5rem)] leading-none reveal mb-10">CERTIFICATES</h2>
          <div className="flex flex-col gap-4">
            {certificates.map((c, i) => (
              <div key={i} className="cert-card reveal" style={{transitionDelay:`${i*.08}s`}}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-dm text-sm text-white font-medium leading-snug">{c.title}</div>
                    <div className="meta-label mt-1">{c.issuer}</div>
                  </div>
                  <span className="font-mono text-xs" style={{color:'#6366F1',whiteSpace:'nowrap'}}>{c.year}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="meta-label reveal mb-3">LEARNING PATH</p>
          <h2 className="font-bebas text-[clamp(2.5rem,5vw,5rem)] leading-none reveal mb-10">COURSES</h2>
          <div className="flex flex-wrap gap-3 reveal">
            {courses.map((c, i) => <span key={i} className="course-pill">{c}</span>)}
          </div>
          <div className="mt-10 reveal">
            <p className="text-white/40 font-dm text-sm leading-relaxed">
              Continuously upskilling through structured courses and certifications,
              covering cybersecurity fundamentals, data science pipelines, and
              game programming best practices.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Ticker ── */
function Ticker() {
  const items = ['PYTHON','C++','AI & DS','GAME DEV','DATA STRUCTURES','UNITY','MACHINE LEARNING','OPEN TO WORK'];
  const doubled = [...items, ...items];
  return (
    <div className="py-5 overflow-hidden" style={{borderTop:'1px solid rgba(255,255,255,.06)',borderBottom:'1px solid rgba(255,255,255,.06)'}}>
      <div className="ticker-inner">
        {doubled.map((t, i) => (
          <span key={i} className="inline-flex items-center gap-6 px-6 font-bebas text-2xl md:text-3xl tracking-widest">
            {t} <span className="text-lg" style={{color:'#6366F1'}}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Contact ── */
function Contact() {
  const [form, setForm] = useState({name:'',email:'',msg:''});
  const [toast, setToast] = useState({ msg:'', type:'success' });
  const [loading, setLoading] = useState(false);

  const handle = e => setForm(f => ({...f,[e.target.name]:e.target.value}));

  const showToast = (msg, type='success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg:'', type:'success' }), 3500);
  };

  const submit = () => {
    if (!form.name.trim())  return showToast('Please enter your name.', 'error');
    if (!form.email.trim() || !form.email.includes('@')) return showToast('Please enter a valid email.', 'error');
    if (!form.msg.trim())   return showToast('Please enter a message.', 'error');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setForm({name:'',email:'',msg:''});
      showToast('Message sent! I\'ll get back to you soon. ✦');
    }, 900);
  };

  return (
    <section id="contact" className="py-28 px-6 md:px-10 relative overflow-hidden">
      <span className="absolute -left-4 bottom-0 font-bebas text-[20vw] text-white/[0.03] leading-none select-none pointer-events-none">04</span>

      <Toast msg={toast.msg} type={toast.type} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <div>
          <p className="meta-label reveal mb-3">GET IN TOUCH</p>
          <h2 className="font-bebas text-[clamp(3rem,7vw,7rem)] leading-none reveal mb-8">
            LET'S<br />CONNECT
          </h2>
          <div className="w-12 h-px reveal mb-8" style={{background:'#6366F1'}} />
          <p className="text-white/45 font-dm text-sm leading-relaxed reveal max-w-xs">
            Have an interesting project, an internship opportunity, or just want to say hi?
            I'm always open to a conversation.
          </p>

          <div className="mt-10 reveal">
            <div className="meta-label mb-1">EMAIL</div>
            <a href={`mailto:${EMAIL}`} className="font-dm text-sm text-white hover:text-indigo-400 transition-colors">
              {EMAIL}
            </a>
          </div>
          <div className="mt-6 reveal">
            <div className="meta-label mb-1">PHONE</div>
            <a href={`tel:${PHONE}`} className="font-dm text-sm text-white/55 hover:text-indigo-400 transition-colors">
              +91 7014662680
            </a>
          </div>
          <div className="mt-6 reveal">
            <div className="meta-label mb-1">LOCATION</div>
            <p className="font-dm text-sm text-white/55">Jaipur, Rajasthan, India — 302028</p>
          </div>

          {/* Social links */}
          <div className="flex flex-wrap gap-4 mt-10 reveal">
            <a href={GITHUB} target="_blank" rel="noopener" className="bracket-btn text-xs">
              <span>[</span> GITHUB <span>]</span>
            </a>
            <a href={LINKEDIN} target="_blank" rel="noopener" className="bracket-btn text-xs">
              <span>[</span> LINKEDIN <span>]</span>
            </a>
            <a href={`mailto:${EMAIL}`} className="bracket-btn text-xs">
              <span>[</span> EMAIL <span>]</span>
            </a>
          </div>
        </div>

        {/* Contact form */}
        <div className="flex flex-col gap-6 reveal">
          <input name="name" value={form.name} onChange={handle}
            className="contact-input" placeholder="Your Name" />
          <input name="email" value={form.email} onChange={handle}
            className="contact-input" placeholder="Your Email" />
          <textarea name="msg" value={form.msg} onChange={handle}
            className="contact-input resize-none" rows={5}
            placeholder="Tell me about the opportunity..." />
          <div className="mt-2">
            <button id="send-message-btn" onClick={submit} disabled={loading}
              className="bracket-btn text-base px-8 py-4 transition-colors"
              style={{border:'1px solid rgba(255,255,255,.2)', opacity: loading ? .6 : 1}}>
              <span>[</span> {loading ? 'SENDING...' : 'SEND MESSAGE'} <span>]</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Footer ── */
function Footer() {
  return (
    <footer className="px-6 md:px-10 py-8 flex flex-col md:flex-row items-center justify-between gap-4"
      style={{borderTop:'1px solid rgba(255,255,255,.06)'}}>
      <span className="font-mono text-xs text-white/25 tracking-widest">URVANSH © 2025</span>
      <div className="flex gap-6">
        <a href={GITHUB}   target="_blank" rel="noopener" className="font-mono text-xs text-white/25 tracking-widest hover:text-indigo-400 transition-colors">GITHUB</a>
        <a href={LINKEDIN} target="_blank" rel="noopener" className="font-mono text-xs text-white/25 tracking-widest hover:text-indigo-400 transition-colors">LINKEDIN</a>
      </div>
      <span className="font-mono text-xs text-white/25 tracking-widest">OPEN TO INTERNSHIPS @.2025</span>
    </footer>
  );
}

/* ── App ── */
function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  useReveal();
  useCursor();
  return (
    <>
      <Nav menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MobileMenu open={menuOpen} setOpen={setMenuOpen} />
      <BackToTop />
      <main>
        <Hero />
        <Ticker />
        <Works />
        <About />
        <Skills />
        <CertsAndCourses />
        <Ticker />
        <Contact />
        <Footer />
      </main>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
