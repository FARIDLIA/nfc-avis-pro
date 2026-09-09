import React, { useState } from 'react';
import { Share2, Copy, Check, QrCode, Smartphone, Globe, ExternalLink, X, ShieldCheck, Sparkles, Layers } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareAppModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'link' | 'merchant' | 'install'>('link');

  if (!isOpen) return null;

  // Compute the exact clean URL to share
  const shareUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(shareUrl)}&margin=10`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 p-4 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Share2 className="w-5 h-5 text-blue-200" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight">Partager l'Application PWA</h2>
              <p className="text-xs text-blue-200">Lien public installable pour vos revendeurs & commerçants</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-5 pt-3">
          <button
            onClick={() => setActiveTab('link')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'link'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Lien & QR Code</span>
          </button>
          <button
            onClick={() => setActiveTab('merchant')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'merchant'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Accès Commerçant</span>
          </button>
          <button
            onClick={() => setActiveTab('install')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'install'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Guide d'Installation</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {activeTab === 'link' && (
            <div className="space-y-5">
              {/* The Link to Share */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Lien officiel de l'application à partager
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-300 text-xs font-mono text-slate-800 truncate select-all">
                    {shareUrl}
                  </div>
                  <button
                    onClick={handleCopy}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition shrink-0 ${
                      copied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Copié !</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copier</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500">
                  Partagez ce lien par SMS, WhatsApp, e-mail ou QR code. Les destinataires peuvent ouvrir l'application directement dans n'importe quel navigateur mobile ou bureau.
                </p>
              </div>

              {/* QR Code Scan on Mobile */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center gap-5">
                <div className="bg-white p-2 rounded-xl shadow-xs border border-slate-200 shrink-0">
                  <img
                    src={qrApiUrl}
                    alt="QR Code d'installation de l'application"
                    className="w-36 h-36 object-contain"
                  />
                </div>
                <div className="space-y-2 text-center sm:text-left">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold">
                    <QrCode className="w-3 h-3" />
                    <span>Scan direct au smartphone</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Scannez pour installer instantanément
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Ouvrez l'appareil photo de votre smartphone Android ou iPhone et pointez ce QR code. L'application s'ouvre immédiatement et vous propose de l'ajouter sur votre écran d'accueil sans passer par l'App Store ou Google Play.
                  </p>
                </div>
              </div>

              {/* Security info */}
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">Protection Administrateur Active :</strong>
                  <span className="block mt-0.5 text-amber-800">
                    Même si vous partagez ce lien publiquement, l'espace SuperAdmin reste protégé par un code secret validé uniquement côté serveur.
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'merchant' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-700" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">Comment le commerçant accède à ses stats ?</h4>
                </div>
                <p className="text-xs leading-relaxed text-emerald-800">
                  Chaque commerçant activé (ex : <em>votre établissement</em>) dispose de son propre espace dédié où il visualise :
                </p>
                <ul className="text-xs space-y-1 list-disc list-inside text-emerald-800 pl-1 font-medium">
                  <li>Le nombre total de scans NFC et QR codes en direct</li>
                  <li>Le comparatif de ses avis Google avant/après installation des supports</li>
                  <li>Le téléchargement de ses fiches et supports pour impression</li>
                  <li>Aucun accès aux paramètres revendeurs ni aux crédits du réseau</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Conseil commercial terrain</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Lorsque vous livrez le support Plexiglas au commerçant, faites-lui scanner le QR code de l'application sur son téléphone et installez l'icône sur son écran d'accueil en 15 secondes. Cela valorise le service professionnel et lui permet de suivre ses avis tous les matins.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'install' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">A</span>
                  Sur Android (Google Chrome)
                </h4>
                <ol className="text-xs text-slate-600 space-y-1.5 list-decimal list-inside pl-1">
                  <li>Ouvrez le lien dans <strong>Google Chrome</strong>.</li>
                  <li>Appuyez sur le bouton bleu <strong>"Installer l'App PWA"</strong> en haut de la page.</li>
                  <li>Ou appuyez sur les <strong>3 points verticaux</strong> en haut à droite &gt; <strong>"Installer l'application"</strong>.</li>
                  <li>L'icône "Avis NFC &amp; QR Pro" est ajoutée instantanément sur votre écran d'accueil.</li>
                </ol>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">i</span>
                  Sur iPhone &amp; iPad (Apple Safari)
                </h4>
                <ol className="text-xs text-slate-600 space-y-1.5 list-decimal list-inside pl-1">
                  <li>Ouvrez le lien dans <strong>Safari</strong>.</li>
                  <li>Appuyez sur l'icône <strong>Partager</strong> <span className="inline-block px-1 bg-slate-200 rounded text-[10px]">⎋</span> en bas de l'écran.</li>
                  <li>Faites défiler et sélectionnez <strong>"Sur l'écran d'accueil"</strong>.</li>
                  <li>Appuyez sur <strong>Ajouter</strong> en haut à droite.</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-medium">
            PWA autonome • Fonctionne hors-ligne & en plein écran
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
