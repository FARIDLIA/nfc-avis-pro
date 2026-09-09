import React, { useState, useEffect } from 'react';
import { X, Cloud, Copy, Check, Terminal, Database, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CloudflareExportModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [data, setData] = useState<{
    workerScript: string;
    d1SchemaSql: string;
    cloudflareLimits: Record<string, string>;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<'worker' | 'd1' | 'guide'>('guide');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      api.getCloudflareExport().then(setData).catch(console.error);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-orange-50 text-orange-600">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Déploiement 0 € Cloudflare & D1</h2>
              <p className="text-xs text-slate-500">
                100 000 requêtes/jour gratuites • Base de données D1 5 Go gratuite • Zéro abonnement
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

        {/* Quota overview badges */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 block">Workers Free</span>
            <span className="font-bold text-slate-900">100k req / jour</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 block">D1 Lectures</span>
            <span className="font-bold text-slate-900">5 millions / jour</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 block">D1 Écritures</span>
            <span className="font-bold text-slate-900">100k / jour</span>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
            <span className="text-[10px] text-emerald-700 block">Coût mensuel</span>
            <span className="font-extrabold text-emerald-800">0,00 € TTC</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-5 flex gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'guide'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Guide d'installation (3 étapes)</span>
          </button>
          <button
            onClick={() => setActiveTab('worker')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'worker'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Code worker.js</span>
          </button>
          <button
            onClick={() => setActiveTab('d1')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'd1'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Schéma SQL D1</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-4 text-xs">
          {activeTab === 'guide' && (
            <div className="space-y-3 text-slate-700">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <p className="font-bold text-slate-900">
                  Déployer gratuitement et sans carte bancaire sur Cloudflare :
                </p>
                <ol className="list-decimal pl-5 space-y-1.5 leading-relaxed">
                  <li>
                    <strong>Créez un compte gratuit sur Cloudflare.com</strong> (aucune carte bancaire requise).
                  </li>
                  <li>
                    Allez dans <strong>Workers & Pages &gt; D1 SQL Database</strong> &gt; Cliquez sur <strong>Create Database</strong> (nommez-la <code className="bg-white px-1 py-0.5 rounded border border-slate-300">avis-nfc-db</code>), puis collez le <strong>Schéma SQL D1</strong> de l'onglet ci-dessus.
                  </li>
                  <li>
                    Créez un <strong>Worker</strong>, collez le contenu du fichier <code className="bg-white px-1 py-0.5 rounded border border-slate-300">worker.js</code> et reliez la base D1 dans les paramètres (variable <code className="bg-white px-1 py-0.5 rounded border border-slate-300">DB</code>).
                  </li>
                </ol>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
                <p className="font-bold">Résultat :</p>
                <p className="mt-0.5">
                  Vos redirections s'exécutent en moins de <strong>15 millisecondes</strong> mondialement, sans aucun coût d'hébergement, avec comptage direct des scans et isolation totale des données.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'worker' && data && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-semibold">Script Worker complet :</span>
                <button
                  onClick={() => handleCopy(data.workerScript)}
                  className="flex items-center gap-1 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-bold"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copié !' : 'Copier le script'}</span>
                </button>
              </div>
              <pre className="p-3.5 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-xl overflow-x-auto max-h-64 leading-relaxed">
                {data.workerScript}
              </pre>
            </div>
          )}

          {activeTab === 'd1' && data && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-semibold">Tables & Index SQLite D1 :</span>
                <button
                  onClick={() => handleCopy(data.d1SchemaSql)}
                  className="flex items-center gap-1 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-bold"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copié !' : 'Copier le schéma'}</span>
                </button>
              </div>
              <pre className="p-3.5 bg-slate-900 text-amber-300 font-mono text-[11px] rounded-xl overflow-x-auto max-h-64 leading-relaxed">
                {data.d1SchemaSql}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
