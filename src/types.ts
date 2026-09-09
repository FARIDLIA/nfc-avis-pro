export type UserRole = 'admin' | 'reseller' | 'merchant';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  credits: number;
  status: 'active' | 'suspended';
  merchantId?: string; // If role === 'merchant'
  phone?: string;
  city?: string;
  createdAt: string;
}

export interface CreditTransaction {
  id: string;
  userId: string;
  amount: number; // positive for recharge, negative for deduction
  type: 'purchase' | 'merchant_activation' | 'admin_adjustment' | 'refund';
  description: string;
  performedBy: string; // admin email or 'system' or payment method
  paymentMethod?: 'manual_transfer' | 'cash' | 'card_simulation' | 'stripe_ready';
  date: string;
  balanceAfter: number;
}

export interface Merchant {
  id: string;
  resellerId: string;
  name: string;
  city: string;
  address: string;
  googlePlaceId: string;
  googleReviewUrl: string;
  initialReviewCount: number;
  currentReviewCount: number;
  initialRating: number;
  currentRating: number;
  lastReviewSyncDate: string;
  activatedAt: string;
  contactEmail?: string;
  contactPhone?: string;
  totalScans: number;
  activeStandsCount: number;
}

export interface Stand {
  id: string; // e.g. ST-CRPY-01
  merchantId: string;
  name: string; // e.g. "Comptoir Caisse 1", "Table Terrasse"
  type: 'plexiglas_a6' | 'plexiglas_a5' | 'chevalet' | 'autocollant' | 'nfc_seul';
  nfcCode: string;
  nfcUrl: string; // short redirection URL: /s/ST-CRPY-01?t=nfc
  qrUrl: string;  // short redirection URL: /s/ST-CRPY-01?t=qr
  nfcScans: number;
  qrScans: number;
  totalScans: number;
  lastProgrammedDate?: string;
  ntagChipType: 'NTAG213' | 'NTAG215' | 'NTAG216';
  createdAt: string;
}

export interface ScanEvent {
  id: string;
  standId: string;
  merchantId: string;
  type: 'nfc' | 'qr';
  timestamp: string;
  deviceType: 'ios' | 'android' | 'desktop' | 'other';
  userAgent?: string;
  ipHash?: string;
}

export interface GoogleQuotaState {
  dailyCallsUsed: number;
  dailyLimit: number; // default 30
  monthlyCallsUsed: number;
  monthlyLimit: number; // default 930 (under 1000 Place Details free tier)
  lastResetDay: string;
  lastResetMonth: string;
}

export interface CreditPack {
  credits: number;
  priceTotal: number;
  pricePerCredit: number;
  badge?: string;
  savingsPercentage: number;
}
