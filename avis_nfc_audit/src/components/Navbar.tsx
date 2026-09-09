import React from 'react';
import { Coins, HelpCircle, LogOut, Radio, Share2, Shield, Store, User as UserIcon } from 'lucide-react';
import { User } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

interface Props { currentUser: User; onLogout: () => void; onOpenWallet: () => void; onOpenExplanation: () => void; onOpenShare?: () => void; }
export const Navbar: React.FC<Props> = ({ currentUser, onLogout, onOpenWallet, onOpenExplanation, onOpenShare }) => <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
    <div className="flex items-center gap-2.5"><div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center"><Radio className="w-5 h-5"/></div><div><span className="font-extrabold text-base block">Avis NFC & QR Pro</span><span className="text-[10px] text-slate-500 hidden sm:block">QR • NFC • Supports</span></div></div>
    <div className="flex items-center gap-2"><PWAInstallButton/>{onOpenShare&&<button onClick={onOpenShare} className="p-2 rounded-lg hover:bg-slate-100" title="Partager"><Share2 className="w-4 h-4"/></button>}<button onClick={onOpenExplanation} className="p-2 rounded-lg hover:bg-slate-100" title="Aide NFC"><HelpCircle className="w-4 h-4"/></button>{currentUser.role==='reseller'&&<button onClick={onOpenWallet} className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold flex items-center gap-1"><Coins className="w-3.5 h-3.5"/>{currentUser.credits>=999999?'Gratuit':`${currentUser.credits} crédits`}</button>}<div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold pl-2 border-l">{currentUser.role==='admin'?<Shield className="w-4 h-4 text-red-500"/>:currentUser.role==='merchant'?<Store className="w-4 h-4 text-emerald-600"/>:<UserIcon className="w-4 h-4 text-blue-600"/>}<span>{currentUser.name}</span></div><button onClick={onLogout} className="p-2 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-600" title="Déconnexion"><LogOut className="w-4 h-4"/></button></div>
  </div>
</header>;
