import React, { createContext, useContext, useState } from 'react';
import { BRAND_NAME, BRAND_SUBTITLE, BRAND_LOGO } from '../data/styles';
import { playNotificationChime, vibrateDevice } from '../utils/notificationTranslator';

export interface CustomAdItem {
  id: string;
  title: string;
  placement: 'top' | 'middle' | 'bottom';
  code: string;
  enabled: boolean;
  createdAt: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'update' | 'announcement' | 'reward' | 'vip';
  link?: string;
  createdAt: number;
  titles?: Record<string, string>;
  messages?: Record<string, string>;
}

export interface SiteConfig {
  brandName: string;
  brandSubtitle: string;
  brandLogo: string;
  showLogo: boolean;
  brandBadge: string;
  showBadge: boolean;
  announcement: string;
  showAnnouncement: boolean;
  adsList: CustomAdItem[];
  socialAdEnabled: boolean;
  socialAdScriptUrl: string;
  // Adsterra Direct Link Copy Settings
  directLinkEnabled: boolean;
  directLinkUrl: string;
  countdownSeconds: number;
  // Social links
  youtubeUrl: string;
  facebookUrl: string;
  telegramUrl: string;
  whatsappUrl: string;
  discordUrl: string;
  // Notifications List
  notificationsList: NotificationItem[];
  // Rotating Red Border Light
  borderLightEnabled: boolean;
  borderLightSpeed: number; // Duration in seconds (e.g. 5)
}

// Ads list initially empty until new IDs are provided by user
const DEFAULT_ADS: CustomAdItem[] = [];

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'নতুন ফ্রি ফায়ার ভিআইপি স্টাইল যুক্ত হয়েছে!',
    message: '亗𝐑𝐗々𝐅𝐅 𝐒𝐓𝐘𝐋𝐄亗 এ সেরা ক্ল্যান স্টাইল, উইং ও নিনজা ফ্রেম আপডেট করা হয়েছে। আপনার নাম লিখে এখনই কপি করুন!',
    titles: {
      bn: 'নতুন ফ্রি ফায়ার ভিআইপি স্টাইল যুক্ত হয়েছে!',
      en: 'New Free Fire VIP Styles Added!',
      hi: 'नए फ्री फायर वीआईपी स्टाइल जोड़े गए!',
      id: 'Gaya VIP Free Fire Baru Ditambahkan!',
      pt: 'Novos Estilos VIP de Free Fire Adicionados!',
      es: '¡Nuevos Estilos VIP de Free Fire Añadidos!',
      ar: 'تمت إضافة زخارف فري فاير VIP جديدة!',
      ur: 'نئے فری فائر وی آئی پی اسٹائلز شامل کیے گئے!'
    },
    messages: {
      bn: '亗𝐑𝐗々𝐅𝐅 𝐒𝐓𝐘𝐋𝐄亗 এ সেরা ক্ল্যান স্টাইল, উইং ও নিনজা ফ্রেম আপডেট করা হয়েছে। আপনার নাম লিখে এখনই কপি করুন!',
      en: 'Best clan styles, angel wings, and ninja brackets updated! Type your name and copy instantly.',
      hi: '亗𝐑𝐗々𝐅𝐅 𝐒𝐓𝐘𝐋𝐄亗 में सर्वश्रेष्ठ कबीले शैलियाँ और पंख अपडेट किए गए हैं। अपना नाम टाइप करें और कॉपी करें!',
      id: 'Gaya klan terbaik, sayap malaikat, dan bingkai ninja diperbarui! Ketik nama Anda dan salin sekarang.',
      pt: 'Melhores estilos de clã, asas de anjo e símbolos ninja atualizados! Digite seu nick e copie agora.',
      es: '¡Los mejores estilos de clan, alas de ángel y marcos ninja han sido actualizados! Escribe tu nombre y copia.',
      ar: 'تم تحديث أفضل زخارف الكلان وأجنحة الملاك ورموز النينجا! اكتب اسمك وانسخ الآن.',
      ur: 'بہترین کلاں اسٹائلز اور اینجل ونگز اپ ڈیٹ ہو چکے ہیں! اپنا نام لکھیں اور کاپی کریں۔'
    },
    type: 'vip',
    createdAt: 1710000000000
  },
  {
    id: 'notif-2',
    title: 'ফ্রি ফায়ার অদৃশ্য স্পেস (U+3164) ১০০% কার্যকর',
    message: 'গেমের মধ্যে নাম লুকানো বা স্পেস দিতে হ্যাঙ্গুল ফিলার স্পেস ব্যবহার করুন। Space ট্যাবে ক্লিক করে ১-ক্লিকে কপি করুন।',
    titles: {
      bn: 'ফ্রি ফায়ার অদৃশ্য স্পেস (U+3164) ১০০% কার্যকর',
      en: 'Free Fire Invisible Space (U+3164) 100% Working',
      hi: 'फ्री फायर अदृश्य स्पेस (U+3164) 100% काम कर रहा है',
      id: 'Spasi Kosong Free Fire (U+3164) 100% Berhasil',
      pt: 'Espaço Invisível Free Fire (U+3164) 100% Funcional',
      es: 'Espacio Invisible Free Fire (U+3164) 100% Funcional',
      ar: 'المسافة المخفية فري فاير (U+3164) تعمل 100%',
      ur: 'فری فائر پوشیدہ اسپیس (U+3164) 100% کام کر رہا ہے'
    },
    messages: {
      bn: 'গেমের মধ্যে নাম লুকানো বা স্পেস দিতে হ্যাঙ্গুল ফিলার স্পেস ব্যবহার করুন। Space ট্যাবে ক্লিক করে ১-ক্লিকে কপি করুন।',
      en: 'Hide your nickname or add blank space using Unicode U+3164. Go to Space tab to copy with 1 click.',
      hi: 'गेम में नाम छिपाने या स्पेस देने के लिए स्पेस टूल का उपयोग करें। Space टैब में जाकर 1-क्लिक में कॉपी करें।',
      id: 'Sembunyikan nama atau tambahkan spasi menggunakan spasi kosong. Buka tab Space untuk menyalin dengan 1 klik.',
      pt: 'Esconda seu nome ou adicione espaço em branco usando U+3164. Vá para a aba Espaço para copiar em 1 clique.',
      es: 'Oculta tu nombre o añade espacio en blanco con U+3164. Ve a la pestaña Espacio para copiar en 1 clic.',
      ar: 'قم بإخفاء اسمك أو إضافة مسافة فارغة باستخدام U+3164. انتقل إلى علامة التبويب المسافة للنسخ بنقرة واحدة.',
      ur: 'نام چھپانے کے لیے اسپیس ٹول استعمال کریں۔ Space ٹیب میں جا کر کاپی کریں۔'
    },
    type: 'update',
    createdAt: 1710001000000
  }
];

