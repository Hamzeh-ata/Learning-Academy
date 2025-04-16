import PrimeReact, { locale, updateLocaleOption, addLocale } from 'primereact/api';
import ARLocale from './ar/ar-prime-react.json';
import EnLocale from './en/en-prime-react.json';

export const PrimeReactLocale = (lang) => {
  PrimeReact.ripple = true;
  addLocale(lang, lang === 'ar' ? ARLocale : EnLocale);
  updateLocaleOption('firstDayOfWeek', 1, lang);
  locale(lang);
};
