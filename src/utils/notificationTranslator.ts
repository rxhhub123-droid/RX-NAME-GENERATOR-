export interface TranslatedNotice {
  title: string;
  message: string;
}

// Gaming dictionary for quick multi-language localization
const TRANSLATION_MAPS: Record<string, {
  vipTitle: string;
  vipMsg: string;
  updateTitle: string;
  updateMsg: string;
  rewardTitle: string;
  rewardMsg: string;
  announcementTitle: string;
  announcementMsg: string;
  spaceTitle: string;
  spaceMsg: string;
}> = {
  bn: {
    vipTitle: 'নতুন ফ্রি ফায়ার ভিআইপি স্টাইল যুক্ত হয়েছে!',
    vipMsg: '亗𝐑𝐗々𝐅𝐅 𝐒𝐓𝐘𝐋𝐄亗 এ সেরা ক্ল্যান স্টাইল, উইং ও নিনজা ফ্রেম আপডেট করা হয়েছে। আপনার নাম লিখে এখনই কপি করুন!',
    updateTitle: 'ফ্রি ফায়ার নতুন আপডেট ও নতুন নাম!',
    updateMsg: 'নতুন ট্রেন্ডিং ফন্ট এবং কুল সিম্বল সাইটে যুক্ত করা হয়েছে। পছন্দমতো বেছে কপি করে গেমে সেট করুন।',
    rewardTitle: 'ফ্রি ফায়ার স্পেশাল রিওয়ার্ড নোটিশ!',
    rewardMsg: 'আমাদের সোশ্যাল চ্যানেলে গিভওয়ে এবং বিশেষ ফ্রি রিডিম কোড শেয়ার করা হয়েছে। লিংকে ক্লিক করে যুক্ত হন।',
    announcementTitle: 'অফিসিয়াল গেমিং ঘোষণা',
    announcementMsg: 'সাইটের সকল নাম ও ফন্ট ফ্রি ফায়ার এবং ফ্রি ফায়ার ম্যাক্সে ১০০% কার্যকর। বন্ধুদের সাথে শেয়ার করুন।',
    spaceTitle: 'ফ্রি ফায়ার অদৃশ্য স্পেস (U+3164) ১০০% কার্যকর',
    spaceMsg: 'গেমের মধ্যে নাম লুকানো বা স্পেস দিতে হ্যাঙ্গুল ফিলার স্পেস ব্যবহার করুন। Space ট্যাবে গিয়ে ১-ক্লিকে কপি করুন।'
  },
  en: {
    vipTitle: 'New Free Fire VIP Styles Added!',
    vipMsg: 'Best clan styles, angel wings, and ninja brackets updated! Type your name and copy instantly.',
    updateTitle: 'Free Fire Fresh Update & New Nicknames!',
    updateMsg: 'Trending stylish fonts and cool symbols are now added. Select and copy to your game easily.',
    rewardTitle: 'Free Fire Special Reward Notice!',
    rewardMsg: 'Giveaways and special redeem codes shared on our community channel. Click the link to join!',
    announcementTitle: 'Official Gaming Announcement',
    announcementMsg: 'All stylish names and unicode symbols work 100% on Free Fire & FF MAX. Share with your squad!',
    spaceTitle: 'Free Fire Invisible Space (U+3164) 100% Working',
    spaceMsg: 'Hide your nickname or add blank spaces using Unicode U+3164. Go to Space tab to copy with 1 click.'
  },
  hi: {
    vipTitle: 'नए फ्री फायर वीआईपी स्टाइल जोड़े गए!',
    vipMsg: '亗𝐑𝐗々𝐅𝐅 𝐒𝐓𝐘𝐋𝐄亗 में सर्वश्रेष्ठ कबीले शैलियाँ और पंख अपडेट किए गए हैं। अपना नाम टाइप करें और कॉपी करें!',
    updateTitle: 'फ्री फायर नया अपडेट और स्टाइलिश नाम!',
    updateMsg: 'ट्रेंडिंग कूल फ़ॉन्ट्स और सिंबल जोड़े गए हैं। अपनी पसंद का नाम चुनें और 1-क्लिक में कॉपी करें।',
    rewardTitle: 'फ्री फायर विशेष इनाम सूचना!',
    rewardMsg: 'हमारे सोशल चैनल पर विशेष कोड और गिवअवे साझा किए गए हैं। जुड़ने के लिए लिंक पर क्लिक करें।',
    announcementTitle: 'आधिकारिक गेमिंग सूचना',
    announcementMsg: 'सभी नाम और फ़ॉन्ट फ्री फायर और फ्री फायर मैक्स में 100% काम करते हैं। स्क्वाड के साथ साझा करें।',
    spaceTitle: 'फ्री फायर अदृश्य स्पेस (U+3164) 100% काम कर रहा है',
    spaceMsg: 'गेम में नाम छिपाने या स्पेस देने के लिए स्पेस टूल का उपयोग करें। Space टैब में जाकर 1-क्लिक में कॉपी करें।'
  },
  id: {
    vipTitle: 'Gaya VIP Free Fire Baru Ditambahkan!',
    vipMsg: 'Gaya klan terbaik, sayap malaikat, dan bingkai ninja diperbarui! Ketik nama Anda dan salin sekarang.',
    updateTitle: 'Pembaruan Free Fire & Nama Keren Baru!',
    updateMsg: 'Font bergaya dan simbol viral telah ditambahkan. Pilih dan salin ke game Anda dengan mudah.',
    rewardTitle: 'Pemberitahuan Hadiah Spesial Free Fire!',
    rewardMsg: 'Giveaway dan kode redeem khusus dibagikan di saluran resmi kami. Klik tautan untuk bergabung!',
    announcementTitle: 'Pengumuman Resmi Gaming',
    announcementMsg: 'Semua nama dan simbol keren 100% berfungsi di Free Fire & FF MAX. Bagikan dengan teman Anda!',
    spaceTitle: 'Spasi Kosong Free Fire (U+3164) 100% Berhasil',
    spaceMsg: 'Sembunyikan nama atau tambahkan spasi menggunakan spasi kosong. Buka tab Space untuk menyalin dengan 1 klik.'
  },
  pt: {
    vipTitle: 'Novos Estilos VIP de Free Fire Adicionados!',
    vipMsg: 'Melhores estilos de clã, asas de anjo e símbolos ninja atualizados! Digite seu nick e copie agora.',
    updateTitle: 'Nova Atualização do Free Fire & Nicks Top!',
    updateMsg: 'Fontes estilosas e símbolos virais adicionados ao site. Escolha o seu e copie direto para o jogo.',
    rewardTitle: 'Aviso de Recompensas Especiais FF!',
    rewardMsg: 'Sorteios e códigos de resgate especiais compartilhados no nosso canal. Clique no link para participar!',
    announcementTitle: 'Comunicado Oficial Gamer',
    announcementMsg: 'Todos os nicks e símbolos funcionam 100% no Free Fire e Free Fire MAX. Compartilhe com a guilda!',
    spaceTitle: 'Espaço Invisível Free Fire (U+3164) 100% Funcional',
    spaceMsg: 'Esconda seu nome ou adicione espaço em branco usando U+3164. Vá para a aba Espaço para copiar em 1 clique.'
  },
  es: {
    vipTitle: '¡Nuevos Estilos VIP de Free Fire Añadidos!',
    vipMsg: '¡Los mejores estilos de clan, alas de ángel y marcos ninja han sido actualizados! Escribe tu nombre y copia.',
    updateTitle: '¡Nueva Actualización de Free Fire y Nicks Pro!',
    updateMsg: 'Fuentes estilizadas y símbolos geniales añadidos. Selecciona tu favorito y cópialo al juego fácilmente.',
    rewardTitle: '¡Aviso de Recompensa Especial Free Fire!',
    rewardMsg: 'Sorteos y códigos de canje especiales compartidos en nuestro canal. ¡Haz clic en el enlace para unirte!',
    announcementTitle: 'Anuncio Oficial de Juegos',
    announcementMsg: 'Todos los nombres y símbolos funcionan al 100% en Free Fire y FF MAX. ¡Comparte con tu clan!',
    spaceTitle: 'Espacio Invisible Free Fire (U+3164) 100% Funcional',
    spaceMsg: 'Oculta tu nombre o añade espacio en blanco con U+3164. Ve a la pestaña Espacio para copiar en 1 clic.'
  },
  ar: {
    vipTitle: 'تمت إضافة زخارف فري فاير VIP جديدة!',
    vipMsg: 'تم تحديث أفضل زخارف الكلان وأجنحة الملاك ورموز النينجا! اكتب اسمك وانسخ الآن بسهولة.',
    updateTitle: 'تحديث جديد لأسماء وزخارف فري فاير!',
    updateMsg: 'تمت إضافة خطوط عصرية ورموز ألعاب نادرة. اختر اسمك وانسخه بنقرة واحدة داخل اللعبة.',
    rewardTitle: 'إشعار مكافأة فري فاير الخاصة!',
    rewardMsg: 'هدايا وأكواد استرداد خاصة تمت مشاركتها على قنواتنا الرسمية. انقر فوق الرابط للانضمام!',
    announcementTitle: 'إعلان ألعاب رسمي',
    announcementMsg: 'جميع الأسماء المزخرفة والرموز تعمل بنسبة 100% في Free Fire و Free Fire MAX. شاركها مع كلانك!',
    spaceTitle: 'المسافة المخفية فري فاير (U+3164) تعمل 100%',
    spaceMsg: 'قم بإخفاء اسمك أو إضافة مسافة فارغة باستخدام U+3164. انتقل إلى علامة التبويب المسافة للنسخ بنقرة واحدة.'
  },
  ur: {
    vipTitle: 'نئے فری فائر وی آئی پی اسٹائلز شامل کیے گئے!',
    vipMsg: 'بہترین کلاں اسٹائلز اور اینجل ونگز اپ ڈیٹ ہو چکے ہیں! اپنا نام لکھیں اور فوری کاپی کریں۔',
    updateTitle: 'فری فائر نئی اپ ڈیٹ اور اسٹائلش نام!',
    updateMsg: 'ٹرینڈنگ فونٹس اور گیمنگ سمبلز سائٹ میں شامل ہو گئے ہیں۔ اپنی پسند کا نام چن کر کاپی کریں۔',
    rewardTitle: 'فری فائر خصوصی انعام کا نوٹس!',
    rewardMsg: 'ہمارے سوشل چینل پر خصوصی کوڈز اور تحائف شیئر کیے گئے ہیں۔ شامل ہونے کے لیے لنک پر کلک کریں۔',
    announcementTitle: 'سرکاری گیمنگ کا اعلان',
    announcementMsg: 'تمام اسٹائلش نام فری فائر اور فری فائر میکس میں 100% کام کرتے ہیں۔ اپنے دوستوں کے ساتھ شیئر کریں۔',
    spaceTitle: 'فری فائر پوشیدہ اسپیس (U+3164) 100% کام کر رہا ہے',
    spaceMsg: 'نام چھپانے کے لیے اسپیس ٹول استعمال کریں۔ Space ٹیب میں جا کر 1-کلک میں کاپی کریں۔'
  },
  ru: {
    vipTitle: 'Добавлены новые VIP стили для Free Fire!',
    vipMsg: 'Обновлены лучшие клановые стили, крылья ангела и символы ниндзя! Введите ник и скопируйте сейчас.',
    updateTitle: 'Новое обновление ников Free Fire!',
    updateMsg: 'Добавлены трендовые шрифты и крутые символы. Выберите стиль и скопируйте в один клик.',
    rewardTitle: 'Специальное уведомление о наградах FF!',
    rewardMsg: 'Розыгрыши и подарочные промокоды опубликованы на нашем канале. Нажмите на ссылку, чтобы присоединиться!',
    announcementTitle: 'Официальное объявление',
    announcementMsg: 'Все красивые ники и символы работают на 100% в Free Fire и FF MAX. Поделитесь со своей гильдией!',
    spaceTitle: 'Невидимый пробел Free Fire (U+3164) 100% работает',
    spaceMsg: 'Скройте свой никнейм или добавьте пустой пробел через Unicode U+3164 во вкладке Space.'
  },
  vi: {
    vipTitle: 'Đã thêm kiểu tên VIP Free Fire mới!',
    vipMsg: 'Cập nhật kiểu tên quân đoàn, cánh thiên thần và khung ninja! Nhập tên của bạn và sao chép ngay.',
    updateTitle: 'Cập nhật tên Free Fire mới nhất!',
    updateMsg: 'Đã thêm các font chữ và ký tự đặc biệt thịnh hành. Chọn tên yêu thích và sao chép vào game.',
    rewardTitle: 'Thông báo phần thưởng Free Fire đặc biệt!',
    rewardMsg: 'Quà tặng và mã đổi thưởng đặc biệt được chia sẻ trên kênh cộng đồng. Nhấn liên kết để tham gia!',
    announcementTitle: 'Thông báo chính thức',
    announcementMsg: 'Tất cả tên và ký tự hoạt động 100% trên Free Fire & Free Fire MAX. Chia sẻ ngay với bạn bè!',
    spaceTitle: 'Khoảng trống tàng hình Free Fire (U+3164)',
    spaceMsg: 'Ẩn tên của bạn hoặc thêm khoảng trắng với U+3164. Vào mục Space để sao chép với 1 lần chạm.'
  },
  tr: {
    vipTitle: 'Yeni Free Fire VIP Stilleri Eklendi!',
    vipMsg: 'En iyi klan stilleri, melek kanatları ve ninja çerçeveleri güncellendi! Adınızı yazıp hemen kopyalayın.',
    updateTitle: 'Yeni Free Fire Güncellemesi & Şekilli İsimler!',
    updateMsg: 'Popüler havalı yazı tipleri ve semboller eklendi. Beğendiğiniz adı seçip oyuna kopyalayın.',
    rewardTitle: 'Free Fire Özel Ödül Bildirimi!',
    rewardMsg: 'Özel hediye kodları ve çekilişler kanalımızda paylaşıldı. Katılmak için linke tıklayın!',
    announcementTitle: 'Resmi Oyun Duyurusu',
    announcementMsg: 'Tüm şekilli isimler Free Fire ve FF MAX ile %100 uyumludur. Takımınızla paylaşın!',
    spaceTitle: 'Free Fire Görünmez Boşluk (U+3164) %100 Çalışıyor',
    spaceMsg: 'İsminizi gizlemek veya boşluk bırakmak için Görünmez Boşluk (Space) sekmesinden tek tıkla kopyalayın.'
  }
};

