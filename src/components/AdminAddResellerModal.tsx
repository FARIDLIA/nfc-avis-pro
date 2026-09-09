import React, { useState } from 'react';
import { X, UserPlus, Coins, ShieldCheck, Mail, Phone, MapPin, Building, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { User } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onResellerCreated: (user: User) => void;
}

export const AdminAddResellerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onResellerCreated,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [initialCredits, setInitialCredits] = useState('10');
  const [password, setPassword] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'manual_transfer' | 'cash' | 'card_simulation'>('manual_transfer');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || password.length < 8) {
      setErrorMessage('Nom, e-mail et mot de passe de 8 caractères minimum requis.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await api.adminCreateReseller({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        city: city.trim() || undefined,
        initialCredits: parseInt(initialCredits, 10) || 0,
        paymentMethod,
        notes: notes.trim() || `Création compte revendeur + ${initialCredits} crédits`,
        password,
      });

      onResellerCreated(res.user);
      onClose();
      // Reset form
      setName('');
      setEmail('');
      setPhone('');
      setCity('');
      setInitialCredits('10');
      setPassword('');
      setNotes('');
    } catch (err: unknown) {
      console.error(err);
      setErrorMessage(err instanceof Error ? err.message : 'Erreur lors de la création du revendeur');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-50 text-red-600">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Créer un Compte Revendeur</h2>
              <p className="text-xs text-slate-500">
                Attribution manuelle par l'administrateur avec solde initial
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

        {errorMessage && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          <div>
            <label className="font-semibold text-slate-700 flex items-center gap-1.5 mb-1">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              <span>Nom complet / Raison sociale de l'agence *</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Alexandre Martin (Com&Web Agence)"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 flex items-center gap-1.5 mb-1">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>Adresse e-mail professionnelle *</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ex: alexandre@comweb.fr"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Mot de passe initial *</label>
            <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="8 caractères minimum" className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 flex items-center gap-1.5 mb-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>Téléphone</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ex: 06 12 34 56 78"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 flex items-center gap-1.5 mb-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>Ville / Région</span>
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ex: Lyon (69)"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Initial Credits Allocation */}
          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-2.5">
            <label className="font-bold text-amber-950 flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-amber-600" />
              <span>Dotation initiale de crédits (Activation immédiate)</span>
            </label>

            <div className="grid grid-cols-4 gap-2">
              {['0', '5', '10', '25'].map((cr) => (
                <button
                  key={cr}
                  type="button"
                  onClick={() => setInitialCredits(cr)}
                  className={`py-1.5 rounded-lg font-bold border transition ${
                    initialCredits === cr
                      ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                      : 'bg-white text-slate-700 border-amber-200 hover:bg-amber-100/50'
                  }`}
                >
                  {cr === '0' ? '0 crédit' : `${cr} crédits`}
                </button>
              ))}
            </div>

            <div className="pt-1 flex items-center gap-2">
              <span className="text-[11px] text-amber-800 font-medium">Ou personnalisé :</span>
              <input
                type="number"
                min="0"
                max="1000"
                value={initialCredits}
                onChange={(e) => setInitialCredits(e.target.value)}
                className="w-24 px-2 py-1 rounded-lg border border-amber-300 bg-white font-bold text-center text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Mode d'encaissement du pack initial (Traçabilité comptable)
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="manual_transfer">Virement bancaire professionnel reçu</option>
              <option value="cash">Règlement en espèces / remise directe</option>
              <option value="card_simulation">Carte bancaire (Payé en ligne)</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Notes internes / Référence de commande (Optionnel)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Pack 10 crédits facturé + Support A6 offert"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Submit */}
          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 font-bold text-slate-700 transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold flex items-center justify-center gap-1.5 shadow-xs transition"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isSubmitting ? 'Création...' : 'Créer le revendeur'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
