import {
  User,
  Merchant,
  Stand,
  CreditTransaction,
  CreditPack,
  GoogleQuotaState,
} from '../types';

export const api = {
  // Authentication & Profiles
  async getMe(): Promise<{ user: User; availableProfiles: User[] }> {
    const res = await fetch('/api/auth/me');
    if (!res.ok) throw new Error('Impossible de charger le profil');
    return res.json();
  },

  async login(email: string, password: string): Promise<{ success: boolean; user: User }> {
    const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
    if (!res.ok) { const e = await res.json().catch(()=>({})); throw new Error(e.error || 'Connexion impossible'); } return res.json();
  },

  async adminLogin(code: string): Promise<{ success: boolean; user: User }> {
    const res = await fetch('/api/auth/admin-login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code }) });
    if (!res.ok) { const e = await res.json().catch(()=>({})); throw new Error(e.error || 'Accès administrateur refusé'); } return res.json();
  },

  async logout(): Promise<void> { await fetch('/api/auth/logout', { method: 'POST' }); },

  async verifyAdminCode(code: string): Promise<{ success: boolean }> {
    const res = await fetch('/api/auth/verify-admin-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Code administrateur incorrect");
    }
    return res.json();
  },

  async registerUser(data: {
    name: string;
    email: string;
    phone?: string;
    city?: string;
    password: string;
  }): Promise<{ success: boolean; user: User; message?: string }> {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Erreur lors de l'inscription");
    }
    return res.json();
  },

  async adminCreateReseller(data: {
    name: string;
    email: string;
    phone?: string;
    city?: string;
    initialCredits?: number;
    notes?: string;
    paymentMethod?: string;
    adminCode?: string;
    password: string;
  }): Promise<{ success: boolean; user: User }> {
    const res = await fetch('/api/admin/create-reseller', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(data.adminCode ? { 'x-admin-code': data.adminCode } : {}),
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Erreur lors de la création du revendeur');
    }
    return res.json();
  },

  // Wallet
  async getWallet(): Promise<{ credits: number; transactions: CreditTransaction[]; packs: CreditPack[]; freeMode: boolean; paymentProvider: string }> {
    const res = await fetch('/api/wallet');
    if (!res.ok) throw new Error('Erreur chargement portefeuille');
    return res.json();
  },

  async adjustCreditsAdmin(data: {
    targetUserId: string;
    amount: number;
    description: string;
    paymentMethod: string;
    adminCode?: string;
  }): Promise<{ success: boolean; updatedCredits: number; transaction: CreditTransaction }> {
    const res = await fetch('/api/admin/adjust-credits', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(data.adminCode ? { 'x-admin-code': data.adminCode } : {}),
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Erreur ajustement crédits');
    }
    return res.json();
  },

  async toggleUserStatus(targetUserId: string, adminCode?: string): Promise<{ success: boolean; status: 'active' | 'suspended' }> {
    const res = await fetch('/api/admin/toggle-status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(adminCode ? { 'x-admin-code': adminCode } : {}),
      },
      body: JSON.stringify({ targetUserId, adminCode }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Erreur statut utilisateur');
    }
    return res.json();
  },

  // Merchants
  async getMerchants(): Promise<Merchant[]> {
    const res = await fetch('/api/merchants');
    if (!res.ok) throw new Error('Erreur chargement commerces');
    return res.json();
  },

  async activateMerchant(data: {
    name: string;
    city: string;
    address: string;
    googlePlaceId?: string;
    googleReviewUrl?: string;
    initialReviewCount: number;
    initialRating: number;
    contactEmail?: string;
    contactPhone?: string;
  }): Promise<{ success: boolean; merchant: Merchant; defaultStand: Stand; remainingCredits: number }> {
    const res = await fetch('/api/merchants/activate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Erreur lors de l'activation du commerce");
    }
    return res.json();
  },

  async updateMerchantReviews(
    id: string,
    data: { reviewCount?: number; rating?: number; source?: 'manual' | 'google_sync' }
  ): Promise<{ success: boolean; merchant: Merchant; quota: GoogleQuotaState }> {
    const res = await fetch(`/api/merchants/${id}/update-reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Erreur mise à jour avis');
    }
    return res.json();
  },

  // Stands
  async getStands(merchantId?: string): Promise<Stand[]> {
    const url = merchantId ? `/api/stands?merchantId=${merchantId}` : '/api/stands';
    const res = await fetch(url);
    if (!res.ok) throw new Error('Erreur chargement des supports');
    return res.json();
  },

  async createStand(data: {
    merchantId: string;
    name: string;
    type: Stand['type'];
    ntagChipType?: Stand['ntagChipType'];
  }): Promise<{ success: boolean; stand: Stand }> {
    const res = await fetch('/api/stands', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Erreur création support');
    return res.json();
  },

  async recordProgrammed(id: string, ntagChipType: string): Promise<{ success: boolean; stand: Stand }> {
    const res = await fetch(`/api/stands/${id}/record-programmed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ntagChipType }),
    });
    if (!res.ok) throw new Error('Erreur enregistrement programmation');
    return res.json();
  },

  // Places Search & Quota
  async searchPlaces(query: { name: string; city?: string; address?: string }) {
    const params = new URLSearchParams();
    params.set('name', query.name);
    if (query.city) params.set('city', query.city);
    if (query.address) params.set('address', query.address);
    const res = await fetch(`/api/places/search?${params.toString()}`);
    if (!res.ok) throw new Error('Erreur recherche Google Places');
    return res.json();
  },

  async getQuota(): Promise<GoogleQuotaState> {
    const res = await fetch('/api/places/quota');
    if (!res.ok) throw new Error('Erreur quota');
    return res.json();
  },

  // Stats Overview
  async getStatsOverview() {
    const res = await fetch('/api/stats/overview');
    if (!res.ok) throw new Error('Erreur statistiques');
    return res.json();
  },

  // Cloudflare Zero-Cost Export
  async getCloudflareExport() {
    const res = await fetch('/api/cloudflare/export');
    if (!res.ok) throw new Error('Erreur export Cloudflare');
    return res.json();
  },
};