/**
 * Automatically resolves the title and message of a notification in the requested language
 */
export function resolveNoticeInLanguage(
  notice: {
    title: string;
    message: string;
    type?: string;
    titles?: Record<string, string>;
    messages?: Record<string, string>;
  },
  langCode: string
): TranslatedNotice {
  // 1. Direct hit in custom translations
  if (notice.titles?.[langCode] && notice.messages?.[langCode]) {
    return {
      title: notice.titles[langCode],
      message: notice.messages[langCode]
    };
  }

  // 2. Check type template match from our gaming dictionary
  const typeKey = (notice.type || 'vip') as 'vip' | 'update' | 'reward' | 'announcement';
  const targetMap = TRANSLATION_MAPS[langCode];
  
  if (targetMap) {
    if (notice.title.includes('অদৃশ্য') || notice.title.toLowerCase().includes('invisible') || notice.title.includes('U+3164')) {
      return {
        title: targetMap.spaceTitle,
        message: targetMap.spaceMsg
      };
    }
    if (typeKey === 'vip' && (notice.title.includes('ভিআইপি') || notice.title.toLowerCase().includes('vip'))) {
      return {
        title: targetMap.vipTitle,
        message: targetMap.vipMsg
      };
    }
    if (typeKey === 'update' && (notice.title.includes('আপডেট') || notice.title.toLowerCase().includes('update'))) {
      return {
        title: targetMap.updateTitle,
        message: targetMap.updateMsg
      };
    }
    if (typeKey === 'reward' && (notice.title.includes('রিওয়ার্ড') || notice.title.toLowerCase().includes('reward') || notice.title.includes('গিভওয়ে'))) {
      return {
        title: targetMap.rewardTitle,
        message: targetMap.rewardMsg
      };
    }
  }

  // 3. Fallback to English if available and lang is not Bengali
  if (langCode !== 'bn') {
    if (notice.titles?.en && notice.messages?.en) {
      return {
        title: notice.titles.en,
        message: notice.messages.en
      };
    }
  }

  // 4. Default: original title and message
  return {
    title: notice.titles?.[langCode] || notice.title,
    message: notice.messages?.[langCode] || notice.message
  };
}

