"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function StudentDashboard() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [studentName, setStudentName] = useState("Student");

  useEffect(() => {
    if (localStorage.getItem("userRole") !== "student") {
      router.push("/login");
    } else {
      setAuthorized(true);
      setStudentName(localStorage.getItem("userName") || "Student");
    }
  }, [router]);

  // Load saved achievements (synced with localStorage & faculty approvals)
  const [achievements, setAchievements] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sih_student_achievements");
      if (saved) return JSON.parse(saved);
    }
    return [
      { id: 1, title: "National Level Hackathon Winner", category: "Hackathon", file: "cert.pdf", fileUrl: "", hash: "8d969eef6ecad3c29a3a", date: "2026-08-15", status: "Verified", verifier: "Dr. A. Sharma" }
    ];
  });

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Certification");
  const [fileName, setFileName] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [fileHash, setFileHash] = useState("");

  // Sync achievements and listen for faculty status updates
  useEffect(() => {
    localStorage.setItem("sih_student_achievements", JSON.stringify(achievements));
  }, [achievements]);

  // Periodic sync check to see if faculty approved an item
  useEffect(() => {
    const interval = setInterval(() => {
      const saved = localStorage.getItem("sih_student_achievements");
      if (saved) setAchievements(JSON.parse(saved));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      setFileUrl(URL.createObjectURL(file)); // Creates a local viewable URL for images/PDFs

      const buffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      setFileHash(hashHex);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !fileName) return;
    
    const newEntry = {
      id: Date.now(), title, category,
      date: new Date().toISOString().split("T")[0],
      status: "Pending Review", file: fileName, fileUrl, hash: fileHash, verifier: "Pending"
    };

    const updated = [newEntry, ...achievements];
    setAchievements(updated);
    
    // Push into Faculty Queue
    const existingQueue = JSON.parse(localStorage.getItem("sih_faculty_queue") || "[]");
    localStorage.setItem("sih_faculty_queue", JSON.stringify([{ ...newEntry, student: studentName }, ...existingQueue]));

    setTitle(""); setFileName(""); setFileUrl(""); setFileHash("");
  };

  const handleLogout = () => { localStorage.removeItem("userRole"); router.push("/login"); };

  if (!authorized) return <div className="min-h-screen bg-slate-950 text-slate-400 flex items-center justify-center">Authenticating...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 relative overflow-hidden">
      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        <div className="flex justify-between items-center border-b border-slate-800/80 pb-5">
          <div>
            <h1 className="text-2xl font-black text-white">Student Portal</h1>
            <p className="text-slate-400 text-xs mt-0.5">Welcome back, <span className="text-indigo-400 font-semibold">{studentName}</span></p>
          </div>
          <div className="flex gap-3 items-center">
            <Link href="/portfolio" className="px-3.5 py-2 bg-indigo-600 text-white text-xs font-medium rounded-xl">View Portfolio</Link>
            <button onClick={handleLogout} className="px-3.5 py-2 bg-red-500/10 text-red-400 border border-red-500/20 text-xs rounded-xl">Logout</button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl h-fit space-y-5">
            <h2 className="text-base font-bold text-white">Log New Achievement</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Achievement Title" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white" />
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white">
                <option value="Certification">Certification</option>
                <option value="Hackathon">Hackathon</option>
                <option value="Project">Project Work</option>
              </select>
              <div>
                <input type="file" onChange={handleFileChange} className="w-full text-xs text-slate-400 bg-slate-950 border border-slate-800 rounded-xl p-2.5 cursor-pointer" required />
                {fileUrl && (
                  <div className="mt-2">
                    <a href={fileUrl} target="_blank" rel="noreferrer" className="text-[11px] text-indigo-400 underline block">Preview Uploaded Proof File ↗</a>
                  </div>
                )}
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl text-xs font-bold">Submit for Verification</button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-4">
            <h2 className="text-base font-bold text-white">Your Activity Records & Live Pipeline</h2>
            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px]">
                  <tr><th className="p-3.5">Achievement</th><th className="p-3.5">Proof</th><th className="p-3.5">Verifier</th><th className="p-3.5">Status</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-950/40">
                  {achievements.map((item: any) => (
                    <tr key={item.id}>
                      <td className="p-3.5 font-semibold text-white">{item.title}</td>
                      <td className="p-3.5">
                        {item.fileUrl ? (
                          <a href={item.fileUrl} target="_blank" rel="noreferrer" className="text-indigo-400 underline font-mono text-[10px]">View File</a>
                        ) : (
                          <span className="text-slate-500 font-mono text-[10px]">{item.file || "doc.pdf"}</span>
                        )}
                      </td>
                      <td className="p-3.5 text-slate-300">{item.verifier}</td>
                      <td className="p-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${item.status === 'Verified' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
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