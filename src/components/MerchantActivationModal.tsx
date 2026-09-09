import React, { useState } from 'react';
import { X, Search, CheckCircle2, Building2, MapPin, Star, AlertTriangle, Coins } from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { Merchant, Stand, User } from '../types';

interface Props {
  isOpen: boolean;
  currentUser: User;
  onClose: () => void;
  onMerchantActivated: (merchant: Merchant, defaultStand: Stand, remainingCredits: number) => void;
}

interface PlaceResult {
  placeId: string;
  name: string;
  address: string;
  city: string;
  rating: number;
  userRatingsTotal: number;
  reviewUrl: string;
}

export const MerchantActivationModal: React.FC<Props> = ({
  isOpen,
  currentUser,
  onClose,
  onMerchantActivated,
}) => {
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<PlaceResult[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<PlaceResult | null>(null);
  const [manualReviewCount, setManualReviewCount] = useState('0');
  const [manualRating, setManualRating] = useState('5.0');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [googleReviewUrl, setGoogleReviewUrl] = useState('');
  const [mapsSearchUrl, setMapsSearchUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSearchPlaces = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSearching(true);
    setErrorMessage('');
    setSelectedPlace(null);

    try {
      const res = await api.searchPlaces({ name, city, address });
      setSearchResults(res.results || []);
      setMapsSearchUrl(res.mapsOfficialSearchUrl || '');
      if (res.results && res.results.length > 0) {
        setSelectedPlace(res.results[0]);
        setManualReviewCount(String(res.results[0].userRatingsTotal || 0));
        setManualRating(String(res.results[0].rating || 5.0));
      }
    } catch (err: unknown) {
      console.error(err);
      setErrorMessage('Erreur lors de la recherche du commerce.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectPlace = (place: PlaceResult) => {
    setSelectedPlace(place);
    setName(place.name);
    setManualReviewCount(String(place.userRatingsTotal || 0));
    setManualRating(String(place.rating || 5.0));
  };

  const handleActivate = async () => {
    if (!name.trim() || !city.trim()) {
      setErrorMessage('Veuillez renseigner le nom et la ville.');
      return;
    }

    if (currentUser.role === 'reseller' && currentUser.credits < 1) {
      setErrorMessage('Crédits insuffisants. Vous devez disposer d\'au moins 1 crédit.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await api.activateMerchant({
        name: selectedPlace ? selectedPlace.name : name,
        city: city,
        address: selectedPlace ? selectedPlace.address : address,
        googlePlaceId: selectedPlace?.placeId,
        googleReviewUrl: selectedPlace?.reviewUrl || googleReviewUrl.trim(),
        initialReviewCount: Number(manualReviewCount) || 0,
        initialRating: Number(manualRating) || 5.0,
        contactEmail,
        contactPhone,
      });

      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
      onMerchantActivated(res.merchant, res.defaultStand, res.remainingCredits);
      onClose();
    } catch (err: unknown) {
      console.error(err);
      setErrorMessage(err instanceof Error ? err.message : 'Erreur lors de l\'activation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-blue-600">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Activer un nouvel établissement</h2>
              <p className="text-xs text-slate-500">
                Identification Google Places IDs Only gratuite • Coût : 1 crédit
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

        {/* Credit warning / info */}
        <div className="mt-4 flex items-center justify-between p-3 rounded-xl bg-blue-50/80 border border-blue-200 text-xs">
          <div className="flex items-center gap-2 text-blue-900">
            <Coins className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span>
              Solde actuel : <strong>{currentUser.credits} crédits</strong> • L'activation consomme <strong>1 crédit</strong>
            </span>
          </div>
          <span className="font-semibold px-2 py-0.5 rounded bg-blue-200 text-blue-900 text-[11px]">
            Supports illimités inclus
          </span>
        </div>

        {errorMessage && (
          <div className="mt-3 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSearchPlaces} className="mt-4 space-y-3 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="font-semibold text-slate-700 block mb-1">Nom du commerce *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Boulangerie du Centre, Café des Halles..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Ville *</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ex: Crépy-en-Valois"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Adresse (facultatif mais recommandé)</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Ex: 14 Rue Charles de Gaulle"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={isSearching}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition flex items-center gap-1.5 disabled:opacity-50"
            >
              <Search className="w-3.5 h-3.5" />
              <span>{isSearching ? 'Recherche Google en cours...' : 'Rechercher la fiche Google'}</span>
            </button>
          </div>
        </form>

        {/* Results with visual confirmation */}
        {searchResults.length > 0 && (
          <div className="mt-4">
            <label className="font-bold text-slate-900 text-xs block mb-2">
              Confirmation visuelle de l'établissement (Étape obligatoire) :
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {searchResults.map((place) => (
                <div
                  key={place.placeId}
                  onClick={() => handleSelectPlace(place)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition flex items-center justify-between ${
                    selectedPlace?.placeId === place.placeId
                      ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{place.name}</span>
                      <div className="flex items-center text-amber-500 font-bold text-[11px]">
                        <Star className="w-3 h-3 fill-amber-400 mr-0.5" />
                        <span>{place.rating}</span>
                        <span className="text-slate-400 font-normal ml-1">({place.userRatingsTotal} avis)</span>
                      </div>
                    </div>
                    <p className="text-slate-500 text-[11px] flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{place.address}</span>
                    </p>
                  </div>
                  {selectedPlace?.placeId === place.placeId ? (
                    <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  ) : (
                    <span className="text-[11px] font-semibold text-slate-400">Sélectionner</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs">
          <label className="font-semibold text-slate-700 block mb-1">URL Google réelle de la fiche / demande d'avis *</label>
          <div className="flex gap-2">
            <input
              type="url"
              value={selectedPlace?.reviewUrl || googleReviewUrl}
              onChange={(e) => { setGoogleReviewUrl(e.target.value); setSelectedPlace(null); }}
              placeholder="https://search.google.com/local/writereview?... ou lien Google Maps"
              className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {mapsSearchUrl && <a href={mapsSearchUrl} target="_blank" rel="noreferrer" className="px-3 py-2 rounded-xl bg-white border border-slate-300 font-semibold text-blue-700">Ouvrir Google Maps</a>}
          </div>
          <p className="mt-1.5 text-[11px] text-slate-500">En mode 0 €, aucune fiche Google n'est inventée : copiez ici le lien réel du commerce.</p>
        </div>

        {/* Baseline reviews & contacts */}
        <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="font-semibold text-slate-600 block mb-1">Nombre initial d'avis</label>
            <input
              type="number"
              value={manualReviewCount}
              onChange={(e) => setManualReviewCount(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
            />
          </div>
          <div>
            <label className="font-semibold text-slate-600 block mb-1">Note initiale</label>
            <input
              type="number"
              step="0.1"
              value={manualRating}
              onChange={(e) => setManualRating(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
            />
          </div>
          <div>
            <label className="font-semibold text-slate-600 block mb-1">Email commerçant</label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="contact@commerce.fr"
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
            />
          </div>
          <div>
            <label className="font-semibold text-slate-600 block mb-1">Téléphone</label>
            <input
              type="tel"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="03 44 .."
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
            />
          </div>
        </div>

        {/* Final Confirmation Button */}
        <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleActivate}
            disabled={isSubmitting || (currentUser.role === 'reseller' && currentUser.credits < 1)}
            className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition shadow-sm disabled:opacity-50 flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isSubmitting ? 'Activation...' : 'Confirmer et Activer (1 crédit)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
