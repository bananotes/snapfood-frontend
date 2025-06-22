'use client';

import { useAppContext } from '@/contexts/AppContext';
import { X, Search, ArrowLeft, Menu } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from '@/contexts/I18nContext';

export default function MobileOptimizedHeader() {
  const { state, setState, toggleSearch, closeSearch, isSearchActive } =
    useAppContext();
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isShowingCards = state === 'show_cards';

  const handleBackToUpload = () => {
    setState('idle');
  };

  const handleBack = () => {
    if (state === 'show_cards') {
      setState('restaurant_selection');
    } else if (state === 'restaurant_selection') {
      setState('idle');
    }
  };

  if (state === 'show_cards' && isSearchActive) {
    return (
      <div className="sticky top-0 z-20 bg-white border-b border-[#E8E6E3] px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={closeSearch}
            className="flex items-center text-[#6B6B6B] hover:text-[#2D2A26] transition-colors">
            <X className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">{t('common.back')}</span>
          </button>
          <h1 className="text-lg font-semibold text-[#2D2A26]">
            {t('restaurant.title')}
          </h1>
        </div>
      </div>
    );
  }

  return (
    <header className="bg-white border-b border-[#E8E6E3] sticky top-0 z-50 h-16 flex items-center px-4 pt-safe-top">
      <div className="flex items-center justify-between w-full">
        {/* Left side - Back button or menu */}
        <div className="flex items-center">
          {isShowingCards ? (
            <button
              onClick={handleBack}
              className="p-3 text-gray-700 hover:text-black rounded-full transition-colors active:bg-gray-100 touch-manipulation"
              aria-label="Back">
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : state === 'restaurant_selection' ? (
            <button
              onClick={handleBack}
              className="p-3 text-gray-700 hover:text-black rounded-full transition-colors active:bg-gray-100 touch-manipulation"
              aria-label="Back to camera">
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-3 text-gray-700 hover:text-black rounded-full transition-colors active:bg-gray-100 touch-manipulation"
              aria-label="Menu">
              <Menu className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Center - Title */}
        <div className="text-center flex-grow px-4">
          {isShowingCards ? (
            <h1 className="text-lg font-semibold text-[#2D2A26] truncate">
              Golden Dragon Restaurant
            </h1>
          ) : state === 'restaurant_selection' ? (
            <h1 className="text-lg font-semibold text-[#2D2A26]">
              {t('restaurant.title')}
            </h1>
          ) : (
            <h1 className="text-xl font-bold text-[#2D2A26]">
              <span className="text-[#8B7355]">Snap</span>Dish
            </h1>
          )}
        </div>

        {/* Right side - Search or action button */}
        <div className="flex items-center">
          {isShowingCards ? (
            <button
              onClick={toggleSearch}
              className="p-3 text-gray-700 hover:text-black rounded-full transition-all duration-100 ease-in-out active:bg-gray-100 active:scale-90 touch-manipulation"
              aria-label={t('common.search')}>
              <Search className="w-5 h-5" />
            </button>
          ) : (
            <div className="w-11 h-11"></div> // Maintain balance
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-[#E8E6E3] shadow-lg">
          <div className="px-4 py-2">
            <button
              onClick={handleBackToUpload}
              className="w-full text-left py-3 px-4 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors touch-manipulation">
              <div className="flex items-center">
                <X className="w-4 h-4 mr-3 text-gray-500" />
                <span className="text-[#2D2A26]">
                  {t('onboarding.scanMenuButton')}
                </span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Search Overlay */}
      {state === 'show_cards' && isSearchActive && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-[#E8E6E3] p-4 shadow-lg">
          <div className="space-y-3">
            <button
              onClick={() => {
                closeSearch();
                // Add logic to go back to camera scanner
              }}
              className="w-full text-left py-3 px-4 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors touch-manipulation">
              <div className="flex items-center">
                <X className="w-4 h-4 mr-3 text-gray-500" />
                <span className="text-[#2D2A26]">
                  {t('onboarding.scanMenuButton')}
                </span>
              </div>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
