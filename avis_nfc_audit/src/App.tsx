import React, { useEffect, useState } from 'react';
import { User, Merchant, Stand, GoogleQuotaState } from './types';
import { api } from './services/api';
import { AuthScreen } from './components/AuthScreen';
import { Navbar } from './components/Navbar';
import { DashboardReseller } from './components/DashboardReseller';
import { DashboardMerchant } from './components/DashboardMerchant';
import { DashboardAdmin } from './components/DashboardAdmin';
import { MerchantActivationModal } from './components/MerchantActivationModal';
import { NFCProgrammingModal } from './components/NFCProgrammingModal';
import { PlexiglasStudioModal } from './components/PlexiglasStudioModal';
import { WalletModal } from './components/WalletModal';
import { ExplanationModal } from './components/ExplanationModal';
import { CloudflareExportModal } from './components/CloudflareExportModal';
import { ShareAppModal } from './components/ShareAppModal';
import { OfflineIndicator } from './components/OfflineIndicator';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [availableProfiles, setAvailableProfiles] = useState<User[]>([]);
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [stands, setStands] = useState<Stand[]>([]);
  const [quota, setQuota] = useState<GoogleQuotaState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActivationOpen, setIsActivationOpen] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isExplanationOpen, setIsExplanationOpen] = useState(false);
  const [isCloudflareOpen, setIsCloudflareOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [selectedNfcStand, setSelectedNfcStand] = useState<{ stand: Stand; merchant: Merchant } | null>(null);
  const [selectedStudioStand, setSelectedStudioStand] = useState<{ stand: Stand; merchant: Merchant } | null>(null);

  const loadInitialData = async () => {
    try {
      const auth = await api.getMe(); setCurrentUser(auth.user); setAvailableProfiles(auth.availableProfiles);
      const [m, s, q] = await Promise.all([api.getMerchants(), api.getStands(), api.getQuota()]);
      setMerchants(m); setStands(s); setQuota(q);
    } catch { setCurrentUser(null); setAvailableProfiles([]); setMerchants([]); setStands([]); }
    finally { setIsLoading(false); }
  };
  useEffect(() => { loadInitialData(); }, []);

  const authenticated = async (user: User) => { setCurrentUser(user); setIsLoading(true); await loadInitialData(); };
  const logout = async () => { await api.logout(); setCurrentUser(null); setAvailableProfiles([]); setMerchants([]); setStands([]); };
  const onActivated = (merchant: Merchant, defaultStand: Stand, remainingCredits: number) => { setMerchants(p=>[merchant,...p]); setStands(p=>[defaultStand,...p]); setCurrentUser(u=>u?{...u,credits:remainingCredits}:u); };
  const onProgrammed = (updated: Stand) => setStands(p=>p.map(s=>s.id===updated.id?updated:s));

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"/></div>;
  if (!currentUser) return <AuthScreen onAuthenticated={authenticated}/>;

  return <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
    <OfflineIndicator />
    <Navbar currentUser={currentUser} onLogout={logout} onOpenWallet={()=>setIsWalletOpen(true)} onOpenExplanation={()=>setIsExplanationOpen(true)} onOpenShare={()=>setIsShareOpen(true)}/>
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {currentUser.role==='reseller' && <DashboardReseller currentUser={currentUser} merchants={merchants} stands={stands} quota={quota} onOpenActivationModal={()=>setIsActivationOpen(true)} onOpenWalletModal={()=>setIsWalletOpen(true)} onOpenExplanationModal={()=>setIsExplanationOpen(true)} onOpenCloudflareModal={()=>setIsCloudflareOpen(true)} onOpenNfcModal={(stand,merchant)=>setSelectedNfcStand({stand,merchant})} onOpenStudioModal={(stand,merchant)=>setSelectedStudioStand({stand,merchant})} onRefreshData={loadInitialData}/>} 
      {currentUser.role==='merchant' && <DashboardMerchant currentUser={currentUser} merchants={merchants} stands={stands} onOpenExplanationModal={()=>setIsExplanationOpen(true)} onOpenStudioModal={(stand,merchant)=>setSelectedStudioStand({stand,merchant})}/>} 
      {currentUser.role==='admin' && <DashboardAdmin users={availableProfiles} onRefreshData={loadInitialData} onOpenCloudflareModal={()=>setIsCloudflareOpen(true)} isAdminUnlocked={true} onLockAdmin={logout}/>} 
    </main>
    <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">Avis NFC & QR Pro • PWA sécurisée • QR et NFC indépendants du studio</footer>
    <ShareAppModal isOpen={isShareOpen} onClose={()=>setIsShareOpen(false)}/>
    <MerchantActivationModal isOpen={isActivationOpen} currentUser={currentUser} onClose={()=>setIsActivationOpen(false)} onMerchantActivated={onActivated}/>
    <WalletModal isOpen={isWalletOpen} currentUser={currentUser} onClose={()=>setIsWalletOpen(false)} onCreditsUpdated={(credits)=>setCurrentUser(u=>u?{...u,credits}:u)}/>
    <ExplanationModal isOpen={isExplanationOpen} onClose={()=>setIsExplanationOpen(false)}/>
    <CloudflareExportModal isOpen={isCloudflareOpen} onClose={()=>setIsCloudflareOpen(false)}/>
    {selectedNfcStand && <NFCProgrammingModal stand={selectedNfcStand.stand} merchant={selectedNfcStand.merchant} isOpen={true} onClose={()=>setSelectedNfcStand(null)} onProgrammedSuccess={onProgrammed}/>} 
    {selectedStudioStand && <PlexiglasStudioModal stand={selectedStudioStand.stand} merchant={selectedStudioStand.merchant} isOpen={true} onClose={()=>setSelectedStudioStand(null)}/>} 
  </div>;
}
