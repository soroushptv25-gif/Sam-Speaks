import type { Category, Language, VocabularyTile } from './types';

/**
 * Arabic text for the starter words: [label, spoken phrase].
 * Written for the prototype. Have a native Arabic speaker (ideally the family or
 * the child's therapist) check these before real use.
 */
const starterArabic: Record<string, [string, string]> = {
  i: ['أنا', 'أنا'], want: ['أريد', 'أريد'], need: ['أحتاج', 'أحتاج'], more: ['المزيد', 'المزيد'],
  yes: ['نعم', 'نعم'], no: ['لا', 'لا'], help: ['ساعدني', 'ساعدني من فضلك'], stop: ['توقف', 'توقف'],
  like: ['أحب', 'أحب'], finished: ['انتهيت', 'لقد انتهيت'], again: ['مرة أخرى', 'مرة أخرى'],
  different: ['شيء آخر', 'أريد شيئاً آخر'], wait: ['انتظر', 'انتظر من فضلك'], 'not-like': ['لا أحب', 'لا أحب هذا'],
  water: ['ماء', 'ماء'], juice: ['عصير', 'عصير'], milk: ['حليب', 'حليب'], food: ['طعام', 'أريد أن آكل'],
  bathroom: ['الحمّام', 'أريد الحمّام'], break: ['استراحة', 'أحتاج استراحة'], hurt: ['يؤلمني', 'شيء يؤلمني'],
  sick: ['مريض', 'أشعر بالمرض'], hot: ['حرّ', 'أشعر بالحر'], cold: ['برد', 'أشعر بالبرد'],
  quiet: ['هدوء', 'أحتاج الهدوء'], 'too-loud': ['صوت عالٍ', 'الصوت عالٍ جداً'], space: ['مساحة', 'أحتاج مساحة'],
  hug: ['عناق', 'أريد عناقاً'], go: ['هيا', 'هيا نذهب'], play: ['ألعب', 'أريد أن ألعب'], toys: ['ألعابي', 'أريد ألعابي'],
  read: ['أقرأ', 'أريد أن أقرأ'], listen: ['أستمع', 'أريد أن أستمع'], tell: ['أخبرك', 'أريد أن أخبرك شيئاً'],
  choose: ['أختار', 'أريد أن أختار'], outside: ['الخارج', 'أريد أن أخرج'], rest: ['أرتاح', 'أريد أن أرتاح'],
  wash: ['أغتسل', 'أحتاج أن أغتسل'], sleep: ['أنام', 'أريد أن أنام'], draw: ['أرسم', 'أريد أن أرسم'],
  music: ['موسيقى', 'أريد موسيقى'], happy: ['سعيد', 'أشعر بالسعادة'], sad: ['حزين', 'أشعر بالحزن'],
  tired: ['متعب', 'أشعر بالتعب'], angry: ['غاضب', 'أشعر بالغضب'], scared: ['خائف', 'أشعر بالخوف'],
  worried: ['قلق', 'أشعر بالقلق'], calm: ['هادئ', 'أشعر بالهدوء'], excited: ['متحمس', 'أشعر بالحماس'],
  confused: ['محتار', 'أنا محتار'], uncomfortable: ['منزعج', 'لست مرتاحاً'], proud: ['فخور', 'أشعر بالفخر'],
  mum: ['ماما', 'ماما'], dad: ['بابا', 'بابا'], grandma: ['جدتي', 'جدتي'], family: ['عائلتي', 'عائلتي'],
  friend: ['صديقي', 'صديقي'], teacher: ['المعلم', 'معلمي'], classmate: ['زميلي', 'زميلي'],
  therapist: ['المعالج', 'معالجي'], nurse: ['الممرضة', 'الممرضة'], 'home-place': ['البيت', 'البيت'],
  'school-place': ['المدرسة', 'المدرسة'], park: ['الحديقة', 'الحديقة'], 'quiet-place': ['مكان هادئ', 'مكان هادئ'],
  playground: ['الملعب', 'الملعب'], cafeteria: ['المقصف', 'المقصف'], bus: ['الحافلة', 'الحافلة'],
  bedroom: ['غرفتي', 'غرفتي'], kitchen: ['المطبخ', 'المطبخ'], question: ['سؤال', 'عندي سؤال'],
  answer: ['أعرف', 'أعرف الجواب'], pencil: ['قلم', 'أحتاج قلماً'], computer: ['الحاسوب', 'الحاسوب'],
  lesson: ['الدرس', 'الدرس'], recess: ['الفسحة', 'الفسحة'], lunch: ['الغداء', 'الغداء'],
  homework: ['واجبي', 'واجبي'], 'work-finished': ['أنهيت عملي', 'أنهيت عملي'],
  'need-explanation': ['اشرح مرة أخرى', 'اشرح ذلك مرة أخرى من فضلك'],
};

export function tileLabel(tile: VocabularyTile, language: Language) {
  if (language === 'ar') return tile.labelAr || starterArabic[tile.id]?.[0] || tile.label;
  return tile.label;
}

export function tilePhrase(tile: VocabularyTile, language: Language) {
  if (language === 'ar') return tile.phraseAr || starterArabic[tile.id]?.[1] || tile.labelAr || tile.phrase;
  return tile.phrase;
}

export const speechLang: Record<Language, string> = { en: 'en-GB', ar: 'ar-SA' };

const categoryNames: Record<Language, Record<Category | 'All', string>> = {
  en: { All: 'My board', Core: 'Little words', Needs: 'Needs', Actions: 'Doing', Feelings: 'Feelings', People: 'People', Places: 'Places', School: 'School' },
  ar: { All: 'لوحتي', Core: 'كلمات صغيرة', Needs: 'احتياجات', Actions: 'أفعال', Feelings: 'مشاعر', People: 'أشخاص', Places: 'أماكن', School: 'المدرسة' },
};

export const categoryName = (category: Category | 'All', language: Language) => categoryNames[language][category];

/** The few words the child board itself shows. Adult screens stay in English. */
export const childText = {
  en: {
    home: 'Home', school: 'School', speak: 'Speak', undo: 'Undo', clear: 'Clear', sayAgain: 'Say again',
    grownUps: 'Grown-ups', holdToFinish: 'Hold to finish', empty: 'Nothing here yet',
    tapPicture: 'Tap a picture', speechOff: 'Sound is off',
  },
  ar: {
    home: 'البيت', school: 'المدرسة', speak: 'تكلّم', undo: 'تراجع', clear: 'امسح', sayAgain: 'مرة أخرى',
    grownUps: 'للكبار', holdToFinish: 'اضغط مطولاً للإنهاء', empty: 'لا شيء هنا بعد',
    tapPicture: 'اختر صورة', speechOff: 'الصوت مطفأ',
  },
} satisfies Record<Language, Record<string, string>>;
