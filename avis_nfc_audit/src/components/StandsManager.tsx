import React, { useState } from 'react';
import { Plus, Radio, QrCode, Sparkles, ExternalLink, Download, CheckCircle2, Clock } from 'lucide-react';
import QRCode from 'qrcode';
import { Stand, Merchant } from '../types';
import { api } from '../services/api';

interface Props {
  merchant: Merchant;
  stands: Stand[];
  onStandUpdated: (stand: Stand) => void;
  onStandCreated: (stand: Stand) => void;
  onOpenNfcModal: (stand: Stand) => void;
  onOpenStudioModal: (stand: Stand) => void;
}

export const StandsManager: React.FC<Props> = ({
  merchant,
  stands,
  onStandCreated,
  onOpenNfcModal,
  onOpenStudioModal,
}) => {
  const [isAddingStand, setIsAddingStand] = useState(false);
  const [newStandName, setNewStandName] = useState('');
  const [newStandType, setNewStandType] = useState<Stand['type']>('plexiglas_a6');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateStand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStandName.trim()) return;
    setIsSubmitting(true);

    try {
      const res = await api.createStand({
        merchantId: merchant.id,
        name: newStandName,
        type: newStandType,
      });
      onStandCreated(res.stand);
      setNewStandName('');
      setIsAddingStand(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadQrDirect = async (stand: Stand) => {
    const fullQrUrl = `${window.location.origin}${stand.qrUrl}`;
    const dataUrl = await QRCode.toDataURL(fullQrUrl, { width: 400, margin: 1 });
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `QR_${stand.id}_${merchant.name.replace(/\s+/g, '_')}.png`;
    a.click();
  };

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h3 className="font-bold text-slate-900 text-sm">
            Supports NFC & QR Code de l'établissement
          </h3>
          <p className="text-xs text-slate-500">
            {stands.length} support{stands.length > 1 ? 's' : ''} configuré{stands.length > 1 ? 's' : ''} • Création gratuite et illimitée
          </p>
        </div>
        <button
          onClick={() => setIsAddingStand(true)}
          className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Ajouter un support (Gratuit)</span>
        </button>
      </div>

      {/* Add Stand Inline Form */}
      {isAddingStand && (
        <form
          onSubmit={handleCreateStand}
          className="p-4 rounded-xl bg-blue-50/50 border border-blue-200 text-xs space-y-3"
        >
          <div className="font-bold text-blue-950">Nouveau support pour {merchant.name} :</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Emplacement / Nom du support *
              </label>
              <input
                type="text"
                required
                value={newStandName}
                onChange={(e) => setNewStandName(e.target.value)}
                placeholder="Ex: Comptoir Caisse 2, Table 8..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Type de support</label>
              <select
                value={newStandType}
                onChange={(e) => setNewStandType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="plexiglas_a6">Plexiglas A6 (105 × 148 mm)</option>
                <option value="plexiglas_a5">Plexiglas A5 (148 × 210 mm)</option>
                <option value="chevalet">Chevalet de table</option>
                <option value="autocollant">Autocollant vitrine</option>
                <option value="nfc_seul">Puce NFC seule (Sans visuel imprimé)</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAddingStand(false)}
              className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-1.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Création...' : 'Valider le support'}
            </button>
          </div>
        </form>
      )}

      {/* Stands Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {stands.map((stand) => (
          <div
            key={stand.id}
            className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 shadow-xs transition flex flex-col justify-between space-y-3"
          >
            {/* Stand Top Info */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">{stand.name}</span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-mono font-bold">
                    {stand.id}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 capitalize block mt-0.5">
                  {stand.type.replace('_', ' ')}
                </span>
              </div>

              {/* Status Badge */}
              {stand.lastProgrammedDate ? (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>NFC {stand.ntagChipType} Gravé</span>
                </span>
              ) : (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200">
                  <Clock className="w-3 h-3" />
                  <span>Non gravé</span>
                </span>
              )}
            </div>

            {/* Scan Metrics */}
            <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-lg bg-slate-50 border border-slate-100 text-center text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block">Total Scans</span>
                <span className="font-black text-slate-900 text-sm">{stand.totalScans}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Puce NFC</span>
                <span className="font-bold text-blue-600 text-sm">{stand.nfcScans}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">QR Code</span>
                <span className="font-bold text-emerald-600 text-sm">{stand.qrScans}</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-1.5 text-xs">
              <div className="flex gap-1.5 flex-wrap">
                <button
                  onClick={() => onOpenNfcModal(stand)}
                  className="px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold flex items-center gap-1 transition"
                  title="Programmer la puce NFC (Android ou iPhone)"
                >
                  <Radio className="w-3.5 h-3.5" />
                  <span>Programmer NFC</span>
                </button>

                <button
                  onClick={() => handleDownloadQrDirect(stand)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold flex items-center gap-1 transition"
                  title="Télécharger le QR Code sans créer de visuel"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>QR Code seul</span>
                </button>

                <button
                  onClick={() => onOpenStudioModal(stand)}
                  className="px-2.5 py-1.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 font-semibold flex items-center gap-1 transition"
                  title="Studio Visuel Plexiglas complet"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Studio Plexi</span>
                </button>
              </div>

              <a
                href={`${window.location.origin}${stand.nfcUrl}&preview=1`}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                title="Tester la redirection en direct"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
