/**
 * 12 Divine Bloodlines — İda'nın Son Muhafızları
 * Each bloodline maps to an Olympian parent with stat bonuses,
 * signature power, flaws, and thematic metadata.
 */

export const BLOODLINES = {
  zeus: {
    id: 'zeus',
    name: 'Zeus',
    title: 'Göklerin Hakimi',
    icon: '⚡',
    color: '#f0d68a',
    colorDark: '#8b6914',
    modernArchetype: 'Çok uluslu bir holdingin yöneticisi, üst düzey politikacı veya diplomat',
    primaryStat: 'karizma',
    primaryBonus: 2,
    secondaryStat: 'irade',
    secondaryBonus: 1,
    domainPowers: [
      { name: 'Yıldırım', description: 'Menzilli yıldırım saldırısı. d8 hasar.', level: 1 },
      { name: 'Fırtına Çağrısı', description: 'Alandaki tüm düşmanlara d6 hasar + Kör efekti (1 tur).', level: 3 },
      { name: 'Ralliye Çağrı', description: 'Tüm müttefiklerin bir sonraki zarına +3 bonus.', level: 5 },
    ],
    flaws: ['İnanılmaz kibir (Hubris)', 'Yenilgiyi kabul edememe', 'Öfke nöbetleri'],
    description: 'Zeus\'un çocukları doğal liderlerdir. Atmosferik kontrol, şiddetli rüzgar manipülasyonu ve yıldırım tabanlı hasar büyüleri kullanırlar.',
  },
  poseidon: {
    id: 'poseidon',
    name: 'Poseidon',
    title: 'Derinliklerin Gücü',
    icon: '🔱',
    color: '#4a90d9',
    colorDark: '#1a3a5c',
    modernArchetype: 'Dev bir denizcilik filosunun sahibi, amiral veya okyanus bilimleri profesörü',
    primaryStat: 'güç',
    primaryBonus: 2,
    secondaryStat: 'dayanıklılık',
    secondaryBonus: 1,
    domainPowers: [
      { name: 'Su Kontrolü', description: 'Suyu silah olarak kullanma. AoE yere devirme (Knockdown).', level: 1 },
      { name: 'Deprem', description: 'Yerel çaplı mini deprem. d10 hasar + tüm düşmanlar yere düşer.', level: 3 },
      { name: 'At Ehlileştirme', description: 'İda\'nın mitolojik atlarını çağırıp ehlileştirme.', level: 5 },
    ],
    flaws: ['Su kaynaklarından uzak kalınca zayıflık', 'İnatçılık', 'Değişime kapalı olma'],
    description: 'Poseidon\'un çocukları deniz ve deprem gücünü taşır. Üstün fiziksel dayanıklılık ve su manipülasyonu yeteneklerine sahiptir.',
  },
  hades: {
    id: 'hades',
    name: 'Hades',
    title: 'Gölgelerin Efendisi',
    icon: '💀',
    color: '#7b2fbe',
    colorDark: '#4a1a6b',
    modernArchetype: 'Küresel bir madencilik şirketinin sahibi veya yeraltı ekonomisini yöneten karanlık bir figür',
    primaryStat: 'irade',
    primaryBonus: 2,
    secondaryStat: 'zeka',
    secondaryBonus: 1,
    domainPowers: [
      { name: 'Gölge Yolculuğu', description: 'Gölgeler arasında 10m anında yer değiştirme.', level: 1 },
      { name: 'Nekromansi', description: 'Ruhlarla konuşma, Truva hayaletlerini geçici kontrol etme.', level: 3 },
      { name: 'Korku Aurası', description: 'Etrafa yayılan korku. Tüm düşmanlar İrade DC 14 atmalı.', level: 5 },
    ],
    flaws: ['Gün ışığında algı dezavantajı', 'Ağır melankoli', 'Empati kurma zorluğu'],
    description: 'Hades\'in çocukları karanlık ve ölüm diyarıyla bağlantılıdır. Nekromansi, gölge yolculuğu ve korku auraları kullanırlar.',
  },
  athena: {
    id: 'athena',
    name: 'Athena',
    title: 'Taktiksel Deha',
    icon: '🦉',
    color: '#a8a29e',
    colorDark: '#57534e',
    modernArchetype: 'Askeri akademide baş stratejist veya elit bir düşünce kuruluşunun lideri',
    primaryStat: 'zeka',
    primaryBonus: 2,
    secondaryStat: 'çeviklik',
    secondaryBonus: 1,
    domainPowers: [
      { name: 'Taktik Analiz', description: 'Düşmanın zayıf noktasını analiz et. Müttefikin sonraki zarına +2.', level: 1 },
      { name: 'Kritik Vuruş', description: 'Bir saldırıyı otomatik kritik yapma (2x hasar).', level: 3 },
      { name: 'Bulmaca Çözücü', description: 'İda\'daki antik mekanizmaları/bulmacaları anında çöz.', level: 5 },
    ],
    flaws: ['Analiz felci', 'Duygusal karar alamama', 'Örümcek fobisi (Arachne laneti)'],
    description: 'Athena\'nın çocukları savaş alanını kusursuz okur. Üstün silah ustalığı ve taktiksel zekayla düşmanın zayıf noktasını bulurlar.',
  },
  ares: {
    id: 'ares',
    name: 'Ares',
    title: 'Savaşın Öfkesi',
    icon: '⚔️',
    color: '#c0392b',
    colorDark: '#8b2500',
    modernArchetype: 'Emekli özel kuvvetler komutanı veya küresel bir paralı asker şirketinin lideri',
    primaryStat: 'güç',
    primaryBonus: 2,
    secondaryStat: 'dayanıklılık',
    secondaryBonus: 1,
    domainPowers: [
      { name: 'Berserker Öfkesi', description: 'HP %50 altındayken +4 saldırı hasarı.', level: 1 },
      { name: 'Durdurulamaz', description: 'Kanama ve korku efektlerine tam direnç.', level: 3 },
      { name: 'Savaş Çığlığı', description: 'Tüm düşmanlar 1 tur boyunca dezavantajlı saldırır.', level: 5 },
    ],
    flaws: ['Kana susamışlık', 'Geri çekilmeyi reddetme', 'Dost ateşine meyilli fevrilik'],
    description: 'Ares\'in çocukları yakın dövüşün krallarıdır. Hasar aldıkça güçlenir, korku ve kanamaya karşı dirençlidirler.',
  },
  hephaestus: {
    id: 'hephaestus',
    name: 'Hephaestus',
    title: 'Ateş ve Çelik',
    icon: '🔨',
    color: '#e67e22',
    colorDark: '#d35400',
    modernArchetype: 'Usta bir baş makine mühendisi veya savunma sanayi uzmanı',
    primaryStat: 'dayanıklılık',
    primaryBonus: 2,
    secondaryStat: 'zeka',
    secondaryBonus: 1,
    domainPowers: [
      { name: 'Ustanın Dövüşü', description: 'Silah/zırh üretimi ve anında tamiri. Ateş hasarına bağışıklık.', level: 1 },
      { name: 'Metal Manipülasyonu', description: 'Düşmanın metal zırhını/silahını eğip bükme (-2 AC).', level: 3 },
      { name: 'Otomat Kontrolü', description: 'Tahta At Konstruktlarını hackleme/kontrol etme.', level: 5 },
    ],
    flaws: ['Fiziksel hızda düşüklük', 'Sosyal anksiyete', 'Makinelere aşırı güven'],
    description: 'Hephaestus\'un çocukları usta zanaatkarlardır. Silah üretir, metal manipüle eder ve ateşe karşı bağışıktırlar.',
  },
  demeter: {
    id: 'demeter',
    name: 'Demeter',
    title: 'Doğanın Kucağı',
    icon: '🌿',
    color: '#40916c',
    colorDark: '#2d6a4f',
    modernArchetype: 'Küresel bir çevre örgütünün başkanı veya organik tarım uzmanı',
    primaryStat: 'dayanıklılık',
    primaryBonus: 2,
    secondaryStat: 'irade',
    secondaryBonus: 1,
    domainPowers: [
      { name: 'Doğanın Pençesi', description: 'Düşmanı köklerle yere sabitle (1 tur hareketsiz).', level: 1 },
      { name: 'Şifa İksiri', description: 'Endemik bitkilerden güçlü şifa iksiri. d10 HP iyileştirme.', level: 3 },
      { name: 'Zehirli Asmalar', description: 'AoE zehirli asmalar. d6 zehir hasarı + Yavaşlama.', level: 5 },
    ],
    flaws: ['Doğaya zarar verilince hasar/çöküntü', 'Doğal olmayan mekanlarda zayıflama'],
    description: 'Demeter\'in çocukları Kaz Dağları\'nın bitki örtüsünü silah olarak kullanır. Şifa ve zehir ustasıdırlar.',
  },
  aphrodite: {
    id: 'aphrodite',
    name: 'Aphrodite',
    title: 'Güzellik ve İllüzyon',
    icon: '✨',
    color: '#ec4899',
    colorDark: '#be185d',
    modernArchetype: 'Dünyaca ünlü bir süper model veya uluslararası PR yöneticisi',
    primaryStat: 'karizma',
    primaryBonus: 2,
    secondaryStat: 'irade',
    secondaryBonus: 1,
    domainPowers: [
      { name: 'Büyüleme', description: 'Düşman 1 tur boyunca saldıramaz (İrade DC 13).', level: 1 },
      { name: 'İllüzyon Perdesi', description: 'Grup 1 tur görünmez (savaş dışı).', level: 3 },
      { name: 'Zihin Hakimiyeti', description: 'Güçlü zihin kontrolü. Düşman 2 tur müttefik olur.', level: 5 },
    ],
    flaws: ['Düşük fiziksel dayanıklılık', 'Lükse aşırı düşkünlük', 'Dikkat dağınıklığı'],
    description: 'Aphrodite\'nin çocukları inanılmaz ikna ve manipülasyon yeteneğine sahiptir. İllüzyonlarla çatışmadan kaçınırlar.',
  },
  hermes: {
    id: 'hermes',
    name: 'Hermes',
    title: 'İlahi Haberci',
    icon: '🪽',
    color: '#06b6d4',
    colorDark: '#0e7490',
    modernArchetype: 'Küresel bir kurye/lojistik ağının yöneticisi veya kripto para borsası kurucusu',
    primaryStat: 'çeviklik',
    primaryBonus: 2,
    secondaryStat: 'karizma',
    secondaryBonus: 1,
    domainPowers: [
      { name: 'Görünmezlik', description: '1 tur boyunca görünmezlik (Stealth otomatik başarı).', level: 1 },
      { name: 'Kilit Açıcı', description: 'Her türlü kilidi, tuzağı ve büyülü mührü aç.', level: 3 },
      { name: 'Hız Patlaması', description: '1 turda 2 aksiyon (saldırı + hareket veya 2 saldırı).', level: 5 },
    ],
    flaws: ['Kleptomani', 'Yerinde duramama', 'Otoriteye itaatsizlik'],
    description: 'Hermes\'in çocukları inanılmaz hızlı ve çeviktir. Kilit açma, görünmezlik ve tuzak fark etme yeteneklerine sahiptir.',
  },
  dionysus: {
    id: 'dionysus',
    name: 'Dionysus',
    title: 'Şenlik ve Delilik',
    icon: '🍷',
    color: '#a855f7',
    colorDark: '#7e22ce',
    modernArchetype: 'Dünyaca ünlü bir şarap markasının sahibi veya efsanevi parti organizatörü',
    primaryStat: 'karizma',
    primaryBonus: 2,
    secondaryStat: 'dayanıklılık',
    secondaryBonus: 1,
    domainPowers: [
      { name: 'Delilik Aurası', description: 'AoE kafa karıştırma. Düşmanlar İrade DC 12 atmalı veya rastgele hedef saldırır.', level: 1 },
      { name: 'Sarhoşluk', description: 'Hedef düşman sarhoş: -3 saldırı ve savunma (2 tur).', level: 3 },
      { name: 'Kaos Fırtınası', description: 'Tüm savaş alanı d8 psişik hasar + Confusion efekti.', level: 5 },
    ],
    flaws: ['Gerçeklikten kopma', 'Eğlenceye zaaf', 'Ciddi durumlarda odaklanma sorunu'],
    description: 'Dionysus\'un çocukları kaos ve zihin bükme ustasıdır. Düşmanları sarhoşluk ve hezeyan haline sokarlar.',
  },
  artemis: {
    id: 'artemis',
    name: 'Artemis',
    title: 'Vahşi Doğa ve Av',
    icon: '🏹',
    color: '#22c55e',
    colorDark: '#15803d',
    modernArchetype: 'Yaban hayatı koruma parkının yöneticisi veya olimpiyat seviyesinde bir okçu',
    primaryStat: 'çeviklik',
    primaryBonus: 2,
    secondaryStat: 'zeka',
    secondaryBonus: 1,
    domainPowers: [
      { name: 'Mükemmel Atış', description: 'Savaş başına 1 kez, menzilli saldırı otomatik isabet.', level: 1 },
      { name: 'Gece Görüşü', description: 'Karanlıkta mükemmel görüş. Gece savaşlarında avantaj.', level: 3 },
      { name: 'Hayvan Çağrısı', description: 'Kaz Dağı\'nın vahşi hayvanlarını savaşa çağır (2 tur).', level: 5 },
    ],
    flaws: ['Şehir hayatına tahammülsüzlük', 'Erkek karakterlere şüphecilik', 'Bağımsızlık takıntısı'],
    description: 'Artemis\'in çocukları kusursuz okçulardır. Hayvanlarla iletişim kurar, geceleri mükemmel görür ve iz sürerler.',
  },
  apollo: {
    id: 'apollo',
    name: 'Apollo',
    title: 'Güneş ve Şifa',
    icon: '☀️',
    color: '#fbbf24',
    colorDark: '#d97706',
    modernArchetype: 'Efsanevi bir müzisyen, saygın bir başhekim veya karizmatik bir yaşam koçu',
    primaryStat: 'irade',
    primaryBonus: 2,
    secondaryStat: 'karizma',
    secondaryBonus: 1,
    domainPowers: [
      { name: 'Şifa', description: 'Müttefikin d8 HP iyileştirme.', level: 1 },
      { name: 'Güneş Patlaması', description: 'Kör edici güneş patlaması. d8 ışık hasarı + Kör (1 tur).', level: 3 },
      { name: 'İlham Melodisi', description: 'Müzikle tüm müttefiklerin tüm zarlarına +2 (3 tur).', level: 5 },
    ],
    flaws: ['Aşırı özgüven', 'İlgi odağı olma isteği', 'Kontrol edilemez kehanet vizyonları'],
    description: 'Apollo\'nun çocukları ışık ve şifa ustasıdır. Üstün şifa büyüleri, kör edici güneş patlamaları ve moral yükseltme yeteneklerine sahiptir.',
  },
};

