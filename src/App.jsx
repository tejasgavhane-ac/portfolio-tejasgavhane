import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import {
  Menu, X, Download, ExternalLink, Github, Linkedin, Mail,
  MapPin, ChevronDown, Award, Briefcase, BookOpen, Code2,
  TrendingUp, FileText, Send, CheckCircle, AlertCircle,
  BarChart3, DollarSign, Calculator, Globe, Phone,
  ArrowRight, Star, Shield, Layers, Database
} from 'lucide-react'

// ─── DATA ────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Certifications', href: '#certifications' },
  { label: 'Resume', href: '#resume' },
  { label: 'Contact', href: '#contact' },
]

const SKILLS = {
  'SAP S/4HANA FICO': [
    { name: 'General Ledger (G/L) Accounting', level: 90 },
    { name: 'Accounts Payable (AP)', level: 92 },
    { name: 'Accounts Receivable (AR)', level: 88 },
    { name: 'Asset Accounting (AA)', level: 80 },
    { name: 'Bank Accounting & Reconciliation', level: 85 },
    { name: 'Cost Center Accounting', level: 78 },
    { name: 'Automatic Payment Program (APP)', level: 82 },
    { name: 'Foreign Exchange (FOREX)', level: 72 },
  ],
  'Financial Accounting': [
    { name: 'GST Compliance & Filing', level: 88 },
    { name: 'TDS / Withholding Tax', level: 82 },
    { name: 'Financial Reporting & Analysis', level: 85 },
    { name: 'P2P (Procure-to-Pay)', level: 90 },
    { name: 'O2C (Order-to-Cash)', level: 87 },
    { name: 'R2R (Record-to-Report)', level: 80 },
  ],
  'Tools & Technology': [
    { name: 'MS Excel (VLOOKUP, Pivot Tables)', level: 90 },
    { name: 'Tally ERP 9 / Tally Prime', level: 85 },
    { name: 'SAP MM & SD Integration', level: 72 },
    { name: 'CRM Systems', level: 75 },
    { name: 'MS Word & PowerPoint', level: 88 },
  ],
}

const EXPERIENCE = [
  {
    role: 'Account & Sales Finance Executive',
    company: 'Icom Industries',
    period: 'January 2022 – Present',
    location: 'Pune, Maharashtra',
    type: 'Full-Time',
    icon: Briefcase,
    highlights: [
      'Managed end-to-end sales communication and correspondence with domestic and international customers',
      'Prepared, processed, and tracked quotations and sales orders with real-time payment follow-ups',
      'Handled purchase orders, account entries, and ERP-based order execution workflows',
      'Generated comprehensive sales reports and maintained accurate financial transaction records',
      'Supported finance operations in P2P (vendor invoice processing), O2C (customer billing & collections), and R2R (journal entries, reconciliation)',
      'Ensured compliance with GST regulations and assisted in monthly tax filing processes',
    ],
  },
]

const PROJECTS = [
  {
    title: 'SAP FICO End-to-End Implementation',
    subtitle: 'Charminar Steel Castings Ltd.',
    description: 'Hands-on SAP FICO configuration and implementation project covering the complete enterprise financial structure from Company Organization setup through advanced accounting modules.',
    tags: ['SAP S/4HANA', 'FICO', 'GL', 'AP', 'AR', 'Asset Accounting'],
    modules: [
      'Company Organization Structure', 'General Ledger (G/L)',
      'Accounts Payable (AP)', 'Accounts Receivable (AR)',
      'Taxation (GST) & Withholding Tax', 'House Bank Configuration',
      'Petty Cash Book', 'Automatic Payment Program',
      'Foreign Exchange Management', 'Asset Accounting',
      'Cost Center (Internal Cost Center)',
    ],
    icon: Database,
    color: 'from-blue-600 to-navy-800',
  },
  {
    title: 'Financial Process Optimization',
    subtitle: 'Icom Industries',
    description: 'Designed and implemented streamlined P2P, O2C, and R2R financial workflows, reducing processing time and improving accuracy in financial reporting across the organization.',
    tags: ['P2P', 'O2C', 'R2R', 'ERP', 'Process Design'],
    modules: [
      'Procure-to-Pay Workflow Automation', 'Order-to-Cash Pipeline',
      'Month-End Close Procedures', 'Bank Reconciliation Framework',
      'GST Return Preparation', 'Vendor Ledger Management',
    ],
    icon: TrendingUp,
    color: 'from-emerald-700 to-navy-800',
  },
]

