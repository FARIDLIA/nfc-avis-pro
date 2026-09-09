import React, { useState } from 'react';
import {
  ShieldAlert,
  Coins,
  Users,
  Plus,
  Minus,
  Check,
  AlertTriangle,
  FileText,
  Cloud,
  ExternalLink,
  Lock,
  Unlock,
  KeyRound,
  ShieldCheck,
  AlertCircle,
  UserPlus,
} from 'lucide-react';
import { User, CreditTransaction } from '../types';
import { api } from '../services/api';
import { AdminAddResellerModal } from './AdminAddResellerModal';

interface Props {
  users: User[];
  onRefreshData: () => void;
  onOpenCloudflareModal: () => void;
  isAdminUnlocked?: boolean;
  onUnlockAdmin?: (code: string) => void;
  onLockAdmin?: () => void;
}

export const DashboardAdmin: React.FC<Props> = ({
  users,
  onRefreshData,
  onOpenCloudflareModal,
  isAdminUnlocked = true,
  onUnlockAdmin,
  onLockAdmin,
}) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [creditAmount, setCreditAmount] = useState('5');
  const [creditReason, setCreditReason] = useState('Virement bancaire reçu');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [pinError, setPinError] = useState('');
  const [isAddResellerOpen, setIsAddResellerOpen] = useState(false);

  const resellers = users.filter((u) => u.role === 'reseller');

  const handleAdjustCredits = async (isAddition: boolean) => {
    if (!selectedUser) return;
    const amount = Number(creditAmount) * (isAddition ? 1 : -1);
    setIsSubmitting(true);
    setActionSuccess('');

    try {
      await api.adjustCreditsAdmin({
        targetUserId: selectedUser.id,
        amount,
        description: creditReason,
        paymentMethod: 'manual_transfer',
      });
      setActionSuccess(`Crédits mis à jour avec succès pour ${selectedUser.name} (${amount > 0 ? `+${amount}` : amount}).`);
      onRefreshData();
    } catch (err: unknown) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (user: User) => {
    try {
      await api.toggleUserStatus(user.id);
      onRefreshData();
    } catch (err) {
      console.error(err);
    }
  };

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.verifyAdminCode(pinCode.trim());
      setPinError('');
      if (onUnlockAdmin) onUnlockAdmin(pinCode.trim());
    } catch (err) {
      setPinError(err instanceof Error ? err.message : "Code d'accès incorrect.");
    }
  };

  // If locked, show the security lock screen
  if (!isAdminUnlocked) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden animate-fade-in">
        <div className="bg-slate-900 p-8 text-white text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-black tracking-tight">SuperAdmin Verrouillé</h2>
          <p className="text-xs text-slate-400 mt-2">
            Cet espace de gestion financière et technique est strictement protégé. Veuillez saisir le code d'accès administrateur.
          </p>
        </div>

        <form onSubmit={handlePinSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider text-center mb-2">
              Code d'accès administrateur
            </label>
            <div className="relative">
              <input
                type="password"
                inputMode="numeric"
                maxLength={6}
                value={pinCode}
                onChange={(e) => {
                  setPinCode(e.target.value.replace(/\D/g, ''));
                  setPinError('');
                }}
                placeholder="••••••"
                autoFocus
                className="w-full text-center text-3xl font-mono tracking-widest py-3 px-4 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none"
              />
              <KeyRound className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {pinError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
              <span>{pinError}</span>
            </div>
          )}

          {/* Keypad */}
          <div className="grid grid-cols-3 gap-2 max-w-[240px] mx-auto">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setPinCode((p) => (p.length < 6 ? p + d : p))}
                className="h-11 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-800 text-lg transition"
              >
                {d}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPinCode('')}
              className="h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-500 transition"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => setPinCode((p) => (p.length < 6 ? p + '0' : p))}
              className="h-11 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-800 text-lg transition"
            >
              0
            </button>
            <button
              type="button"
              onClick={() => setPinCode((p) => p.slice(0, -1))}
              className="h-11 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 text-sm transition"
            >
              ⌫
            </button>
          </div>

          <button
            type="submit"
            disabled={pinCode.length === 0}
            className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs"
          >
            <Unlock className="w-4 h-4" />
            <span>Déverrouiller l'accès SuperAdmin</span>
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Admin Top Banner */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-black">SuperAdmin Plateforme</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 font-bold text-xs border border-red-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-red-400" />
              <span>Accès SuperAdmin sécurisé</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Gestion centrale des revendeurs, attribution manuelle de crédits et audit de conformité.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={onOpenCloudflareModal}
            className="px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center gap-1.5 transition"
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>Code Cloudflare 0 €</span>
          </button>

          {onLockAdmin && (
            <button
              onClick={onLockAdmin}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition"
              title="Verrouiller la console admin"
            >
              <Lock className="w-3.5 h-3.5 text-red-400" />
              <span>Verrouiller</span>
            </button>
          )}
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Resellers Management Table */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="font-bold text-slate-900 text-sm">Comptes Revendeurs Partenaires</h2>
            <p className="text-xs text-slate-500">
              {resellers.length} revendeur{resellers.length > 1 ? 's' : ''} inscrit{resellers.length > 1 ? 's' : ''} • Création par admin ou libre en ligne
            </p>
          </div>

          <button
            onClick={() => setIsAddResellerOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Ajouter un revendeur</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">Nom du revendeur</th>
                <th className="p-3">Email</th>
                <th className="p-3 text-center">Solde Crédits</th>
                <th className="p-3 text-center">Statut</th>
                <th className="p-3 text-right">Actions Crédits</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {resellers.map((reseller) => (
                <tr key={reseller.id} className="hover:bg-slate-50/60">
                  <td className="p-3 font-bold text-slate-900">{reseller.name}</td>
                  <td className="p-3 text-slate-600">{reseller.email}</td>
                  <td className="p-3 text-center">
                    <span className="font-extrabold px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                      {reseller.credits} crédits
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleToggleStatus(reseller)}
                      className={`px-2 py-0.5 rounded-full font-bold text-[10px] transition ${
                        reseller.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                          : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                      }`}
                    >
                      {reseller.status === 'active' ? 'Actif' : 'Suspendu'}
                    </button>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => setSelectedUser(reseller)}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition"
                    >
                      Ajuster crédits
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Credit Adjustment Form Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Ajustement manuel : {selectedUser.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="text-xs space-y-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nombre de crédits</label>
                <input
                  type="number"
                  min="1"
                  value={creditAmount}
                  onChange={(e) => setCreditAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Motif / Justificatif</label>
                <input
                  type="text"
                  value={creditReason}
                  onChange={(e) => setCreditReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                  placeholder="Ex: Virement bancaire de 80€ reçu (Pack 10)"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => handleAdjustCredits(true)}
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter crédits (+)</span>
                </button>
                <button
                  onClick={() => handleAdjustCredits(false)}
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <Minus className="w-4 h-4" />
                  <span>Retirer crédits (-)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Add Reseller Modal */}
      <AdminAddResellerModal
        isOpen={isAddResellerOpen}
        onClose={() => setIsAddResellerOpen(false)}
        onResellerCreated={(newUser) => {
          onRefreshData();
          setActionSuccess(`Revendeur « ${newUser.name} » créé avec succès (${newUser.credits} crédits alloués) !`);
        }}
      />
    </div>
  );
};
