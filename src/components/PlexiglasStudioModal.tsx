import React, { useState, useEffect, useRef } from 'react';
import { X, Printer, Download, Sparkles, Smartphone, Check, Layout, Palette, MessageSquareQuote } from 'lucide-react';
import QRCode from 'qrcode';
import { Stand, Merchant } from '../types';

export const INCENTIVE_CATCHPHRASES = [
  {
    category: '⭐ Les Plus Efficaces & Recommandées (Top Conversion)',
    phrases: [
      'Votre avis compte énormément pour nous !',
      'Aidez notre commerce à grandir !',
      'Satisfait de votre visite ? Dites-le en 1 clic !',
      'Un petit mot pour soutenir notre équipe ?',
      'Votre avis est notre plus belle récompense !',
      'Partagez votre expérience avec nous !',
      'Merci pour votre confiance et votre fidélité !',
      '1 minute pour nous soutenir sur Google ?',
      'Laissez-nous un avis 5 étoiles !',
      'Vous avez aimé ? Recommandez-nous sur Google !',
    ],
  },
  {
    category: '🍽️ Restaurants, Brasseries, Cafés & Hôtellerie',
    phrases: [
      'Vous vous êtes régalé ? Laissez-nous 5 étoiles !',
      'Un bon moment partagé ? Dites-le au Chef !',
      'Le service vous a plu ? Donnez-nous votre avis !',
      'Un régal pour vos papilles ? Partagez votre avis !',
      'Merci pour votre passage gourmand !',
      'Avez-vous passé un agréable repas parmi nous ?',
      'Votre satisfaction à table est notre plus beau plat !',
    ],
  },
  {
    category: '💇 Coiffure, Barbier, Beauté & Instituts',
    phrases: [
      'Satisfait(e) de votre prestation ? Dites-le nous !',
      'Sublimé(e) aujourd’hui ? Partagez votre coup de cœur !',
      'Votre nouveau look vous plaît ? Donnez-nous 5 étoiles !',
      'Un moment de détente réussi ? Laissez votre avis !',
      'Merci de confier votre mise en beauté à notre équipe !',
      'Ravi(e) du résultat ? Recommandez votre salon !',
    ],
  },
  {
    category: '🛍️ Boutiques, Artisans & Commerces de quartier',
    phrases: [
      'Soutenez vos commerçants et artisans locaux !',
      'Trouvé votre bonheur ? Partagez votre avis !',
      'Merci de faire vivre notre boutique de quartier !',
      'Fier de nos créations artisanales ? Notez-nous !',
      'Votre sourire en caisse est notre priorité !',
      'Soutenez le savoir-faire local en un clic !',
    ],
  },
  {
    category: '🛠️ Artisans BTP, Garages & Services Professionnels',
    phrases: [
      'Mission accomplie ? Évaluez la qualité de nos services !',
      'Votre satisfaction est notre fierté quotidienne !',
      'Un travail soigné ? Laissez-nous votre recommandation !',
      'Service rapide et professionnel ? Notez-nous 5 étoiles !',
      'Recommandez notre savoir-faire à votre entourage !',
    ],
  },
  {
    category: '🩺 Santé, Optique, Dentaire & Bien-être',
    phrases: [
      'Ravi(e) de notre prise en charge et de nos soins ?',
      'Une équipe à votre écoute : laissez votre avis !',
      'Votre santé et votre confort sont notre priorité !',
      'Merci pour votre confiance au quotidien !',
    ],
  },
  {
    category: '⚡ Directes, Flash & Percutantes (Action immédiate)',
    phrases: [
      '1 clic = 1 soutien inestimable pour nous !',
      'Scannez, notez et soutenez-nous !',
      'Déposez votre avis en 5 secondes chrono !',
      'Flashez pour booster notre visibilité !',
      'Votre note Google fait toute la différence !',
    ],
  },
];

const POPULAR_SLOGANS = [
  'Votre avis compte énormément pour nous !',
  'Aidez notre commerce à grandir !',
  'Satisfait ? Dites-le en 1 clic !',
  'Vous vous êtes régalé ? 5 étoiles !',
  'Soutenez vos commerçants locaux !',
];

interface Props {
  stand: Stand | null;
  merchant: Merchant | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PlexiglasStudioModal: React.FC<Props> = ({
  stand,
  merchant,
  isOpen,
  onClose,
}) => {
  const [format, setFormat] = useState<'a6' | 'a5' | 'square'>('a6');
  const [theme, setTheme] = useState<'google_blue' | 'slate_dark' | 'warm_amber' | 'clean_white'>('google_blue');
  const [customSlogan, setCustomSlogan] = useState('Aidez notre commerce à grandir !');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (stand) {
      const fullQrUrl = `${window.location.origin}${stand.qrUrl}`;
      QRCode.toDataURL(fullQrUrl, {
        width: 320,
        margin: 1,
        color: {
          dark: theme === 'slate_dark' ? '#0f172a' : '#1e293b',
          light: '#ffffff',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('QR code generation error:', err));
    }
  }, [stand, theme]);

  if (!isOpen || !stand || !merchant) return null;

  // Download raw QR code image only
  const handleDownloadQrOnly = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `QR_${stand.id}_${merchant.name.replace(/\s+/g, '_')}.png`;
    a.click();
  };

