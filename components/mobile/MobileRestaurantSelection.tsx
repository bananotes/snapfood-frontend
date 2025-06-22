'use client';

import { useState, useEffect } from 'react';
import { Search, MapPin, Star, Clock, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Restaurant {
  id?: string;
  displayName?: {
    text?: string;
    languageCode?: string;
  };
  address?: string;
  distance?: number;
  rating?: number;
  matchScore?: number;
  cuisine?: string;
  phone?: string;
  website?: string;
}

interface MobileRestaurantSelectionProps {
  ocrText: string;
  difyResponse: any;
  onSelect: (restaurant: { id: string; name: string }) => void;
}

export default function MobileRestaurantSelection({
  ocrText,
  difyResponse,
  onSelect,
}: MobileRestaurantSelectionProps) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isManualInputOpen, setIsManualInputOpen] = useState(false);
  const [manualRestaurantName, setManualRestaurantName] = useState('');

  useEffect(() => {
    if (difyResponse?.data?.outputs?.restaurants) {
      setRestaurants(difyResponse.data.outputs.restaurants);
    }
  }, [difyResponse]);

  const filteredRestaurants = restaurants.filter(restaurant =>
    restaurant.displayName?.text
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

  const handleManualSubmit = () => {
    if (manualRestaurantName.trim()) {
      onSelect({
        id: 'manual',
        name: manualRestaurantName.trim(),
      });
      setIsManualInputOpen(false);
      setManualRestaurantName('');
    }
  };

  const handleRestaurantSelect = (restaurant: Restaurant) => {
    onSelect({
      id: restaurant.id || 'unknown',
      name: restaurant.displayName?.text || 'Unknown Restaurant',
    });
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] pb-safe-bottom">
      {/* Header Section */}
      <div className="bg-white border-b border-[#E8E6E3] px-4 py-4">
        <h1 className="text-xl font-bold text-[#2D2A26] mb-2">选择餐厅</h1>
        <p className="text-sm text-[#6B6B6B] mb-4">
          我们找到了以下匹配的餐厅，请选择正确的餐厅
        </p>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#6B6B6B]" />
          <Input
            type="text"
            placeholder="搜索餐厅..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-3 bg-[#F5F4F2] border-0 rounded-2xl text-[#2D2A26] placeholder-[#6B6B6B]"
          />
        </div>

        {/* Manual Input Button */}
        <Button
          onClick={() => setIsManualInputOpen(true)}
          variant="outline"
          className="w-full py-3 border-2 border-[#E8E6E3] rounded-2xl text-[#2D2A26] hover:bg-[#F5F4F2] transition-colors touch-manipulation">
          <Plus className="w-4 h-4 mr-2" />
          手动输入餐厅名称
        </Button>
      </div>

      {/* Restaurant List */}
      <div className="px-4 py-4">
        {filteredRestaurants.length > 0 ? (
          <div className="space-y-3">
            {filteredRestaurants.map((restaurant, index) => (
              <div
                key={restaurant.id || index}
                onClick={() => handleRestaurantSelect(restaurant)}
                className="bg-white rounded-2xl p-4 shadow-sm border border-[#E8E6E3] active:bg-[#FAFAF9] transition-colors touch-manipulation">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#2D2A26] mb-1">
                      {restaurant.displayName?.text || '未知餐厅'}
                    </h3>
                    {restaurant.address && (
                      <div className="flex items-center text-sm text-[#6B6B6B] mb-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="line-clamp-1">
                          {restaurant.address}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Match Score */}
                  {restaurant.matchScore && (
                    <div className="flex-shrink-0 ml-3">
                      <div className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                        {Math.round(restaurant.matchScore * 100)}% 匹配
                      </div>
                    </div>
                  )}
                </div>

                {/* Restaurant Details */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-[#6B6B6B]">
                    {restaurant.rating && (
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                        <span>{restaurant.rating}</span>
                      </div>
                    )}
                    {restaurant.distance && (
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{restaurant.distance}m</span>
                      </div>
                    )}
                    {restaurant.cuisine && (
                      <span className="bg-[#F5F4F2] px-2 py-1 rounded-full text-xs">
                        {restaurant.cuisine}
                      </span>
                    )}
                  </div>

                  <Button
                    size="sm"
                    className="bg-[#8B7355] hover:bg-[#7a654c] text-white px-4 py-2 rounded-xl text-sm font-medium touch-manipulation">
                    选择
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-[#F5F4F2] rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-[#6B6B6B]" />
            </div>
            <h3 className="text-lg font-semibold text-[#2D2A26] mb-2">
              {searchQuery ? '未找到匹配的餐厅' : '暂无餐厅数据'}
            </h3>
            <p className="text-sm text-[#6B6B6B] mb-4">
              {searchQuery
                ? '请尝试其他关键词或手动输入餐厅名称'
                : '请检查OCR识别结果或手动输入餐厅名称'}
            </p>
            <Button
              onClick={() => setIsManualInputOpen(true)}
              className="bg-[#8B7355] hover:bg-[#7a654c] text-white px-6 py-3 rounded-2xl font-medium touch-manipulation">
              手动输入餐厅名称
            </Button>
          </div>
        )}
      </div>

      {/* Manual Input Dialog */}
      <Dialog open={isManualInputOpen} onOpenChange={setIsManualInputOpen}>
        <DialogContent className="sm:max-w-md mx-4 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-[#2D2A26]">
              手动输入餐厅名称
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#2D2A26] mb-2">
                餐厅名称
              </label>
              <Input
                type="text"
                placeholder="请输入餐厅名称..."
                value={manualRestaurantName}
                onChange={e => setManualRestaurantName(e.target.value)}
                className="w-full py-3 px-4 border-2 border-[#E8E6E3] rounded-2xl text-[#2D2A26] placeholder-[#6B6B6B] focus:border-[#8B7355] focus:ring-0"
                onKeyPress={e => e.key === 'Enter' && handleManualSubmit()}
              />
            </div>

            <div className="flex space-x-3">
              <Button
                onClick={() => setIsManualInputOpen(false)}
                variant="outline"
                className="flex-1 py-3 border-2 border-[#E8E6E3] rounded-2xl text-[#2D2A26] hover:bg-[#F5F4F2] transition-colors touch-manipulation">
                取消
              </Button>
              <Button
                onClick={handleManualSubmit}
                disabled={!manualRestaurantName.trim()}
                className="flex-1 py-3 bg-[#8B7355] hover:bg-[#7a654c] text-white rounded-2xl font-medium touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed">
                确认
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
