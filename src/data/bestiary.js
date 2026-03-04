/**
 * Bestiary — İda'nın Son Muhafızları
 * 5 enemy types from the PRD with full stat blocks.
 */

export const BESTIARY = [
  {
    id: 'drakon-phrygios',
    name: 'Frigya Ejderhası',
    nameEn: 'Drakon Phrygios',
    icon: '🐉',
    type: 'Canavar',
    challenge: 'Ara-Patron (Mini-Boss)',
    hp: { current: 85, max: 85 },
    ac: 16,
    stats: { güç: 18, çeviklik: 12, dayanıklılık: 16, zeka: 14, irade: 13, karizma: 10 },
    attacks: [
      { name: 'Pençe Darbesi', bonus: '+7', damage: '2d8+4', type: 'Fiziksel' },
      { name: 'Büyülü Nefes (Charm)', bonus: 'İrade DC 14', damage: 'Büyülenme (Charmed)', type: 'Büyü', description: 'Hipnotik aether gazı. Başarısız olanlar silahlarını düşürüp ejderhaya doğru yürür.' },
    ],
    abilities: [
      'Pusu Avcısı: Gizlilik zarlarında avantaj, sürpriz turda Zırh Delme hasarı',
      'Devasa boyut: ~18m uzunluk, yılan benzeri gövde',
    ],
    weaknesses: ['Işık tabanlı saldırılar', 'Grup halinde menzilli saldırı'],
    description: 'Orta Anadolu\'ya özgü, 18 metre uzunluğunda zeki ejderhalar. Gündüzleri ağaçlar gibi dikilerek kuşları nefesleriyle çeker, geceleri pusu kurarlar.',
    location: 'Şahindere Kanyonu',
  },
  {
    id: 'truva-hayaletleri',
    name: 'İntikamcı Truva Hayaletleri',
    nameEn: 'Vengeful Ghosts of Troy',
    icon: '👻',
    type: 'Ruhi Varlık',
    challenge: 'Orta',
    hp: { current: 35, max: 35 },
    ac: 13,
    stats: { güç: 8, çeviklik: 14, dayanıklılık: 10, zeka: 10, irade: 16, karizma: 6 },
    attacks: [
      { name: 'Hayalet Dokunuşu', bonus: '+5', damage: '2d6', type: 'Nekrotik' },
      { name: 'Ele Geçirme (Possession)', bonus: 'İrade DC 13', damage: 'Kontrol (1 tur)', type: 'Büyü', description: 'Oyuncuları veya köylüleri ele geçirmeye çalışır.' },
    ],
    abilities: [
      'Fiziksel Direnç: Normal silahlara bağışık, sadece büyülü silahlar etkili',
      'Athena/Poseidon soyuna ekstra öfke: Bu soylara odaklanmış saldırı',
    ],
    weaknesses: ['Büyülü silahlar', 'Hephaestus alevleri', 'Tombak/Çakşır otu kaplamalı silahlar'],
    description: 'Truva Savaşı\'nda katledilmiş askerlerin huzursuz ruhları. Korozyona uğramış bronz zırhlar ve parçalanmış kalkanlar içinde yarı şeffaf silüetler.',
    location: 'Gargaros Zirvesi',
  },
  {
    id: 'tahta-at-golemi',
    name: 'Tahta At Konstruktları',
    nameEn: 'Trojan Horse Golems',
    icon: '🐴',
    type: 'Konstrukt',
    challenge: 'Zor',
    hp: { current: 120, max: 120 },
    ac: 18,
    stats: { güç: 20, çeviklik: 6, dayanıklılık: 20, zeka: 3, irade: 8, karizma: 1 },
    attacks: [
      { name: 'Ezme', bonus: '+8', damage: '3d8+5', type: 'Ezici' },
      { name: 'Takviye Bırakma', bonus: 'Otomatik', damage: '1d4 düşman piyadesi', type: 'Özel', description: '2-3. turda karnından hayaletler/iblisler fırlatır.' },
    ],
    abilities: [
      'Canlı Taşıyıcı: İçinde 1d4 ekstra düşman taşır, at yok edilene kadar takviye',
      'Ezici/Delici Direnci: Bu hasar türlerine muazzam direnç',
    ],
    weaknesses: ['Ateş hasarı (2x)', 'Hephaestus çocukları ekstra etkin'],
    description: 'Orijinal Truva Atı konseptinin, büyüyle canlandırılmış devasa golem versiyonları. İçlerinde hayaletler ve iblisler taşıyan canlı zırhlı personel taşıyıcıları.',
    location: 'Gargaros Zirvesi',
  },
  {
    id: 'satyr',
    name: 'Satyrler',
    nameEn: 'Silenoi & Tityroi',
    icon: '🐐',
    type: 'Fey',
    challenge: 'Düşük-Orta',
    hp: { current: 22, max: 22 },
    ac: 12,
    stats: { güç: 10, çeviklik: 14, dayanıklılık: 12, zeka: 11, irade: 10, karizma: 16 },
    attacks: [
      { name: 'Boynuz Toslaması', bonus: '+3', damage: '1d6+1', type: 'Fiziksel' },
      { name: 'Aulos Melodisi', bonus: 'İrade DC 12', damage: 'Confusion / Stun (AoE)', type: 'Büyü', description: 'Kaos melodisi çalarak düşmanların dikkatini dağıtır veya dans ettirir.' },
    ],
    abilities: [
      'Bilgi Kaynağı: İkna edilirse (Charm/Persuasion) gizli yolları ve kestirmeleri söyler',
      'Apollo fobisi: Apollo çocuklarından korkar veya kin besler (Marsyas efsanesi)',
    ],
    weaknesses: ['Müzik yarışmasıyla yenilebilir', 'İyi şarapla ikna edilebilir'],
    description: 'Şarap düşkünü, fevri ve tehlikeli doğa ruhları. Dionysos\'un ebedi eşlikçileri. Müzik yarışmalarına takıntılıdırlar.',
    location: 'İda Dağı ormanları ve vadileri',
  },
  {
    id: 'truva-cetusu',
    name: 'Truva Cetus\'u',
    nameEn: 'Kêtos Troias',
    icon: '🐋',
    type: 'Kozmik Canavar',
    challenge: 'Final Boss',
    hp: { current: 250, max: 250 },
    ac: 20,
    stats: { güç: 24, çeviklik: 10, dayanıklılık: 22, zeka: 8, irade: 18, karizma: 14 },
    attacks: [
      { name: 'Tsunami Çarpması', bonus: '+10', damage: '4d10+7', type: 'Fiziksel + Soğuk + Asit', description: 'Gökyüzünden devasa su kütlelerini yağdırır.' },
      { name: 'Bütün Olarak Yutma', bonus: '+12 (Çok Yüksek)', damage: 'd8 asit/tur', type: 'Özel', description: 'Bir oyuncuyu yutabilir. Yutulan oyuncu içeriden saldırmalı.' },
    ],
    abilities: [
      'Kozmik Boyut: 12m kafatası, aether fırtınalarında yüzer',
      'Mühür Kırıcı: Hayatta olduğu sürece enerji yarığı mühürlenemez',
      'Rejenerasyon: Tur başına 10 HP iyileşme (ilahi hasar hariç)',
    ],
    weaknesses: ['Palladium\'un ilahi enerjisi kalkanını zayıflatır', 'İçeriden saldırı (Herkül taktiği)'],
    description: 'Poseidon\'un gönderdiği efsanevi deniz canavarı. Köpek balığı dişleri, yaban domuzu kafası, devasa balina gövdesi. Gökyüzündeki aether akıntılarında yüzer.',
    location: 'Gargaros Zirvesi - Enerji Yarığı',
  },
];

export function getBestiaryById(id) {
  return BESTIARY.find(b => b.id === id);
}

/** Create an NPC instance from a bestiary template */
export function createNpcFromBestiary(bestiaryId) {
  const template = getBestiaryById(bestiaryId);
  if (!template) return null;

  return {
    ...template,
    instanceId: crypto.randomUUID(),
    hp: { ...template.hp },
  };
}