  // Print plexiglas sheet
  const handlePrint = () => {
    window.print();
  };

  const getThemeStyles = () => {
    switch (theme) {
      case 'slate_dark':
        return {
          cardBg: 'bg-slate-900 text-white border-slate-700',
          accentBadge: 'bg-blue-600 text-white',
          starColor: 'text-amber-400',
          subtext: 'text-slate-300',
          nfcBadge: 'bg-slate-800 text-blue-400 border border-slate-700',
        };
      case 'warm_amber':
        return {
          cardBg: 'bg-amber-50/90 text-slate-900 border-amber-200',
          accentBadge: 'bg-amber-600 text-white',
          starColor: 'text-amber-500',
          subtext: 'text-amber-900',
          nfcBadge: 'bg-amber-100 text-amber-800 border border-amber-300',
        };
      case 'clean_white':
        return {
          cardBg: 'bg-white text-slate-900 border-slate-200 shadow-lg',
          accentBadge: 'bg-slate-900 text-white',
          starColor: 'text-amber-500',
          subtext: 'text-slate-600',
          nfcBadge: 'bg-slate-100 text-slate-700 border border-slate-200',
        };
      case 'google_blue':
      default:
        return {
          cardBg: 'bg-white text-slate-900 border-blue-200 shadow-xl',
          accentBadge: 'bg-blue-600 text-white',
          starColor: 'text-amber-400',
          subtext: 'text-slate-600',
          nfcBadge: 'bg-blue-50 text-blue-700 border border-blue-200',
        };
    }
  };

