import React, { createContext, useState, useEffect, useContext } from 'react';

export const LanguageContext = createContext();

export const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧', native: 'English' },
  { code: 'hi', label: 'हिन्दी (Hindi)', flag: '🇮🇳', native: 'हिन्दी' },
  { code: 'hinglish', label: 'Hinglish', flag: '🇮🇳', native: 'Hinglish' },
  { code: 'mr', label: 'मराठी (Marathi)', flag: '🇮🇳', native: 'मराठी' },
  { code: 'ta', label: 'தமிழ் (Tamil)', flag: '🇮🇳', native: 'தமிழ்' },
  { code: 'te', label: 'తెలుగు (Telugu)', flag: '🇮🇳', native: 'తెలుగు' },
  { code: 'bn', label: 'বাংলা (Bengali)', flag: '🇮🇳', native: 'বাংলা' },
  { code: 'gu', label: 'ગુજરાતી (Gujarati)', flag: '🇮🇳', native: 'ગુજરાતી' }
];

export const DICTIONARY = {
  // Navigation & Brand
  'CampusFix': {
    hi: 'कैंपसफिक्स',
    hinglish: 'CampusFix',
    mr: 'कॅम्पसफिक्स',
    ta: 'கேம்பஸ்பிக்ஸ்'
  },
  'Smart Problem Solving by Team Shubham': {
    hi: 'टीम शुभम द्वारा स्मार्ट समस्या निवारण',
    hinglish: 'Smart Problem Solving by Team Shubham',
    mr: 'टीम शुभम द्वारे स्मार्ट समस्या निवारण',
    ta: 'டீம் சுபம் உருவாக்கிய ஸ்மார்ட் பிரச்சனை தீர்வு'
  },
  'Live Demo': {
    hi: 'लाइव डेमो',
    hinglish: 'Live Demo',
    mr: 'थेट डेमो',
    ta: 'நேரடி டெமோ'
  },
  'GIS Campus Map': {
    hi: 'GIS कैंपस मैप',
    hinglish: 'GIS Campus Map',
    mr: 'GIS कॅम्पस नकाशा',
    ta: 'GIS வளாக வரைபடம்'
  },
  'Smart Board': {
    hi: 'स्मार्ट बोर्ड',
    hinglish: 'Smart Board',
    mr: 'स्मार्ट बोर्ड',
    ta: 'ஸ்மார்ட் பலகை'
  },
  'Study Pods': {
    hi: 'स्टडी पॉड्स',
    hinglish: 'Study Pods',
    mr: 'अभ्यास पॉड्स',
    ta: 'படிப்பு அறைகள்'
  },
  'Features': {
    hi: 'सुविधाएं',
    hinglish: 'Features',
    mr: 'वैशिष्ट्ये',
    ta: 'அம்சங்கள்'
  },
  'Roles': {
    hi: 'भूमिकाएं',
    hinglish: 'Roles',
    mr: 'भूमिका',
    ta: 'பாத்திரங்கள்'
  },
  'AI Copilot': {
    hi: 'AI कोपायलट',
    hinglish: 'AI Copilot',
    mr: 'AI कोपायलट',
    ta: 'AI உதவியாளர்'
  },
  'SOS': {
    hi: 'आपातकालीन SOS',
    hinglish: 'Emergency SOS',
    mr: 'तातडीचे SOS',
    ta: 'அவசர SOS'
  },
  'QR Scan': {
    hi: 'QR स्कैन',
    hinglish: 'QR Scan',
    mr: 'QR स्कॅन',
    ta: 'QR ஸ்கேன்'
  },
  'Sign In': {
    hi: 'साइन इन करें',
    hinglish: 'Sign In karein',
    mr: 'साइन इन करा',
    ta: 'உள்நுழைக'
  },
  'Register': {
    hi: 'पंजीकरण करें',
    hinglish: 'Register karein',
    mr: 'नोंदणी करा',
    ta: 'பதிவு செய்க'
  },
  'Logout': {
    hi: 'लॉग आउट',
    hinglish: 'Log Out',
    mr: 'लॉग आउट',
    ta: 'வெளியேறு'
  },
  'Profile': {
    hi: 'प्रोफ़ाइल',
    hinglish: 'Profile',
    mr: 'प्रोफाइल',
    ta: 'சுயவிவரம்'
  },
  'Notifications': {
    hi: 'सूचनाएं',
    hinglish: 'Notifications',
    mr: 'सूचना',
    ta: 'அறிவிப்புகள்'
  },
  'Campus Alerts': {
    hi: 'कैंपस अलर्ट्स',
    hinglish: 'Campus Alerts',
    mr: 'कॅम्पस अलर्ट',
    ta: 'வளாக எச்சரிக்கைகள்'
  },
  'Mark all as read': {
    hi: 'सभी को पढ़ा हुआ चिह्नित करें',
    hinglish: 'Sab read mark karein',
    mr: 'सर्व वाचलेले म्हणून चिन्हांकित करा',
    ta: 'அனைத்தையும் படித்ததாகக் குறிக்கவும்'
  },
  'No notifications yet': {
    hi: 'अभी कोई नई सूचना नहीं है',
    hinglish: 'Koi notifications nahi hai',
    mr: 'अद्याप कोणत्याही सूचना नाहीत',
    ta: 'அறிவிப்புகள் எதுவும் இல்லை'
  },
  'AI Core Active': {
    hi: 'AI कोर सक्रिय',
    hinglish: 'AI Core Active',
    mr: 'AI कोर सक्रिय',
    ta: 'AI செயலில் உள்ளது'
  },
  'Email Address': {
    hi: 'ईमेल पता',
    hinglish: 'Email Address',
    mr: 'ईमेल पत्ता',
    ta: 'மின்னஞ்சல் முகவரி'
  },
  'Password': {
    hi: 'पासवर्ड',
    hinglish: 'Password',
    mr: 'पासवर्ड',
    ta: 'கடவுச்சொல்'
  },
  'Mobile OTP': {
    hi: 'मोबाइल OTP',
    hinglish: 'Mobile OTP',
    mr: 'मोबाईल OTP',
    ta: 'மொபைல் OTP'
  },
  'Select Portal Role': {
    hi: 'पोर्टल भूमिका चुनें',
    hinglish: 'Portal Role Select Karein',
    mr: 'पोर्टल भूमिका निवडा',
    ta: 'வலைதள பாத்திரத்தைத் தேர்ந்தெடுக்கவும்'
  },
  'Notice Board': {
    hi: 'सूचना पट्ट (नोटिस बोर्ड)',
    hinglish: 'Notice Board',
    mr: 'सूचना फलक',
    ta: 'அறிவிப்பு பலகை'
  },
  'Study Resources & Notes': {
    hi: 'अध्ययन सामग्री और नोट्स',
    hinglish: 'Study Resources & Notes',
    mr: 'अभ्यास साहित्य आणि नोट्स',
    ta: 'படிப்பு பொருட்கள் மற்றும் குறிப்புகள்'
  },
  'Placements & Drives': {
    hi: 'प्लेसमेंट और कैंपस ड्राइव',
    hinglish: 'Placements & Drives',
    mr: 'प्लेसमेंट आणि भरती',
    ta: 'வேலைவாய்ப்பு மற்றும் தேர்வுகள்'
  },
  'Lost & Found Hub': {
    hi: 'खोया और पाया केंद्र',
    hinglish: 'Lost & Found Hub',
    mr: 'हरवले आणि सापडले केंद्र',
    ta: 'தொலைந்தவை மற்றும் கண்டெடுக்கப்பட்டவை'
  },
  'Faculty Directory': {
    hi: 'फैकल्टी डायरेक्टरी',
    hinglish: 'Faculty Directory',
    mr: 'प्राध्यापक यादी',
    ta: 'பேராசிரியர் விவரங்கள்'
  },
  'Smart Attendance Grid': {
    hi: 'स्मार्ट उपस्थिति प्रणाली',
    hinglish: 'Smart Attendance Tracker',
    mr: 'स्मार्ट उपस्थिती प्रणाली',
    ta: 'ஸ்மார்ட் வருகை பதிவு'
  },
  'Predictive Fleet Health': {
    hi: 'पूर्वानुमानित उपकरण स्वास्थ्य (IoT)',
    hinglish: 'Predictive Equipment Health',
    mr: 'उपकरण आरोग्य अंदाज',
    ta: 'முன்கணிப்பு பராமரிப்பு'
  },
  'Manage Complaints': {
    hi: 'शिकायतों का प्रबंधन',
    hinglish: 'Complaints Manage Karein',
    mr: 'तक्रार व्यवस्थापन',
    ta: 'புகார்களை நிர்வகித்தல்'
  },
  'Admin Overview': {
    hi: 'प्रशासन मुख्य डैशबोर्ड',
    hinglish: 'Admin Overview',
    mr: 'प्रशासक आढावा',
    ta: 'நிர்வாக கண்ணோட்டம்'
  },
  'Live Campus Chat': {
    hi: 'लाइव कैंपस चैट',
    hinglish: 'Live Campus Chat',
    mr: 'थेट कॅम्पस गप्पा',
    ta: 'நேரடி வளாக அரட்டை'
  },
  'Emergency Center': {
    hi: 'आपातकालीन सहायता केंद्र',
    hinglish: 'Emergency Center',
    mr: 'आपत्कालीन केंद्र',
    ta: 'அவசர மையம்'
  },
  'Student Community Hub': {
    hi: 'छात्र समुदाय केंद्र',
    hinglish: 'Student Community Hub',
    mr: 'विद्यार्थी समुदाय केंद्र',
    ta: 'மாணவர் சமூகம்'
  },
  'Report Issue': {
    hi: 'समस्या दर्ज करें',
    hinglish: 'Problem Report Karein',
    mr: 'समस्या नोंदवा',
    ta: 'பிரச்சனையைப் புகாரளிக்கவும்'
  },
  'My Complaints': {
    hi: 'मेरी शिकायतें',
    hinglish: 'Meri Complaints',
    mr: 'माझ्या तक्रारी',
    ta: 'எனது புகார்கள்'
  },
  'Status': {
    hi: 'स्थिति',
    hinglish: 'Status',
    mr: 'स्थिती',
    ta: 'நிலை'
  },
  'Pending': {
    hi: 'लंबित',
    hinglish: 'Pending',
    mr: 'प्रलंबित',
    ta: 'நிலுவையில்'
  },
  'In Progress': {
    hi: 'प्रगति पर',
    hinglish: 'In Progress',
    mr: 'प्रगतीपथावर',
    ta: 'செயலில்'
  },
  'Resolved': {
    hi: 'हल किया गया',
    hinglish: 'Resolved',
    mr: 'निवारण झाले',
    ta: 'தீர்க்கப்பட்டது'
  },
  'High': {
    hi: 'उच्च प्राथमिकता',
    hinglish: 'High Priority',
    mr: 'उच्च',
    ta: 'அதிக'
  },
  'Emergency': {
    hi: 'आपातकालीन',
    hinglish: 'Emergency',
    mr: 'आपत्कालीन',
    ta: 'அவசரம்'
  },
  'Medium': {
    hi: 'मध्यम',
    hinglish: 'Medium',
    mr: 'मध्यम',
    ta: 'நடுத்தர'
  },
  'Low': {
    hi: 'निम्न',
    hinglish: 'Low',
    mr: 'कमी',
    ta: 'குறைந்த'
  },
  'Category': {
    hi: 'श्रेणी',
    hinglish: 'Category',
    mr: 'प्रवर्ग',
    ta: 'வகை'
  },
  'Electrical': {
    hi: 'विद्युत व बिजली',
    hinglish: 'Electrical & Power',
    mr: 'विद्युत',
    ta: 'மின்சாரம்'
  },
  'Water & Plumbing': {
    hi: 'जल व पाइपलाइन',
    hinglish: 'Water & Plumbing',
    mr: 'पाणी आणि नलकामे',
    ta: 'தண்ணீர் & குழாய்'
  },
  'Internet/Wi-Fi': {
    hi: 'इंटरनेट और वाई-फाई',
    hinglish: 'Internet / Wi-Fi',
    mr: 'इंटरनेट / वाय-फाय',
    ta: 'இணையம் / வைஃபை'
  },
  'Audio-Visual': {
    hi: 'ऑडियो-विजुअल प्रोजेक्टर',
    hinglish: 'Audio-Visual Smart Class',
    mr: 'ध्वनी-दृश्य',
    ta: 'ஒலி-ஒளி அமைப்பு'
  },
  'Hostel Facility': {
    hi: 'छात्रावास सुविधाएं',
    hinglish: 'Hostel Facility',
    mr: 'वसतिगृह सुविधा',
    ta: 'விடுதி வசதி'
  },
  'Search': {
    hi: 'खोजें...',
    hinglish: 'Search...',
    mr: 'शोधा...',
    ta: 'தேடுங்கள்...'
  },
  'Submit': {
    hi: 'सबमिट करें',
    hinglish: 'Submit karein',
    mr: 'प्रस्तुत करा',
    ta: 'சமர்ப்பிக்கவும்'
  },
  'Download': {
    hi: 'डाउनलोड',
    hinglish: 'Download',
    mr: 'डाउनलोड',
    ta: 'பதிவிறக்கம்'
  },
  'Back': {
    hi: 'वापस जाएं',
    hinglish: 'Peeche jayein',
    mr: 'मागे जा',
    ta: 'பின்செல்க'
  },
  'View Details': {
    hi: 'विवरण देखें',
    hinglish: 'Details dekhein',
    mr: 'तपशील पहा',
    ta: 'விவரங்களைப் பார்க்கவும்'
  },
  'Safe Zone': {
    hi: 'सुरक्षित क्षेत्र (75%+)',
    hinglish: 'Safe Zone (75%+)',
    mr: 'सुरक्षित क्षेत्र',
    ta: 'பாதுகாப்பான மண்டலம்'
  },
  'Bunk Calculator': {
    hi: 'बंक कैलकुलेटर',
    hinglish: 'Safe Bunk Calculator',
    mr: 'बंक कॅल्क्युलेटर',
    ta: 'வருகை கணிப்பான்'
  },
  'Attendance': {
    hi: 'उपस्थिति',
    hinglish: 'Attendance',
    mr: 'उपस्थिती',
    ta: 'வருகை'
  },
  'Announcements': {
    hi: 'कैंपस घोषणाएं',
    hinglish: 'Campus Announcements',
    mr: 'कॅम्पस घोषणा',
    ta: 'வளாக அறிவிப்புகள்'
  },
  'Recent Activity': {
    hi: 'हाल की गतिविधियां',
    hinglish: 'Recent Activity',
    mr: 'अलीकडील क्रियाकलाप',
    ta: 'சமீபத்திய செயல்பாடு'
  },
  'Quick Actions': {
    hi: 'त्वरित कार्य',
    hinglish: 'Quick Actions',
    mr: 'जलद कृती',
    ta: 'விரைவு நடவடிக்கைகள்'
  }
};

