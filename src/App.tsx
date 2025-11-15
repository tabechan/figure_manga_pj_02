import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Share2, ShoppingBag, Calendar, Newspaper, MessageCircle, User, Lock, Search, Plus, Minus, ArrowLeft, Settings, Mail, Shield, FileText, Edit2, Check, X } from 'lucide-react';

// Components
import { FigureButton } from './components/FigureButton';
import { FigureCard, FigureCardHeader, FigureCardContent, FigureCardActions } from './components/FigureCard';
import { FigureTabs } from './components/FigureTabs';
import { FigureBadge } from './components/FigureBadge';
import { FigureInput, NumberStepper } from './components/FigureInput';
import { FigureListItem } from './components/FigureListItem';
import { AppHeader } from './components/AppHeader';
import { DrawerMenu } from './components/DrawerMenu';
import { QRModal } from './components/QRModal';
import { ViewerControls } from './components/ViewerControls';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { WorksScreen as WorksScreenComponent } from './components/WorksScreen';
import { WorkDetailScreen as WorkDetailScreenComponent } from './components/WorkDetailScreen';
import { TopScreen as TopScreenComponent } from './components/TopScreen';
import { PdfCanvasViewer } from './components/PdfCanvasViewer';
import { useAuth } from './context/AuthContext';
import { api } from './lib/api';
import figureImage from './assets/3f0192d938aee3a1be9dd7ef4a2591aee906638c.png';
import logoImage from './assets/c118041339660eb8265b788cf84f4fb26dbce194.png';
import authorIcon from './assets/cbbb40ca96db9058ae4adf49b50b5da6c2963d12.png';
import mangaPanel1 from './assets/d923ea8d9694b378cd9352f679578c25190f1afc.png';
import mangaPanel2 from './assets/d7392013300db9d4458faf15895b31bdcc87831c.png';
import mangaPanel3 from './assets/50e339ff04cb0e5b30569bea9b39644ced9c9df6.png';
import additionalFigureImage from './assets/dc9bcb89186aadbcb238063470781e8040d3e48a.png';
import hanakoFigureImage from './assets/2ff577bd64c5f12149ddea3a789d2ecd13bc111f.png';
import sengokuCover from './assets/38f189f6254bfcfd7b831ee2211b43337b04363c.png';
import magicCover from './assets/a23505fcf7d545b73f11f00e0d250bec4a253b39.png';

