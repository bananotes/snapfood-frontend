'use client';

import { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { useTranslation } from '@/contexts/I18nContext';
import Image from 'next/image';
import { Camera, Sparkles, Star, Zap } from 'lucide-react';

export default function MobileOnboardingScreen() {
  const { setState, setDishes, setCategories } = useAppContext();
  const { t } = useTranslation();

  const handleGetStarted = () => {
    setState('idle');
  };

  const handleDemo = () => {
    import('@/lib/mockData').then(({ mockDishes, mockCategories }) => {
      setDishes(mockDishes);
      setCategories(mockCategories);
      setState('show_cards');
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-[#FAFAF9] to-[#F5F4F2] text-[#2D2A26]">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-8 pb-4">
        {/* App Icon and Title */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-[#8B7355] to-[#6B5B47] rounded-3xl flex items-center justify-center mb-6 mx-auto shadow-xl">
            <Camera className="w-12 h-12 text-white" />
          </div>

          <h1 className="text-3xl font-bold mb-2 text-[#2D2A26]">
            <span className="text-[#8B7355]">Snap</span>Dish
          </h1>
          <p className="text-lg text-[#6B6B6B] font-medium">
            {t('onboarding.subtitle')}
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="w-full max-w-sm space-y-4 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-[#E8E6E3]">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <Camera className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-[#2D2A26] text-sm">
                  {t('camera.title')}
                </h3>
                <p className="text-xs text-[#6B6B6B]">{t('camera.subtitle')}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-[#E8E6E3]">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <Sparkles className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-[#2D2A26] text-sm">
                  AI {t('common.analysis')}
                </h3>
                <p className="text-xs text-[#6B6B6B]">
                  {t('dish.detailedDescription')}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-[#E8E6E3]">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                <Star className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-[#2D2A26] text-sm">
                  {t('menu.categories.recommended')}
                </h3>
                <p className="text-xs text-[#6B6B6B]">
                  {t('menu.searchDescription')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Phone Mockup */}
        <div className="relative mb-8">
          <div className="w-64 h-80 bg-white rounded-[32px] shadow-2xl flex items-center justify-center p-2 border-4 border-gray-200">
            <div className="w-full h-full bg-gradient-to-br from-[#8B7355]/10 to-[#6B5B47]/10 rounded-[24px] flex items-center justify-center">
              <div className="text-center">
                <Zap className="w-12 h-12 text-[#8B7355] mx-auto mb-3" />
                <p className="text-sm text-[#6B6B6B] font-medium">
                  {t('onboarding.demoButton')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="px-6 pb-safe-bottom pb-6">
        <div className="space-y-4">
          <button
            onClick={handleGetStarted}
            className="w-full bg-gradient-to-r from-[#8B7355] to-[#7a654c] text-white font-bold py-4 rounded-2xl text-lg hover:from-[#7a654c] hover:to-[#6b5742] transition-all duration-200 ease-in-out active:scale-95 shadow-lg touch-manipulation">
            {t('onboarding.scanMenuButton')}
          </button>

          <button
            onClick={handleDemo}
            className="w-full bg-white text-[#2D2A26] font-semibold py-4 rounded-2xl text-lg border-2 border-[#E8E6E3] hover:bg-gray-50 transition-all duration-200 ease-in-out active:scale-95 shadow-sm touch-manipulation">
            {t('onboarding.demoButton')}
          </button>
        </div>

        {/* Privacy Notice */}
        <p className="text-xs text-[#6B6B6B] text-center mt-4 px-4">
          {t('common.privacy')}
        </p>
      </div>
    </div>
  );
}