const CERTIFICATIONS = [
  {
    title: 'SAP FICO (S/4HANA)',
    issuer: 'D-Tech Point IT/ERP Training Institute',
    status: 'Completed',
    statusColor: 'text-yellow-400',
    icon: '🏆',
    desc: 'Comprehensive SAP S/4HANA Financial Accounting & Controlling module training with hands-on configuration and functional expertise.',
  },
  {
    title: 'Tally ERP 9 / Tally Prime with GST',
    issuer: 'Professional Certification',
    status: 'Completed',
    statusColor: 'text-emerald-400',
    icon: '📊',
    desc: 'Basic to Intermediate proficiency in Tally ERP 9 and Tally Prime including GST compliance, invoicing, and accounting workflows.',
  },
  {
    title: 'MS Office Suite',
    issuer: 'Professional Proficiency',
    status: 'Certified',
    statusColor: 'text-emerald-400',
    icon: '💼',
    desc: 'Advanced Excel including VLOOKUP, Pivot Tables, financial modelling; professional-grade Word and PowerPoint skills.',
  },
  {
    title: 'Bachelor of Commerce (B.Com)',
    issuer: 'Dr. Babasaheb Ambedkar Marathwada University',
    status: 'Completed — June 2017 to March 2020',
    statusColor: 'text-blue-400',
    icon: '🎓',
    desc: 'Specialization in Bookkeeping and Accounting. Foundational knowledge in financial principles, taxation, auditing, and business law.',
  },
  {
    title: 'MBA — Finance',
    issuer: 'Pursuing',
    status: 'In Progress',
    statusColor: 'text-yellow-400',
    icon: '📚',
    desc: 'Master of Business Administration with Finance specialization — deepening strategic finance, investment analysis, and corporate financial management expertise.',
  },
]

