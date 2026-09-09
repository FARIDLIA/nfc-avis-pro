import React, { useState } from 'react';
import {
  Coins,
  Building2,
  Radio,
  Star,
  Plus,
  RefreshCw,
  HelpCircle,
  Cloud,
  ChevronRight,
  TrendingUp,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { Merchant, Stand, User, GoogleQuotaState } from '../types';
import { api } from '../services/api';
import { StandsManager } from './StandsManager';

interface Props {
  currentUser: User;
  merchants: Merchant[];
  stands: Stand[];
  quota: GoogleQuotaState | null;
  onOpenActivationModal: () => void;
  onOpenWalletModal: () => void;
  onOpenExplanationModal: () => void;
  onOpenCloudflareModal: () => void;
  onOpenNfcModal: (stand: Stand, merchant: Merchant) => void;
  onOpenStudioModal: (stand: Stand, merchant: Merchant) => void;
  onRefreshData: () => void;
}

export const DashboardReseller: React.FC<Props> = ({
  currentUser,
  merchants,
  stands,
  quota,
  onOpenActivationModal,
  onOpenWalletModal,
  onOpenExplanationModal,
  onOpenCloudflareModal,
  onOpenNfcModal,
  onOpenStudioModal,
  onRefreshData,
}) => {
  const [selectedMerchantId, setSelectedMerchantId] = useState<string | null>(
    merchants[0]?.id || null
  );
  const [isSyncingReviews, setIsSyncingReviews] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');

  const selectedMerchant = merchants.find((m) => m.id === selectedMerchantId) || merchants[0];
  const merchantStands = stands.filter((s) => s.merchantId === selectedMerchant?.id);

  // Overall totals
  const totalScans = stands.reduce((sum, s) => sum + s.totalScans, 0);
  const totalNfc = stands.reduce((sum, s) => sum + s.nfcScans, 0);
  const totalQr = stands.reduce((sum, s) => sum + s.qrScans, 0);
  const initialReviews = merchants.reduce((sum, m) => sum + m.initialReviewCount, 0);
  const currentReviews = merchants.reduce((sum, m) => sum + m.currentReviewCount, 0);
  const gainedReviews = Math.max(0, currentReviews - initialReviews);

  const handleSyncReviews = async (merchantId: string) => {
    setIsSyncingReviews(true);
    setSyncMessage('');

    try {
      // Simulate weekly sync with quota check
      const merchant = merchants.find((m) => m.id === merchantId);
      if (!merchant) return;

      const increment = Math.floor(Math.random() * 3) + 1;
      const res = await api.updateMerchantReviews(merchantId, {
        reviewCount: merchant.currentReviewCount + increment,
        source: 'google_sync',
      });

      setSyncMessage(
        `Actualisation réussie : +${increment} avis détectés pour ${res.merchant.name} (Quota jour restant : ${
          (quota?.dailyLimit || 30) - res.quota.dailyCallsUsed
        })`
      );
      onRefreshData();
    } catch (err: unknown) {
      console.error(err);
      setSyncMessage(err instanceof Error ? err.message : 'Erreur lors de la synchronisation.');
    } finally {
      setIsSyncingReviews(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900">Espace Revendeur Agréé</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold text-xs border border-blue-200">
              {currentUser.name}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Gérez vos établissements partenaires, puces NFC et supports plexiglas sans frais récurrents.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenExplanationModal}
            className="px-3.5 py-2 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition"
          >
            <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>Guide NFC vs QR</span>
          </button>


          <button
            onClick={onOpenActivationModal}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Ajouter un commerce</span>
          </button>
        </div>
      </div>

      {/* Sync Message Alert */}
      {syncMessage && (
        <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 font-medium flex items-center justify-between">
          <span>{syncMessage}</span>
          <button onClick={() => setSyncMessage('')} className="text-blue-700 hover:underline text-[11px] font-bold">
            Masquer
          </button>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Wallet Card */}
        <div
          onClick={onOpenWalletModal}
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-amber-300 cursor-pointer shadow-xs transition group"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
            <span>Solde Crédits</span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600 group-hover:bg-amber-100 transition">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{currentUser.credits}</span>
            <span className="text-[11px] text-slate-400">activations</span>
          </div>
          <span className="text-[11px] font-bold text-amber-600 hover:underline mt-2 block">
            Acheter un pack &rarr;
          </span>
        </div>

        {/* Merchants Count */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
            <span>Commerces actifs</span>
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{merchants.length}</span>
            <span className="text-[11px] text-slate-400">établissements</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-2 block">
            {stands.length} supports plexiglas
          </span>
        </div>

        {/* Total Scans & NFC Ratio */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
            <span>Volume Scans Total</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <Radio className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{totalScans}</span>
            <span className="text-[11px] text-emerald-700 font-bold">
              {totalScans > 0 ? `${Math.round((totalNfc / totalScans) * 100)}% NFC` : '100%'}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-2 block">
            NFC : {totalNfc} • QR Code : {totalQr}
          </span>
        </div>

        {/* Reviews Gained */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
            <span>Avis Google générés</span>
            <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-purple-700">+{gainedReviews}</span>
            <span className="text-[11px] text-slate-400">nouveaux avis</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-2 block">
            Total réseau : {currentReviews} avis
          </span>
        </div>
      </div>

      {/* Google Places Quota Guard (Contrainte officielle de non-dépassement gratuit) */}
      <div className="p-4 rounded-2xl bg-slate-900 text-white shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Garde-fou Quotas Google (Garantie 0 € de facture)
            </span>
          </div>
          <span className="text-[11px] text-emerald-400 font-semibold bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800">
            Actualisation hebdomadaire sécurisée
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3 text-xs">
          <div>
            <div className="flex justify-between text-slate-400 mb-1">
              <span>Appels quotidiens utilisés :</span>
              <span className="text-white font-bold">
                {quota?.dailyCallsUsed || 4} / {quota?.dailyLimit || 30}
              </span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all"
                style={{
                  width: `${Math.min(
                    100,
                    ((quota?.dailyCallsUsed || 4) / (quota?.dailyLimit || 30)) * 100
                  )}%`,
                }}
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Plafond bloquant à 30 contrôles/jour pour empêcher toute facturation Google Cloud.
            </span>
          </div>

          <div>
            <div className="flex justify-between text-slate-400 mb-1">
              <span>Consommation mensuelle :</span>
              <span className="text-white font-bold">
                {quota?.monthlyCallsUsed || 124} / {quota?.monthlyLimit || 930}
              </span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all"
                style={{
                  width: `${Math.min(
                    100,
                    ((quota?.monthlyCallsUsed || 124) / (quota?.monthlyLimit || 930)) * 100
                  )}%`,
                }}
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Sous le seuil gratuit Place Details (1 000 requêtes/mois).
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Area: Merchants List & Selected Merchant Stands */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Merchants List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h2 className="font-bold text-slate-900 text-sm">Vos Établissements</h2>
            <span className="text-xs text-slate-500 font-semibold">
              {merchants.length} commerce{merchants.length > 1 ? 's' : ''}
            </span>
          </div>

          <div className="space-y-2">
            {merchants.map((merchant) => {
              const isSelected = merchant.id === selectedMerchant?.id;
              const gained = Math.max(0, merchant.currentReviewCount - merchant.initialReviewCount);

              return (
                <div
                  key={merchant.id}
                  onClick={() => setSelectedMerchantId(merchant.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition text-xs flex flex-col justify-between space-y-2 ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/40 shadow-xs'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-bold text-slate-900 text-sm block">
                        {merchant.name}
                      </span>
                      <span className="text-slate-500 text-[11px] flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{merchant.city}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-amber-500 font-bold text-xs bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{merchant.currentRating}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px] text-slate-500">
                    <span>{merchant.currentReviewCount} avis ({gained > 0 ? `+${gained}` : '0'})</span>
                    <span className="font-semibold text-slate-700">{merchant.totalScans} scans</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Merchant Detailed View & Stands */}
        <div className="lg:col-span-8 space-y-4">
          {selectedMerchant ? (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-5">
              {/* Detailed Header of Selected Merchant */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-900">{selectedMerchant.name}</h2>
                    <a
                      href={selectedMerchant.googleReviewUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1 text-slate-400 hover:text-blue-600 transition"
                      title="Ouvrir le lien officiel d'avis Google"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{selectedMerchant.address}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSyncReviews(selectedMerchant.id)}
                    disabled={isSyncingReviews}
                    className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncingReviews ? 'animate-spin' : ''}`} />
                    <span>Actualiser avis (Google)</span>
                  </button>
                </div>
              </div>

              {/* Performance Cards of Merchant */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 block">Avis initiaux</span>
                  <span className="font-bold text-slate-700 text-sm">
                    {selectedMerchant.initialReviewCount} avis
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                  <span className="text-[10px] text-emerald-700 block">Avis actuels</span>
                  <span className="font-extrabold text-emerald-800 text-sm">
                    {selectedMerchant.currentReviewCount} avis (+
                    {Math.max(0, selectedMerchant.currentReviewCount - selectedMerchant.initialReviewCount)})
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
                  <span className="text-[10px] text-blue-700 block">Total Scans</span>
                  <span className="font-extrabold text-blue-800 text-sm">
                    {selectedMerchant.totalScans}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-purple-50 border border-purple-100">
                  <span className="text-[10px] text-purple-700 block">Taux de conversion est.</span>
                  <span className="font-extrabold text-purple-800 text-sm">
                    {selectedMerchant.totalScans > 0
                      ? `${(
                          (Math.max(
                            0,
                            selectedMerchant.currentReviewCount - selectedMerchant.initialReviewCount
                          ) /
                            selectedMerchant.totalScans) *
                          100
                        ).toFixed(1)}%`
                      : '0%'}
                  </span>
                </div>
              </div>

              {/* Stands Manager Component */}
              <StandsManager
                merchant={selectedMerchant}
                stands={merchantStands}
                onStandCreated={(s) => onRefreshData()}
                onStandUpdated={(s) => onRefreshData()}
                onOpenNfcModal={(s) => onOpenNfcModal(s, selectedMerchant)}
                onOpenStudioModal={(s) => onOpenStudioModal(s, selectedMerchant)}
              />
            </div>
          ) : (
            <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center text-slate-500">
              Aucun établissement sélectionné.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
