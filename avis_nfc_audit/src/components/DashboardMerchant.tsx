import React from 'react';
import {
  Star,
  Radio,
  QrCode,
  TrendingUp,
  MapPin,
  ExternalLink,
  Printer,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { Merchant, Stand, User } from '../types';

interface Props {
  currentUser: User;
  merchants: Merchant[];
  stands: Stand[];
  onOpenExplanationModal: () => void;
  onOpenStudioModal: (stand: Stand, merchant: Merchant) => void;
}

export const DashboardMerchant: React.FC<Props> = ({
  currentUser,
  merchants,
  stands,
  onOpenExplanationModal,
  onOpenStudioModal,
}) => {
  // Find merchant assigned to this user, or default to first merchant (votre établissement)
  const merchant =
    merchants.find((m) => m.id === currentUser.merchantId) || merchants[0];
  const merchantStands = stands.filter((s) => s.merchantId === merchant?.id);

  if (!merchant) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
        Aucun établissement associé à ce compte.
      </div>
    );
  }

  const gainedReviews = Math.max(0, merchant.currentReviewCount - merchant.initialReviewCount);
  const totalScans = merchantStands.reduce((sum, s) => sum + s.totalScans, 0);
  const nfcScans = merchantStands.reduce((sum, s) => sum + s.nfcScans, 0);
  const qrScans = merchantStands.reduce((sum, s) => sum + s.qrScans, 0);

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:border-none print:shadow-none">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900">{merchant.name}</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200">
              Espace Commerçant
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>{merchant.address}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 print:hidden">
          <button
            onClick={onOpenExplanationModal}
            className="px-3.5 py-2 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition"
          >
            Comment ça marche ?
          </button>
          <button
            onClick={handlePrintReport}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimer la synthèse</span>
          </button>
        </div>
      </div>

      {/* Main Review Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Rating */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Note Google actuelle</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{merchant.currentRating}</span>
            <div className="flex items-center text-amber-500 text-sm">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
              ))}
            </div>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Note initiale : {merchant.initialRating}★
          </span>
        </div>

        {/* Reviews Gained */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Avis générés</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600">+{gainedReviews}</span>
            <span className="text-xs text-slate-400 font-medium">nouveaux</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Total : {merchant.currentReviewCount} avis vérifiés
          </span>
        </div>

        {/* Total Scans */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Total Scans Clients</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-blue-600">{totalScans}</span>
            <span className="text-xs text-slate-400 font-medium">interactions</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            NFC : {nfcScans} ({totalScans > 0 ? Math.round((nfcScans / totalScans) * 100) : 0}%) • QR : {qrScans}
          </span>
        </div>

        {/* Conversion Rate */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Conversion estimée</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-purple-700">
              {totalScans > 0 ? `${((gainedReviews / totalScans) * 100).toFixed(1)}%` : '0%'}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Rapport scans / nouveaux avis
          </span>
        </div>
      </div>

      {/* Stands Breakdown */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="font-bold text-slate-900 text-sm">Performance par Support Plexiglas</h2>
            <p className="text-xs text-slate-500">
              Comparez l'efficacité de vos différents comptoirs et tables.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {merchantStands.map((stand) => (
            <div
              key={stand.id}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 text-xs"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 text-sm block">{stand.name}</span>
                  <span className="text-[11px] text-slate-500 font-mono">{stand.id}</span>
                </div>
                <button
                  onClick={() => onOpenStudioModal(stand, merchant)}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-[11px] flex items-center gap-1 print:hidden"
                >
                  <Sparkles className="w-3 h-3 text-purple-600" />
                  <span>Studio</span>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-lg bg-white border border-slate-200 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 block">Total Scans</span>
                  <span className="font-bold text-slate-900 text-sm">{stand.totalScans}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">NFC (Sans contact)</span>
                  <span className="font-bold text-blue-600 text-sm">{stand.nfcScans}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">QR Code</span>
                  <span className="font-bold text-emerald-600 text-sm">{stand.qrScans}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Staff Best Practices Tip Box */}
      <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-slate-700 space-y-2 print:hidden">
        <div className="flex items-center gap-2 font-bold text-blue-900">
          <CheckCircle2 className="w-4 h-4 text-blue-600" />
          <span>Conseil pour vos équipes en caisse :</span>
        </div>
        <p className="leading-relaxed">
          Lorsque vous encaissez un client satisfait, dites simplement :
          <em className="text-blue-950 font-semibold block mt-1">
            « Si vous avez apprécié votre visite, vous pouvez simplement poser votre téléphone sur le support plexiglas pour nous laisser 5 étoiles ! »
          </em>
          Cette simple phrase multiplie par 4 le nombre d'avis déposés chaque semaine.
        </p>
      </div>
    </div>
  );
};
