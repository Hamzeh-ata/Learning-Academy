import translationsEN from './en/en.json';
import translationsAR from './ar/ar.json';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';

const resources = {
  en: {
    translation: translationsEN
  },
  ar: {
    translation: translationsAR
  }
};

const DETECTION_OPTIONS = {
  order: ['htmlTag'],
  lookupFromPathIndex: 0,
  caches: []
};

i18n
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(LanguageDetector)
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    resources,
    fallbackLng: 'en', // default language
    detection: DETECTION_OPTIONS,
    keySeparator: '.',
    interpolation: {
      escapeValue: false // react already safes from xss
    },
    react: { useSuspense: false } //this line
  });
i18n.languages = ['en', 'ar'];

export default i18n;
