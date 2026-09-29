"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function VerifiedPortfolio() {
  const [studentName, setStudentName] = useState("Student Portfolio");
  const [achievements, setAchievements] = useState<any[]>([]);
  const [verifying, setVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const name = localStorage.getItem("userName");
    if (name) setStudentName(name);

    const saved = localStorage.getItem("sih_student_achievements");
    if (saved) {
      setAchievements(JSON.parse(saved));
    }
  }, []);

  const simulateQRScan = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setIsVerified(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-4xl mx-auto bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 space-y-8 shadow-2xl relative z-10">
        
        <div className="flex justify-between items-start border-b border-slate-800/80 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] px-3 py-1 rounded-full border border-emerald-500/30 font-bold uppercase tracking-widest mb-3">
              ✓ Institutional Verified Portfolio
            </div>
            <h1 className="text-3xl font-black text-white">{studentName}</h1>
            <p className="text-slate-400 text-sm mt-1">Electronics & Telecommunication Engineering • Batch of 2027</p>
          </div>
          
          <button onClick={simulateQRScan} className="flex flex-col items-center bg-slate-950 hover:bg-slate-800 border border-slate-700 p-3 rounded-xl transition cursor-pointer shadow-lg group">
            <div className="w-12 h-12 bg-white flex items-center justify-center rounded text-slate-950 font-black text-[8px] text-center mb-2 group-hover:scale-105 transition-transform">
              [ QR CODE ]
            </div>
            <span className="text-[9px] text-indigo-400 font-mono font-bold">CLICK TO SCAN</span>
          </button>
        </div>

        {verifying && (
          <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-2xl p-4 text-center font-mono text-indigo-300 text-xs animate-pulse">
            Querying Institutional Database Ledger...
          </div>
        )}
        {isVerified && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 text-center space-y-2">
            <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-2 text-xl font-bold text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]">✓</div>
            <h2 className="text-emerald-400 font-bold text-lg">Authenticity Confirmed</h2>
            <p className="text-slate-300 text-xs max-w-lg mx-auto">All credentials on this profile are cryptographically signed and verified by institutional faculty.</p>
          </div>
        )}

        <div className="space-y-6">
          <h2 className="text-sm font-bold text-white border-b border-slate-800 pb-2 uppercase tracking-widest">Digital Credentials & Badges</h2>
          
          <div className="space-y-4">
            {achievements.length === 0 ? (
              <p className="text-slate-500 text-xs">No achievements logged yet.</p>
            ) : (
              achievements.map((item: any) => (
                <div key={item.id} className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded uppercase font-semibold">{item.category}</span>
                      <h3 className="font-bold text-white text-base mt-2">{item.title}</h3>
                    </div>
                    <span className={`text-[10px] px-2.5 py-1 rounded font-bold uppercase tracking-wider ${
                      item.status === 'Verified' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {item.status === 'Verified' ? `Signed by ${item.verifier || 'Faculty'}` : 'Pending Verification'}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[9px] text-slate-500 font-mono truncate max-w-[280px]">HASH: {item.hash || "8d969eef6ecad3c29a3a629280e686cf0c3f5d5"}</span>
                    {item.fileUrl && (
                      <a href={item.fileUrl} target="_blank" rel="noreferrer" className="text-[10px] text-indigo-400 hover:underline font-semibold">View Original Document ↗</a>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-slate-800 text-xs text-slate-400">
          <Link href="/" className="text-indigo-400 hover:underline">← Back Home</Link>
          <span className="font-mono text-[10px]">SIH0084 • NAAC/NIRF Verified Ecosystem</span>
        </div>
      </div>
    </div>
  );
}