// Automatic content translator dictionary for common dynamic notices & phrases
const DYNAMIC_PHRASES = [
  { en: /mid semester exam|mid sem exam|midterm/gi, hi: 'मध्य सेमेस्टर परीक्षा', mr: 'मध्य सत्र परीक्षा', ta: 'பருவ இடைத்தேர்வு' },
  { en: /schedule announced|datesheet released|timetable/gi, hi: 'समय सारणी घोषित / समय तालिका जारी', mr: 'वेळापत्रक जाहीर', ta: 'அட்டவணை வெளியிடப்பட்டது' },
  { en: /holiday notice|college closed|campus holiday/gi, hi: 'अवकाश सूचना: परिसर बंद रहेगा', mr: 'सुट्टीची सूचना', ta: 'விடுமுறை அறிவிப்பு' },
  { en: /water supply|water filter|pipeline maintenance/gi, hi: 'जल आपूर्ति व पाइपलाइन रखरखाव', mr: 'पाणी पुरवठा देखभाल', ta: 'குடிநீர் விநியோகம்' },
  { en: /wi-fi maintenance|network upgrade|internet down/gi, hi: 'वाई-फाई नेटवर्क अपग्रेड व इंटरनेट रखरखाव', mr: 'वाय-फाय दुरुस्ती', ta: 'வைஃபை பராமரிப்பு' },
  { en: /hostel gate timings|curfew notice|hostel rules/gi, hi: 'छात्रावास प्रवेश समय व सुरक्षा नियम', mr: 'वसतिगृह वेळ नियम', ta: 'விடுதி நேரக் கட்டுப்பாடு' },
  { en: /placement drive|campus recruitment|interview schedule/gi, hi: 'प्लेसमेंट ड्राइव और साक्षात्कार कार्यक्रम', mr: 'नोकरी भरती मोहीम', ta: 'வேலைவாய்ப்பு முகாம்' },
  { en: /sports meet|annual fest|cultural night/gi, hi: 'वार्षिक खेल महोत्सव और सांस्कृतिक कार्यक्रम', mr: 'वार्षिक क्रीडा महोत्सव', ta: 'விளையாட்டுப் போட்டி' },
  { en: /fee payment deadline|last date for fee/gi, hi: 'शुल्क भुगतान की अंतिम तिथि', mr: 'फी भरण्याची अंतिम मुदत', ta: 'கட்டணம் செலுத்தும் இறுதி நாள்' },
  { en: /library timings extended|book return notice/gi, hi: 'पुस्तकालय समय विस्तार व पुस्तक वापसी सूचना', mr: 'ग्रंथालय वेळ विस्तार', ta: 'நூலக நேர விரிவாக்கம்' },
  { en: /power cut|substation shutdown|electrical maintenance/gi, hi: 'विद्युत सबस्टेशन रखरखाव व बिजली कटौती', mr: 'वीज पुरवठा बंद', ta: 'மின்சார நிறுத்தம்' }
];

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('campusfix_language') || 'en';
  });

  const setLanguage = (newLang) => {
    setLanguageState(newLang);
    try {
      localStorage.setItem('campusfix_language', newLang);
      document.documentElement.lang = newLang;
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  // Universal translation function
  const t = (key, defaultText) => {
    if (!key) return defaultText || '';
    if (language === 'en') return defaultText || key;
    
    // Check dictionary
    if (DICTIONARY[key] && DICTIONARY[key][language]) {
      return DICTIONARY[key][language];
    }

    // Try finding close match
    const lowerKey = String(key).toLowerCase().trim();
    for (const [dictKey, translations] of Object.entries(DICTIONARY)) {
      if (dictKey.toLowerCase() === lowerKey && translations[language]) {
        return translations[language];
      }
    }

    // Dynamic phrase translation if key contains known keywords
    if (typeof key === 'string') {
      let translated = key;
      let matched = false;
      for (const phrase of DYNAMIC_PHRASES) {
        if (phrase.en.test(key) && phrase[language]) {
          translated = translated.replace(phrase.en, phrase[language]);
          matched = true;
        }
      }
      if (matched) return translated;
    }

    return defaultText || key;
  };

  // Helper for dynamic content (Notices, tickets, descriptions)
  const translateContent = (content) => {
    if (!content || language === 'en') return content;
    if (typeof content !== 'string') return content;

    let text = content;
    for (const phrase of DYNAMIC_PHRASES) {
      if (phrase.en.test(text) && phrase[language]) {
        text = text.replace(phrase.en, phrase[language]);
      }
    }
    return text;
  };

  const currentLangObj = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        translateContent,
        languages: LANGUAGES,
        currentLanguage: currentLangObj
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