/**
 * Generate multi-language map when admin creates or edits a notice
 */
export function generateNoticeTranslations(
  titleBn: string,
  messageBn: string,
  titleEn?: string,
  messageEn?: string,
  type: string = 'vip'
): { titles: Record<string, string>; messages: Record<string, string> } {
  const titles: Record<string, string> = {
    bn: titleBn,
    en: titleEn?.trim() || titleBn
  };

  const messages: Record<string, string> = {
    bn: messageBn,
    en: messageEn?.trim() || messageBn
  };

  // Populate other popular languages from standard gaming dictionary if applicable
  const typeKey = type as 'vip' | 'update' | 'reward' | 'announcement';
  for (const [code, pack] of Object.entries(TRANSLATION_MAPS)) {
    if (code === 'bn' || code === 'en') continue;

    if (typeKey === 'vip') {
      titles[code] = pack.vipTitle;
      messages[code] = pack.vipMsg;
    } else if (typeKey === 'update') {
      titles[code] = pack.updateTitle;
      messages[code] = pack.updateMsg;
    } else if (typeKey === 'reward') {
      titles[code] = pack.rewardTitle;
      messages[code] = pack.rewardMsg;
    } else {
      titles[code] = pack.announcementTitle;
      messages[code] = pack.announcementMsg;
    }
  }

  return { titles, messages };
}

/**
 * Audio chime for gaming notification
 */
export function playNotificationChime(): void {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5
    osc.frequency.exponentialRampToValueAtTime(1174.66, ctx.currentTime + 0.25); // D6

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch (e) {
    // blocked or unavailable
  }
}

/**
 * Mobile vibration helper
 */
export function vibrateDevice(pattern: number[] = [150, 80, 150]): void {
  try {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  } catch (e) {}
}
