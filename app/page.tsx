import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden selection:bg-indigo-500 selection:text-white">
      
      {/* Background Ambient Glow Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center max-w-6xl mx-auto w-full px-6 py-6 border-b border-slate-800/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-extrabold px-3.5 py-1.5 rounded-xl text-sm tracking-wide shadow-lg shadow-indigo-500/20">
            SIH26190
          </span>
          <h1 className="text-xl font-black tracking-tight text-white">DocVault <span className="text-indigo-400 font-light">LEGAL</span></h1>
        </div>
        <div className="flex gap-3">
          <Link href="/login" className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 rounded-xl text-sm font-medium transition shadow-sm">
            Investigator Login
          </Link>
          <Link href="/portfolio" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition shadow-lg shadow-indigo-600/25">
            Public Evidence Packets
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-5xl mx-auto w-full my-16 px-6 text-center space-y-8">
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs px-4 py-2 rounded-full font-semibold uppercase tracking-wider backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          Ministry of Home Affairs Enterprise Solution
        </div>
        
        <h2 className="text-4xl sm:text-7xl font-black text-white tracking-tight leading-[1.1]">
          Secure Digital Legal Documents & <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent">Verifiable Chain of Custody</span>
        </h2>
        
        <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto font-normal leading-relaxed">
          Eliminating fragmented physical files, paper evidence approvals, and tampered records with a cryptographically secure audit trail.
        </p>

        {/* Before vs After Grid with Glassmorphism */}
        <div className="grid md:grid-cols-2 gap-6 text-left mt-16">
          <div className="bg-slate-900/60 backdrop-blur-xl border border-red-500/20 p-8 rounded-3xl relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl pointer-events-none" />
            <div className="text-red-400 font-bold text-xs tracking-widest uppercase mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500" /> The Problem (Before)
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Vulnerable & Fragmented Records</h3>
            <ul className="space-y-3 text-slate-400 text-sm">
              <li className="flex items-start gap-2"><span>•</span> Paper case files, FIRs, & loose PDF evidence scattered across independent jurisdictions.</li>
              <li className="flex items-start gap-2"><span>•</span> Manual verification bottlenecks and lack of real-time tracking during active proceedings.</li>
              <li className="flex items-start gap-2"><span>•</span> Risk of tampered or fabricated legal evidence causing severe judicial trust gaps.</li>
            </ul>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-xl border border-emerald-500/20 p-8 rounded-3xl relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
            <div className="text-emerald-400 font-bold text-xs tracking-widest uppercase mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Our Solution (After)
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Cryptographic Evidence Ecosystem</h3>
            <ul className="space-y-3 text-slate-300 text-sm">
              <li className="flex items-start gap-2"><span>•</span> Instant officer uploads featuring automated SHA-256 duplicate & tamper checks.</li>
              <li className="flex items-start gap-2"><span>•</span> Supervisory quick-action review queue with zero-friction audit trails.</li>
              <li className="flex items-start gap-2"><span>•</span> Instant digital case file export with embedded QR verification for judicial review.</li>
            </ul>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8">
          <Link href="/login" className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-2xl shadow-xl shadow-indigo-600/30 transition transform hover:-translate-y-0.5">
            Access Officer Portal & Sign In →
          </Link>
          <Link href="/portfolio" className="px-8 py-4 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-200 font-bold rounded-2xl transition backdrop-blur-md">
            View Sample Verifiable Evidence Packet
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center text-slate-500 text-xs py-6 border-t border-slate-900 backdrop-blur-md">
        SIH26190 · Secure Digital Legal Documents & Verifiable Chain of Custody System
      </footer>
    </div>
  );
}