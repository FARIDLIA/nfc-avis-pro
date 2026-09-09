import React from 'react';
import { X, Smartphone, QrCode, Zap, CheckCircle2, ShieldAlert, FileText, ArrowRight } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ExplanationModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl my-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-blue-600">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Comprendre le fonctionnement NFC & QR Code</h2>
              <p className="text-xs text-slate-500">Guide officiel du support plexiglas & diagnostic NFC Tools</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-6 text-sm text-slate-700 max-h-[75vh] overflow-y-auto pr-1">
          {/* Question 1: NFC Tools & votre établissement */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4">
            <div className="flex items-center gap-2 text-emerald-800 font-bold mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Pourquoi NFC Tools ouvre bien votre établissement ? Est-ce normal ?</span>
            </div>
            <p className="text-xs text-emerald-900 leading-relaxed">
              <strong>Oui, c'est 100% normal et c'est exactement la bonne logique !</strong><br />
              NFC Tools est un outil technique de diagnostic : lorsqu'il lit la puce NTAG, il extrait l'URL enregistrée et affiche un aperçu QR/Code-barres de cette même URL. Quand un client lambda (sans application technique) approche son téléphone du plexiglas, son système (iOS ou Android) ouvre directement la page sans afficher de code technique.
            </p>
          </div>

          {/* Question 2: Faut-il imprimer le QR Code ? */}
          <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">
            <div className="flex items-center gap-2 text-blue-900 font-bold mb-2">
              <QrCode className="w-4 h-4 text-blue-600" />
              <span>Dois-je obligatoirement imprimer le QR Code sur le plexiglas ?</span>
            </div>
            <div className="space-y-2 text-xs text-slate-700 leading-relaxed">
              <p>
                <strong>Non, ce n'est pas obligatoire.</strong> La puce NFC fonctionne parfaitement toute seule.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>
                  <strong>Si le revendeur ne veut pas créer de visuel imprimé :</strong> il programme simplement la puce NFC, la colle sur son support (ou au dos d'une plaque neutre), et c'est tout. Le client tape son smartphone et l'avis s'ouvre.
                </li>
                <li>
                  <strong>Si le revendeur imprime un visuel (recommandé pour 100% d'avis) :</strong> il intègre le QR Code sur le papier inséré dans le plexiglas. Ainsi, les clients dont le NFC est désactivé peuvent quand même scanner le QR code avec leur appareil photo standard.
                </li>
              </ul>
            </div>
          </div>

          {/* Question 3: Pourquoi passer par le lien de redirection au lieu du lien Google direct ? */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold mb-2">
              <Smartphone className="w-4 h-4 text-slate-700" />
              <span>Pourquoi utiliser l'adresse courte au lieu du lien Google direct ?</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs mt-3">
              <div className="p-3 bg-white rounded-lg border border-red-200">
                <div className="flex items-center gap-1.5 font-bold text-red-700 mb-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Si lien Google direct sur la puce :</span>
                </div>
                <p className="text-slate-600">
                  L'avis s'ouvre, mais <strong>VOUS NE POUVEZ PAS COMPTER LES SCANS</strong>. Impossible de prouver au commerçant le nombre de clients passés par votre support.
                </p>
              </div>

              <div className="p-3 bg-white rounded-lg border border-emerald-200">
                <div className="flex items-center gap-1.5 font-bold text-emerald-700 mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Avec l'adresse courte de redirection :</span>
                </div>
                <p className="text-slate-600">
                  Le serveur enregistre instantanément le scan (+1 compteur, date, canal NFC/QR, modèle iPhone/Android), puis redirige en <strong>0,01 seconde</strong> vers la page d'avis Google !
                </p>
              </div>
            </div>
          </div>

          {/* Anatomie d'un support plexiglas */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">
              Anatomie d'une plaque Plexiglas complète
            </h3>
            <div className="flex flex-col sm:flex-row items-center gap-4 text-xs">
              <div className="w-36 h-48 rounded-lg border-2 border-dashed border-blue-400 bg-blue-50/30 flex flex-col items-center justify-center p-2 text-center relative shadow-sm">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs mb-1">
                  5★
                </div>
                <span className="font-bold text-slate-800 text-[11px] mb-2">votre établissement</span>
                <div className="w-14 h-14 bg-white border border-slate-200 rounded flex items-center justify-center p-1 mb-1">
                  <QrCode className="w-10 h-10 text-slate-800" />
                </div>
                <span className="text-[9px] text-slate-500">QR Code (Appareil photo)</span>
                
                {/* NFC Spot Indicator */}
                <div className="absolute -bottom-2.5 bg-amber-500 text-white px-2 py-0.5 rounded-full text-[9px] font-bold shadow-xs">
                  Puce NFC au dos
                </div>
              </div>

              <div className="flex-1 space-y-2 text-slate-600">
                <p className="font-medium text-slate-800">Deux accès sur le même support :</p>
                <div className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 flex-shrink-0"></span>
                  <p><strong>Puce NFC collée au dos (invisible) :</strong> Le client pose son smartphone dessus, l'avis s'ouvre sans ouvrir d'appli.</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 flex-shrink-0"></span>
                  <p><strong>QR Code visible sur le visuel :</strong> Pour les clients plus âgés ou les téléphones sans NFC.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition"
          >
            Fermer le guide
          </button>
        </div>
      </div>
    </div>
  );
};
