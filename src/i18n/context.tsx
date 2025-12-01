import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { Language, Translations } from './types';
import { zh } from './translations/zh';
import { en } from './translations/en';

// 翻译数据映射
const translations: Record<Language, Translations> = {
  zh,
  en,
};

// Context 类型
interface I18nContextType {
  language: Language;
  t: Translations;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

// 创建 Context
const I18nContext = createContext<I18nContextType | undefined>(undefined);

// 本地存储 key
const STORAGE_KEY = 'richman_language';

// 获取初始语言
const getInitialLanguage = (): Language => {
  // 1. 首先检查本地存储
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'zh' || stored === 'en') {
    return stored;
  }
  
  // 2. 检查浏览器语言
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('zh')) {
    return 'zh';
  }
  
  // 3. 默认中文
  return 'zh';
};

// Provider 组件
interface I18nProviderProps {
  children: ReactNode;
}

export const I18nProvider = ({ children }: I18nProviderProps) => {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  // 设置语言并保存到本地存储
  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
    // 更新 HTML lang 属性
    document.documentElement.lang = lang;
  }, []);

  // 切换语言
  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'zh' ? 'en' : 'zh');
  }, [language, setLanguage]);

  // 初始化时设置 HTML lang 属性
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value: I18nContextType = {
    language,
    t: translations[language],
    setLanguage,
    toggleLanguage,
  };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
};

// Hook 用于获取翻译
export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};

// 简化的 hook 用于只获取翻译
export const useTranslation = () => {
  const { t } = useI18n();
  return t;
};

// 语言图标映射
export const languageFlags: Record<Language, string> = {
  zh: '🇨🇳',
  en: '🇺🇸',
};

// 语言名称映射
export const languageNames: Record<Language, string> = {
  zh: '中文',
  en: 'English',
};

