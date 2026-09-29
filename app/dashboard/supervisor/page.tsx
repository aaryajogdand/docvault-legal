"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function OfficerDashboard() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [officerName, setOfficerName] = useState("Lead Supervisory Officer");

  useEffect(() => {
    // Verified against supervisory/officer role
    if (localStorage.getItem("userRole") !== "officer" && localStorage.getItem("userRole") !== "faculty") {
      router.push("/login");
    } else {
      setAuthorized(true);
      setOfficerName(localStorage.getItem("userName") || "Lead Supervisory Officer");
    }
  }, [router]);

  const [queue, setQueue] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sih_officer_queue") || localStorage.getItem("sih_faculty_queue");
      if (saved) return JSON.parse(saved);
    }
    return [];
  });

  const [auditLog, setAuditLog] = useState<string[]>([]);

  useEffect(() => {
    localStorage.setItem("sih_officer_queue", JSON.stringify(queue));
  }, [queue]);

  const handleAction = (id: number, officer: string, action: "Verified & Signed" | "Rejected") => {
    setQueue(queue.filter((item: any) => item.id !== id));

    // Update case evidence records in localStorage
    const evidenceRecords = JSON.parse(
      localStorage.getItem("sih_case_evidence_records") || 
      localStorage.getItem("sih_student_achievements") || 
      "[]"
    );

    const updatedRecords = evidenceRecords.map((rec: any) => {
      if (rec.id === id) {
        return { 
          ...rec, 
          status: action === "Verified & Signed" ? "Cryptographically Verified" : "Rejected", 
          verifier: officerName 
        };
      }
      return rec;
    });

    localStorage.setItem("sih_case_evidence_records", JSON.stringify(updatedRecords));

    setAuditLog([
      `[${new Date().toLocaleTimeString()}] ${officerName} ${action.toUpperCase()} record submitted by ${officer}`,
      ...auditLog,
    ]);
  };

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    router.push("/login");
  };

  if (!authorized)
    return (
      <div className="min-h-screen bg-slate-950 text-slate-400 flex items-center justify-center">
        Authenticating Chain-of-Custody Credentials...
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 relative overflow-hidden">
      <div className="max-w-6xl mx-auto space-y-6 relative z-10">
        <div className="flex justify-between items-center border-b border-slate-800/80 pb-4">
          <div>
            <h1 className="text-2xl font-black text-white">Supervisory & Legal Review Queue</h1>
            <p className="text-slate-400 text-xs mt-0.5">
              Logged in Officer / Verifier:{" "}
              <span className="text-indigo-400 font-semibold">{officerName}</span>
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 bg-red-500/10 text-red-400 text-xs rounded-xl border border-red-500/20 hover:bg-red-500/20 transition-all"
          >
            Logout
          </button>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Pending Evidence Approvals ({queue.length})
          </h2>
          {queue.length === 0 ? (
            <div className="text-center py-12 text-slate-500 bg-slate-950/40 rounded-2xl border border-slate-800">
              <p className="text-sm font-medium">All submitted case evidence records have been processed!</p>
            </div>
          ) : (
            queue.map((item: any) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-950 border border-slate-800 p-5 rounded-2xl gap-4"
              >
                <div>
                  <span className="text-[10px] bg-indigo-500/10 text-indigo-300 px-2.5 py-1 rounded border border-indigo-500/20 font-bold uppercase">
                    {item.category || "Case Document"}
                  </span>
                  <h3 className="text-base font-bold text-white mt-1.5">{item.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Investigating Officer:{" "}
                    <span className="text-slate-200 font-semibold">{item.student || item.investigator || "Field Officer"}</span>
                  </p>
                  {item.fileUrl && (
                    <a
                      href={item.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-400 underline text-xs mt-1 block hover:text-indigo-300"
                    >
                      Inspect Cryptographic Evidence File ↗
                    </a>
                  )}
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleAction(item.id, item.student || item.investigator, "Verified & Signed")}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all"
                  >
                    Verify & Sign Evidence
                  </button>
                  <button
                    onClick={() => handleAction(item.id, item.student || item.investigator, "Rejected")}
                    className="px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold rounded-xl transition-all"
                  >
                    Reject Record
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Cryptographic Chain-of-Custody Audit Log
          </h2>
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-mono text-emerald-400 h-32 overflow-y-auto space-y-1.5">
            {auditLog.length === 0 ? (
              <p className="text-slate-600">No supervisory actions recorded in this active session.</p>
            ) : (
              auditLog.map((log, i) => <p key={i}>{log}</p>)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}