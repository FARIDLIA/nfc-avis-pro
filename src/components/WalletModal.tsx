import React, { useEffect, useState } from 'react';
import { X, Coins, CheckCircle2, CreditCard } from 'lucide-react';
import { api } from '../services/api';
import { CreditTransaction, User } from '../types';

interface Props { isOpen: boolean; currentUser: User; onClose: () => void; onCreditsUpdated: (newBalance: number) => void; }
export const WalletModal: React.FC<Props> = ({ isOpen, currentUser, onClose }) => {
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [freeMode, setFreeMode] = useState(true);
  const [paymentProvider, setPaymentProvider] = useState('none');
  useEffect(()=>{ if(isOpen) api.getWallet().then((d:any)=>{ setTransactions(d.transactions||[]); setFreeMode(d.freeMode!==false); setPaymentProvider(d.paymentProvider||'none'); }).catch(()=>{}); },[isOpen]);
  if(!isOpen) return null;
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm overflow-y-auto">
    <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
      <div className="flex items-center justify-between pb-4 border-b"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><Coins className="w-5 h-5"/></div><div><h2 className="font-bold text-slate-900">Accès & monétisation</h2><p className="text-xs text-slate-500">Infrastructure prête, facturation désactivée actuellement</p></div></div><button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100"><X className="w-5 h-5"/></button></div>
      {freeMode ? <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-5"><div className="flex items-center gap-2 font-black text-emerald-900"><CheckCircle2 className="w-5 h-5"/>Mode gratuit actif</div><p className="text-sm text-emerald-800 mt-2">Les créations de commerces, QR codes, supports NFC et visuels ne sont pas bloquées par des crédits. Aucun paiement n'est demandé.</p></div> : <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50 p-5"><div className="flex items-center gap-2 font-bold text-blue-900"><CreditCard className="w-5 h-5"/>Paiement activable</div><p className="text-sm text-blue-800 mt-2">Fournisseur configuré : {paymentProvider}.</p></div>}
      <div className="mt-5"><h3 className="text-xs font-bold text-slate-700 mb-2">Historique</h3>{transactions.length===0?<div className="text-xs text-slate-500 border rounded-xl p-4">Aucun mouvement de crédit.</div>:<div className="border rounded-xl overflow-hidden max-h-56 overflow-y-auto"><table className="w-full text-xs"><thead className="bg-slate-50"><tr><th className="p-2 text-left">Date</th><th className="p-2 text-left">Description</th><th className="p-2 text-right">Variation</th></tr></thead><tbody>{transactions.map(tx=><tr key={tx.id} className="border-t"><td className="p-2">{new Date(tx.date).toLocaleDateString('fr-FR')}</td><td className="p-2">{tx.description}</td><td className="p-2 text-right font-bold">{tx.amount>0?`+${tx.amount}`:tx.amount}</td></tr>)}</tbody></table></div>}</div>
      <div className="mt-5 text-[11px] text-slate-500">Le paramètre serveur <code>PAYMENT_PROVIDER=none</code> maintient la facturation inactive. La couche crédits reste disponible pour une future intégration.</div>
    </div>
  </div>;
};