  const currentTheme = getThemeStyles();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white">
      <div className="relative w-full max-w-4xl rounded-2xl bg-white p-6 shadow-2xl my-8 print:shadow-none print:p-0 print:m-0 print:border-none">
        {/* Modal Header (Hidden on print) */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 print:hidden">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-blue-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Studio Support Plexiglas</h2>
              <p className="text-xs text-slate-500">
                Personnalisation et export prêt à imprimer pour <strong>{merchant.name}</strong>
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

        {/* Studio Body */}
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-6 print:block">
          {/* Controls column (Hidden on print) */}
          <div className="lg:col-span-5 space-y-4 text-xs print:hidden">
            {/* Format choice */}
            <div>
              <label className="font-semibold text-slate-700 flex items-center gap-1.5 mb-2">
                <Layout className="w-3.5 h-3.5 text-blue-600" />
                <span>Format du support</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'a6', label: 'A6 Plexi', desc: '105 × 148 mm' },
                  { id: 'a5', label: 'A5 Comptoir', desc: '148 × 210 mm' },
                  { id: 'square', label: 'Carré', desc: '100 × 100 mm' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setFormat(item.id as any)}
                    className={`p-2.5 rounded-xl border text-center transition ${
                      format === item.id
                        ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-bold'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="block font-semibold">{item.label}</span>
                    <span className="text-[10px] text-slate-500">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Theme selection */}
            <div>
              <label className="font-semibold text-slate-700 flex items-center gap-1.5 mb-2">
                <Palette className="w-3.5 h-3.5 text-blue-600" />
                <span>Thème graphique</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'google_blue', label: 'Google Pro (Bleu)' },
                  { id: 'slate_dark', label: 'Dark Slate Moderne' },
                  { id: 'warm_amber', label: 'Or & Ambre Chaud' },
                  { id: 'clean_white', label: 'Minimaliste Blanc' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id as any)}
                    className={`p-2 rounded-xl border text-left flex items-center justify-between transition ${
                      theme === t.id
                        ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-bold'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{t.label}</span>
                    {theme === t.id && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Slogan with comprehensive selector */}
            <div className="space-y-2.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                  <MessageSquareQuote className="w-4 h-4 text-blue-600" />
                  <span>Texte d'incitation (Accroche)</span>
                </label>
                <span className="text-[10px] text-slate-400 font-mono">
                  {customSlogan.length} car.
                </span>
              </div>

              {/* Selector dropdown with categorized optgroups */}
              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">
                  Choisir une phrase d'incitation recommandée :
                </label>
                <select
                  value={INCENTIVE_CATCHPHRASES.flatMap((c) => c.phrases).includes(customSlogan) ? customSlogan : ''}
                  onChange={(e) => {
                    if (e.target.value) {
                      setCustomSlogan(e.target.value);
                    }
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-2xs"
                >
                  <option value="">
                    -- Sélectionner parmi les {INCENTIVE_CATCHPHRASES.reduce((acc, c) => acc + c.phrases.length, 0)} phrases d'accroche --
                  </option>
                  {INCENTIVE_CATCHPHRASES.map((group) => (
                    <optgroup key={group.category} label={group.category}>
                      {group.phrases.map((phrase) => (
                        <option key={phrase} value={phrase}>
                          {phrase}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              {/* Quick suggestion tags / pills for 1-click preview */}
              <div className="space-y-1 pt-0.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Accès rapide (Top conversions) :
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_SLOGANS.map((slogan) => (
                    <button
                      key={slogan}
                      type="button"
                      onClick={() => setCustomSlogan(slogan)}
                      className={`px-2 py-1 rounded-lg text-[10.5px] transition text-left ${
                        customSlogan === slogan
                          ? 'bg-blue-600 text-white font-bold shadow-2xs'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      {slogan}
                    </button>
                  ))}
                </div>
              </div>

              {/* Editable custom input */}
              <div className="pt-1 border-t border-slate-200/70">
                <label className="text-[11px] font-medium text-slate-600 block mb-1">
                  Personnaliser ou ajuster l'accroche :
                </label>
                <input
                  type="text"
                  value={customSlogan}
                  onChange={(e) => setCustomSlogan(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                  placeholder="Ex: Laissez-nous un avis 5 étoiles !"
                  maxLength={95}
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Idéal : 30 à 60 caractères pour une lisibilité parfaite sur le support physique.
                </p>
              </div>
            </div>

            {/* Decoupled alert: If they only want QR, they can download it directly */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <p className="font-semibold text-slate-800 mb-1">
                Pas besoin de visuel ?
              </p>
              <p className="text-slate-500 text-[11px] mb-2.5">
                Vous pouvez télécharger directement le QR Code seul pour l'utiliser dans votre propre maquette ou imprimer des étiquettes.
              </p>
              <button
                onClick={handleDownloadQrOnly}
                className="w-full py-2 px-3 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5 text-blue-600" />
                <span>Télécharger le QR Code seul (PNG)</span>
              </button>
            </div>

            {/* Actions */}
            <div className="pt-2 flex gap-2">
              <button
                onClick={handlePrint}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimer le visuel (A6/A5)</span>
              </button>
            </div>
          </div>

          {/* Visual Preview column */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center p-4 bg-slate-100 rounded-2xl print:bg-white print:p-0">
            <div
              ref={printRef}
              className={`w-[290px] ${
                format === 'square' ? 'h-[290px]' : format === 'a5' ? 'h-[420px]' : 'h-[390px]'
              } rounded-2xl border-2 p-5 flex flex-col items-center justify-between text-center relative transition-all duration-200 ${
                currentTheme.cardBg
              }`}
            >
              {/* Header Badge */}
              <div className="w-full flex items-center justify-between border-b pb-2 border-current/10">
                <div className="flex items-center gap-1 font-bold text-xs tracking-wide">
                  <span className="text-blue-500 font-black">G</span>
                  <span className="text-red-500 font-black">o</span>
                  <span className="text-amber-500 font-black">o</span>
                  <span className="text-blue-500 font-black">g</span>
                  <span className="text-emerald-500 font-black">l</span>
                  <span className="text-red-500 font-black">e</span>
                  <span className="ml-1 opacity-75">Avis</span>
                </div>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-sm ${currentTheme.starColor}`}>★</span>
                  ))}
                </div>
              </div>

              {/* Business Name & Slogan */}
              <div className="my-auto py-2">
                <h3 className="font-extrabold text-base tracking-tight leading-tight">
                  {merchant.name}
                </h3>
                <p className={`text-[11px] font-medium mt-1 ${currentTheme.subtext}`}>
                  {customSlogan}
                </p>
              </div>

              {/* QR Code */}
              <div className="p-2.5 bg-white rounded-xl shadow-xs border border-slate-200">
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="QR Code Avis" className="w-28 h-28 object-contain" />
                ) : (
                  <div className="w-28 h-28 flex items-center justify-center text-xs text-slate-400">
                    Génération QR...
                  </div>
                )}
              </div>

              {/* NFC Sensor Zone */}
              <div className="w-full mt-3">
                <div className={`py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 text-[10px] font-bold ${currentTheme.nfcBadge}`}>
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Posez votre smartphone ici (NFC)</span>
                </div>
                <span className="text-[9px] opacity-60 block mt-1">
                  Ou ouvrez votre appareil photo pour scanner le QR
                </span>
              </div>

              {/* Small Stand Code for tracking */}
              <span className="text-[8px] opacity-40 font-mono absolute bottom-1 right-2">
                {stand.id}
              </span>
            </div>

            <p className="text-[11px] text-slate-500 mt-3 print:hidden">
              Aperçu en temps réel • Imprimez directement sur papier 200g pour insérer dans votre présentoir plexiglas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
