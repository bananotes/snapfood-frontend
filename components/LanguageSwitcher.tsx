'use client';

import { useState } from 'react';
import { useI18n } from '@/contexts/I18nContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface LanguageSwitcherProps {
  variant?: 'compact' | 'full';
  className?: string;
}

export default function LanguageSwitcher({
  variant = 'full',
  className = '',
}: LanguageSwitcherProps) {
  const { language, setLanguage, languageOptions, currentLanguage, isClient } =
    useI18n();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage as any);
    setIsOpen(false);
  };

  // Don't render dynamic content until client-side hydration is complete
  if (!isClient) {
    return (
      <div
        className={`px-3 py-1 rounded bg-gray-200 text-xs font-semibold shadow ${className}`}>
        EN
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <button
            className={`flex items-center justify-center w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white active:scale-95 transition-all border border-[#E8E6E3] touch-manipulation ${className}`}
            aria-label="Switch language">
            <span className="text-lg">{currentLanguage.flag}</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="bg-white/95 backdrop-blur-sm border-[#E8E6E3] shadow-xl w-48 rounded-2xl">
          {languageOptions.map(option => (
            <DropdownMenuItem
              key={option.code}
              onClick={() => handleLanguageChange(option.code)}
              className="hover:bg-[#F5F4F2] cursor-pointer text-sm py-3 px-4 flex items-center touch-manipulation">
              <span className="text-lg mr-3">{option.flag}</span>
              <span className="flex-1 text-[#2D2A26]">{option.nativeName}</span>
              {language === option.code && (
                <span className="text-xs text-[#8B7355] ml-auto font-medium">
                  ✓
                </span>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className={`px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-xs font-semibold shadow transition-colors ${className}`}
          aria-label="Switch language">
          {language === 'en' ? '中文' : 'EN'}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-white/95 backdrop-blur-sm border-[#E8E6E3] shadow-xl w-48 rounded-2xl">
        {languageOptions.map(option => (
          <DropdownMenuItem
            key={option.code}
            onClick={() => handleLanguageChange(option.code)}
            className="hover:bg-[#F5F4F2] cursor-pointer text-sm py-3 px-4 flex items-center touch-manipulation">
            <span className="text-lg mr-3">{option.flag}</span>
            <span className="flex-1 text-[#2D2A26]">{option.nativeName}</span>
            {language === option.code && (
              <span className="text-xs text-[#8B7355] ml-auto font-medium">
                ✓
              </span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
