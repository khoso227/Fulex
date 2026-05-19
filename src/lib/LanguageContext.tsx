import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'ur' | 'sd';

interface Translations {
  [key: string]: {
    en: string;
    ur: string;
    sd: string;
  };
}

export const translations: Translations = {
  dashboard: {
    en: 'Dashboard',
    ur: 'ڈیش بورڈ',
    sd: 'ڊيش بورڊ'
  },
  vehicle_health: {
    en: 'Vehicle Health',
    ur: 'گاڑی کی حالت',
    sd: 'گاڏي جي حالت'
  },
  register_vehicle: {
    en: 'Register New Vehicle',
    ur: 'نئی گاڑی رجسٹر کریں',
    sd: 'نئين گاڏي رجسٽر ڪريو'
  },
  make: {
    en: 'Make',
    ur: 'کمپنی',
    sd: 'ڪمپني'
  },
  model: {
    en: 'Model',
    ur: 'ماڈل',
    sd: 'ماڊل'
  },
  year: {
    en: 'Year',
    ur: 'سال',
    sd: 'سال'
  },
  login: {
    en: 'Portal Access',
    ur: 'پورٹل تک رسائی',
    sd: 'پورٽل تائين رسائي'
  },
  tagline: {
    en: 'Unified Energy.',
    ur: 'متحدہ توانائی۔',
    sd: 'متحدہ توانائي.'
  },
  desc: {
    en: "The region's first digital fuel settlement network. IoT enabled inventory, BNPL credits, and AI vehicle diagnostics.",
    ur: 'خطے کا پہلا ڈیجیٹل فیول سیٹلمنٹ نیٹ ورک۔ آئی او ٹی سے لیس انوینٹری، بی این پی ایل کریڈٹس، اور اے آئی وہیکل ڈائیگنوسٹکس۔',
    sd: 'علائقي جو پهريون ڊجيٽل فيول سيٽلمينٽ نيٽ ورڪ. IoT سان ليس انونٽري، BNPL ڪريڊٽس، ۽ AI گاڏين جي تشخيص.'
  },
  license_plate: {
    en: 'License Plate',
    ur: 'نمبر پلیٹ',
    sd: 'نمبر پليٽ'
  },
  fuel_type: {
    en: 'Fuel Type',
    ur: 'ایندھن کی قسم',
    sd: 'ٻارڻ جو قسم'
  },
  mileage: {
    en: 'Current Mileage',
    ur: 'موجودہ مائلیج',
    sd: 'موجودہ مائيليج'
  },
  efficiency: {
    en: 'Average Efficiency',
    ur: 'اوسط کارکردگی',
    sd: 'سراسري ڪارڪردگي'
  },
  save: {
    en: 'Save Details',
    ur: 'تفصیلات محفوظ کریں',
    sd: 'تفصيل محفوظ ڪريو'
  },
  create_account: {
    en: 'Create Account',
    ur: 'اکاؤنٹ بنائیں',
    sd: 'اڪائونٽ ٺاهيو'
  },
  email: {
    en: 'Email Address',
    ur: 'ای میل ایڈریس',
    sd: 'اي ميل ائڊريس'
  },
  password: {
    en: 'Password',
    ur: 'پاس ورڈ',
    sd: 'پاس ورڊ'
  },
  forgot_password: {
    en: 'Forgot Password?',
    ur: 'پاس ورڈ بھول گئے؟',
    sd: 'پاس ورڊ وساري ويٺا؟'
  },
  reset_link: {
    en: 'Send Recovery Email',
    ur: 'ریکوری ای میل بھیجیں',
    sd: 'واپسي جي اي ميل موڪليو'
  },
  back_to_login: {
    en: 'Back to Login',
    ur: 'لاگ ان پر واپس جائیں',
    sd: 'لاگ ان ڏانهن واپس وڃو'
  },
  phone_login: {
    en: 'Login via Mobile',
    ur: 'موبائل کے ذریعے لاگ ان',
    sd: 'موبائل ذريعي لاگ ان'
  },
  biometric_login: {
    en: 'Biometric Access',
    ur: 'بایومیٹرک رسائی',
    sd: 'بايوميٽرڪ رسائي'
  },
  login_btn: {
    en: 'Sign In',
    ur: 'سائن ان کریں',
    sd: 'سائن ان ڪريو'
  },
  no_account: {
    en: "Don't have an account?",
    ur: 'اکاؤنٹ نہیں ہے؟',
    sd: 'اڪائونٽ ناهي؟'
  },
  have_account: {
    en: 'Already have an account?',
    ur: 'پہلے سے اکاؤنٹ ہے؟',
    sd: 'پهرين ئي اڪائونٽ آهي؟'
  },
  status: {
    en: 'Status',
    ur: 'حیثیت',
    sd: 'حيثيت'
  },
  station_label: {
    en: 'Station / Node',
    ur: 'اسٹیشن / نوڈ',
    sd: 'اسٽيشن / نوڊ'
  },
  resource: {
    en: 'Resource',
    ur: 'وسیلہ',
    sd: 'وسيلو'
  },
  amount: {
    en: 'Settled Amount',
    ur: 'رقم',
    sd: 'رقم'
  },
  completed: {
    en: 'Completed',
    ur: 'مکمل',
    sd: 'مڪمل'
  },
  processing: {
    en: 'Processing',
    ur: 'جاری ہے',
    sd: 'جاري آهي'
  },
  no_history: {
    en: 'No transactions found.',
    ur: 'کوئی لین دین نہیں ملا۔',
    sd: 'ڪو به ٽرانزيڪشن نه مليو.'
  },
  map: {
    en: 'Universal Map',
    ur: 'عالمگیر نقشہ',
    sd: 'عالمگير نقشو'
  },
  history: {
    en: 'Activity Log',
    ur: 'سرگرمی لاگ',
    sd: 'سرگرمي لاگ'
  },
  wallet: {
    en: 'Energy Wallet',
    ur: 'انرجی والٹ',
    sd: 'انرجي والٽ'
  },
  eco: {
    en: 'Eco Monitor',
    ur: 'ایکو مانیٹر',
    sd: 'ايڪو مانيٽر'
  },
  petrol: {
    en: 'Petrol',
    ur: 'پیٹرول',
    sd: 'پيٽرول'
  },
  diesel: {
    en: 'Diesel',
    ur: 'ڈیزل',
    sd: 'ڊيزل'
  },
  ev: {
    en: 'EV',
    ur: 'ای وی',
    sd: 'اي وي'
  },
  cng: {
    en: 'CNG',
    ur: 'سی این جی',
    sd: 'سي اين جي'
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string) => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      <div dir={language === 'en' ? 'ltr' : 'rtl'} className={language === 'en' ? '' : 'font-urdu'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