const DEFAULT_CONFIG: SiteConfig = {
  brandName: BRAND_NAME,
  brandSubtitle: BRAND_SUBTITLE,
  brandLogo: BRAND_LOGO,
  showLogo: true,
  brandBadge: 'FF PRO',
  showBadge: true,
  announcement: 'স্বাগতম 亗𝐑𝐗々𝐅𝐅 𝐒𝐓𝐘𝐋𝐄亗 এ! ফ্রি ফায়ার স্টাইলিশ নাম, সিম্বল এবং ইনভিজিবল স্পেস কপি করুন।',
  showAnnouncement: false,
  adsList: DEFAULT_ADS,
  socialAdEnabled: false,
  socialAdScriptUrl: '',
  directLinkEnabled: false,
  directLinkUrl: '',
  countdownSeconds: 5,
  youtubeUrl: 'https://youtube.com/@mrrxh?si=hlywUd5-dVH8Qpic',
  facebookUrl: 'https://www.facebook.com/profile.php?id=61593084736115',
  telegramUrl: 'https://t.me/rxhofficial',
  whatsappUrl: 'https://wa.me/8801909073140',
  discordUrl: 'https://discord.gg/',
  notificationsList: DEFAULT_NOTIFICATIONS,
  borderLightEnabled: true,
  borderLightSpeed: 5
};

const STORAGE_KEY = 'rx_ff_site_config_v11';

