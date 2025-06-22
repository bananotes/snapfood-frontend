'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import translations, {
  Language,
  LanguageOption,
  languageOptions,
} from '@/lib/i18n/translations';

interface I18nContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  languageOptions: LanguageOption[];
  currentLanguage: LanguageOption;
  isClient: boolean;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Helper function to get nested object value by dot notation
function getNestedValue(obj: any, path: string): string {
  return (
    path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : '';
    }, obj) || ''
  );
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [isClient, setIsClient] = useState(false);

  // Always start with 'en' to avoid hydration mismatch
  const [language, setLanguageState] = useState<Language>('en');

  // Set client flag after mount
  useEffect(() => {
    setIsClient(true);
    // Load saved language from localStorage after mount
    const saved = localStorage.getItem('snapfood-language');
    if (saved && languageOptions.some(option => option.code === saved)) {
      setLanguageState(saved as Language);
    }

    // Initialize HTML lang attribute
    const langMap: Record<string, string> = {
      en: 'en',
      zh: 'zh-CN',
      es: 'es',
      fr: 'fr',
      ja: 'ja',
      ko: 'ko',
    };
    const currentLang =
      saved && languageOptions.some(option => option.code === saved)
        ? saved
        : 'en';
    document.documentElement.lang = langMap[currentLang] || 'en';
  }, []);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    if (typeof window !== 'undefined') {
      localStorage.setItem('snapfood-language', newLanguage);
    }
  };

  // Translation function
  const t = (key: string): string => {
    const translation = getNestedValue(translations[language], key);
    if (!translation) {
      console.warn(
        `Translation key "${key}" not found for language "${language}"`,
      );
      // Fallback to English
      return getNestedValue(translations.en, key) || key;
    }
    return translation;
  };

  const currentLanguage =
    languageOptions.find(option => option.code === language) ||
    languageOptions[0];

  const value: I18nContextType = {
    language,
    setLanguage,
    t,
    languageOptions,
    currentLanguage,
    isClient,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

// Hook for easy access to translations
export function useTranslation() {
  const { t } = useI18n();
  return { t };
}
