import React, { useState } from 'react';
import { Shield, KeyRound, AlertCircle, X, Lock } from 'lucide-react';
import { api } from '../services/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (code: string) => void;
  title?: string;
  description?: string;
}

export const AdminSecurityModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSuccess,
  title = "Espace Direction & SuperAdmin",
  description = "Cet espace est strictement confidentiel. Veuillez saisir le code d'accès administrateur pour déverrouiller la console.",
}) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await api.verifyAdminCode(code.trim());
      onSuccess(code.trim());
      setCode('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Code d'accès incorrect.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeypad = (digit: string) => {
    if (code.length < 6) {
      setCode((prev) => prev + digit);
      setError('');
    }
  };

  const handleBackspace = () => {
    setCode((prev) => prev.slice(0, -1));
    setError('');
  };

  const handleClear = () => {
    setCode('');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 p-4 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-14 h-14 mx-auto rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center mb-3">
            <Lock className="w-7 h-7 text-red-400" />
          </div>
          <h3 className="text-lg font-black tracking-tight">{title}</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            {description}
          </p>
        </div>

        {/* Body */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 text-center">
                Code secret d'accès
              </label>
              <div className="relative">
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={6}
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value.replace(/\D/g, ''));
                    setError('');
                  }}
                  placeholder="••••••"
                  autoFocus
                  className="w-full text-center text-2xl font-mono tracking-widest py-3 px-4 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none"
                />
                <KeyRound className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-start gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            {/* Virtual Keypad for quick mobile input */}
            <div className="grid grid-cols-3 gap-2 max-w-[260px] mx-auto pt-1">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleKeypad(digit)}
                  className="h-11 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 font-bold text-base transition flex items-center justify-center"
                >
                  {digit}
                </button>
              ))}
              <button
                type="button"
                onClick={handleClear}
                className="h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 font-semibold text-xs transition flex items-center justify-center"
              >
                Effacer
              </button>
              <button
                type="button"
                onClick={() => handleKeypad('0')}
                className="h-11 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 font-bold text-base transition flex items-center justify-center"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleBackspace}
                className="h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition flex items-center justify-center"
              >
                ⌫
              </button>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={code.length === 0 || isLoading}
                className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                {isLoading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    <span>Déverrouiller</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