type Screen = 'login' | 'claim-transition' | 'top' | 'volumes' | 'viewer' | 'lending' | 'goods' | 'goods-detail' | 'cart' | 'manga-purchase' | 'events' | 'event-detail' | 'news' | 'news-detail' | 'works' | 'work-detail' | 'trial-reader' | 'account' | 'account-edit' | 'privacy-policy' | 'terms-of-service' | 'figure-detail' | 'figure-purchase';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export default function App() {
  const { user, loading } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [worksTab, setWorksTab] = useState('owned');
  const [selectedSeriesId, setSelectedSeriesId] = useState<string | null>(null);
  const [lendingDays, setLendingDays] = useState(7);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [pendingTransactionId, setPendingTransactionId] = useState<string | null>(null);
  const [transactionFigure, setTransactionFigure] = useState<any>(null);
  
  // Account edit state
  const [editingField, setEditingField] = useState<string | null>(null);
  const [accountData, setAccountData] = useState({
    username: '太郎',
    email: 'taro@example.com',
    password: '********'
  });
  
  // Viewer state
  const [viewerFigureId, setViewerFigureId] = useState<string | null>(null);
  const [viewerVolumeId, setViewerVolumeId] = useState<string | null>(null);
  const [viewerVolumeNo, setViewerVolumeNo] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(198);
  const [showViewerControls, setShowViewerControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSpread, setIsSpread] = useState(false);

  // Mock data
  const seriesTitle = "魔法学園アドベンチャー";
  const username = "太郎";
  const fallbackFigureImage = "https://images.unsplash.com/photo-1705927450843-3c1abe9b17d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMG1hbmdhJTIwZmlndXJlJTIwY29sbGVjdGlibGV8ZW58MXx8fHwxNzU5NTY1ODAzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
  const mangaCover = "https://images.unsplash.com/photo-1742414304022-b38977ce1533?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5nYSUyMGNvbWljJTIwYm9vayUyMGNvdmVyfGVufDF8fHx8MTc1OTU2NTgwNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
  const merchandiseImage = "https://images.unsplash.com/photo-1569803237283-4af155d9e52b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxqYXBhbmVzZSUyMG1lcmNoYW5kaXNlJTIwa2V5Y2hhaW58ZW58MXx8fHwxNzU5NTY1ODA5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
  
  // Show toast effect
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  // Auto-hide viewer controls
  useEffect(() => {
    if (currentScreen === 'viewer') {
      const timer = setTimeout(() => setShowViewerControls(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [currentScreen, currentPage]);

  // Transaction ID handling (from NFC tap URL) - runs once on mount
  useEffect(() => {
    const handleTransactionUrl = async () => {
      const params = new URLSearchParams(window.location.search);
      const transactionId = params.get('transactionId');

      if (transactionId) {
        // Clean URL
        window.history.replaceState({}, '', window.location.pathname);

        try {
          // Fetch transaction details
          const transaction = await api.getTransaction(transactionId);
          setPendingTransactionId(transactionId);
          setTransactionFigure(transaction.figure);
          
          // Stay on login screen with figure info if not logged in
          setCurrentScreen('login');
        } catch (error) {
          console.error('Failed to fetch transaction:', error);
          setCurrentScreen('login');
        }
      }
    };

    handleTransactionUrl();
  }, []);

  // Handle claim screen when user logs in with pending transaction
  useEffect(() => {
    if (user && pendingTransactionId && currentScreen === 'login') {
      setCurrentScreen('claim-transition');
    }
  }, [user, pendingTransactionId, currentScreen]);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setShowToast(true);
  };

  const handleNavigate = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const handleReadVolume = (figureId: string | null, volumeId: string, volumeNo: number) => {
    setViewerFigureId(figureId);
    setViewerVolumeId(volumeId);
    setViewerVolumeNo(volumeNo);
    setCurrentScreen('viewer');
  };

  const { login } = useAuth();
  
  const handleLogin = async () => {
    try {
      setLoginError('');
      await login(loginEmail, loginPassword);
      
      // If there's a pending transaction, go to claim screen
      if (pendingTransactionId) {
        setCurrentScreen('claim-transition');
      } else {
        setCurrentScreen('works');
      }
    } catch (error: any) {
      setLoginError(error.message || 'ログインに失敗しました');
    }
  };

  useEffect(() => {
    if (user && currentScreen === 'login') {
      setCurrentScreen('top');
    }
  }, [user]);

  // Screen Components
  const LoginScreen = () => (
    <div className="min-h-screen bg-gradient p-4 relative">
      {/* Figure Image directly on background */}
      <div className="flex justify-center pt-16 pb-8">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div
            animate={{ 
              y: [0, -8, 0],
              rotate: [0, 2, 0, -2, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-64 h-80"
          >
            <img
              src={transactionFigure?.imageUrl || figureImage}
              alt="Figure"
              className="w-full h-full object-contain drop-shadow-lg"
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Transaction figure info */}
      {transactionFigure && (
        <div className="max-w-sm mx-auto mb-6">
          <div className="bg-white/90 backdrop-blur rounded-2xl p-4 border border-[#7A5AF8]/20">
            <h3 className="font-bold text-lg mb-2">{transactionFigure.title}</h3>
            <p className="text-sm text-[#555555] mb-2">{transactionFigure.series?.title}</p>
            <div className="flex items-center space-x-2 text-sm text-[#22C55E]">
              <Lock className="w-4 h-4" />
              <span>この作品をおうちに迎える</span>
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-sm mx-auto">
        {/* Login Form */}
        <div className="space-y-4 mb-8">
          {loginError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              {loginError}
            </div>
          )}
          <FigureInput
            type="email"
            placeholder="メールアドレス"
            label="メールアドレス"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
          />
          <FigureInput
            type="password"
            placeholder="パスワード"
            label="パスワード"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
          />
          
          <FigureButton onClick={handleLogin} className="w-full">
            ログイン
          </FigureButton>
          
          <button className="w-full text-center text-[#7A5AF8] py-2">
            パスワードをお忘れですか？
          </button>
        </div>

        {/* Demo credentials hint */}
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-lg mb-6 text-sm">
          <p className="font-semibold">デモアカウント:</p>
          <p>Email: demo@example.com</p>
          <p>Password: password123</p>
        </div>

        {/* Security Info */}
        <div className="flex items-center justify-center space-x-2 mb-6">
          <Lock className="w-4 h-4 text-[#22C55E]" />
          <span className="text-sm text-[#555555]">セキュアな接続・NFC検証済み</span>
        </div>

        {/* Sign Up CTA */}
        <p className="text-center text-[#555555]">
          初めての方は
          <button className="text-[#7A5AF8] ml-1">こちら</button>
        </p>
      </div>
    </div>
  );

  const ClaimTransitionScreen = () => {
    const [claimStatus, setClaimStatus] = useState<'claiming' | 'success' | 'already_owned' | 'error'>('claiming');
    const [claimError, setClaimError] = useState('');

    useEffect(() => {
      const handleClaim = async () => {
        if (!pendingTransactionId) {
          setClaimError('トランザクションIDが見つかりません');
          setClaimStatus('error');
          return;
        }

        try {
          const result = await api.claimFigure(pendingTransactionId);
          
          // Check if already owned
          if (result.alreadyOwned) {
            setClaimStatus('already_owned');
            if (result.seriesId) {
              setSelectedSeriesId(result.seriesId);
            }
          } else {
            setClaimStatus('success');
            if (result.seriesId) {
              setSelectedSeriesId(result.seriesId);
            }
          }
          
          // Redirect to TOP screen after 2 seconds
          setTimeout(() => {
            setPendingTransactionId(null);
            setTransactionFigure(null);
            setCurrentScreen('top');
          }, 2000);
        } catch (error: any) {
          console.error('Claim failed:', error);
          setClaimError(error.message || 'エラーが発生しました');
          setClaimStatus('error');
          
          // Redirect to works screen after 3 seconds
          setTimeout(() => {
            setPendingTransactionId(null);
            setTransactionFigure(null);
            setCurrentScreen('works');
          }, 3000);
        }
      };

      handleClaim();
    }, [pendingTransactionId]);

    return (
      <div className="min-h-screen bg-gradient flex items-center justify-center p-4">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: [0.5, 1.2, 1], opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="mb-8"
          >
            <div className="w-48 h-64 mx-auto">
              <ImageWithFallback
                src={transactionFigure?.imageUrl || figureImage}
                alt="Figure"
                className="w-full h-full object-contain drop-shadow-lg"
              />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            {claimStatus === 'claiming' && (
              <>
                <h1 className="mb-4">認証中...</h1>
                <p className="text-[#555555]">しばらくお待ちください</p>
              </>
            )}
            
            {claimStatus === 'success' && (
              <>
                <h1 className="mb-4">仲間が加わりました！</h1>
                <p className="text-[#555555]">『{transactionFigure?.series?.title || seriesTitle}』の世界へようこそ</p>
              </>
            )}
            
            {claimStatus === 'already_owned' && (
              <>
                <h1 className="mb-4">また会えたね！</h1>
                <p className="text-[#555555]">楽しんでね！</p>
              </>
            )}
            
            {claimStatus === 'error' && (
              <>
                <h1 className="mb-4 text-red-600">{claimError}</h1>
                <p className="text-sm text-[#555555]">作品一覧に移動します...</p>
              </>
            )}
          </motion.div>
        </div>
      </div>
    );
  };

  const VolumesScreen = () => (
    <div className="min-h-screen bg-gradient">
      <AppHeader 
        title="作品を読む"
        onMenuClick={() => setIsMenuOpen(true)} 
        showBackButton={true}
        onBackClick={() => setCurrentScreen('top')}
      />
      
      <div className="p-4">
        <div className="grid grid-cols-1 gap-4">
          {Array.from({ length: 6 }, (_, i) => {
            const owned = i < 3;
            return (
              <FigureCard key={i} className={!owned ? 'opacity-60' : ''}>
                <div className="flex items-center space-x-4">
                  {/* Left side - Image */}
                  <div className="flex-shrink-0 w-20 h-28 rounded-[12px] overflow-hidden relative">
                    <ImageWithFallback
                      src={magicCover}
                      alt={`第${i + 1}巻`}
                      className="w-full h-full object-cover"
                    />
                    {owned && (
                      <div className="absolute top-1 right-1">
                        <FigureBadge variant="owned" className="text-xs px-1.5 py-0.5">所持</FigureBadge>
                      </div>
                    )}
                  </div>
                  
                  {/* Center - Title */}
                  <div className="flex-1">
                    <h4>第{i + 1}巻</h4>
                  </div>
                  
                  {/* Right side - Button */}
                  <div className="flex-shrink-0">
                    {owned ? (
                      <FigureButton 
                        size="sm"
                        onClick={() => setCurrentScreen('viewer')}
                      >
                        読む
                      </FigureButton>
                    ) : (
                      <FigureButton 
                        size="sm" 
                        variant="secondary"
                        onClick={() => setCurrentScreen('manga-purchase')}
                      >
                        購入する
                      </FigureButton>
                    )}
                  </div>
                </div>
              </FigureCard>
            );
          })}
        </div>
      </div>
    </div>
  );

  const ViewerScreen = ({ figureId, volumeId, volumeNo }: { figureId: string | null; volumeId: string | null; volumeNo: number | null }) => {
    const [sessionData, setSessionData] = useState<any>(null);
    const [isLoadingSession, setIsLoadingSession] = useState(true);
    const [sessionError, setSessionError] = useState<string | null>(null);
    const [viewerCurrentPage, setViewerCurrentPage] = useState(1);
    const [totalViewerPages, setTotalViewerPages] = useState(100);

    useEffect(() => {
      let sessionId: string | null = null;
      let heartbeatInterval: ReturnType<typeof setInterval> | null = null;

      const startSession = async () => {
        console.log('ViewerScreen: Starting session', { figureId, volumeId, volumeNo });
        if ((!figureId && !volumeId) || !volumeNo) {
          console.error('ViewerScreen: Missing data', { figureId, volumeId, volumeNo });
          setSessionError(`読み込み情報が不足しています`);
          setIsLoadingSession(false);
          return;
        }

        try {
          setIsLoadingSession(true);
          setSessionError(null);
          
          const result = await api.startReading({ figureId: figureId || undefined, volumeId: volumeId || undefined, volumeNo });
          sessionId = result.sessionId;
          setSessionData(result);
          setViewerCurrentPage(1);
          setIsLoadingSession(false);

          // Start heartbeat every 60 seconds
          heartbeatInterval = setInterval(async () => {
            if (sessionId) {
              try {
                await api.sendHeartbeat(sessionId);
              } catch (error) {
                console.error('Heartbeat failed:', error);
              }
            }
          }, 60000);
        } catch (error: any) {
          console.error('Failed to start reading session:', error);
          setSessionError(error.message || '読書セッションの開始に失敗しました');
          setIsLoadingSession(false);
        }
      };

      startSession();

      // Cleanup on unmount
      return () => {
        if (heartbeatInterval) {
          clearInterval(heartbeatInterval);
        }
        if (sessionId) {
          api.stopReading(sessionId).catch(console.error);
        }
      };
    }, [figureId, volumeId, volumeNo]);

    useEffect(() => {
      if (sessionData?.contentAsset?.pageCount) {
        setTotalViewerPages(sessionData.contentAsset.pageCount);
      }
    }, [sessionData]);

    if (isLoadingSession) {
      return (
        <div className="h-screen bg-gradient flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#7A5AF8] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#555555]">読書セッションを開始中...</p>
          </div>
        </div>
      );
    }

    if (sessionError || !sessionData) {
      return (
        <div className="h-screen bg-gradient flex items-center justify-center p-4">
          <div className="text-center">
            <h2 className="text-xl font-bold text-red-600 mb-4">エラー</h2>
            <p className="text-[#555555] mb-6">{sessionError || '読書セッションの開始に失敗しました'}</p>
            <FigureButton onClick={() => setCurrentScreen('top')}>
              TOPに戻る
            </FigureButton>
          </div>
        </div>
      );
    }

    const { contentAsset } = sessionData;

    return (
      <div 
        className="h-screen bg-black relative overflow-hidden"
        onClick={() => setShowViewerControls(!showViewerControls)}
      >
        {/* PDF Viewer */}
        <div className="w-full h-full">
          <PdfCanvasViewer
            pdfUrl="/manga/sample.pdf"
            currentPage={viewerCurrentPage}
            onPageChange={setViewerCurrentPage}
            onLoadComplete={setTotalViewerPages}
          />
        </div>

        {/* Viewer Controls */}
        <ViewerControls
          currentPage={viewerCurrentPage}
          totalPages={totalViewerPages}
          isFullscreen={isFullscreen}
          isSpread={isSpread}
          onPrevPage={() => setViewerCurrentPage(Math.max(1, viewerCurrentPage - 1))}
          onNextPage={() => setViewerCurrentPage(Math.min(totalViewerPages, viewerCurrentPage + 1))}
          onPageJump={setViewerCurrentPage}
          onZoom={() => {}}
          onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
          onToggleSpread={() => setIsSpread(!isSpread)}
          visible={showViewerControls}
        />

        {/* Back Button */}
        {showViewerControls && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentScreen('top');
            }}
            className="absolute top-4 left-4 p-3 bg-black/80 backdrop-blur-sm rounded-[16px] text-white hover:bg-black/90 transition-colors z-20"
          >
            戻る
          </button>
        )}

        {/* Session Info Overlay */}
        {showViewerControls && (
          <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm rounded-[16px] px-4 py-2 text-white text-sm z-20">
            {contentAsset?.title}
          </div>
        )}
      </div>
    );
  };

  const LendingScreen = () => (
    <div className="min-h-screen bg-gradient">
      <AppHeader 
        title="作品貸出"
        onMenuClick={() => setIsMenuOpen(true)} 
        showBackButton={true}
        onBackClick={() => setCurrentScreen('top')}
      />
      
      <div className="p-4 space-y-6">
        <FigureCard>
          <div className="bg-[#F59E0B]/10 border border-[#F59E0B]/20 rounded-[16px] p-4 mb-6">
            <p className="text-sm text-[#F59E0B]">
              ⚠️ 貸出期間中は貸出元アカウントでは閲覧できません
            </p>
          </div>
          
          <div className="space-y-6">
            <NumberStepper
              label="貸出期間（日数）"
              value={lendingDays}
              onChange={setLendingDays}
              min={1}
              max={30}
            />
            
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="terms"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="mt-1 w-4 h-4 text-[#7A5AF8] border-[#E6E8EF] rounded focus:ring-[#7A5AF8]"
              />
              <label htmlFor="terms" className="text-sm text-[#555555]">
                <button className="text-[#7A5AF8]">利用規約</button>に同意します
              </label>
            </div>
            
            <FigureButton 
              className="w-full"
              disabled={!agreeToTerms}
              onClick={() => setIsQRModalOpen(true)}
            >
              貸出用QRコードを発行
            </FigureButton>
          </div>
        </FigureCard>

        {/* Status Card */}
        <FigureCard>
          <FigureCardHeader>
            <h3>貸出状況</h3>
          </FigureCardHeader>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[#555555]">現在の状況</span>
              <FigureBadge variant="status">貸出可能</FigureBadge>
            </div>
            
            <p className="text-sm text-[#555555]">
              複数同時貸出はできません
            </p>
          </div>
        </FigureCard>
      </div>
    </div>
  );

  const GoodsScreen = () => (
    <div className="min-h-screen bg-gradient">
      <AppHeader 
        title="グッズ"
        onMenuClick={() => setIsMenuOpen(true)} 
        showBackButton={true}
        onBackClick={() => setCurrentScreen('top')}
      />
      
      <div className="p-4 space-y-4">
        {/* Search and Filter */}
        <div className="flex space-x-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#555555]" />
            <input
              type="text"
              placeholder="グッズを検索"
              className="w-full pl-10 pr-4 py-3 rounded-[16px] border border-[#E6E8EF] bg-white focus:outline-none focus:ring-2 focus:ring-[#7A5AF8]"
            />
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {['キーホルダー', 'アクリル', 'ポスター', 'タペストリー'].map((filter) => (
            <button
              key={filter}
              className="px-4 py-2 rounded-full bg-white border border-[#E6E8EF] text-sm whitespace-nowrap hover:border-[#7A5AF8] hover:text-[#7A5AF8]"
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 6 }, (_, i) => (
            <FigureCard key={i}>
              <div className="aspect-square rounded-[16px] overflow-hidden mb-3 relative">
                <ImageWithFallback
                  src={merchandiseImage}
                  alt={`商品${i + 1}`}
                  className="w-full h-full object-cover"
                />
                {i === 0 && (
                  <div className="absolute top-2 right-2">
                    <FigureBadge variant="new">新着</FigureBadge>
                  </div>
                )}
                {i === 1 && (
                  <div className="absolute top-2 right-2">
                    <FigureBadge variant="popular">人気</FigureBadge>
                  </div>
                )}
              </div>
              
              <h4 className="mb-2">アクリルキーホルダー {i + 1}</h4>
              <p className="text-[#7A5AF8] font-medium mb-3">¥1,200</p>
              
              <FigureButton 
                size="sm" 
                variant="secondary" 
                className="w-full"
                onClick={() => setCurrentScreen('goods-detail')}
              >
                詳���を見る
              </FigureButton>
            </FigureCard>
          ))}
        </div>
      </div>
    </div>
  );

  const CartScreen = () => {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const updateQuantity = (id: string, newQuantity: number) => {
      if (newQuantity === 0) {
        setCart(prev => prev.filter(item => item.id !== id));
      } else {
        setCart(prev => prev.map(item => 
          item.id === id ? { ...item, quantity: newQuantity } : item
        ));
      }
    };

    return (
      <div className="min-h-screen bg-gradient">
        <AppHeader 
          title="カート"
          onMenuClick={() => setIsMenuOpen(true)} 
          showBackButton={true}
          onBackClick={() => setCurrentScreen('goods')}
        />
        
        <div className="p-4 space-y-6">
          {cart.length === 0 ? (
            <FigureCard>
              <div className="text-center py-12">
                <ShoppingBag className="w-12 h-12 text-[#E6E8EF] mx-auto mb-4" />
                <p className="text-[#555555] mb-4">カートに商品がありません</p>
                <FigureButton 
                  variant="secondary"
                  onClick={() => setCurrentScreen('goods')}
                >
                  グッズを見る
                </FigureButton>
              </div>
            </FigureCard>
          ) : (
            <>
              {/* Cart Items */}
              <div className="space-y-4">
                {cart.map((item) => (
                  <FigureCard key={item.id}>
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-[12px] overflow-hidden">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="mb-1">{item.name}</h4>
                        <p className="text-[#7A5AF8]">¥{item.price.toLocaleString()}</p>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full border border-[#E6E8EF] flex items-center justify-center"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full border border-[#E6E8EF] flex items-center justify-center"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </FigureCard>
                ))}
              </div>

              {/* Order Summary */}
              <FigureCard>
                <FigureCardHeader>
                  <h3>ご注文内容</h3>
                </FigureCardHeader>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-[#555555]">小計</span>
                    <span>¥{total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#555555]">送料</span>
                    <span>¥500</span>
                  </div>
                  <div className="border-t border-[#E6E8EF] pt-3">
                    <div className="flex justify-between">
                      <span>合計</span>
                      <span className="text-[#7A5AF8]">¥{(total + 500).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </FigureCard>

              {/* Shipping Info */}
              <FigureCard>
                <FigureCardHeader>
                  <h3>配送先</h3>
                </FigureCardHeader>
                
                <div className="space-y-4">
                  <FigureInput label="お名前" placeholder="山田太郎" />
                  <FigureInput label="郵便番号" placeholder="123-4567" />
                  <FigureInput label="住所" placeholder="東京都渋谷区..." />
                  <FigureInput label="電話番号" placeholder="090-1234-5678" />
                </div>
              </FigureCard>

              {/* Payment Method */}
              <FigureCard>
                <FigureCardHeader>
                  <h3>お支払い方法</h3>
                </FigureCardHeader>
                
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input type="radio" name="payment" value="card" className="text-[#7A5AF8]" defaultChecked />
                    <span>クレジットカード</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input type="radio" name="payment" value="bank" className="text-[#7A5AF8]" />
                    <span>銀行振込</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input type="radio" name="payment" value="cod" className="text-[#7A5AF8]" />
                    <span>代金引換</span>
                  </label>
                </div>
              </FigureCard>

              {/* Purchase Button */}
              <FigureButton 
                className="w-full h-16"
                onClick={() => {
                  setCart([]);
                  setShowToast(true);
                  setTimeout(() => setCurrentScreen('top'), 1500);
                }}
              >
                ¥{(total + 500).toLocaleString()}で注文する
              </FigureButton>
            </>
          )}
        </div>
      </div>
    );
  };

  const MangaPurchaseScreen = () => {
    const [selectedVolumes, setSelectedVolumes] = useState<number[]>([]);
    const pricePerVolume = 600;
    const total = selectedVolumes.length * pricePerVolume;

    const toggleVolume = (volumeIndex: number) => {
      setSelectedVolumes(prev => 
        prev.includes(volumeIndex) 
          ? prev.filter(v => v !== volumeIndex)
          : [...prev, volumeIndex]
      );
    };

    return (
      <div className="min-h-screen bg-gradient">
        <AppHeader 
          title="作品購入"
          onMenuClick={() => setIsMenuOpen(true)} 
          showBackButton={true}
          onBackClick={() => setCurrentScreen('volumes')}
        />
        
        <div className="p-4 space-y-6">
          <FigureCard>
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-24 rounded-[12px] overflow-hidden">
                <ImageWithFallback
                  src={sengokuCover}
                  alt={seriesTitle}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3>{seriesTitle}</h3>
                <p className="text-[#555555]">各巻 ¥{pricePerVolume}</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4>購入する巻を選択してください</h4>
              
              {Array.from({ length: 6 }, (_, i) => {
                const volumeIndex = i + 3; // 第4巻から第9巻
                const isSelected = selectedVolumes.includes(volumeIndex);
                
                return (
                  <div 
                    key={i}
                    className={`p-4 rounded-[16px] border cursor-pointer transition-colors ${
                      isSelected ? 'border-[#7A5AF8] bg-[#7A5AF8]/5' : 'border-[#E6E8EF] bg-white'
                    }`}
                    onClick={() => toggleVolume(volumeIndex)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4>第{volumeIndex + 1}巻</h4>
                        <p className="text-sm text-[#555555]">デジタル版</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-[#7A5AF8]">¥{pricePerVolume}</span>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? 'border-[#7A5AF8] bg-[#7A5AF8]' : 'border-[#E6E8EF]'
                        }`}>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </FigureCard>

          {selectedVolumes.length > 0 && (
            <>
              {/* Order Summary */}
              <FigureCard>
                <FigureCardHeader>
                  <h3>ご注文内容</h3>
                </FigureCardHeader>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-[#555555]">選択した巻数</span>
                    <span>{selectedVolumes.length}巻</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#555555]">小計</span>
                    <span>¥{total.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-[#E6E8EF] pt-3">
                    <div className="flex justify-between">
                      <span>合計</span>
                      <span className="text-[#7A5AF8]">¥{total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </FigureCard>

              {/* Payment Method */}
              <FigureCard>
                <FigureCardHeader>
                  <h3>お支払い方法</h3>
                </FigureCardHeader>
                
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input type="radio" name="payment" value="card" className="text-[#7A5AF8]" defaultChecked />
                    <span>クレジットカード</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input type="radio" name="payment" value="bank" className="text-[#7A5AF8]" />
                    <span>銀行振込</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input type="radio" name="payment" value="paypal" className="text-[#7A5AF8]" />
                    <span>PayPal</span>
                  </label>
                </div>
              </FigureCard>

              {/* Purchase Notice */}
              <div className="bg-[#7A5AF8]/10 border border-[#7A5AF8]/20 rounded-[16px] p-4">
                <p className="text-sm text-[#7A5AF8]">
                  ✨ 購入後すぐにお読みいただけます。デジタル版のため配送はありません。
                </p>
              </div>

              {/* Purchase Button */}
              <FigureButton 
                className="w-full h-16"
                onClick={() => {
                  setSelectedVolumes([]);
                  setShowToast(true);
                  setTimeout(() => setCurrentScreen('volumes'), 1500);
                }}
              >
                ¥{total.toLocaleString()}で購入する
              </FigureButton>
            </>
          )}
        </div>
      </div>
    );
  };

  const GoodsDetailScreen = () => {
    const [quantity, setQuantity] = useState(1);
    
    return (
      <div className="min-h-screen bg-gradient">
        <AppHeader 
          title="商品詳細"
          onMenuClick={() => setIsMenuOpen(true)} 
          showBackButton={true}
          onBackClick={() => setCurrentScreen('goods')}
        />
        
        <div className="p-4 space-y-6">
          {/* Product Images */}
          <FigureCard>
            <div className="aspect-square rounded-[16px] overflow-hidden mb-4">
              <ImageWithFallback
                src={merchandiseImage}
                alt="アクリルキーホルダー"
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex space-x-2">
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i} className="w-16 h-16 rounded-[12px] overflow-hidden border-2 border-[#7A5AF8]">
                  <ImageWithFallback
                    src={merchandiseImage}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </FigureCard>

          {/* Product Info */}
          <FigureCard>
            <FigureCardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <h2>アクリルキーホルダー</h2>
                  <p className="text-2xl text-[#7A5AF8] font-medium mt-2">¥1,200</p>
                </div>
                <FigureBadge variant="new">新着</FigureBadge>
              </div>
            </FigureCardHeader>
            
            <FigureCardContent>
              <p className="text-[#555555] mb-4">
                『{seriesTitle}』のメインキャラクターをデザインした高品質アクリルキーホルダーです。
                バッグやポーチに付けて、いつでも一緒にお出かけできます。
              </p>
              
              <div className="space-y-4">
                <div>
                  <span className="text-sm text-[#555555]">サイズ: 約5cm × 5cm</span>
                </div>
                <div>
                  <span className="text-sm text-[#555555]">素材: アクリル</span>
                </div>
              </div>
            </FigureCardContent>
            
            <FigureCardActions>
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-sm font-medium">数量:</span>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-full border border-[#E6E8EF] flex items-center justify-center"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-full border border-[#E6E8EF] flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <FigureButton 
                className="w-full"
                onClick={() => {
                  addToCart({
                    id: '1',
                    name: 'アクリルキーホルダー',
                    price: 1200,
                    image: merchandiseImage
                  });
                }}
              >
                カートに追加
              </FigureButton>
            </FigureCardActions>
          </FigureCard>
        </div>
      </div>
    );
  };

  const NewsScreen = () => (
    <div className="min-h-screen bg-gradient">
      <AppHeader 
        title="ニュース"
        onMenuClick={() => setIsMenuOpen(true)} 
        showBackButton={true}
        onBackClick={() => setCurrentScreen('top')}
      />
      
      <div className="p-4 space-y-4">
        {Array.from({ length: 5 }, (_, i) => (
          <FigureListItem
            key={i}
            title={i === 0 ? "新刊第4巻発売決定！" : i === 1 ? "作者サイン会開催のお知らせ" : `ニュース記事 ${i + 1}`}
            meta={`2024.10.${15 - i}`}
            image={i < 2 ? logoImage : undefined}
            onClick={() => setCurrentScreen('news-detail')}
          />
        ))}
      </div>
    </div>
  );

  const AccountScreen = () => (
    <div className="min-h-screen bg-gradient">
      <AppHeader 
        title="アカウント"
        onMenuClick={() => setIsMenuOpen(true)} 
        showBackButton={true}
        onBackClick={() => setCurrentScreen('top')}
      />
      
      <div className="p-4 space-y-6">
        {/* Profile Section */}
        <FigureCard>
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-[#7A5AF8] flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3>{accountData.username}さん</h3>
              <p className="text-[#555555]">{accountData.email}</p>
            </div>
          </div>
          
          <FigureButton 
            variant="secondary" 
            className="w-full"
            onClick={() => setCurrentScreen('account-edit')}
          >
            <Settings className="w-4 h-4 mr-2" />
            アカウント情報を編集
          </FigureButton>
        </FigureCard>

        {/* Settings */}
        <FigureCard>
          <FigureCardHeader>
            <h3>設定</h3>
          </FigureCardHeader>
          
          <div className="space-y-1">
            <FigureListItem
              icon={<Mail className="w-5 h-5" />}
              title="通知設定"
              meta="メール・プッシュ通知"
              onClick={() => {}}
            />
            <FigureListItem
              icon={<Shield className="w-5 h-5" />}
              title="プライ���シー設定"
              meta="データの取り扱い"
              onClick={() => {}}
            />
          </div>
        </FigureCard>

        {/* Legal */}
        <FigureCard>
          <FigureCardHeader>
            <h3>利用規約・プライバシー</h3>
          </FigureCardHeader>
          
          <div className="space-y-1">
            <FigureListItem
              icon={<FileText className="w-5 h-5" />}
              title="利用規約"
              onClick={() => setCurrentScreen('terms-of-service')}
            />
            <FigureListItem
              icon={<FileText className="w-5 h-5" />}
              title="プライバシーポリシー"
              onClick={() => setCurrentScreen('privacy-policy')}
            />
          </div>
        </FigureCard>

        {/* App Info */}
        <FigureCard>
          <FigureCardHeader>
            <h3>アプリ情報</h3>
          </FigureCardHeader>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-[#555555]">バージョン</span>
              <span>1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#555555]">最終更新</span>
              <span>2024.10.15</span>
            </div>
          </div>
        </FigureCard>

        {/* Logout */}
        <FigureButton 
          variant="line" 
          className="w-full text-[#EF4444] border-[#EF4444]"
          onClick={() => setCurrentScreen('login')}
        >
          ログアウト
        </FigureButton>
      </div>
    </div>
  );

  const AccountEditScreen = () => {
    const [tempData, setTempData] = useState(accountData);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSave = (field: string) => {
      setAccountData(prev => ({ ...prev, [field]: tempData[field as keyof typeof tempData] }));
      setEditingField(null);
      setShowToast(true);
    };

    const handlePasswordChange = () => {
      if (newPassword !== confirmPassword) {
        alert('新しいパスワードが一致しません');
        return;
      }
      if (newPassword.length < 8) {
        alert('パスワードは8文字以上で入力してください');
        return;
      }
      setAccountData(prev => ({ ...prev, password: '********' }));
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setEditingField(null);
      setShowToast(true);
    };

    return (
      <div className="min-h-screen bg-gradient">
        <AppHeader 
          title="アカウント編集"
          onMenuClick={() => setIsMenuOpen(true)} 
          showBackButton={true}
          onBackClick={() => setCurrentScreen('account')}
        />
        
        <div className="p-4 space-y-6">
          {/* Username Edit */}
          <FigureCard>
            <FigureCardHeader>
              <div className="flex items-center justify-between">
                <h3>ユーザー名</h3>
                {editingField !== 'username' && (
                  <button
                    onClick={() => setEditingField('username')}
                    className="p-2 hover:bg-[#F6F7FB] rounded-[12px]"
                  >
                    <Edit2 className="w-4 h-4 text-[#7A5AF8]" />
                  </button>
                )}
              </div>
            </FigureCardHeader>
            
            {editingField === 'username' ? (
              <div className="space-y-4">
                <FigureInput
                  value={tempData.username}
                  onChange={(e) => setTempData(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="ユーザー名"
                />
                <div className="flex space-x-2">
                  <FigureButton
                    size="sm"
                    onClick={() => handleSave('username')}
                    className="flex-1"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    保存
                  </FigureButton>
                  <FigureButton
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setTempData(accountData);
                      setEditingField(null);
                    }}
                    className="flex-1"
                  >
                    <X className="w-4 h-4 mr-1" />
                    キャンセル
                  </FigureButton>
                </div>
              </div>
            ) : (
              <p className="text-[#555555]">{accountData.username}</p>
            )}
          </FigureCard>

          {/* Email Edit */}
          <FigureCard>
            <FigureCardHeader>
              <div className="flex items-center justify-between">
                <h3>メールアドレス</h3>
                {editingField !== 'email' && (
                  <button
                    onClick={() => setEditingField('email')}
                    className="p-2 hover:bg-[#F6F7FB] rounded-[12px]"
                  >
                    <Edit2 className="w-4 h-4 text-[#7A5AF8]" />
                  </button>
                )}
              </div>
            </FigureCardHeader>
            
            {editingField === 'email' ? (
              <div className="space-y-4">
                <FigureInput
                  type="email"
                  value={tempData.email}
                  onChange={(e) => setTempData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="メールアドレス"
                />
                <div className="bg-[#F59E0B]/10 border border-[#F59E0B]/20 rounded-[16px] p-4">
                  <p className="text-sm text-[#F59E0B]">
                    ⚠️ メールアドレス変更後、確認メールをお送りします
                  </p>
                </div>
                <div className="flex space-x-2">
                  <FigureButton
                    size="sm"
                    onClick={() => handleSave('email')}
                    className="flex-1"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    保存
                  </FigureButton>
                  <FigureButton
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setTempData(accountData);
                      setEditingField(null);
                    }}
                    className="flex-1"
                  >
                    <X className="w-4 h-4 mr-1" />
                    キャンセル
                  </FigureButton>
                </div>
              </div>
            ) : (
              <p className="text-[#555555]">{accountData.email}</p>
            )}
          </FigureCard>

          {/* Password Change */}
          <FigureCard>
            <FigureCardHeader>
              <div className="flex items-center justify-between">
                <h3>パスワード</h3>
                {editingField !== 'password' && (
                  <button
                    onClick={() => setEditingField('password')}
                    className="p-2 hover:bg-[#F6F7FB] rounded-[12px]"
                  >
                    <Edit2 className="w-4 h-4 text-[#7A5AF8]" />
                  </button>
                )}
              </div>
            </FigureCardHeader>
            
            {editingField === 'password' ? (
              <div className="space-y-4">
                <FigureInput
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="現在のパスワード"
                  label="現在のパスワード"
                />
                <FigureInput
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="新しいパスワード（8文字以上）"
                  label="新しいパスワード"
                />
                <FigureInput
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="新しいパスワード（確認）"
                  label="パスワード確認"
                />
                <div className="flex space-x-2">
                  <FigureButton
                    size="sm"
                    onClick={handlePasswordChange}
                    className="flex-1"
                    disabled={!currentPassword || !newPassword || !confirmPassword}
                  >
                    <Check className="w-4 h-4 mr-1" />
                    変更
                  </FigureButton>
                  <FigureButton
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setCurrentPassword('');
                      setNewPassword('');
                      setConfirmPassword('');
                      setEditingField(null);
                    }}
                    className="flex-1"
                  >
                    <X className="w-4 h-4 mr-1" />
                    キャンセル
                  </FigureButton>
                </div>
              </div>
            ) : (
              <p className="text-[#555555]">********</p>
            )}
          </FigureCard>

          {/* Security Notice */}
          <div className="bg-[#7A5AF8]/10 border border-[#7A5AF8]/20 rounded-[16px] p-4">
            <p className="text-sm text-[#7A5AF8]">
              🔒 アカウント情報の変更は安全に暗号化されて処理されます
            </p>
          </div>
        </div>
      </div>
    );
  };

  const PrivacyPolicyScreen = () => (
    <div className="min-h-screen bg-gradient">
      <AppHeader 
        title="プライバシーポリシー"
        onMenuClick={() => setIsMenuOpen(true)} 
        showBackButton={true}
        onBackClick={() => setCurrentScreen('account')}
      />
      
      <div className="p-4 space-y-6">
        <FigureCard>
          <div className="space-y-6 text-sm">
            <div>
              <h3 className="mb-3">1. 個人情報の収集について</h3>
              <p className="text-[#555555] leading-relaxed">
                Figure-Linked Comicsアプリ（以下「当アプリ」）では、サービスの提供・改善のため、以下の個人情報を収集いたします。
              </p>
              <ul className="mt-2 ml-4 space-y-1 text-[#555555]">
                <li>• メールアドレス</li>
                <li>• ユーザー名</li>
                <li>• 読書履歴・購入履歴</li>
                <li>• デバイス情報</li>
              </ul>
            </div>

            <div>
              <h3 className="mb-3">2. 個人情報の利用目的</h3>
              <p className="text-[#555555] leading-relaxed">
                収集した個人情報は、以下の目的で利用いたします：
              </p>
              <ul className="mt-2 ml-4 space-y-1 text-[#555555]">
                <li>• サービスの提供・運営</li>
                <li>• ユーザーサポート</li>
                <li>• サービス改善・新機能開発</li>
                <li>• 重要なお知らせの送信</li>
              </ul>
            </div>

            <div>
              <h3 className="mb-3">3. 個人情報の第三者提供</h3>
              <p className="text-[#555555] leading-relaxed">
                当社は、法令に基づく場合を除き、ユーザーの同意なく個人情報を第三者に提供することはありません。
              </p>
            </div>

            <div>
              <h3 className="mb-3">4. 個人情報の管理</h3>
              <p className="text-[#555555] leading-relaxed">
                個人情報は適切なセキュ��ティ対策を講じて管理し、不正アクセス・漏洩・滅失・毀損を防止いたします。
              </p>
            </div>

            <div>
              <h3 className="mb-3">5. Cookie・解析ツール</h3>
              <p className="text-[#555555] leading-relaxed">
                当アプリでは、サービス改善のためGoogleアナリティクス等の解析ツールを使用しています。これらのツールは匿名化された情報を収集します。
              </p>
            </div>

            <div>
              <h3 className="mb-3">6. お問い合わせ</h3>
              <p className="text-[#555555] leading-relaxed">
                個人情報の取り扱いに関するお問い合わせは、アプリ内のお問い合わせフォームまたは以下のメールアドレスまでご連絡ください。
              </p>
              <p className="mt-2 text-[#7A5AF8]">privacy@figure-comics.app</p>
            </div>

            <div className="pt-4 border-t border-[#E6E8EF]">
              <p className="text-xs text-[#555555]">
                制定日：2024年4月1日<br />
                最終更新日：2024年10月1日
              </p>
            </div>
          </div>
        </FigureCard>
      </div>
    </div>
  );

  const TermsOfServiceScreen = () => (
    <div className="min-h-screen bg-gradient">
      <AppHeader 
        title="利用規約"
        onMenuClick={() => setIsMenuOpen(true)} 
        showBackButton={true}
        onBackClick={() => setCurrentScreen('account')}
      />
      
      <div className="p-4 space-y-6">
        <FigureCard>
          <div className="space-y-6 text-sm">
            <div>
              <h3 className="mb-3">第1条（適用）</h3>
              <p className="text-[#555555] leading-relaxed">
                本規約は、Figure-Linked Comics株式会社（以下「当社」）が提供するFigure-Linked Comicsアプリ（以下「本サービス」）の利用条件を定めるものです。
              </p>
            </div>

            <div>
              <h3 className="mb-3">第2条（利用登録）</h3>
              <p className="text-[#555555] leading-relaxed">
                本サービスの利用を希望する方は、本規約に同意の上、当社の定める方法によって利用登録を申請し、当社がこれを承認することによって、利用登録が完了するものとします。
              </p>
            </div>

            <div>
              <h3 className="mb-3">第3条（禁止事項）</h3>
              <p className="text-[#555555] leading-relaxed">
                ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません：
              </p>
              <ul className="mt-2 ml-4 space-y-1 text-[#555555]">
                <li>• 法令または公序良俗に反する行為</li>
                <li>• 犯罪行為に関連する行為</li>
                <li>• 他のユーザーまたは第三者の知的財産権を侵害する行為</li>
                <li>• コンテンツの不正コピー・配布</li>
                <li>• システムへの不正アクセス</li>
              </ul>
            </div>

            <div>
              <h3 className="mb-3">第4条（フィギュア認証システム）</h3>
              <p className="text-[#555555] leading-relaxed">
                本サービスは、正規品フィギュアのNFC認証により、対応デジタルコンテンツへのアクセスを提供します。不正な方法での認証は禁止されています。
              </p>
            </div>

            <div>
              <h3 className="mb-3">第5条（コンテンツの利用）</h3>
              <p className="text-[#555555] leading-relaxed">
                購入・取得したデジタルコンテンツは、個人での閲覧に限り利用できます。第三者への転売・譲渡・共有は禁止されています。
              </p>
            </div>

            <div>
              <h3 className="mb-3">第6条（免責事項）</h3>
              <p className="text-[#555555] leading-relaxed">
                当社は、本サービスに関して、明示または黙示を問わず、完全性、正確性、確実性、有用性等について一切保証いたしません。
              </p>
            </div>

            <div>
              <h3 className="mb-3">第7条（利用停止）</h3>
              <p className="text-[#555555] leading-relaxed">
                当社は、ユーザーが本規約に違反した場合、事前の通知なく本サービスの利用を停止することができるものとします。
              </p>
            </div>

            <div>
              <h3 className="mb-3">第8条（規約の変更）</h3>
              <p className="text-[#555555] leading-relaxed">
                当社は、必要と判断した場合には、ユーザーに通知することにより、いつでも本規約を変更することができるものとします。
              </p>
            </div>

            <div className="pt-4 border-t border-[#E6E8EF]">
              <p className="text-xs text-[#555555]">
                制定日：2024年4月1日<br />
                最終更新日：2024年10月1日<br />
                Figure-Linked Comics株式会社
              </p>
            </div>
          </div>
        </FigureCard>
      </div>
    </div>
  );

  const FigureDetailScreen = () => {
    const [quantity, setQuantity] = useState(1);
    
    return (
      <div className="min-h-screen bg-gradient">
        <AppHeader 
          title="フィギュア詳細"
          onMenuClick={() => setIsMenuOpen(true)} 
          showBackButton={true}
          onBackClick={() => setCurrentScreen('work-detail')}
        />
        
        <div className="p-4 space-y-6">
          {/* Figure Images */}
          <FigureCard>
            <div className="aspect-[3/4] rounded-[16px] overflow-hidden mb-4">
              <ImageWithFallback
                src={hanakoFigureImage}
                alt="花子フィギュア"
                className="w-full h-full object-contain bg-[#F6F7FB]"
              />
            </div>
            
            <div className="flex space-x-2">
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i} className="w-16 h-20 rounded-[12px] overflow-hidden border-2 border-[#7A5AF8] bg-[#F6F7FB]">
                  <ImageWithFallback
                    src={hanakoFigureImage}
                    alt=""
                    className="w-full h-full object-contain"
                  />
                </div>
              ))}
            </div>
          </FigureCard>

          {/* Figure Info */}
          <FigureCard>
            <FigureCardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <h2>花子フィギュア</h2>
                  <p className="text-2xl text-[#7A5AF8] font-medium mt-2">¥3,500</p>
                </div>
                <FigureBadge variant="new">新作</FigureBadge>
              </div>
            </FigureCardHeader>
            
            <FigureCardContent>
              <div className="bg-[#7A5AF8]/10 border border-[#7A5AF8]/20 rounded-[16px] p-4 mb-4">
                <p className="text-sm text-[#7A5AF8]">
                  ✨ フィギュア購入で戦国アドベンチャー3巻分閲覧可能
                </p>
              </div>
              
              <p className="text-[#555555] mb-4 leading-relaxed">
                『戦国アドベンチャー』のヒロイン・花子の高品質フィギュアです。
                細部まで丁寧に作りこまれたディテールと、美しいポーズが魅力的。
                NFCチップ内蔵で、スキャンすることで対応デジタルコンテンツにアクセスできます。
              </p>
              
              <div className="space-y-4">
                <div>
                  <span className="text-sm text-[#555555]">サイズ: 約18cm</span>
                </div>
                <div>
                  <span className="text-sm text-[#555555]">素材: PVC・ABS</span>
                </div>
                <div>
                  <span className="text-sm text-[#555555]">付属品: 専用台座、NFCチップ</span>
                </div>
                <div>
                  <span className="text-sm text-[#555555]">対応コンテンツ: 戦国アドベンチャー 第1-3巻</span>
                </div>
              </div>
            </FigureCardContent>
            
            <FigureCardActions>
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-sm font-medium">数量:</span>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-full border border-[#E6E8EF] flex items-center justify-center"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-full border border-[#E6E8EF] flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <FigureButton 
                className="w-full"
                onClick={() => setCurrentScreen('figure-purchase')}
              >
                購入手続きに進む
              </FigureButton>
            </FigureCardActions>
          </FigureCard>

          {/* Related Content */}
          <FigureCard>
            <FigureCardHeader>
              <h3>このフィギュアで読める作品</h3>
            </FigureCardHeader>
            
            <div className="space-y-3">
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i} className="flex items-center space-x-4 p-3 border border-[#E6E8EF] rounded-[12px]">
                  <div className="w-12 h-16 rounded-[8px] overflow-hidden flex-shrink-0">
                    <ImageWithFallback
                      src={sengokuCover}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4>戦国アドベンチャー 第{i + 1}巻</h4>
                    <p className="text-sm text-[#555555]">フィギュア購入で無料</p>
                  </div>
                  <FigureBadge variant="owned" className="text-xs">含まれる</FigureBadge>
                </div>
              ))}
            </div>
          </FigureCard>
        </div>
      </div>
    );
  };

  const FigurePurchaseScreen = () => {
    const figurePrice = 3500;
    
    return (
      <div className="min-h-screen bg-gradient">
        <AppHeader 
          title="フィギュア購入"
          onMenuClick={() => setIsMenuOpen(true)} 
          showBackButton={true}
          onBackClick={() => setCurrentScreen('figure-detail')}
        />
        
        <div className="p-4 space-y-6">
          <FigureCard>
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-20 rounded-[12px] overflow-hidden bg-[#F6F7FB]">
                <ImageWithFallback
                  src={hanakoFigureImage}
                  alt="花子フィギュア"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3>花子フィギュア</h3>
                <p className="text-[#555555]">¥{figurePrice.toLocaleString()}</p>
                <p className="text-sm text-[#7A5AF8]">3巻分のコンテンツ付き</p>
              </div>
            </div>

            <div className="bg-[#7A5AF8]/10 border border-[#7A5AF8]/20 rounded-[16px] p-4 mb-6">
              <h4 className="mb-2">購入特典</h4>
              <ul className="text-sm text-[#7A5AF8] space-y-1">
                <li>• 戦国アドベンチャー 第1-3巻 デジタル版</li>
                <li>• NFCチップによる特別コンテンツアクセス</li>
                <li>• 限定壁紙・サウンドトラック</li>
              </ul>
            </div>
          </FigureCard>

          {/* Order Summary */}
          <FigureCard>
            <FigureCardHeader>
              <h3>ご注文内容</h3>
            </FigureCardHeader>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-[#555555]">花子フィギュア × 1</span>
                <span>¥{figurePrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#555555]">送料</span>
                <span>¥800</span>
              </div>
              <div className="border-t border-[#E6E8EF] pt-3">
                <div className="flex justify-between">
                  <span>合計</span>
                  <span className="text-[#7A5AF8]">¥{(figurePrice + 800).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </FigureCard>

          {/* Shipping Info */}
          <FigureCard>
            <FigureCardHeader>
              <h3>配送先</h3>
            </FigureCardHeader>
            
            <div className="space-y-4">
              <FigureInput label="お名前" placeholder="山田太郎" />
              <FigureInput label="郵便番号" placeholder="123-4567" />
              <FigureInput label="住所" placeholder="東京都渋谷区..." />
              <FigureInput label="電話番号" placeholder="090-1234-5678" />
            </div>
          </FigureCard>

          {/* Payment Method */}
          <FigureCard>
            <FigureCardHeader>
              <h3>お支払い方法</h3>
            </FigureCardHeader>
            
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input type="radio" name="payment" value="card" className="text-[#7A5AF8]" defaultChecked />
                <span>クレジットカード</span>
              </label>
              <label className="flex items-center space-x-3">
                <input type="radio" name="payment" value="bank" className="text-[#7A5AF8]" />
                <span>銀行振込</span>
              </label>
              <label className="flex items-center space-x-3">
                <input type="radio" name="payment" value="cod" className="text-[#7A5AF8]" />
                <span>代金引換</span>
              </label>
            </div>
          </FigureCard>

          {/* Delivery Notice */}
          <div className="bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-[16px] p-4">
            <p className="text-sm text-[#22C55E]">
              📦 通常2-3営業日でお届けします。デジタルコンテンツは購入後すぐにご利用いただけます。
            </p>
          </div>

          {/* Purchase Button */}
          <FigureButton 
            className="w-full h-16"
            onClick={() => {
              setShowToast(true);
              setTimeout(() => setCurrentScreen('work-detail'), 1500);
            }}
          >
            ¥{(figurePrice + 800).toLocaleString()}で注文する
          </FigureButton>
        </div>
      </div>
    );
  };

  const WorksScreen = () => (
    <div className="min-h-screen bg-gradient">
      <AppHeader 
        title="作品一覧"
        onMenuClick={() => setIsMenuOpen(true)} 
        showBackButton={true}
        onBackClick={() => setCurrentScreen('top')}
      />
      
      <div className="p-4">
        <FigureTabs
          tabs={[
            { id: 'owned', label: '所有作品' },
            { id: 'unowned', label: 'まだ持っていない作品' }
          ]}
          activeTab={worksTab}
          onTabChange={setWorksTab}
          className="mb-6"
        />
        
        {worksTab === 'unowned' && (
          <div className="mb-6">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#555555]" />
              <input
                type="text"
                placeholder="作品を検索"
                className="w-full pl-10 pr-4 py-3 rounded-[16px] border border-[#E6E8EF] bg-white focus:outline-none focus:ring-2 focus:ring-[#7A5AF8]"
              />
            </div>
            
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {['ジャンル', '作者', '価格'].map((filter) => (
                <button
                  key={filter}
                  className="px-4 py-2 rounded-full bg-white border border-[#E6E8EF] text-sm whitespace-nowrap hover:border-[#7A5AF8]"
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-6">
          {worksTab === 'unowned' && (
            <>
              <div>
                <h3 className="mb-4">あなたへのおすすめ</h3>
                <div className="space-y-4">
                  {Array.from({ length: 3 }, (_, i) => (
                    <FigureCard key={i}>
                      <div className="space-y-4">
                        {/* 作品情報ヘッダー */}
                        <div className="flex items-start space-x-4">
                          <div className="w-20 h-28 rounded-[12px] overflow-hidden flex-shrink-0">
                            <ImageWithFallback
                              src={sengokuCover}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="mb-2">戦国アドベンチャー {i + 1}</h4>
                            <p className="text-sm text-[#555555] mb-2">作者: 武田信玄</p>
                            <div className="flex items-center space-x-2 mb-2">
                              <FigureBadge variant="new">完結済</FigureBadge>
                              <span className="text-sm text-[#555555]">全12巻</span>
                            </div>
                            <p className="text-sm text-[#555555] line-clamp-2">
                              戦国時代を舞台にした壮大な冒険譚。若き武士が天下統一を目指す...
                            </p>
                          </div>
                        </div>
                        
                        {/* フィギュア画像 */}
                        <div className="space-y-3">
                          <h5 className="text-sm font-medium text-[#555555]">対応フィギュア</h5>
                          <div className="flex space-x-3 overflow-x-auto pb-2">
                            {Array.from({ length: 2 }, (_, figureIndex) => (
                              <div key={figureIndex} className="flex-shrink-0 w-16 h-20">
                                <ImageWithFallback
                                  src={figureIndex === 0 ? hanakoFigureImage : additionalFigureImage}
                                  alt=""
                                  className="w-full h-full object-contain rounded-[8px]"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* アクションボタン */}
                        <div className="flex space-x-2">
                          <FigureButton 
                            size="sm" 
                            variant="secondary" 
                            className="flex-1"
                            onClick={() => setCurrentScreen('trial-reader')}
                          >
                            1話無料試し読み
                          </FigureButton>
                          <FigureButton 
                            size="sm" 
                            className="flex-1"
                            onClick={() => setCurrentScreen('work-detail')}
                          >
                            作品ページ
                          </FigureButton>
                        </div>
                      </div>
                    </FigureCard>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="mb-4">新刊</h3>
                <div className="space-y-4">
                  {Array.from({ length: 2 }, (_, i) => (
                    <FigureCard key={i}>
                      <div className="space-y-4">
                        <div className="flex items-start space-x-4">
                          <div className="w-20 h-28 rounded-[12px] overflow-hidden flex-shrink-0 relative">
                            <ImageWithFallback
                              src={magicCover}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-1 right-1">
                              <FigureBadge variant="new" className="text-xs px-1 py-0.5">新刊</FigureBadge>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="mb-2">魔法学園物語 {i + 1}</h4>
                            <p className="text-sm text-[#555555] mb-2">作者: 魔法使いマリー</p>
                            <div className="flex items-center space-x-2 mb-2">
                              <FigureBadge variant="status">連載中</FigureBadge>
                              <span className="text-sm text-[#555555]">既刊6巻</span>
                            </div>
                            <p className="text-sm text-[#555555] line-clamp-2">
                              魔法学園を舞台にした青春ファンタジー。少女たちの成長と友情を描く...
                            </p>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <h5 className="text-sm font-medium text-[#555555]">対応フィギュア</h5>
                          <div className="flex space-x-3 overflow-x-auto pb-2">
                            {Array.from({ length: 1 }, (_, figureIndex) => (
                              <div key={figureIndex} className="flex-shrink-0 w-16 h-20">
                                <ImageWithFallback
                                  src={figureImage}
                                  alt=""
                                  className="w-full h-full object-contain rounded-[8px]"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <FigureButton 
                            size="sm" 
                            variant="secondary" 
                            className="flex-1"
                            onClick={() => setCurrentScreen('trial-reader')}
                          >
                            1話無料試し読み
                          </FigureButton>
                          <FigureButton 
                            size="sm" 
                            className="flex-1"
                            onClick={() => setCurrentScreen('work-detail')}
                          >
                            作品ページ
                          </FigureButton>
                        </div>
                      </div>
                    </FigureCard>
                  ))}
                </div>
              </div>
            </>
          )}
          
          {worksTab === 'owned' && (
            <div className="grid grid-cols-2 gap-4">
              <FigureCard>
                <div className="aspect-[3/4] rounded-[16px] overflow-hidden mb-3 relative">
                  <ImageWithFallback
                    src={magicCover}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <FigureBadge variant="owned">所持</FigureBadge>
                  </div>
                </div>
                <h4 className="mb-2">{seriesTitle}</h4>
                <FigureButton 
                  size="sm" 
                  className="w-full"
                  onClick={() => setCurrentScreen('top')}
                >
                  詳細を見る
                </FigureButton>
              </FigureCard>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const WorkDetailScreen = () => (
    <div className="min-h-screen bg-gradient">
      <AppHeader 
        title="作品詳細"
        onMenuClick={() => setIsMenuOpen(true)} 
        showBackButton={true}
        onBackClick={() => setCurrentScreen('works')}
      />
      
      <div className="p-4 space-y-6">
        {/* 作品ヘッダー */}
        <FigureCard>
          <div className="flex space-x-4 mb-4">
            <div className="w-24 h-32 rounded-[12px] overflow-hidden flex-shrink-0">
              <ImageWithFallback
                src={sengokuCover}
                alt="戦国アドベンチャー"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="mb-2">戦国アドベンチャー</h2>
              <p className="text-[#555555] mb-2">作者: 武田信玄</p>
              <div className="flex items-center space-x-2 mb-3">
                <FigureBadge variant="status">完結済</FigureBadge>
                <span className="text-sm text-[#555555]">全12巻</span>
              </div>
              <div className="flex items-center space-x-4 text-sm text-[#555555]">
                <span>★ 4.8</span>
                <span>レビュー 234件</span>
              </div>
            </div>
          </div>
          
          <p className="text-[#555555] mb-4 leading-relaxed">
            戦国時代を舞台にした壮大な冒険譚。若き武士・太郎が天下統一を目指し、仲間たちと共に数々の困難に立ち向かう。
            リアルな戦国描写と魅力的なキャラクターたちが織りなす、感動の歴史ファンタジー巨編。
          </p>
          
          <div className="flex space-x-2">
            <FigureButton 
              className="flex-1"
              onClick={() => setCurrentScreen('trial-reader')}
            >
              1話無料試し読み
            </FigureButton>
            <FigureButton 
              variant="secondary"
              className="flex-1"
              onClick={() => setCurrentScreen('manga-purchase')}
            >
              購入する
            </FigureButton>
          </div>
        </FigureCard>

        {/* 対応フィギュア */}
        <div className="space-y-4">
          <h3>対応フィギュア</h3>
          
          {Array.from({ length: 2 }, (_, i) => {
            const figureName = i === 0 ? '花子' : '次郎';
            const figureImg = i === 0 ? hanakoFigureImage : additionalFigureImage;
            
            return (
              <FigureCard key={i}>
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-24 rounded-[12px] overflow-hidden flex-shrink-0">
                    <ImageWithFallback
                      src={figureImg}
                      alt={`${figureName}フィギュア`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="mb-2">{figureName}フィギュア</h4>
                    <p className="text-sm text-[#7A5AF8] mb-2">¥3,500</p>
                    <p className="text-sm text-[#555555] mb-3">
                      フィギュア購入で3巻分閲覧可能
                    </p>
                    <FigureButton 
                      size="sm"
                      onClick={() => setCurrentScreen('figure-detail')}
                    >
                      購入する
                    </FigureButton>
                  </div>
                </div>
              </FigureCard>
            );
          })}
        </div>

        {/* 巻一覧 */}
        <FigureCard>
          <FigureCardHeader>
            <div className="flex items-center justify-between">
              <h3>全12巻</h3>
              <span className="text-sm text-[#555555]">各巻 ¥600</span>
            </div>
          </FigureCardHeader>
          
          <div className="space-y-3">
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i} className="flex items-center space-x-4 p-3 border border-[#E6E8EF] rounded-[12px]">
                <div className="w-12 h-16 rounded-[8px] overflow-hidden flex-shrink-0">
                  <ImageWithFallback
                    src={sengokuCover}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4>第{i + 1}巻</h4>
                  <p className="text-sm text-[#555555]">¥600</p>
                </div>
                <FigureButton size="sm" variant="secondary">
                  カートに追加
                </FigureButton>
              </div>
            ))}
          </div>
        </FigureCard>

        {/* レビュー */}
        <FigureCard>
          <FigureCardHeader>
            <div className="flex items-center justify-between">
              <h3>レビュー</h3>
              <div className="flex items-center space-x-2">
                <span className="text-[#F59E0B]">★ 4.8</span>
                <span className="text-sm text-[#555555]">(234件)</span>
              </div>
            </div>
          </FigureCardHeader>
          
          <div className="space-y-4">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="border-b border-[#E6E8EF] pb-4 last:border-b-0">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-[#F59E0B]">★★★★★</span>
                  <span className="text-sm text-[#555555]">ユーザー{i + 1}</span>
                </div>
                <p className="text-sm text-[#555555]">
                  戦国時代の描写がとても細かく、キャラクターの成長も素晴らしい。
                  フィギュアと連動した読書体験も新鮮で楽しいです。
                </p>
              </div>
            ))}
          </div>
        </FigureCard>

        {/* 関連作品 */}
        <FigureCard>
          <FigureCardHeader>
            <h3>この作品を読んだ人はこんな作品も読んでいます</h3>
          </FigureCardHeader>
          
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="flex-shrink-0 w-24">
                <div className="aspect-[3/4] rounded-[12px] overflow-hidden mb-2">
                  <ImageWithFallback
                    src={magicCover}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs text-center text-[#555555]">関連作品 {i + 1}</p>
              </div>
            ))}
          </div>
        </FigureCard>
      </div>
    </div>
  );

  const TrialReaderScreen = () => (
    <div 
      className="h-screen bg-black relative overflow-hidden"
      onClick={() => setShowViewerControls(!showViewerControls)}
    >
      {/* Manga Page */}
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-full max-w-2xl aspect-[3/4] bg-white rounded-lg overflow-hidden">
          <ImageWithFallback
            src={sengokuCover}
            alt="Trial Page"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Trial Banner */}
      <div className="absolute top-0 left-0 right-0 bg-[#7A5AF8] text-white p-3 text-center">
        <p className="text-sm">📖 無料試し読み中 - 1/15ページ</p>
      </div>

      {/* Navigation */}
      {showViewerControls && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-4 bg-black/80 backdrop-blur-sm rounded-[16px] px-6 py-3">
          <button
            className="p-2 text-white hover:text-[#7A5AF8] transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentPage(Math.max(1, currentPage - 1));
            }}
          >
            前へ
          </button>
          <span className="text-white text-sm">{currentPage} / 15</span>
          <button
            className="p-2 text-white hover:text-[#7A5AF8] transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              if (currentPage >= 15) {
                // 試し読み終了
                alert('試し読みはここまでです。続きを読むには購入してください。');
                setCurrentScreen('work-detail');
              } else {
                setCurrentPage(currentPage + 1);
              }
            }}
          >
            次へ
          </button>
        </div>
      )}

      {/* Back Button */}
      {showViewerControls && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setCurrentScreen('work-detail');
          }}
          className="absolute top-4 left-4 p-3 bg-black/80 backdrop-blur-sm rounded-[16px] text-white hover:bg-black/90 transition-colors z-20"
        >
          戻る
        </button>
      )}

      {/* Purchase CTA */}
      {showViewerControls && (
        <div className="absolute top-4 right-4 z-20">
          <FigureButton
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentScreen('work-detail');
            }}
          >
            続きを購入
          </FigureButton>
        </div>
      )}
    </div>
  );

  // Toast Component
  const Toast = () => {
    if (!showToast) return null;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="fixed top-20 left-4 right-4 z-50"
      >
        <div className="bg-[#22C55E] text-white rounded-[16px] p-4 shadow-mid text-center">
          <p>{currentScreen === 'manga-purchase' || currentScreen === 'cart' ? '購入が完了しました' : currentScreen === 'account-edit' ? '保存しました' : 'カートに追加しました'}</p>
          {currentScreen === 'goods-detail' && (
            <FigureButton 
              size="sm" 
              variant="secondary" 
              className="mt-2"
              onClick={() => setCurrentScreen('cart')}
            >
              購入に進む
            </FigureButton>
          )}
        </div>
      </motion.div>
    );
  };

  // Screen Renderer
  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return <LoginScreen />;
      case 'claim-transition':
        return <ClaimTransitionScreen />;
      case 'top':
        return <TopScreenComponent 
          seriesId={selectedSeriesId || undefined}
          onMenuClick={() => setIsMenuOpen(true)}
          onNavigate={handleNavigate}
          onReadVolume={handleReadVolume}
        />;
      case 'volumes':
        return <VolumesScreen />;
      case 'viewer':
        return <ViewerScreen figureId={viewerFigureId} volumeId={viewerVolumeId} volumeNo={viewerVolumeNo} />;
      case 'lending':
        return <LendingScreen />;
      case 'goods':
        return <GoodsScreen />;
      case 'goods-detail':
        return <GoodsDetailScreen />;
      case 'cart':
        return <CartScreen />;
      case 'manga-purchase':
        return <MangaPurchaseScreen />;
      case 'news':
        return <NewsScreen />;
      case 'works':
        return <WorksScreenComponent 
          worksTab={worksTab}
          onWorksTabChange={setWorksTab}
          onMenuClick={() => setIsMenuOpen(true)}
          onBackClick={() => {
            setSelectedSeriesId(null);
            setCurrentScreen('top');
          }}
          onSelectSeries={(seriesId) => {
            setSelectedSeriesId(seriesId);
            // 所有作品の場合はTopScreenへ、未所有作品の場合はwork-detailへ
            if (worksTab === 'owned') {
              setCurrentScreen('top');
            } else {
              setCurrentScreen('work-detail');
            }
          }}
        />;
      case 'work-detail':
        return <WorkDetailScreenComponent 
          seriesId={selectedSeriesId}
          onMenuClick={() => setIsMenuOpen(true)}
          onBackClick={() => setCurrentScreen('works')}
          onReadVolume={handleReadVolume}
        />;
      case 'trial-reader':
        return <TrialReaderScreen />;
      case 'account':
        return <AccountScreen />;
      case 'account-edit':
        return <AccountEditScreen />;
      case 'privacy-policy':
        return <PrivacyPolicyScreen />;
      case 'terms-of-service':
        return <TermsOfServiceScreen />;
      case 'figure-detail':
        return <FigureDetailScreen />;
      case 'figure-purchase':
        return <FigurePurchaseScreen />;
      default:
        return <TopScreenComponent 
          seriesId={selectedSeriesId || undefined}
          onMenuClick={() => setIsMenuOpen(true)}
          onNavigate={handleNavigate}
          onReadVolume={handleReadVolume}
        />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#7A5AF8] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#555555]">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient">
      {renderScreen()}
      
      <DrawerMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onNavigate={handleNavigate}
      />
      
      <QRModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        shareUrl="https://figure-comics.app/borrow/abc123"
      />
      
      <Toast />
    </div>
  );
}