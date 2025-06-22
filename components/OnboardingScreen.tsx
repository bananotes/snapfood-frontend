'use client';

import { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { useTranslation } from '@/contexts/I18nContext';
import Image from 'next/image';

export default function OnboardingScreen() {
  const { setState, setDishes, setCategories } = useAppContext();
  const { t } = useTranslation();

  const handleGetStarted = () => {
    setState('idle'); // Transition to camera scanner view
  };

  const handleDemo = () => {
    // Import mock data for demo
    import('@/lib/mockData').then(({ mockDishes, mockCategories }) => {
      setDishes(mockDishes);
      setCategories(mockCategories);
      setState('show_cards'); // Skip directly to cards view
    });
  };

  return (
    // Updated background and default text color for the screen
    <div className="flex flex-col h-screen bg-[#FAFAF9] text-[#2D2A26]">
      {/* GIF Placeholder Area - Themed */}
      <div className="flex-1 flex items-center justify-center bg-[#E8E6E3] overflow-hidden relative px-4">
        {/* Phone mock styling adjusted */}
        <div className="w-full max-w-[280px] sm:max-w-xs aspect-[9/19.5] bg-white rounded-[36px] shadow-2xl flex items-center justify-center p-1.5 border-2 border-gray-200">
          <Image
            src="/placeholder.svg?height=600&width=300"
            alt="App feature: scanning a menu"
            width={270} // Slightly smaller to fit padding
            height={585} // Maintain aspect ratio
            className="object-contain rounded-[30px] bg-gray-700" // Added bg for placeholder visibility
          />
        </div>
      </div>

      {/* Bottom Content Area - Themed text colors */}
      <div className="px-6 sm:px-8 py-8 sm:py-10 pb-safe-bottom flex flex-col items-center text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-[#2D2A26]">
          {t('onboarding.title')}
        </h1>
        <p className="text-base sm:text-lg text-[#6B6B6B] mb-6 max-w-md">
          {t('onboarding.subtitle')}
        </p>
        <div className="w-full max-w-xs space-y-3">
          <button
            onClick={handleGetStarted}
            className="w-full bg-[#2D2A26] text-white font-semibold py-3.5 sm:py-4 rounded-full text-lg hover:bg-[#1e1c1a] transition-colors active:scale-95 shadow-md">
            {t('onboarding.scanMenuButton')}
          </button>
          <button
            onClick={handleDemo}
            className="w-full bg-[#8B7355] text-white font-semibold py-3.5 sm:py-4 rounded-full text-lg hover:bg-[#7a654c] transition-colors active:scale-95 shadow-md">
            {t('onboarding.demoButton')}
          </button>
        </div>
      </div>
    </div>
  );
}
