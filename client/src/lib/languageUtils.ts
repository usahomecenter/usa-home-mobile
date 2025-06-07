import { languageOptions } from "@/data/languageData";
import { translations } from "@/hooks/useLanguage";

// Get the current language from localStorage or default to English
export function getCurrentLanguage() {
  const savedLanguageCode = localStorage.getItem('languageCode');
  if (savedLanguageCode) {
    const savedLanguage = languageOptions.find(lang => lang.code === savedLanguageCode);
    if (savedLanguage) {
      return savedLanguage;
    }
  }
  return languageOptions[0]; // Default to English
}

// Translation function that can be used outside of React components
export function translateText(key: string): string {
  const currentLanguage = getCurrentLanguage();
  
  // If translation exists for current language, return it
  if (translations[currentLanguage.code] && translations[currentLanguage.code][key]) {
    return translations[currentLanguage.code][key];
  }
  
  // Fallback to English
  if (translations.en && translations.en[key]) {
    return translations.en[key];
  }
  
  // If no translation is found, return the key itself
  return key;
}

// Update HTML lang attribute
export function updateHtmlLang() {
  const currentLanguage = getCurrentLanguage();
  document.documentElement.lang = currentLanguage.code;
  document.documentElement.dir = currentLanguage.code === 'ar' || currentLanguage.code === 'fa' ? 'rtl' : 'ltr';
}