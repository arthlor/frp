/**
 * Legendary Items — İda'nın Son Muhafızları
 * Player-facing flavor text and lore only.
 * No exact mechanics, DCs, or stat modifiers.
 */

export const LEGENDARY_ITEMS = [
  {
    id: 'palladium',
    name: 'Truva Palladium\'u',
    nameEn: 'Palladion',
    icon: '🏛️',
    rarity: 'Efsanevi',
    rarityColor: '#f0d68a',
    origin: 'Tanrıça Athena tarafından bizzat yontulmuş kadim bir heykel.',
    lore: `Pallas Athena'nın, yakın arkadaşı Pallas'ın ölümünden duyduğu derin kederi yaşatmak için kendi elleriyle tahtadan yonttuğu üç arşın boyunda kutsal bir tasvirdir. Sağ elinde bir mızrak, sol elinde ise bir öreke ve iğ tutar. Göğsünde, Zeus'un korkutucu Aegis kalkanı yer alır.`,
    history: `Bu heykel Truva surları içinde kaldığı sürece, şehir asla düşürülemezdi. Truva Savaşı'nın onuncu yılında Odysseus ve Diomedes'in çaldığı sanılsa da, Truva rahipleri asıl Palladium'u İda Dağı'nın eteklerine gömmüştür. Binlerce yıl boyunca bölgedeki mitolojik enerjiyi dengede tutan kozmik bir mühür işlevi görmüştür.`,
    gameHint: 'Bu eser, enerji yarığını kapatabilecek tek anahtardır — ama aktif olduğu sürece çevredeki yaratıkları da kendine çeker.',
  },
  {
    id: 'discord-apple',
    name: 'Eris\'in Nifak Elması',
    nameEn: 'Apple of Discord',
    icon: '🍎',
    rarity: 'Efsanevi',
    rarityColor: '#f0d68a',
    origin: 'Nifak, fesat ve kaos tanrıçası Eris tarafından yaratılmış som altın elma.',
    lore: `Üzerinde "En Güzele" (Kallisti) yazan bu altın elma, tarihteki ilk güzellik yarışmasının — ve dolayısıyla Truva Savaşı'nın — başlamasının asıl nedenidir. Eris, Peleus ve Thetis'in düğününe davet edilmemesine öfkelenerek bu elmayı düğünün ortasına fırlatmış; Hera, Athena ve Aphrodite arasında bir husumet başlatmıştır.`,
    history: `Paris, hakem olarak rüşvete en yatkın teklifi — dünyanın en güzel kadını Helen'i — sunarak elmayı Aphrodite'ye verince savaş kaçınılmaz olmuştur. Şimdi bu elma Kaz Dağları'nın derinliklerinde bir yerlerde beklemektedir.`,
    gameHint: 'Elma fiziksel bir silahtan ziyade psikolojik bir araçtır. Taşıyanların en derin güvensizliklerini ve kıskançlıklarını ortaya çıkarır. Düşmanlara karşı güçlü ama son derece riskli.',
  },
  {
    id: 'arrogance-brooch',
    name: 'İlahi Kibir Broşu',
    nameEn: 'Brooch of Divine Arrogance',
    icon: '📿',
    rarity: 'Nadir',
    rarityColor: '#a855f7',
    origin: 'Antik bir Truva komutanının veya Ares\'in bir rahibinin üzerinden düşen kan rengi broş.',
    lore: `Mitolojide her büyülü eşya saf bir avantaj sağlamaz. Bu broş, Yunan tragedyasının temel unsuru olan "Kibir" (Hubris) temasını taşır. Takan kişiye korku ve sindirmeye karşı mutlak cesaret verir — ama bedeli muazzam bir ego şişmesidir.`,
    history: `Truva Savaşı sırasında birçok komutanın bu broşu takarak ölümsüz savaştığı söylenir. Ancak hiçbiri geri çekilmek bilmediği için savaş alanında kalmıştır.`,
    gameHint: 'Korkusuz olursunuz ama geri çekilmeyi reddedersiniz. Takım stratejisini baltalayabilecek ama muhteşem bir rol yapma fırsatı sunan çift taraflı bir ganimet.',
  },
  {
    id: 'nemea-armor',
    name: 'Nemea Aslanı Zırh Parçaları',
    nameEn: 'Nemean Lion Armor Fragments',
    icon: '🦁',
    rarity: 'Nadir',
    rarityColor: '#a855f7',
    origin: 'Herkül\'ün ilk görevi sırasında öldürdüğü efsanevi Nemea Aslanı\'nın postundan yapılmış zırh.',
    lore: `Nemea Aslanı'nın postu hiçbir silahla delinemezdi — Herkül bunu ancak aslanın kendi pençeleriyle kesebildi. Yüzyıllar boyunca farklı kahramanlar arasında el değiştiren bu efsanevi zırh, zamanla parçalanmış olsa da her parçası hâlâ olağanüstü koruma sağlar.`,
    history: `Kaz Dağları'ndaki eski geçitlerdeki kalıntılar arasında parçaları bulunabilir. Tam set toplanamazsa bile tek bir parça bile savaşta fark yaratır.`,
    gameHint: 'Fiziksel saldırılara karşı muazzam koruma sağlar ama son derece ağırdır. Hız gerektiren görevlerde dezavantaj yaratabilir.',
  },
  {
    id: 'medusa-potions',
    name: 'Medusa\'nın Kanı İksirleri',
    nameEn: 'Gorgon Blood Elixirs',
    icon: '🧪',
    rarity: 'Seyrek',
    rarityColor: '#22c55e',
    origin: 'Efsanevi Gorgon Medusa\'nın kanından damıtılmış ikisirler.',
    lore: `Mitolojiye göre Medusa'nın kanı iki farklı özelliğe sahipti: sağ tarafından akan kan şifa verirken, sol tarafından akan kan öldürücü bir zehirdi. Bu bilgi, antik iksir ustalarının en değerli sırlarından biriydi.`,
    history: `Perseus'un Medusa'yı öldürdükten sonra kanını toplattığı rivayet edilir. Bu kanlardan yapılan iksirlerin bir kısmı Anadolu rotasıyla İda Dağı'na ulaşmıştır.`,
    gameHint: 'Şifa veya zehir — hangi iksiri bulduğunuzu dikkatli belirleyin. Yanlış kullanım ölümcül olabilir.',
  },
];

export function getItemById(id) {
  return LEGENDARY_ITEMS.find(item => item.id === id);
}

export const RARITY_ORDER = ['Efsanevi', 'Nadir', 'Seyrek', 'Yaygın'];
