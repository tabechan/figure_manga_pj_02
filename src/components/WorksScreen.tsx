import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { api } from '../lib/api';
import { AppHeader } from './AppHeader';
import { FigureCard } from './FigureCard';
import { FigureButton } from './FigureButton';
import { FigureTabs } from './FigureTabs';
import { FigureBadge } from './FigureBadge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import magicCover from '../assets/a23505fcf7d545b73f11f00e0d250bec4a253b39.png';

interface WorksScreenProps {
  worksTab: string;
  onWorksTabChange: (tab: string) => void;
  onMenuClick: () => void;
  onBackClick: () => void;
  onSelectSeries: (seriesId: string) => void;
}

export const WorksScreen = ({
  worksTab,
  onWorksTabChange,
  onMenuClick,
  onBackClick,
  onSelectSeries
}: WorksScreenProps) => {
  const [catalogSeries, setCatalogSeries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadSeries = async () => {
      try {
        setIsLoading(true);
        const result = await api.getCatalogSeries();
        setCatalogSeries(result.series || []);
      } catch (error) {
        console.error('Failed to load series:', error);
        setCatalogSeries([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadSeries();
  }, []);

  const ownedSeriesList = catalogSeries.filter(s => s.isOwned);
  const unownedSeriesList = catalogSeries.filter(s => !s.isOwned);
  
  const filteredSeries = unownedSeriesList.filter(s => 
    !searchQuery || s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient">
        <AppHeader 
          title="作品一覧"
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

  return (
    <div className="min-h-screen bg-gradient">
      <AppHeader 
        title="作品一覧"
        onMenuClick={onMenuClick} 
        showBackButton={true}
        onBackClick={onBackClick}
      />
      
      <div className="p-4">
        <FigureTabs
          tabs={[
            { id: 'owned', label: '所有作品' },
            { id: 'unowned', label: 'まだ持っていない作品' }
          ]}
          activeTab={worksTab}
          onTabChange={onWorksTabChange}
          className="mb-6"
        />
        
        {worksTab === 'unowned' && (
          <div className="mb-6">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#555555]" />
              <input
                type="text"
                placeholder="作品を検索"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-[16px] border border-[#E6E8EF] bg-white focus:outline-none focus:ring-2 focus:ring-[#7A5AF8]"
              />
            </div>
          </div>
        )}

        <div className="space-y-6">
          {worksTab === 'unowned' && (
            <div>
              <h3 className="mb-4">全作品</h3>
              <div className="space-y-4">
                {filteredSeries.length === 0 ? (
                  <p className="text-[#555555] text-center py-8">作品が見つかりませんでした</p>
                ) : (
                  filteredSeries.map((series) => (
                    <FigureCard key={series.id}>
                      <div className="space-y-4">
                        <div className="flex items-start space-x-4">
                          <div className="w-20 h-28 rounded-[12px] overflow-hidden flex-shrink-0">
                            <ImageWithFallback
                              src={series.coverUrl || magicCover}
                              alt={series.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="mb-2">{series.title}</h4>
                            {series.author && (
                              <p className="text-sm text-[#555555] mb-2">作者: {series.author}</p>
                            )}
                            <div className="flex items-center space-x-2 mb-2">
                              {series.genre && (
                                <FigureBadge variant="status">{series.genre}</FigureBadge>
                              )}
                              <span className="text-sm text-[#555555]">全{series.volumes?.length || 0}巻</span>
                            </div>
                            {series.averageRating > 0 && (
                              <div className="flex items-center space-x-2 text-sm text-[#555555] mb-2">
                                <span>★ {series.averageRating.toFixed(1)}</span>
                                <span>レビュー {series.reviewCount}件</span>
                              </div>
                            )}
                            {series.description && (
                              <p className="text-sm text-[#555555] line-clamp-2 mb-2">
                                {series.description}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        {series.figures && series.figures.length > 0 && (
                          <div className="border-t border-[#E6E8EF] pt-3">
                            <p className="text-xs text-[#555555] mb-2">購入可能なフィギュア:</p>
                            <div className="flex gap-2 overflow-x-auto">
                              {series.figures.map((figure: any) => (
                                <div key={figure.id} className="flex-shrink-0 w-16 h-20 rounded-[8px] overflow-hidden">
                                  <ImageWithFallback
                                    src={figure.imageUrl}
                                    alt={figure.title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex space-x-2">
                          <FigureButton 
                            size="sm" 
                            className="flex-1"
                            onClick={() => onSelectSeries(series.id)}
                          >
                            作品ページ
                          </FigureButton>
                        </div>
                      </div>
                    </FigureCard>
                  ))
                )}
              </div>
            </div>
          )}
          
          {worksTab === 'owned' && (
            <div className="grid grid-cols-2 gap-4">
              {ownedSeriesList.length === 0 ? (
                <div className="col-span-2 text-center py-8">
                  <p className="text-[#555555]">所有している作品がありません</p>
                </div>
              ) : (
                ownedSeriesList.map((series) => (
                  <FigureCard key={series.id}>
                    <div className="space-y-3">
                      <div className="aspect-[3/4] rounded-[16px] overflow-hidden relative">
                        <ImageWithFallback
                          src={series.coverUrl || magicCover}
                          alt={series.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <FigureBadge variant="owned">所持</FigureBadge>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="mb-2 line-clamp-2">{series.title}</h4>
                        
                        {series.ownedFigures && series.ownedFigures.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs text-[#555555] mb-1">所有フィギュア:</p>
                            <div className="flex gap-1 overflow-x-auto">
                              {series.ownedFigures.map((figure: any) => (
                                <div key={figure.id} className="flex-shrink-0 w-12 h-16 rounded-[6px] overflow-hidden border border-[#E6E8EF]">
                                  <ImageWithFallback
                                    src={figure.imageUrl}
                                    alt={figure.title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <FigureButton 
                          size="sm" 
                          className="w-full"
                          onClick={() => onSelectSeries(series.id)}
                        >
                          詳細を見る
                        </FigureButton>
                      </div>
                    </div>
                  </FigureCard>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
