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
import { useTranslation } from '@/contexts/I18nContext';
import LanguageSwitcher from '../LanguageSwitcher';

interface Restaurant {
  id?: string;
  displayName?: {
    text: string;
    languageCode: string;
  };
  address?: string;
  distance?: number;
  rating?: number;
  matchScore?: number;
  cuisine?: string;
  phone?: string;
  website?: string;
  userRatingCount?: number;
  priceLevel?: string;
  types?: string[];
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
  const { t } = useTranslation();

  useEffect(() => {
    if (difyResponse?.data?.outputs?.restaurants) {
      setRestaurants(difyResponse.data.outputs.restaurants);
    }
  }, [difyResponse]);

  const filteredRestaurants = restaurants.filter(restaurant =>
    restaurant.displayName?.text
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

  const handleRestaurantSelect = (restaurant: Restaurant) => {
    onSelect({
      id: restaurant.id || 'unknown',
      name: restaurant.displayName?.text || t('restaurant.selectRestaurant'),
    });
  };

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

  return (
    <div className="min-h-screen bg-[#FAFAF9] pb-safe-bottom">
      {/* Header Section */}
      <div className="bg-white border-b border-[#E8E6E3] px-4 py-4">
        {/* Language Switcher */}
        <div className="absolute top-4 right-4 z-50">
          <LanguageSwitcher variant="compact" />
        </div>

        <h1 className="text-xl font-bold text-[#2D2A26] mb-2">
          {t('restaurant.title')}
        </h1>
        <p className="text-sm text-[#6B6B6B] mb-4">
          {t('restaurant.subtitle')}
        </p>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#6B6B6B]" />
          <Input
            type="text"
            placeholder={t('restaurant.searchPlaceholder')}
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
          {t('restaurant.manualInputButton')}
        </Button>
      </div>

      {/* Restaurant List */}
      <div className="px-4 py-4">
        {filteredRestaurants.length > 0 ? (
          <div className="space-y-4">
            {filteredRestaurants.map((restaurant, index) => (
              <div
                key={restaurant.id || index}
                className="bg-white rounded-2xl p-4 shadow-sm border border-[#E8E6E3]">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#2D2A26] mb-1">
                      {restaurant.displayName?.text ||
                        t('restaurant.selectRestaurant')}
                    </h3>
                    {restaurant.address && (
                      <div className="flex items-center text-sm text-[#6B6B6B] mb-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{restaurant.address}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-4 text-sm text-[#6B6B6B]">
                      {restaurant.rating && (
                        <div className="flex items-center">
                          <Star className="w-4 h-4 mr-1 text-yellow-500 fill-current" />
                          <span>{restaurant.rating}</span>
                          {restaurant.userRatingCount && (
                            <span className="ml-1">
                              ({restaurant.userRatingCount})
                            </span>
                          )}
                        </div>
                      )}
                      {restaurant.priceLevel && (
                        <span>{restaurant.priceLevel}</span>
                      )}
                    </div>
                  </div>
                  {restaurant.matchScore && (
                    <div className="flex-shrink-0 ml-3">
                      <div className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                        {Math.round(restaurant.matchScore * 100)}%{' '}
                        {t('common.match')}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button
                    size="sm"
                    className="bg-[#8B7355] hover:bg-[#7a654c] text-white px-4 py-2 rounded-xl text-sm font-medium touch-manipulation">
                    {t('restaurant.selectRestaurant')}
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
              {searchQuery ? t('restaurant.noResults') : t('restaurant.noData')}
            </h3>
            <p className="text-sm text-[#6B6B6B] mb-4">
              {searchQuery ? t('restaurant.noResults') : t('restaurant.noData')}
            </p>
            <Button
              onClick={() => setIsManualInputOpen(true)}
              className="bg-[#8B7355] hover:bg-[#7a654c] text-white px-6 py-3 rounded-2xl font-medium touch-manipulation">
              {t('restaurant.manualInputButton')}
            </Button>
          </div>
        )}
      </div>

      {/* Manual Input Dialog */}
      <Dialog open={isManualInputOpen} onOpenChange={setIsManualInputOpen}>
        <DialogContent className="sm:max-w-md mx-4 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-[#2D2A26]">
              {t('restaurant.manualInputTitle')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="text"
              placeholder={t('restaurant.manualInputPlaceholder')}
              value={manualRestaurantName}
              onChange={e => setManualRestaurantName(e.target.value)}
              className="w-full"
            />
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setIsManualInputOpen(false)}
                className="flex-1">
                {t('common.cancel')}
              </Button>
              <Button
                onClick={handleManualSubmit}
                className="flex-1 bg-[#8B7355] hover:bg-[#7a654c] text-white">
                {t('common.confirm')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
