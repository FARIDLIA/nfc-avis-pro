import React, { useState } from 'react';
import { LockKeyhole, Mail, Radio, Shield, UserPlus } from 'lucide-react';
import { api } from '../services/api';
import { User } from '../types';

export function AuthScreen({ onAuthenticated }: { onAuthenticated: (user: User) => void }) {
  const [mode, setMode] = useState<'login'|'register'|'admin'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setError('');
    try {
      const r = mode === 'admin'
        ? await api.adminLogin(adminCode)
        : mode === 'register'
          ? await api.registerUser({ name, email, password })
          : await api.login(email, password);
      onAuthenticated(r.user);
    } catch (e) { setError(e instanceof Error ? e.message : 'Connexion impossible'); }
    finally { setBusy(false); }
  };

  return <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
    <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6">
      <div className="text-center mb-6"><div className="w-14 h-14 mx-auto rounded-2xl bg-blue-600 text-white flex items-center justify-center"><Radio /></div><h1 className="mt-3 text-xl font-black">Avis NFC & QR Pro</h1><p className="text-xs text-slate-500">Accès sécurisé multi-utilisateur</p></div>
      <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl mb-5 text-xs font-bold">
        <button onClick={()=>setMode('login')} className={`py-2 rounded-lg ${mode==='login'?'bg-white shadow':''}`}>Connexion</button>
        <button onClick={()=>setMode('register')} className={`py-2 rounded-lg ${mode==='register'?'bg-white shadow':''}`}>Inscription</button>
        <button onClick={()=>setMode('admin')} className={`py-2 rounded-lg ${mode==='admin'?'bg-white shadow':''}`}>Admin</button>
      </div>
      <form onSubmit={submit} className="space-y-3">
        {mode==='register' && <input required value={name} onChange={e=>setName(e.target.value)} placeholder="Nom / Société" className="w-full border rounded-xl px-3 py-2.5 text-sm"/>}
        {mode!=='admin' && <><div className="relative"><Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400"/><input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="E-mail" className="w-full border rounded-xl pl-10 pr-3 py-2.5 text-sm"/></div><div className="relative"><LockKeyhole className="absolute left-3 top-3 w-4 h-4 text-slate-400"/><input required minLength={8} type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Mot de passe (8 caractères minimum)" className="w-full border rounded-xl pl-10 pr-3 py-2.5 text-sm"/></div></>}
        {mode==='admin' && <div className="relative"><Shield className="absolute left-3 top-3 w-4 h-4 text-red-500"/><input required inputMode="numeric" maxLength={6} type="password" value={adminCode} onChange={e=>setAdminCode(e.target.value.replace(/\D/g,''))} placeholder="Code SuperAdmin" className="w-full border rounded-xl pl-10 pr-3 py-2.5 text-sm"/></div>}
        {error && <div className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl p-3">{error}</div>}
        <button disabled={busy} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl py-2.5 text-sm flex justify-center items-center gap-2">{mode==='register'?<UserPlus className="w-4 h-4"/>:null}{busy?'Traitement...':mode==='register'?'Créer mon compte':mode==='admin'?'Ouvrir SuperAdmin':'Se connecter'}</button>
      </form>
    </div>
  </div>;
}
