"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function InvestigatorDashboard() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [investigatorName, setInvestigatorName] = useState("Investigating Officer");

  useEffect(() => {
    // Auth check for investigator/student roles
    if (localStorage.getItem("userRole") !== "investigator" && localStorage.getItem("userRole") !== "student") {
      router.push("/login");
    } else {
      setAuthorized(true);
      setInvestigatorName(localStorage.getItem("userName") || "Investigating Officer");
    }
  }, [router]);

  // Load saved evidence records (synced with localStorage & supervisory queue)
  const [evidenceRecords, setEvidenceRecords] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sih_case_evidence_records") || localStorage.getItem("sih_student_achievements");
      if (saved) return JSON.parse(saved);
    }
    return [
      {
        id: 1,
        title: "FIR & Initial Forensic Analysis Report - Case #2026-881",
        category: "FIR / Charge Sheet",
        file: "evidence_forensic.pdf",
        fileUrl: "",
        hash: "8d969eef6ecad3c29a3a789123456789abcdef01",
        date: "2026-08-15",
        status: "Cryptographically Verified",
        verifier: "Lead Inspector General"
      }
    ];
  });

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Evidence Document");
  const [fileName, setFileName] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [fileHash, setFileHash] = useState("");

  // Sync evidence records with local storage
  useEffect(() => {
    localStorage.setItem("sih_case_evidence_records", JSON.stringify(evidenceRecords));
  }, [evidenceRecords]);

  // Periodic sync check to see if supervisor verified an item
  useEffect(() => {
    const interval = setInterval(() => {
      const saved = localStorage.getItem("sih_case_evidence_records") || localStorage.getItem("sih_student_achievements");
      if (saved) setEvidenceRecords(JSON.parse(saved));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      setFileUrl(URL.createObjectURL(file)); // Local viewable object URL

      const buffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
      setFileHash(hashHex);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !fileName) return;

    const newEntry = {
      id: Date.now(),
      title,
      category,
      date: new Date().toISOString().split("T")[0],
      status: "Pending Supervisory Verification",
      file: fileName,
      fileUrl,
      hash: fileHash,
      verifier: "Pending Verification",
      investigator: investigatorName
    };

    const updated = [newEntry, ...evidenceRecords];
    setEvidenceRecords(updated);

    // Push into Supervisory Queue (supports both new officer queue & legacy fallback)
    const existingQueue = JSON.parse(
      localStorage.getItem("sih_officer_queue") || localStorage.getItem("sih_faculty_queue") || "[]"
    );
    const updatedQueue = [{ ...newEntry, student: investigatorName }, ...existingQueue];
    
    localStorage.setItem("sih_officer_queue", JSON.stringify(updatedQueue));
    localStorage.setItem("sih_faculty_queue", JSON.stringify(updatedQueue));

    setTitle("");
    setFileName("");
    setFileUrl("");
    setFileHash("");
  };

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    router.push("/login");
  };

  if (!authorized)
    return (
      <div className="min-h-screen bg-slate-950 text-slate-400 flex items-center justify-center">
        Authenticating Chain-of-Custody Access...
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 relative overflow-hidden">
      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        <div className="flex justify-between items-center border-b border-slate-800/80 pb-5">
          <div>
            <h1 className="text-2xl font-black text-white">Investigator Evidence Filing Portal</h1>
            <p className="text-slate-400 text-xs mt-0.5">
              Logged in Officer: <span className="text-indigo-400 font-semibold">{investigatorName}</span>
            </p>
          </div>
          <div className="flex gap-3 items-center">
            <Link href="/case-packet" className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-xl transition-all">
              View Verifiable Case Packet
            </Link>
            <button onClick={handleLogout} className="px-3.5 py-2 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 text-xs rounded-xl transition-all">
              Logout
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl h-fit space-y-5">
            <h2 className="text-base font-bold text-white">Upload New Case Document</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Case Title / Record Description"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="FIR / Charge Sheet">FIR / Charge Sheet</option>
                <option value="Forensic Audit File">Forensic Audit File</option>
                <option value="Evidence Document">Evidence Document</option>
                <option value="Court Motion / Order">Court Motion / Order</option>
              </select>
              <div>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full text-xs text-slate-400 bg-slate-950 border border-slate-800 rounded-xl p-2.5 cursor-pointer focus:outline-none"
                  required
                />
                {fileUrl && (
                  <div className="mt-2 space-y-1">
                    <a href={fileUrl} target="_blank" rel="noreferrer" className="text-[11px] text-indigo-400 underline block hover:text-indigo-300">
                      Preview Uploaded Proof File ↗
                    </a>
                    {fileHash && (
                      <p className="text-[10px] font-mono text-slate-500 truncate">
                        SHA-256: <span className="text-emerald-400">{fileHash}</span>
                      </p>
                    )}
                  </div>
                )}
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-600/20">
                Submit for Chain-of-Custody Verification
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-4">
            <h2 className="text-base font-bold text-white">Active Case Records & Chain-of-Custody Status</h2>
            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="p-3.5">Document Title</th>
                    <th className="p-3.5">Proof / Hash</th>
                    <th className="p-3.5">Verifying Authority</th>
                    <th className="p-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-950/40">
                  {evidenceRecords.map((item: any) => (
                    <tr key={item.id}>
                      <td className="p-3.5 font-semibold text-white">
                        {item.title}
                        <div className="text-[10px] text-indigo-300/70 font-normal mt-0.5">{item.category}</div>
                      </td>
                      <td className="p-3.5">
                        {item.fileUrl ? (
                          <a href={item.fileUrl} target="_blank" rel="noreferrer" className="text-indigo-400 underline font-mono text-[10px] block">
                            View Evidence File
                          </a>
                        ) : (
                          <span className="text-slate-500 font-mono text-[10px] block">{item.file || "evidence.pdf"}</span>
                        )}
                        {item.hash && (
                          <span className="text-[9px] font-mono text-slate-500 truncate max-w-[120px] block" title={item.hash}>
                            Hash: {item.hash.substring(0, 10)}...
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-slate-300">{item.verifier}</td>
                      <td className="p-3.5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            item.status === "Cryptographically Verified" || item.status === "Verified"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : item.status === "Rejected"
                              ? "bg-red-500/10 text-red-400 border border-red-500/20"
                              : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}