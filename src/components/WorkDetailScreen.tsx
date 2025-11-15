import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { api } from '../lib/api';
import { AppHeader } from './AppHeader';
import { FigureCard, FigureCardHeader, FigureCardContent, FigureCardActions } from './FigureCard';
import { FigureButton } from './FigureButton';
import { FigureTabs } from './FigureTabs';
import { FigureBadge } from './FigureBadge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import magicCover from '../assets/a23505fcf7d545b73f11f00e0d250bec4a253b39.png';
import figureImage from '../assets/3f0192d938aee3a1be9dd7ef4a2591aee906638c.png';

interface WorkDetailScreenProps {
  seriesId: string | null;
  onMenuClick: () => void;
  onBackClick: () => void;
  onReadVolume?: (figureId: string | null, volumeId: string, volumeNo: number) => void;
}

export const WorkDetailScreen = ({
  seriesId,
  onMenuClick,
  onBackClick,
  onReadVolume
}: WorkDetailScreenProps) => {
  const [seriesData, setSeriesData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [volumesTab, setVolumesTab] = useState('owned');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [autoPurchaseEnabled, setAutoPurchaseEnabled] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const loadSeriesDetail = async () => {
      if (!seriesId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const result = await api.getSeriesDetail(seriesId);
        setSeriesData(result);
        setAutoPurchaseEnabled(result.autoPurchaseEnabled || false);
        
        if (result.userReview) {
          setReviewRating(result.userReview.rating);
          setReviewComment(result.userReview.comment || '');
        }
      } catch (error) {
        console.error('Failed to load series detail:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSeriesDetail();
  }, [seriesId]);

  const handlePurchaseVolume = async (volumeId: string) => {
    try {
      await api.purchaseVolume(volumeId);
      setToastMessage('巻を購入しました！');
      setShowToast(true);
      
      const result = await api.getSeriesDetail(seriesId!);
      setSeriesData(result);
    } catch (error) {
      console.error('Failed to purchase volume:', error);
      setToastMessage('購入に失敗しました');
      setShowToast(true);
    }
  };

  const handleSubmitReview = async () => {
    if (!seriesId) return;

    try {
      setIsSubmittingReview(true);
      await api.postReview(seriesId, reviewRating, reviewComment || undefined);
      setToastMessage('レビューを投稿しました！');
      setShowToast(true);
      
      const result = await api.getSeriesDetail(seriesId);
      setSeriesData(result);
    } catch (error) {
      console.error('Failed to submit review:', error);
      setToastMessage('レビュー投稿に失敗しました');
      setShowToast(true);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleToggleAutoPurchase = async () => {
    if (!seriesId) return;

    try {
      const newValue = !autoPurchaseEnabled;
      await api.setAutoPurchase(seriesId, newValue);
      setAutoPurchaseEnabled(newValue);
      setToastMessage(newValue ? '自動購入を有効にしました' : '自動購入を無効にしました');
      setShowToast(true);
    } catch (error) {
      console.error('Failed to toggle auto-purchase:', error);
      setToastMessage('設定の変更に失敗しました');
      setShowToast(true);
    }
  };

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient">
        <AppHeader 
          title="作品詳細"
          onMenuClick={onMenuClick} 
          showBackButton={true}
          onBackClick={onBackClick}
        />
        <div className="p-4 flex items-center justify-center h-64">
          <p className="text-[#555555]">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!seriesData) {
    return (
      <div className="min-h-screen bg-gradient">
        <AppHeader 
          title="作品詳細"
          onMenuClick={onMenuClick} 
          showBackButton={true}
          onBackClick={onBackClick}
        />
        <div className="p-4 flex items-center justify-center h-64">
          <p className="text-[#555555]">作品が見つかりませんでした</p>
        </div>
      </div>
    );
  }

  const { series, userOwnedVolumes, userReview } = seriesData;
  const ownedVolumeIds = new Set(userOwnedVolumes?.map((ov: any) => ov.volumeId) || []);
  const ownedVolumes = series.volumes.filter((v: any) => ownedVolumeIds.has(v.id));
  const unownedVolumes = series.volumes.filter((v: any) => !ownedVolumeIds.has(v.id));

  return (
    <div className="min-h-screen bg-gradient">
      <AppHeader 
        title="作品詳細"
        onMenuClick={onMenuClick} 
        showBackButton={true}
        onBackClick={onBackClick}
      />
      
      <div className="p-4 space-y-6">
        {/* 作品ヘッダー */}
        <FigureCard>
          <div className="flex space-x-4 mb-4">
            <div className="w-24 h-32 rounded-[12px] overflow-hidden flex-shrink-0">
              <ImageWithFallback
                src={series.coverUrl || magicCover}
                alt={series.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="mb-2">{series.title}</h2>
              {series.author && <p className="text-[#555555] mb-2">作者: {series.author}</p>}
              {series.genre && (
                <div className="flex items-center space-x-2 mb-3">
                  <FigureBadge variant="status">{series.genre}</FigureBadge>
                  <span className="text-sm text-[#555555]">全{series.volumes.length}巻</span>
                </div>
              )}
              {series.averageRating > 0 && (
                <div className="flex items-center space-x-4 text-sm text-[#555555]">
                  <span>★ {series.averageRating.toFixed(1)}</span>
                  <span>レビュー {series.reviews?.length || 0}件</span>
                </div>
              )}
            </div>
          </div>
          
          {series.description && (
            <p className="text-[#555555] mb-4 leading-relaxed">
              {series.description}
            </p>
          )}
        </FigureCard>

        {/* 対応フィギュア */}
        {series.figures && series.figures.length > 0 && (
          <div className="space-y-4">
            <h3>対応フィギュア</h3>
            
            {series.figures.map((figure: any) => {
              const includedVolumeNos = figure.volumeRanges?.map((vr: any) => vr.volume.volumeNo).sort((a: number, b: number) => a - b) || [];
              const volumeRangeText = includedVolumeNos.length > 0 
                ? `第${includedVolumeNos[0]}-${includedVolumeNos[includedVolumeNos.length - 1]}巻付属`
                : '';
              
              return (
                <FigureCard key={figure.id}>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-24 h-32 rounded-[12px] overflow-hidden flex-shrink-0">
                      <ImageWithFallback
                        src={figure.imageUrl || figureImage}
                        alt={figure.title}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="mb-2">{figure.title}</h4>
                      {figure.price && (
                        <p className="text-[#7A5AF8] font-medium mb-2">¥{figure.price.toLocaleString()}</p>
                      )}
                      {volumeRangeText && (
                        <FigureBadge variant="status" className="mb-2">{volumeRangeText}</FigureBadge>
                      )}
                      {figure.description && (
                        <p className="text-sm text-[#555555] line-clamp-2">{figure.description}</p>
                      )}
                    </div>
                  </div>
                  
                  {includedVolumeNos.length > 0 && (
                    <div className="border-t border-[#E6E8EF] pt-3 mb-3">
                      <p className="text-xs text-[#555555] mb-2">このフィギュアに含まれる巻:</p>
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {figure.volumeRanges.map((vr: any) => (
                          <div key={vr.volume.id} className="flex-shrink-0">
                            <div className="w-14 h-20 rounded-[6px] overflow-hidden border border-[#E6E8EF]">
                              <ImageWithFallback
                                src={vr.volume.coverUrl}
                                alt={vr.volume.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <p className="text-xs text-center mt-1">第{vr.volume.volumeNo}巻</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <FigureButton size="sm" variant="line" className="flex-1">
                      商品詳細
                    </FigureButton>
                    <FigureButton size="sm" className="flex-1">
                      カートに追加
                    </FigureButton>
                  </div>
                </FigureCard>
              );
            })}
          </div>
        )}

        {/* 巻一覧 */}
        <div className="space-y-4">
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
                  return (
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
                          {ownership && ownership.currentPage > 0 && (
                            <p className="text-sm text-[#555555]">
                              進捗: {ownership.currentPage}ページ / {volume.pageCount || '?'}ページ
                            </p>
                          )}
                        </div>
                        <FigureBadge variant="owned">所持</FigureBadge>
                      </div>
                      {onReadVolume && (
                        <FigureButton 
                          size="sm" 
                          className="w-full"
                          onClick={() => onReadVolume(ownership?.figureId || null, volume.id, volume.volumeNo)}
                        >
                          読む
                        </FigureButton>
                      )}
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
                <FigureButton 
                  className="w-full"
                  onClick={handleSubmitReview}
                  disabled={isSubmittingReview}
                >
                  {isSubmittingReview ? '投稿中...' : (userReview ? 'レビューを更新' : 'レビューを投稿')}
                </FigureButton>
              </div>
            </FigureCardContent>
          </FigureCard>

          {/* 他のユーザーのレビュー */}
          {series.reviews && series.reviews.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium">他のユーザーのレビュー</h4>
              {series.reviews.map((review: any) => (
                <FigureCard key={review.id}>
                  <div className="flex items-start space-x-3 mb-2">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-[#7A5AF8]/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-[#7A5AF8]">
                          {review.user.email.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium">{review.user.email.split('@')[0]}</span>
                        <div className="flex">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-sm text-[#555555]">{review.comment}</p>
                      )}
                      <p className="text-xs text-[#999999] mt-1">
                        {new Date(review.createdAt).toLocaleDateString('ja-JP')}
                      </p>
                    </div>
                  </div>
                </FigureCard>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-black/80 text-white px-6 py-3 rounded-full z-50">
          {toastMessage}
        </div>
      )}
    </div>
  );
};
