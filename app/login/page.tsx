"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [role, setRole] = useState<"investigator" | "officer">("investigator");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    localStorage.setItem("userRole", role === "investigator" ? "investigator" : "officer");
    localStorage.setItem("userName", name);

    // Redirect to the exact subfolder routes in your app directory
    if (role === "investigator") {
      router.push("/dashboard/case-officer");
    } else {
      router.push("/dashboard/Supervisor");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      <div className="bg-slate-900/80 border border-slate-800 p-8 rounded-3xl w-full max-w-md space-y-6 shadow-2xl">
        <div>
          <h1 className="text-2xl font-black text-white">MHA SIH26190 Portal</h1>
          <p className="text-slate-400 text-xs mt-1">Chain-of-Custody Evidence Portal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Officer / Investigator Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Officer R. Sharma"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">Select Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as "investigator" | "officer")}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="investigator">Investigating Officer (Field Agent)</option>
              <option value="officer">Supervisory Officer</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl text-xs font-bold transition-all mt-2"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}