export const BLOODLINE_LIST = Object.values(BLOODLINES);

export const STAT_NAMES = {
  güç: { name: 'Güç', abbrev: 'GÜÇ', icon: '💪' },
  çeviklik: { name: 'Çeviklik', abbrev: 'ÇEV', icon: '🏃' },
  dayanıklılık: { name: 'Dayanıklılık', abbrev: 'DAY', icon: '🛡️' },
  zeka: { name: 'Zeka', abbrev: 'ZEK', icon: '🧠' },
  irade: { name: 'İrade', abbrev: 'İRA', icon: '👁️' },
  karizma: { name: 'Karizma', abbrev: 'KAR', icon: '👑' },
};

export const STAT_KEYS = Object.keys(STAT_NAMES);

/** Calculate stat modifier from raw stat value (D&D-style) */
export function getModifier(stat) {
  return Math.floor((stat - 10) / 2);
}

/** Format modifier as string (+2, -1, +0) */
export function formatModifier(stat) {
  const mod = getModifier(stat);
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

/** Create a default character sheet */
export function createDefaultCharacter(name, bloodlineId) {
  const bloodline = BLOODLINES[bloodlineId];
  if (!bloodline) return null;

  const baseStats = {
    güç: 10,
    çeviklik: 10,
    dayanıklılık: 10,
    zeka: 10,
    irade: 10,
    karizma: 10,
  };

  // Apply bloodline bonuses
  baseStats[bloodline.primaryStat] += bloodline.primaryBonus;
  baseStats[bloodline.secondaryStat] += bloodline.secondaryBonus;

  const hpMax = 10 + getModifier(baseStats.dayanıklılık) * 2;

  return {
    name,
    level: 1,
    bloodline: bloodlineId,
    modernArchetype: '',
    hp: { current: hpMax, max: hpMax },
    ac: 10 + getModifier(baseStats.çeviklik),
    stats: baseStats,
    domainPowers: [bloodline.domainPowers[0].name],
    flaws: [...bloodline.flaws],
    inventory: [],
    notes: '',
    statusEffects: [],
    avatar: bloodline.icon,
  };
}