interface AdminContextType {
  config: SiteConfig;
  updateConfig: (newConfig: Partial<SiteConfig>) => void;
  resetConfig: () => void;
  addAd: (ad: Omit<CustomAdItem, 'id' | 'createdAt'>) => void;
  updateAd: (id: string, ad: Partial<CustomAdItem>) => void;
  deleteAd: (id: string) => void;
  toggleAd: (id: string) => void;
  // Notifications
  addNotification: (notif: Omit<NotificationItem, 'id' | 'createdAt'>) => void;
  updateNotification: (id: string, notif: Partial<NotificationItem>) => void;
  deleteNotification: (id: string) => void;
  broadcastNotification: (id: string) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  // Copy Ad Modal State
  copyModalOpen: boolean;
  setCopyModalOpen: (open: boolean) => void;
  pendingTextToCopy: string | null;
  setPendingTextToCopy: (text: string | null) => void;
  startCopyFlow: (text: string, onDirectCopied?: () => void) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<SiteConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_CONFIG,
          ...parsed,
          adsList: Array.isArray(parsed.adsList) ? parsed.adsList : DEFAULT_ADS,
          notificationsList: Array.isArray(parsed.notificationsList) && parsed.notificationsList.length > 0
            ? parsed.notificationsList
            : DEFAULT_NOTIFICATIONS
        };
      }
    } catch (e) {
      console.error('Failed to load site config from storage', e);
    }
    return DEFAULT_CONFIG;
  });

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [copyModalOpen, setCopyModalOpen] = useState(false);
  const [pendingTextToCopy, setPendingTextToCopy] = useState<string | null>(null);

  const updateConfig = (newConfig: Partial<SiteConfig>) => {
    setConfig(prev => {
      const updated = { ...prev, ...newConfig };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save site config', e);
      }
      return updated;
    });
  };

  const addAd = (newAdData: Omit<CustomAdItem, 'id' | 'createdAt'>) => {
    const newAd: CustomAdItem = {
      ...newAdData,
      id: `ad-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: Date.now()
    };
    setConfig(prev => {
      const updated = {
        ...prev,
        adsList: [...prev.adsList, newAd]
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const updateAd = (id: string, updatedFields: Partial<CustomAdItem>) => {
    setConfig(prev => {
      const updated = {
        ...prev,
        adsList: prev.adsList.map(ad => ad.id === id ? { ...ad, ...updatedFields } : ad)
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const deleteAd = (id: string) => {
    setConfig(prev => {
      const updated = {
        ...prev,
        adsList: prev.adsList.filter(ad => ad.id !== id)
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const toggleAd = (id: string) => {
    setConfig(prev => {
      const updated = {
        ...prev,
        adsList: prev.adsList.map(ad => ad.id === id ? { ...ad, enabled: !ad.enabled } : ad)
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // Notification management
  const addNotification = (notifData: Omit<NotificationItem, 'id' | 'createdAt'>) => {
    const newNotif: NotificationItem = {
      ...notifData,
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: Date.now()
    };

    setConfig(prev => {
      const updated = {
        ...prev,
        notificationsList: [newNotif, ...prev.notificationsList]
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    // Play gaming notification chime & vibrate mobile device
    playNotificationChime();
    vibrateDevice([150, 100, 200]);

    // Dispatch custom event for real-time in-app notification
    try {
      window.dispatchEvent(new CustomEvent('rx_new_notification', { detail: newNotif }));
    } catch (e) {}

    // Send native browser notification if user allowed
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(newNotif.title, {
          body: newNotif.message,
          icon: config.brandLogo || BRAND_LOGO
        });
      } catch (e) {
        console.warn('Native push notification error', e);
      }
    }
  };

  const broadcastNotification = (id: string) => {
    const notif = config.notificationsList.find(n => n.id === id);
    if (!notif) return;

    playNotificationChime();
    vibrateDevice([200, 100, 200]);

    try {
      window.dispatchEvent(new CustomEvent('rx_new_notification', { detail: notif }));
    } catch (e) {}

    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(notif.title, {
          body: notif.message,
          icon: config.brandLogo || BRAND_LOGO
        });
      } catch (e) {}
    }
  };

  const updateNotification = (id: string, updatedFields: Partial<NotificationItem>) => {
    setConfig(prev => {
      const updated = {
        ...prev,
        notificationsList: prev.notificationsList.map(n => n.id === id ? { ...n, ...updatedFields } : n)
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    try {
      window.dispatchEvent(new CustomEvent('rx_notification_updated', { detail: { id, updatedFields } }));
    } catch (e) {}
  };

  const deleteNotification = (id: string) => {
    setConfig(prev => {
      const updated = {
        ...prev,
        notificationsList: prev.notificationsList.filter(n => n.id !== id)
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const resetConfig = () => {
    setConfig(DEFAULT_CONFIG);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CONFIG));
    } catch (e) {
      console.error('Failed to reset config', e);
    }
  };

  // Central Copy Flow Handler:
  const startCopyFlow = (text: string, onDirectCopied?: () => void) => {
    if (config.directLinkEnabled && config.directLinkUrl && config.directLinkUrl.trim()) {
      setPendingTextToCopy(text);
      setCopyModalOpen(true);
      // Open the Adsterra Direct Link in a new tab for ad impression
      try {
        window.open(config.directLinkUrl.trim(), '_blank', 'noopener,noreferrer');
      } catch (e) {
        console.error('Direct link open blocked', e);
      }
    } else {
      // Direct copy immediately
      navigator.clipboard.writeText(text);
      if (onDirectCopied) onDirectCopied();
    }
  };

  return (
    <AdminContext.Provider
      value={{
        config,
        updateConfig,
        resetConfig,
        addAd,
        updateAd,
        deleteAd,
        toggleAd,
        addNotification,
        updateNotification,
        deleteNotification,
        broadcastNotification,
        isAdminOpen,
        setIsAdminOpen,
        copyModalOpen,
        setCopyModalOpen,
        pendingTextToCopy,
        setPendingTextToCopy,
        startCopyFlow
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
