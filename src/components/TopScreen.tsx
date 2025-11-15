import { useState, useEffect, useRef } from 'react';
import { BookOpen, Share2, ShoppingBag, Calendar, MessageCircle, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { api } from '../lib/api';
import { AppHeader } from './AppHeader';
import { FigureButton } from './FigureButton';
import { FigureCard, FigureCardHeader, FigureCardContent } from './FigureCard';
import { FigureBadge } from './FigureBadge';
import { FigureTabs } from './FigureTabs';
import { FigureListItem } from './FigureListItem';
import { ImageWithFallback } from './figma/ImageWithFallback';
import figureImage from '../assets/3f0192d938aee3a1be9dd7ef4a2591aee906638c.png';
import logoImage from '../assets/c118041339660eb8265b788cf84f4fb26dbce194.png';
import authorIcon from '../assets/cbbb40ca96db9058ae4adf49b50b5da6c2963d12.png';
import mangaPanel1 from '../assets/d923ea8d9694b378cd9352f679578c25190f1afc.png';
import mangaPanel2 from '../assets/d7392013300db9d4458faf15895b31bdcc87831c.png';
import mangaPanel3 from '../assets/50e339ff04cb0e5b30569bea9b39644ced9c9df6.png';
import magicCover from '../assets/a23505fcf7d545b73f11f00e0d250bec4a253b39.png';

interface TopScreenProps {
  seriesId?: string;
  onMenuClick: () => void;
  onNavigate: (screen: any) => void;
  onReadVolume?: (figureId: string | null, volumeId: string, volumeNo: number) => void;
}

export const TopScreen = ({ seriesId, onMenuClick, onNavigate, onReadVolume }: TopScreenProps) => {
  const [seriesData, setSeriesData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [volumesTab, setVolumesTab] = useState('owned');
  const [autoPurchaseEnabled, setAutoPurchaseEnabled] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const volumesListRef = useRef<HTMLDivElement>(null);

  const loadSeriesData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // デフォルトで最初の所有作品を取得
      if (!seriesId) {
        const ownedResult = await api.getOwnedSeries();
        if (ownedResult.series && ownedResult.series.length > 0) {
          const firstSeriesId = ownedResult.series[0].id;
          const data = await api.getSeriesDetail(firstSeriesId);
          setSeriesData(data);
          setAutoPurchaseEnabled((data?.series as any)?.autoPurchase || false);
          if (data?.userReview) {
            setReviewRating(data.userReview.rating);
            setReviewComment(data.userReview.comment || '');
          }
        }
      } else {
        const data = await api.getSeriesDetail(seriesId);
        setSeriesData(data);
        setAutoPurchaseEnabled((data?.series as any)?.autoPurchase || false);
        if (data?.userReview) {
          setReviewRating(data.userReview.rating);
          setReviewComment(data.userReview.comment || '');
        }
      }
    } catch (err) {
      console.error('Failed to load series data:', err);
      setError('作品データの読み込みに失敗しました。');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {

    loadSeriesData();
  }, [seriesId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleToggleAutoPurchase = async () => {
    if (!seriesData?.series?.id) return;
    
    try {
      await api.setAutoPurchase(seriesData.series.id, !autoPurchaseEnabled);
      setAutoPurchaseEnabled(!autoPurchaseEnabled);
    } catch (error) {
      console.error('Failed to toggle auto-purchase:', error);
      alert('自動購入設定の更新に失敗しました');
    }
  };

  const handlePostReview = async () => {
    if (!seriesData?.series?.id || reviewRating === 0) {
      alert('評価を選択してください');
      return;
    }

    try {
      await api.postReview(seriesData.series.id, reviewRating, reviewComment || undefined);
      alert('レビューを投稿しました');
      
      // データを再読み込み
      const data = await api.getSeriesDetail(seriesData.series.id);
      setSeriesData(data);
    } catch (error) {
      console.error('Failed to post review:', error);
      alert('レビューの投稿に失敗しました');
    }
  };

  const handlePurchaseVolume = async (volumeId: string) => {
    if (!seriesData?.series?.id) return;

    try {
      await api.purchaseVolume(volumeId);
      alert('巻を購入しました');
      
      // データを再読み込み
      const data = await api.getSeriesDetail(seriesData.series.id);
      setSeriesData(data);
    } catch (error) {
      console.error('Failed to purchase volume:', error);
      alert('購入に失敗しました');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient">
        <AppHeader 
          title="読み込み中..."
          avatar={logoImage}
          onMenuClick={onMenuClick} 
        />
        <div className="p-4 flex items-center justify-center h-64">
          <p className="text-[#555555]">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient">
        <AppHeader 
          title="エラー"
          avatar={logoImage}
          onMenuClick={onMenuClick} 
        />
        <div className="p-4 flex flex-col items-center justify-center h-64 space-y-4">
          <p className="text-[#555555]">{error}</p>
          <FigureButton onClick={loadSeriesData}>
            再試行
          </FigureButton>
        </div>
      </div>
    );
  }

  if (!seriesData) {
    return (
      <div className="min-h-screen bg-gradient">
        <AppHeader 
          title="作品が見つかりません"
          avatar={logoImage}
          onMenuClick={onMenuClick} 
        />
        <div className="p-4 flex items-center justify-center h-64">
          <p className="text-[#555555]">所有している作品がありません</p>
        </div>
      </div>
    );
  }

  const { series, userOwnedVolumes, userReview } = seriesData;
  const ownedVolumeIds = new Set(userOwnedVolumes?.map((ov: any) => ov.volumeId) || []);
  const ownedVolumes = series.volumes.filter((v: any) => ownedVolumeIds.has(v.id));
  const unownedVolumes = series.volumes.filter((v: any) => !ownedVolumeIds.has(v.id));
  
  // 魔法学園アドベンチャーの場合、fig-2を優先表示
  const heroFigure = series.figures?.find((f: any) => f.id === 'fig-2') || series.figures?.[0];

  return (
    <div className="min-h-screen bg-gradient">
      <AppHeader 
        title={`『${series.title}』`}
        avatar={logoImage}
        onMenuClick={onMenuClick} 
      />
      
      <div className="p-4 space-y-6">
        {/* Hero Section */}
        <div className="relative mb-6 overflow-hidden rounded-[20px]">
          {/* Manga Panel Background */}
          <div className="absolute inset-0">
            <div className="absolute top-6 left-1/2 -translate-x-1/2 translate-x-[-180px] w-36 h-48 rotate-[-2deg]">
              <ImageWithFallback
                src={mangaPanel1}
                alt=""
                className="w-full h-full object-cover rounded-[8px]"
              />
            </div>
            <div className="absolute top-8 left-1/2 -translate-x-1/2 translate-x-[100px] w-28 h-36 rotate-[4deg]">
              <ImageWithFallback
                src={mangaPanel2}
                alt=""
                className="w-full h-full object-cover rounded-[8px]"
              />
            </div>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 translate-x-[-140px] w-20 h-28 rotate-[-6deg]">
              <ImageWithFallback
                src={mangaPanel3}
                alt=""
                className="w-full h-full object-cover rounded-[8px]"
              />
            </div>
            <div className="absolute top-42 -translate-y-1/2 left-1/2 -translate-x-1/2 translate-x-[50px] w-22 h-30 rotate-[2deg]">
              <ImageWithFallback
                src={mangaPanel1}
                alt=""
                className="w-full h-full object-cover rounded-[8px]"
              />
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 translate-x-[-220px] w-26 h-34 rotate-[3deg]">
              <ImageWithFallback
                src={mangaPanel2}
                alt=""
                className="w-full h-full object-cover rounded-[8px]"
              />
            </div>
          </div>
          
          {/* Figure (foreground) */}
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="relative z-10 flex justify-center mb-4 pt-4"
          >
            <div className="w-48 h-64">
              <ImageWithFallback
                src={heroFigure?.imageUrl || figureImage}
                alt={series.title}
                className="w-full h-full object-contain drop-shadow-lg"
              />
            </div>
          </motion.div>
          
          <div className="relative z-10 flex flex-wrap justify-center gap-2 pb-4">
            <FigureBadge variant="owned">所持: {ownedVolumes.length}巻</FigureBadge>
            <FigureBadge variant="status">貸出可能</FigureBadge>
          </div>
        </div>

        {/* Primary CTAs */}
        <div className="space-y-4">
          <FigureButton 
            onClick={() => {
              volumesListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className="w-full flex items-center justify-center space-x-2 h-16"
          >
            <BookOpen className="w-5 h-5" />
            <span>巻を選んで読む</span>
          </FigureButton>
          
          <FigureButton 
            onClick={() => onNavigate('lending')}
            variant="secondary"
            className="w-full flex items-center justify-center space-x-2 h-16"
          >
            <Share2 className="w-5 h-5" />
            <span>作品貸出</span>
          </FigureButton>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FigureButton 
            onClick={() => onNavigate('goods')}
            variant="secondary"
            className="flex items-center justify-center space-x-2 h-16"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>グッズ</span>
          </FigureButton>
          
          <FigureButton 
            onClick={() => onNavigate('events')}
            variant="secondary"
            className="flex items-center justify-center space-x-2 h-16"
          >
            <Calendar className="w-5 h-5" />
            <span>イベント</span>
          </FigureButton>
        </div>

        {/* ニュースセクション */}
        <FigureCard>
          <FigureCardHeader>
            <div className="flex items-center justify-between">
              <h3>ニュース</h3>
              <FigureButton 
                size="sm" 
                variant="secondary"
                onClick={() => onNavigate('news')}
              >
                すべて見る
              </FigureButton>
            </div>
          </FigureCardHeader>
          
          <div className="space-y-3">
            <FigureListItem
              title="新刊第4巻発売決定！"
              meta="2024.10.15"
              onClick={() => onNavigate('news-detail')}
            />
            <FigureListItem
              title="作者サイン会開催のお知らせ"
              meta="2024.10.10"
              onClick={() => onNavigate('news-detail')}
            />
          </div>
        </FigureCard>

        {/* 対応フィギュア */}
        {series.figures && series.figures.length > 0 && (
          <div className="space-y-4">
            <h3>対応フィギュア</h3>
            
            {series.figures.map((figure: any) => (
              <FigureCard key={figure.id}>
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-28 rounded-[12px] overflow-hidden flex-shrink-0">
                    <ImageWithFallback
                      src={figure.imageUrl || figureImage}
                      alt={figure.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="mb-2">{figure.title}</h4>
                    {figure.price && (
                      <p className="text-[#7A5AF8] font-medium">¥{figure.price.toLocaleString()}</p>
                    )}
                  </div>
                </div>
              </FigureCard>
            ))}
          </div>
        )}

        {/* 作者の他の作品 */}
        {series.author && (
          <FigureCard>
            <FigureCardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <ImageWithFallback
                    src={authorIcon}
                    alt="作者"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3>作者の他の作品</h3>
                  <p className="text-sm text-[#555555]">{series.author}</p>
                </div>
              </div>
            </FigureCardHeader>
            
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {Array.from({ length: 3 }, (_, i) => (
                <div 
                  key={i} 
                  className="flex-shrink-0 w-24 cursor-pointer"
                  onClick={() => onNavigate('works')}
                >
                  <div className="aspect-[3/4] rounded-[12px] overflow-hidden mb-2">
                    <ImageWithFallback
                      src={magicCover}
                      alt={`作品${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs text-center">作品{i + 1}</p>
                </div>
              ))}
            </div>
          </FigureCard>
        )}

        {/* 巻一覧 */}
        <div ref={volumesListRef} className="space-y-4">
          <h3>巻一覧</h3>
          
          <FigureTabs
            tabs={[
              { id: 'owned', label: '所有巻' },
              { id: 'unowned', label: '未所有巻' }
            ]}
            activeTab={volumesTab}
            onTabChange={setVolumesTab}
          />

          {volumesTab === 'owned' && (
            <div className="space-y-3">
              {ownedVolumes.length === 0 ? (
                <p className="text-[#555555] text-center py-8">所有している巻がありません</p>
              ) : (
                ownedVolumes.map((volume: any) => {
                  const ownership = userOwnedVolumes.find((ov: any) => ov.volumeId === volume.id);
                  
                  // Find figure that includes this volume (by volumeId) - optional for reading
                  const figureWithVolume = seriesData?.ownedFigures?.find((fig: any) => 
                    fig.volumeRanges?.some((vr: any) => vr.volumeId === volume.id)
                  );
                  
                  return (
                    <FigureCard key={volume.id}>
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-16 rounded-[8px] overflow-hidden flex-shrink-0">
                          <ImageWithFallback
                            src={volume.coverUrl}
                            alt={volume.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4>第{volume.volumeNo}巻: {volume.title}</h4>
                          {ownership && ownership.currentPage > 0 && (
                            <p className="text-sm text-[#555555]">
                              進捗: {ownership.currentPage}ページ / {volume.pageCount || '?'}ページ
                            </p>
                          )}
                        </div>
                        {onReadVolume ? (
                          <FigureButton 
                            size="sm"
                            onClick={() => {
                              console.log('Read button clicked:', { figureId: figureWithVolume?.id || null, volumeId: volume.id, volumeNo: volume.volumeNo });
                              onReadVolume(figureWithVolume?.id || null, volume.id, volume.volumeNo);
                            }}
                          >
                            読む
                          </FigureButton>
                        ) : (
                          <FigureBadge variant="owned">所持</FigureBadge>
                        )}
                      </div>
                    </FigureCard>
                  );
                })
              )}
            </div>
          )}

          {volumesTab === 'unowned' && (
            <div className="space-y-3">
              {unownedVolumes.length === 0 ? (
                <p className="text-[#555555] text-center py-8">全巻所有しています！</p>
              ) : (
                unownedVolumes.map((volume: any) => (
                  <FigureCard key={volume.id}>
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="w-12 h-16 rounded-[8px] overflow-hidden flex-shrink-0">
                        <ImageWithFallback
                          src={volume.coverUrl}
                          alt={volume.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4>第{volume.volumeNo}巻: {volume.title}</h4>
                        {volume.price && (
                          <p className="text-[#7A5AF8] font-medium">¥{volume.price.toLocaleString()}</p>
                        )}
                      </div>
                    </div>
                    <FigureButton 
                      size="sm" 
                      className="w-full"
                      onClick={() => handlePurchaseVolume(volume.id)}
                    >
                      購入する
                    </FigureButton>
                  </FigureCard>
                ))
              )}
            </div>
          )}
        </div>

        {/* 自動購入設定 */}
        <FigureCard>
          <FigureCardHeader>
            <h3>自動購入設定</h3>
          </FigureCardHeader>
          <FigureCardContent>
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#555555]">新刊が出たら自動で購入する</p>
              <button
                onClick={handleToggleAutoPurchase}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  autoPurchaseEnabled ? 'bg-[#7A5AF8]' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    autoPurchaseEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </FigureCardContent>
        </FigureCard>

        {/* レビュー */}
        <div className="space-y-4">
          <h3>レビュー</h3>

          {/* レビュー投稿フォーム */}
          <FigureCard>
            <FigureCardHeader>
              <h4>{userReview ? 'あなたのレビュー' : 'レビューを投稿'}</h4>
            </FigureCardHeader>
            <FigureCardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-[#555555] mb-2 block">評価</label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setReviewRating(rating)}
                        className="p-1"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            rating <= reviewRating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-[#555555] mb-2 block">コメント（任意）</label>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="この作品の感想を書いてください..."
                    className="w-full p-3 rounded-[12px] border border-[#E6E8EF] focus:outline-none focus:ring-2 focus:ring-[#7A5AF8] resize-none"
                    rows={4}
                  />
                </div>
                <FigureButton onClick={handlePostReview} className="w-full">
                  {userReview ? 'レビューを更新' : 'レビューを投稿'}
                </FigureButton>
              </div>
            </FigureCardContent>
          </FigureCard>

          {/* 他のユーザーのレビュー */}
          {series.reviews && series.reviews.length > 0 && (
            <div className="space-y-3">
              {series.reviews.map((review: any) => (
                <FigureCard key={review.id}>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-[#555555]">
                        {new Date(review.createdAt).toLocaleDateString('ja-JP')}
                      </span>
                    </div>
                    {review.comment && (
                      <p className="text-sm text-[#555555]">{review.comment}</p>
                    )}
                  </div>
                </FigureCard>
              ))}
            </div>
          )}
        </div>

        {/* Additional CTAs */}
        <div className="space-y-3">
          <FigureButton variant="line" className="w-full flex items-center justify-center space-x-2">
            <MessageCircle className="w-5 h-5" />
            <span>LINEで最新情報を知る</span>
          </FigureButton>
        </div>
      </div>
    </div>
  );
};