// ─── ANIMATION VARIANTS ───────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }
  }),
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } },
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function AnimatedSection({ children, className = '' }) {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={fadeUp}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function SectionHeader({ title, subtitle, accent }) {
  return (
    <div className="mb-16">
      <div className="section-divider" />
      <p className="text-gold-500 font-mono text-sm tracking-[0.2em] uppercase mb-2">{accent}</p>
      <h2 className="font-display text-4xl md:text-5xl font-light text-white mb-4">{title}</h2>
      {subtitle && <p className="text-slate-400 max-w-2xl font-body leading-relaxed">{subtitle}</p>}
    </div>
  )
}

// ─── NAVBAR ──────────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [active, setActive] = useState('#home')

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40)
      const sections = NAV_LINKS.map(l => l.href.replace('#', ''))
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id)
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActive('#' + id)
          break
        }
      }
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-navy-950/95 backdrop-blur-md border-b border-gold-500/10 shadow-2xl'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-3 group">
          <div className="w-9 h-9 bg-gold-500 rounded-sm flex items-center justify-center font-display font-bold text-navy-900 text-sm group-hover:glow-gold transition-all">
            TG
          </div>
          <span className="font-display text-white text-lg font-medium hidden sm:block">
            Tejas Gavhane
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map(link => (
            <a
              key={link.href}
              href={link.href}
              className={`nav-link font-body text-sm transition-colors ${
                active === link.href ? 'text-gold-400 active' : 'text-slate-400 hover:text-white'
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <a
          href="#contact"
          className="hidden lg:flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-900 font-body font-semibold text-sm px-5 py-2 rounded-sm transition-all hover:shadow-lg hover:shadow-gold-500/20"
        >
          Hire Me <ArrowRight size={14} />
        </a>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden text-white p-1"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-navy-900/98 backdrop-blur-md border-t border-gold-500/10"
          >
            <div className="px-6 py-4 space-y-1">
              {NAV_LINKS.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block py-3 text-slate-300 hover:text-gold-400 font-body text-sm border-b border-navy-800 transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setMobileOpen(false)}
                className="block mt-4 bg-gold-500 text-navy-900 font-semibold text-sm px-4 py-3 rounded text-center"
              >
                Hire Me
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

// ─── HERO SECTION ─────────────────────────────────────────────────────────────

function HeroSection() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 120])

  const particles = Array.from({ length: 12 }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: i * 0.4,
    size: Math.random() * 3 + 1,
  }))

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950" />
      <div className="absolute inset-0 grid-texture opacity-60" />
      <div className="absolute inset-0 ledger-pattern opacity-40" />

      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Decorative chart bars */}
      <motion.div style={{ y }} className="absolute bottom-0 right-0 flex items-end gap-2 opacity-10 p-8 pr-16">
        {[60, 85, 45, 95, 70, 80, 55, 90, 65, 75].map((h, i) => (
          <motion.div
            key={i}
            className="w-4 bg-gold-500 rounded-t chart-bar"
            style={{ height: `${h * 3}px`, animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </motion.div>

      {/* Floating particles */}
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-gold-500"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{ y: [0, -20, 0], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 5 + Math.random() * 3, repeat: Infinity, delay: p.delay }}
        />
      ))}

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text content */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="h-px w-12 bg-gold-500" />
              <span className="text-gold-400 font-mono text-xs tracking-[0.25em] uppercase">
                Finance Professional & SAP Consultant
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35 }}
              className="font-display text-6xl md:text-7xl lg:text-7xl font-light text-white leading-none mb-6"
            >
              Tejas<br />
              <span className="shimmer-gold font-semibold">Gavhane</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-slate-300 text-xl font-body font-light leading-relaxed mb-6 max-w-lg italic"
            >
              "Bridging Financial Intelligence with SAP S/4HANA Excellence"
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.65 }}
              className="text-slate-400 font-body leading-relaxed mb-10 max-w-lg"
            >
              Detail-oriented Account & Finance Executive with expertise in SAP S/4HANA FICO configuration,
              financial reporting, GST compliance, and ERP-driven financial operations.
              Currently advancing with an MBA in Finance.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.75 }}
              className="flex gap-8 mb-10"
            >
              {[
                { value: '3+', label: 'Years Experience' },
                { value: 'SAP', label: 'S/4HANA FICO' },
                { value: 'MBA', label: 'Finance (Pursuing)' },
              ].map(stat => (
                <div key={stat.label}>
                  <div className="font-display text-3xl font-semibold text-gold-400">{stat.value}</div>
                  <div className="text-slate-500 text-xs font-body mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.85 }}
              className="flex flex-wrap gap-4"
            >
              <a
                href="#contact"
                className="flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-900 font-body font-semibold px-7 py-3 rounded-sm transition-all hover:shadow-xl hover:shadow-gold-500/25 hover:scale-105"
              >
                Get In Touch <ArrowRight size={16} />
              </a>
              <a
                href="/portfolio-tejasgavhane/resume.pdf"
                download="Tejas_Gavhane_Resume.pdf"
                className="flex items-center gap-2 border border-gold-500/40 hover:border-gold-400 text-gold-400 hover:text-gold-300 font-body font-medium px-7 py-3 rounded-sm transition-all hover:bg-gold-500/5"
              >
                <Download size={16} /> Download CV
              </a>
            </motion.div>

            {/* Social links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 1 }}
              className="flex items-center gap-5 mt-10"
            >
              <a href="https://www.linkedin.com/in/tejas-gavhane-1b5425329" target="_blank" rel="noopener noreferrer"
                className="text-slate-500 hover:text-gold-400 transition-colors p-1">
                <Linkedin size={20} />
              </a>
              <a href="https://github.com/tejasgavhane-ac/portfoliotejasgavhane" target="_blank" rel="noopener noreferrer"
                className="text-slate-500 hover:text-gold-400 transition-colors p-1">
                <Github size={20} />
              </a>
              <a href="mailto:tejas.gavhane0107@gmail.com"
                className="text-slate-500 hover:text-gold-400 transition-colors p-1">
                <Mail size={20} />
              </a>
              <div className="h-4 w-px bg-slate-700 mx-1" />
              <span className="text-slate-600 font-mono text-xs">Pune, India</span>
            </motion.div>
          </div>

          {/* Right side — Profile visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="hidden lg:block relative"
          >
            <div className="relative">
              {/* Main card */}
              <div className="bg-navy-800/60 backdrop-blur border border-gold-500/15 rounded-2xl p-8 relative overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 grid-texture opacity-50" />

                {/* Profile area */}
                <div className="relative z-10 text-center mb-8">
                  <div className="w-28 h-28 rounded-full bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center text-navy-900 font-display text-5xl font-semibold mx-auto mb-4 shadow-xl shadow-gold-500/20">
                    TG
                  </div>
                  <h3 className="font-display text-2xl text-white mb-1">Tejas Gavhane</h3>
                  <p className="text-gold-400 text-sm font-body">Account & Finance Executive</p>
                  <div className="flex items-center justify-center gap-2 text-slate-500 text-xs mt-2">
                    <MapPin size={12} /> Pune, Maharashtra, India
                  </div>
                </div>

                {/* Key expertise pills */}
                <div className="grid grid-cols-2 gap-2 relative z-10">
                  {[
                    { icon: BarChart3, label: 'SAP S/4HANA FICO' },
                    { icon: DollarSign, label: 'AP / AR / GL' },
                    { icon: Calculator, label: 'GST & TDS' },
                    { icon: TrendingUp, label: 'Financial Reporting' },
                    { icon: Database, label: 'ERP / CRM' },
                    { icon: Layers, label: 'P2P · O2C · R2R' },
                  ].map(item => (
                    <div key={item.label} className="flex items-center gap-2 bg-navy-900/60 border border-navy-700 rounded-lg px-3 py-2.5 text-xs text-slate-300">
                      <item.icon size={13} className="text-gold-500 flex-shrink-0" />
                      {item.label}
                    </div>
                  ))}
                </div>

                {/* Status badge */}
                <div className="absolute top-4 right-4 flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-400 text-xs font-body">Open to Opportunities</span>
                </div>
              </div>

              {/* Floating mini cards */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-4 -left-6 bg-navy-800 border border-gold-500/20 rounded-xl px-4 py-3 shadow-xl"
              >
                <div className="text-gold-400 font-mono text-xs font-medium">SAP FICO</div>
                <div className="text-white font-display text-lg font-semibold">S/4HANA</div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute -bottom-4 -right-6 bg-navy-800 border border-gold-500/20 rounded-xl px-4 py-3 shadow-xl"
              >
                <div className="text-slate-500 text-xs font-body">Education</div>
                <div className="text-white text-sm font-medium">MBA Finance</div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-600"
        >
          <span className="font-mono text-xs tracking-widest">SCROLL</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
            <ChevronDown size={18} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── ABOUT SECTION ────────────────────────────────────────────────────────────

function AboutSection() {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <section id="about" className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950 to-navy-900" />
      <div className="absolute inset-0 grid-texture opacity-30" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <AnimatedSection>
          <SectionHeader
            accent="Who I Am"
            title="About Me"
            subtitle="A results-driven finance professional with a passion for leveraging technology to drive financial excellence."
          />
        </AnimatedSection>

        <div ref={ref} className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left — Bio */}
          <motion.div
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={fadeUp}
          >
            <p className="text-slate-300 font-body leading-relaxed mb-6 text-base">
              I am a detail-oriented <span className="text-gold-400 font-medium">Account & Finance Operation Executive</span> based
              in Pune, Maharashtra, with over three years of hands-on experience in financial accounting, ERP operations,
              and SAP-based financial workflows.
            </p>
            <p className="text-slate-400 font-body leading-relaxed mb-6">
              My expertise spans the full financial spectrum — from managing <strong className="text-white">Accounts Payable (AP)</strong>,
              <strong className="text-white"> Accounts Receivable (AR)</strong>, and <strong className="text-white">General Ledger (GL)</strong> entries
              to ensuring GST and TDS compliance in dynamic, fast-paced environments.
            </p>
            <p className="text-slate-400 font-body leading-relaxed mb-8">
              Currently pursuing an <span className="text-gold-400 font-medium">MBA in Finance</span> and actively advancing my
              <span className="text-gold-400 font-medium"> SAP S/4HANA FICO</span> certification through rigorous training at
              D-Tech Point IT/ERP Training Institute — positioning myself at the intersection of financial expertise and enterprise technology.
            </p>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Location', value: 'Pune, Maharashtra, India' },
                { label: 'Email', value: 'tejas.gavhane0107@gmail.com' },
                { label: 'Phone', value: '+91-8408019612' },
                { label: 'Availability', value: 'Open to Opportunities' },
              ].map(item => (
                <div key={item.label} className="bg-navy-800/40 border border-navy-700 rounded-lg p-4">
                  <div className="text-gold-500 font-mono text-xs mb-1 uppercase tracking-widest">{item.label}</div>
                  <div className="text-white font-body text-sm">{item.value}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — Values / Traits */}
          <motion.div
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={{ hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, delay: 0.2 } } }}
            className="space-y-4"
          >
            {[
              {
                icon: Shield,
                title: 'Compliance First',
                desc: 'Rigorous approach to GST, TDS, and financial compliance, ensuring all processes meet statutory requirements with zero exceptions.',
              },
              {
                icon: BarChart3,
                title: 'Data-Driven Reporting',
                desc: 'Transforming raw financial data into actionable insights through structured reports, reconciliations, and ledger management.',
              },
              {
                icon: Database,
                title: 'SAP-Powered Operations',
                desc: 'Leveraging SAP S/4HANA FICO capabilities to automate, streamline, and optimize enterprise-level financial workflows.',
              },
              {
                icon: TrendingUp,
                title: 'Continuous Growth',
                desc: 'Committed to professional development through SAP certification and MBA Finance — staying ahead in an evolving financial landscape.',
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                custom={i}
                variants={fadeUp}
                className="flex gap-4 p-5 bg-navy-800/40 border border-navy-700 rounded-xl card-hover"
              >
                <div className="w-10 h-10 bg-gold-500/10 border border-gold-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <item.icon size={18} className="text-gold-400" />
                </div>
                <div>
                  <div className="text-white font-body font-medium mb-1">{item.title}</div>
                  <div className="text-slate-400 text-sm font-body leading-relaxed">{item.desc}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ─── SKILLS SECTION ───────────────────────────────────────────────────────────

function SkillBar({ name, level, index }) {
  const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: true })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { delay: index * 0.08 } } }}
      className="mb-5"
    >
      <div className="flex justify-between mb-2">
        <span className="text-slate-300 font-body text-sm">{name}</span>
        <span className="text-gold-400 font-mono text-xs">{level}%</span>
      </div>
      <div className="h-1.5 bg-navy-700 rounded-full overflow-hidden">
        <motion.div
          className="h-full skill-bar"
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : { width: 0 }}
          transition={{ duration: 1.2, delay: index * 0.08 + 0.3, ease: [0.22, 0.61, 0.36, 1] }}
        />
      </div>
    </motion.div>
  )
}

function SkillsSection() {
  const [activeTab, setActiveTab] = useState(Object.keys(SKILLS)[0])

  return (
    <section id="skills" className="py-28 relative">
      <div className="absolute inset-0 bg-navy-950" />
      <div className="absolute inset-0 grid-texture opacity-40" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <AnimatedSection>
          <SectionHeader
            accent="Expertise"
            title="Technical Skills"
            subtitle="A comprehensive skill-set spanning SAP S/4HANA FICO configuration, financial accounting, and enterprise tools."
          />
        </AnimatedSection>

        {/* Tab switcher */}
        <AnimatedSection>
          <div className="flex flex-wrap gap-2 mb-12">
            {Object.keys(SKILLS).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`font-body text-sm px-5 py-2.5 rounded-sm transition-all ${
                  activeTab === tab
                    ? 'bg-gold-500 text-navy-900 font-semibold'
                    : 'border border-navy-600 text-slate-400 hover:border-gold-500/40 hover:text-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-x-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="col-span-2 grid md:grid-cols-2 gap-x-16"
            >
              {SKILLS[activeTab].map((skill, i) => (
                <SkillBar key={skill.name} name={skill.name} level={skill.level} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Additional tags */}
        <AnimatedSection className="mt-16">
          <div className="border-t border-navy-800 pt-10">
            <p className="text-slate-500 font-mono text-xs uppercase tracking-widest mb-5">Accounting Processes</p>
            <div className="flex flex-wrap gap-2">
              {[
                'General Ledger', 'Accounts Payable', 'Accounts Receivable',
                'Asset Accounting', 'Bank Reconciliation', 'GST Filing',
                'TDS / Withholding Tax', 'P2P Workflow', 'O2C Cycle',
                'R2R Reporting', 'Month-End Close', 'Financial Statements',
                'Cost Center Accounting', 'Petty Cash', 'Vendor Management',
                'Customer Billing', 'Journal Entries', 'Trial Balance'
              ].map(tag => (
                <span key={tag} className="tag-badge">{tag}</span>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}

// ─── EXPERIENCE SECTION ───────────────────────────────────────────────────────

function ExperienceSection() {
  return (
    <section id="experience" className="py-28 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-navy-900 to-navy-950" />
      <div className="absolute inset-0 ledger-pattern opacity-30" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <AnimatedSection>
          <SectionHeader
            accent="Work History"
            title="Professional Experience"
            subtitle="A proven track record of financial operations, ERP management, and stakeholder collaboration."
          />
        </AnimatedSection>

        <div className="space-y-8">
          {EXPERIENCE.map((exp, i) => (
            <AnimatedSection key={i}>
              <motion.div
                whileHover={{ scale: 1.005 }}
                className="bg-navy-800/40 border border-navy-700 hover:border-gold-500/30 rounded-2xl p-8 transition-all card-hover"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 bg-gold-500/10 border border-gold-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <exp.icon size={22} className="text-gold-400" />
                    </div>
                    <div>
                      <h3 className="font-display text-2xl text-white font-medium">{exp.role}</h3>
                      <p className="text-gold-400 font-body font-medium">{exp.company}</p>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-slate-500 text-sm">
                        <span className="flex items-center gap-1"><MapPin size={13} />{exp.location}</span>
                        <span className="tag-badge">{exp.type}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-navy-900 border border-navy-700 rounded-lg px-4 py-2 text-sm font-mono text-gold-400 whitespace-nowrap">
                    {exp.period}
                  </div>
                </div>

                <div className="border-t border-navy-700 pt-6">
                  <p className="text-gold-500 font-mono text-xs uppercase tracking-widest mb-4">Key Responsibilities</p>
                  <ul className="space-y-3">
                    {exp.highlights.map((point, j) => (
                      <li key={j} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-gold-500 mt-2 flex-shrink-0" />
                        <span className="text-slate-300 font-body text-sm leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── PROJECTS SECTION ─────────────────────────────────────────────────────────

function ProjectsSection() {
  return (
    <section id="projects" className="py-28 relative">
      <div className="absolute inset-0 bg-navy-950" />
      <div className="absolute inset-0 grid-texture opacity-40" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <AnimatedSection>
          <SectionHeader
            accent="Portfolio"
            title="Projects"
            subtitle="Practical implementations of SAP FICO configuration and financial process optimization across real enterprise environments."
          />
        </AnimatedSection>

        <div className="grid lg:grid-cols-2 gap-8">
          {PROJECTS.map((project, i) => (
            <AnimatedSection key={project.title}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                className="bg-navy-800/40 border border-navy-700 hover:border-gold-500/30 rounded-2xl overflow-hidden transition-all h-full"
              >
                {/* Header */}
                <div className={`bg-gradient-to-r ${project.color} p-6 relative overflow-hidden`}>
                  <div className="absolute inset-0 grid-texture opacity-30" />
                  <div className="relative flex items-start justify-between">
                    <div>
                      <project.icon size={28} className="text-gold-300 mb-3" />
                      <h3 className="font-display text-xl text-white font-medium mb-1">{project.title}</h3>
                      <p className="text-gold-300/80 text-sm font-body">{project.subtitle}</p>
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6">
                  <p className="text-slate-400 font-body text-sm leading-relaxed mb-5">{project.description}</p>

                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {project.tags.map(tag => (
                      <span key={tag} className="tag-badge">{tag}</span>
                    ))}
                  </div>

                  <div className="border-t border-navy-700 pt-5">
                    <p className="text-slate-500 font-mono text-xs uppercase tracking-widest mb-3">Modules Covered</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {project.modules.map((mod, j) => (
                        <div key={j} className="flex items-center gap-2 text-slate-400 text-xs font-body">
                          <div className="w-1 h-1 rounded-full bg-gold-500 flex-shrink-0" />
                          {mod}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── CERTIFICATIONS SECTION ───────────────────────────────────────────────────

function CertificationsSection() {
  return (
    <section id="certifications" className="py-28 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950 to-navy-900" />
      <div className="absolute inset-0 ledger-pattern opacity-30" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <AnimatedSection>
          <SectionHeader
            accent="Credentials"
            title="Education & Certifications"
            subtitle="Academic qualifications and professional certifications that underpin financial expertise and SAP competence."
          />
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CERTIFICATIONS.map((cert, i) => (
            <AnimatedSection key={cert.title}>
              <motion.div
                custom={i}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className="bg-navy-800/40 border border-navy-700 hover:border-gold-500/30 rounded-xl p-6 card-hover h-full flex flex-col"
              >
                <div className="text-3xl mb-4">{cert.icon}</div>
                <h3 className="font-body font-semibold text-white mb-1 text-base">{cert.title}</h3>
                <p className="text-slate-500 font-body text-xs mb-3 leading-relaxed">{cert.issuer}</p>
                <span className={`text-xs font-mono font-medium ${cert.statusColor} mb-4`}>{cert.status}</span>
                <p className="text-slate-400 font-body text-sm leading-relaxed mt-auto">{cert.desc}</p>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── RESUME SECTION ───────────────────────────────────────────────────────────

function ResumeSection() {
  const [loaded, setLoaded] = useState(false)

  return (
    <section id="resume" className="py-28 relative">
      <div className="absolute inset-0 bg-navy-950" />
      <div className="absolute inset-0 grid-texture opacity-40" />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <AnimatedSection>
          <SectionHeader
            accent="My CV"
            title="Resume"
            subtitle="View or download my full curriculum vitae — a concise record of qualifications, experience, and competencies."
          />
        </AnimatedSection>

        {/* Action buttons */}
        <AnimatedSection className="flex flex-wrap gap-4 mb-8">
          <a
            href="/portfolio-tejasgavhane/resume.pdf"
            download="Tejas_Gavhane_Resume.pdf"
            className="flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-900 font-body font-semibold px-6 py-3 rounded-sm transition-all hover:shadow-lg hover:shadow-gold-500/20"
          >
            <Download size={16} /> Download Resume (PDF)
          </a>
          <a
            href="/portfolio-tejasgavhane/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 border border-gold-500/40 hover:border-gold-400 text-gold-400 font-body font-medium px-6 py-3 rounded-sm transition-all hover:bg-gold-500/5"
          >
            <ExternalLink size={16} /> Open in New Tab
          </a>
        </AnimatedSection>

        {/* PDF Viewer */}
        <AnimatedSection>
          <div className="pdf-viewer-container relative">
            {!loaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-navy-900 z-10 rounded-lg">
                <div className="text-slate-400 font-body text-sm flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
                  Loading resume...
                </div>
              </div>
            )}
            <iframe
              src="/portfolio-tejasgavhane/resume.pdf"
              title="Tejas Gavhane Resume"
              width="100%"
              height="800px"
              className="rounded-lg"
              onLoad={() => setLoaded(true)}
            />
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}

// ─── CONTACT SECTION ──────────────────────────────────────────────────────────

function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState(null) // 'sending' | 'success' | 'error'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('https://formspree.io/f/xqaqrpob', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setStatus('success')
        setForm({ name: '', email: '', subject: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="py-28 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-navy-900 to-navy-950" />
      <div className="absolute inset-0 ledger-pattern opacity-30" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <AnimatedSection>
          <SectionHeader
            accent="Let's Connect"
            title="Contact Me"
            subtitle="Ready to discuss SAP FICO opportunities, finance roles, or professional collaboration? I'd be delighted to connect."
          />
        </AnimatedSection>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Contact info */}
          <AnimatedSection className="lg:col-span-2 space-y-6">
            {[
              { icon: Mail, label: 'Email', value: 'tejas.gavhane0107@gmail.com', href: 'mailto:tejas.gavhane0107@gmail.com' },
              { icon: Phone, label: 'Phone', value: '+91-8408019612', href: 'tel:+918408019612' },
              { icon: MapPin, label: 'Location', value: 'Dhankawadi, Pune City — 411043\nMaharashtra, India', href: null },
            ].map(item => (
              <div key={item.label} className="flex gap-4 items-start p-5 bg-navy-800/40 border border-navy-700 rounded-xl">
                <div className="w-10 h-10 bg-gold-500/10 border border-gold-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <item.icon size={18} className="text-gold-400" />
                </div>
                <div>
                  <div className="text-slate-500 font-mono text-xs uppercase tracking-widest mb-1">{item.label}</div>
                  {item.href ? (
                    <a href={item.href} className="text-white font-body text-sm hover:text-gold-400 transition-colors">{item.value}</a>
                  ) : (
                    <p className="text-white font-body text-sm whitespace-pre-line">{item.value}</p>
                  )}
                </div>
              </div>
            ))}

            {/* Social links */}
            <div className="p-5 bg-navy-800/40 border border-navy-700 rounded-xl">
              <div className="text-slate-500 font-mono text-xs uppercase tracking-widest mb-4">Professional Profiles</div>
              <div className="flex gap-3">
                <a
                  href="https://www.linkedin.com/in/tejas-gavhane-1b5425329"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 flex-1 bg-blue-700/20 border border-blue-700/30 hover:border-blue-500/50 text-blue-400 font-body text-sm px-4 py-3 rounded-lg transition-all"
                >
                  <Linkedin size={16} /> LinkedIn
                </a>
                <a
                  href="https://github.com/tejasgavhane-ac/portfoliotejasgavhane"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 flex-1 bg-slate-700/20 border border-slate-600/30 hover:border-slate-500/50 text-slate-400 font-body text-sm px-4 py-3 rounded-lg transition-all"
                >
                  <Github size={16} /> GitHub
                </a>
              </div>
            </div>
          </AnimatedSection>

          {/* Contact form */}
          <AnimatedSection className="lg:col-span-3">
            <div className="bg-navy-800/40 border border-navy-700 rounded-2xl p-8">
              <h3 className="font-display text-2xl text-white mb-6">Send a Message</h3>

              {status === 'success' && (
                <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 mb-6 text-emerald-400">
                  <CheckCircle size={18} />
                  <span className="font-body text-sm">Message sent successfully! I'll respond within 24 hours.</span>
                </div>
              )}

              {status === 'error' && (
                <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6 text-red-400">
                  <AlertCircle size={18} />
                  <span className="font-body text-sm">Something went wrong. Please email me directly at tejas.gavhane0107@gmail.com</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-slate-400 font-body text-xs uppercase tracking-widest mb-2">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      placeholder="Your full name"
                      className="input-field w-full px-4 py-3 rounded-lg font-body text-sm placeholder-slate-600"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-body text-xs uppercase tracking-widest mb-2">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      placeholder="your@email.com"
                      className="input-field w-full px-4 py-3 rounded-lg font-body text-sm placeholder-slate-600"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-400 font-body text-xs uppercase tracking-widest mb-2">Subject *</label>
                  <input
                    type="text"
                    required
                    value={form.subject}
                    onChange={e => setForm({ ...form, subject: e.target.value })}
                    placeholder="Job opportunity / Collaboration / Query"
                    className="input-field w-full px-4 py-3 rounded-lg font-body text-sm placeholder-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-body text-xs uppercase tracking-widest mb-2">Message *</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell me about the opportunity or how I can assist you..."
                    className="input-field w-full px-4 py-3 rounded-lg font-body text-sm placeholder-slate-600 resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="flex items-center justify-center gap-2 w-full bg-gold-500 hover:bg-gold-400 disabled:opacity-50 disabled:cursor-not-allowed text-navy-900 font-body font-semibold px-6 py-3.5 rounded-lg transition-all hover:shadow-lg hover:shadow-gold-500/20"
                >
                  {status === 'sending' ? (
                    <>
                      <div className="w-4 h-4 border-2 border-navy-900 border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={16} /> Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-navy-950 border-t border-navy-800 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gold-500 rounded flex items-center justify-center font-display font-bold text-navy-900 text-sm">TG</div>
            <div>
              <div className="font-display text-white text-base">Tejas Gavhane</div>
              <div className="text-slate-500 text-xs font-body">SAP S/4HANA FICO Consultant & Finance Professional</div>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <a href="https://www.linkedin.com/in/tejas-gavhane-1b5425329" target="_blank" rel="noopener noreferrer"
              className="text-slate-600 hover:text-gold-400 transition-colors">
              <Linkedin size={18} />
            </a>
            <a href="https://github.com/tejasgavhane-ac/portfoliotejasgavhane" target="_blank" rel="noopener noreferrer"
              className="text-slate-600 hover:text-gold-400 transition-colors">
              <Github size={18} />
            </a>
            <a href="mailto:tejas.gavhane0107@gmail.com"
              className="text-slate-600 hover:text-gold-400 transition-colors">
              <Mail size={18} />
            </a>
          </div>

          <p className="text-slate-600 font-body text-sm text-center">
            © {new Date().getFullYear()} Tejas Gavhane. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

// ─── APP ──────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <div className="min-h-screen bg-navy-950 text-white">
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ExperienceSection />
        <ProjectsSection />
        <CertificationsSection />
        <ResumeSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
