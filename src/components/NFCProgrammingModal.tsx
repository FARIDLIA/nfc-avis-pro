import React, { useState } from 'react';
import { X, Smartphone, CheckCircle2, AlertCircle, Copy, Check, Radio, HelpCircle, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Stand, Merchant } from '../types';
import { api } from '../services/api';

interface Props {
  stand: Stand | null;
  merchant: Merchant | null;
  isOpen: boolean;
  onClose: () => void;
  onProgrammedSuccess: (updatedStand: Stand) => void;
}

export const NFCProgrammingModal: React.FC<Props> = ({
  stand,
  merchant,
  isOpen,
  onClose,
  onProgrammedSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'android' | 'iphone'>('android');
  const [selectedChip, setSelectedChip] = useState<'NTAG213' | 'NTAG215' | 'NTAG216'>('NTAG213');
  const [status, setStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen || !stand || !merchant) return null;

  // Complete URL to be programmed onto the NFC chip
  const fullNfcUrl = `${window.location.origin}${stand.nfcUrl}`;

  const copyUrlToClipboard = () => {
    navigator.clipboard.writeText(fullNfcUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Direct Web NFC writing for Android Chrome
  const handleAndroidWebNfcWrite = async () => {
    setStatus('scanning');
    setErrorMessage('');

    // Check if Web NFC is supported
    if (!('NDEFReader' in window)) {
      setStatus('error');
      setErrorMessage(
        "L'API Web NFC n'est pas activée sur ce navigateur. Utilisez Chrome sur Android ou la procédure iPhone / NFC Tools ci-dessous."
      );
      return;
    }

    try {
      // @ts-expect-error NDEFReader is not in standard ts dom lib yet
      const ndef = new window.NDEFReader();
      await ndef.write({
        records: [
          {
            recordType: 'url',
            data: fullNfcUrl,
          },
        ],
      });

      // Mark in backend
      const res = await api.recordProgrammed(stand.id, selectedChip);
      setStatus('success');
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
      onProgrammedSuccess(res.stand);
    } catch (err: unknown) {
      console.error('NFC Write Error:', err);
      setStatus('error');
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Échec de la communication NFC. Assurez-vous que la puce est bien plaquée contre le téléphone.'
      );
    }
  };

  // Manual validation confirmation (for iPhone NFC Tools write)
  const handleManualValidation = async () => {
    try {
      const res = await api.recordProgrammed(stand.id, selectedChip);
      setStatus('success');
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
      onProgrammedSuccess(res.stand);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-blue-600">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Programmation Puce NFC</h2>
              <p className="text-xs text-slate-500">
                {stand.name} • {merchant.name} ({stand.id})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chip Type Selector */}
        <div className="mt-4 flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
          <div>
            <span className="text-xs font-semibold text-slate-700 block">Modèle de puce NFC</span>
            <span className="text-[11px] text-slate-500">
              Recommandé : NTAG213 (144 octets, parfait pour URL)
            </span>
          </div>
          <div className="flex gap-1.5">
            {(['NTAG213', 'NTAG215', 'NTAG216'] as const).map((chip) => (
              <button
                key={chip}
                onClick={() => setSelectedChip(chip)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition ${
                  selectedChip === chip
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* URL Target & Copy */}
        <div className="mt-4">
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            Adresse exacte encodée sur la puce (Redirection ultrarapide)
          </label>
          <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-100 border border-slate-200">
            <code className="text-xs font-mono text-blue-700 truncate flex-1 px-1">
              {fullNfcUrl}
            </code>
            <button
              onClick={copyUrlToClipboard}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition flex-shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copié</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copier</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Device Switcher Tabs */}
        <div className="mt-5 grid grid-cols-2 gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab('android')}
            className={`pb-2 text-xs font-bold transition flex items-center justify-center gap-1.5 border-b-2 ${
              activeTab === 'android'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Android (Écriture Directe)</span>
          </button>
          <button
            onClick={() => setActiveTab('iphone')}
            className={`pb-2 text-xs font-bold transition flex items-center justify-center gap-1.5 border-b-2 ${
              activeTab === 'iphone'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>iPhone (Procédure Gratuite NFC Tools)</span>
          </button>
        </div>

        {/* Tab Content: Android */}
        {activeTab === 'android' && (
          <div className="mt-4 space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 text-slate-700 space-y-1.5">
              <p className="font-semibold text-blue-900">Procédure Chrome Android automatique :</p>
              <p>
                1. Cliquez sur le bouton <strong>"Lancer l'écriture NFC"</strong> ci-dessous.<br />
                2. Approchez immédiatement votre puce NTAG213/215/216 du capteur NFC de votre téléphone.<br />
                3. Maintenez en place jusqu'à la confirmation de succès.
              </p>
            </div>

            {status === 'scanning' && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-center space-y-2">
                <Radio className="w-8 h-8 text-amber-600 mx-auto animate-ping" />
                <p className="font-bold text-amber-900 text-sm">En attente de la puce...</p>
                <p className="text-amber-700 text-xs">
                  Placez la puce NTAG contre le dos de votre smartphone Android.
                </p>
              </div>
            )}

            {status === 'error' && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-red-800">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Erreur d'écriture NFC</p>
                  <p className="text-[11px] mt-0.5">{errorMessage}</p>
                </div>
              </div>
            )}

            {status === 'success' && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-emerald-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div>
                  <p className="font-bold">Puce programmée avec succès !</p>
                  <p className="text-[11px]">
                    L'URL est gravée sur la puce. Testez-la dès maintenant en approchant un téléphone.
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={handleAndroidWebNfcWrite}
              disabled={status === 'scanning'}
              className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition shadow-sm disabled:opacity-50"
            >
              {status === 'scanning' ? 'Détection en cours...' : "Lancer l'écriture NFC Android"}
            </button>
          </div>
        )}

        {/* Tab Content: iPhone */}
        {activeTab === 'iphone' && (
          <div className="mt-4 space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 space-y-2">
              <div className="flex items-center justify-between font-bold text-slate-900">
                <span>Procédure 100% Gratuite avec NFC Tools</span>
                <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded text-slate-700">iOS Safari</span>
              </div>
              <p className="text-slate-600">
                Apple bloque l'écriture NFC directe depuis les navigateurs web. L'écriture se fait en 15 secondes via l'application gratuite officielle <strong>NFC Tools</strong> (disponible sur l'App Store) :
              </p>
              <ol className="list-decimal pl-4 space-y-1 text-slate-700">
                <li>Ouvrez <strong>NFC Tools</strong> sur votre iPhone.</li>
                <li>Appuyez sur l'onglet <strong>Écrire</strong> &gt; <strong>Ajouter un enregistrement</strong>.</li>
                <li>Sélectionnez <strong>URL / Lien</strong>.</li>
                <li>Collez l'URL copiée ci-dessus.</li>
                <li>Appuyez sur <strong>Écrire</strong> et posez l'iPhone sur la puce NTAG.</li>
              </ol>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200">
              <div className="text-emerald-900">
                <p className="font-bold">Vous avez terminé l'écriture avec NFC Tools ?</p>
                <p className="text-[11px]">Marquez ce support comme vérifié et prêt à installer.</p>
              </div>
              <button
                onClick={handleManualValidation}
                className="px-3.5 py-2 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition flex-shrink-0"
              >
                Confirmer l'écriture
              </button>
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Identifiant support : <strong>{stand.id}</strong></span>
          <a
            href={fullNfcUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-blue-600 hover:underline font-semibold"
          >
            <span>Tester le lien dans un nouvel onglet</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
