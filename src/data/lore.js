/**
 * World Lore — İda'nın Son Muhafızları
 * Player-facing world information, regions, and storyline.
 * NO DM/GM-only data included.
 */

export const WORLD_LORE = {
  title: 'İda\'nın Son Muhafızları',
  subtitle: 'Kaz Dağları Modern Fantastik Rol Yapma Oyunu',
  overview: `Türkiye'nin kuzeybatısında, Çanakkale ve Balıkesir illeri arasında uzanan Kaz Dağları, modern haritalarda zengin biyolojik çeşitliliği, yüksek oksijen oranları ve eşsiz doğasıyla bilinir. Ancak bu pastoral görüntünün altında, insanlık tarihinin en büyük efsanelerine ev sahipliği yapan devasa bir mitolojik merkez yatmaktadır.`,
  premise: `Antik çağlarda "İda Dağı" olarak bilinen bu sarp coğrafya, Yunan mitolojisinde tanrıların ve tanrıçaların mekanı, kararların alındığı ve kozmik olayların vuku bulduğu kutsal bir zemindir. İda, Yunanistan'daki Olympos Dağı'na atfedilen kutsallığın Anadolu'daki karşılığıdır.`,
  conflict: `Sazlı Köyü'nde sıradan bir altyapı çalışması sırasında toprağın derinliklerinden gün yüzüne çıkarılan kadim bir tılsım, İda Dağı'nın derinliklerindeki büyü mührünü kırmıştır. İki dünya arasındaki ince perde yırtılmış ve bir "Enerji Yarığı" açılmıştır. Mitolojik yaratıklar, intikamcı ruhlar ve unutulmuş tanrısal varlıklar modern dünyaya sızmaya başlamıştır.`,
  playerRole: `Oyuncu karakterleri, modern dünyada sıradan hayatlar yaşadıklarını sanan, ancak aslında antik Yunan tanrılarının soyundan gelen "yarı-kanlar"dır. Miraslarından tamamen habersiz olan bu karakterlerin görevi, uyanan mitolojik dehşetleri durdurmak, kendi içlerindeki ilahi potansiyeli keşfetmek ve Kaz Dağları'nın derinliklerine doğru bir yolculuğa çıkarak kadim kapıyı sonsuza dek mühürlemektir.`,
  themes: [
    {
      icon: '🧬',
      title: 'Yarı-Kan Mirası',
      description: 'Modern dünyada "kusur" olarak görülen bazı özellikler — disleksi, DEHB — aslında antik savaşçıların evrimsel avantajlarının modern dünyadaki yan etkileridir. Beyinleriniz antik rünleri okumak ve savaş alanının her detayını analiz etmek üzere evrimleşmiştir.',
    },
    {
      icon: '⚡',
      title: 'Güçlerin Uyanışı',
      description: 'Karakterlerin güçleri başlangıçta kontrolsüz, duygusal patlamalar şeklinde ortaya çıkar. Kaz Dağları\'nın derinliklerine indikçe bu güçler odaklanmış, ölümcül beceri ağaçlarına dönüşür.',
    },
    {
      icon: '🏛️',
      title: 'Modern Mitoloji',
      description: 'Tanrılar yeryüzünü terk etmemiştir; sadece günümüz dünyasının dinamiklerine uyum sağlamıştır. CEO\'lar, profesörler, sanatçılar — modern dünyada farklı maskeler altında varlıklarını sürdürürler.',
    },
    {
      icon: '🌿',
      title: 'Kaz Dağları\'nın Sırları',
      description: 'Dünyanın en yüksek oksijen seviyelerinden birine sahip bu coğrafya, endemik bitki örtüsü ve derin vadileriyle sadece doğa harikası değil, aynı zamanda mitolojik bir kaledir.',
    },
  ],
};

export const REGIONS = [
  {
    id: 'sazli',
    name: 'Sazlı Köyü & Antandros Yıkıntıları',
    subtitle: 'Güvenli Bölge / Başlangıç Merkezi',
    icon: '🏘️',
    dangerLevel: 1,
    dangerLabel: 'Güvenli',
    color: '#40916c',
    description: `Zeytin ağaçları, asırlık çınarlar, dar sokaklar ve taş evleriyle tipik bir Kuzey Ege köyü. Ancak köyün üst kısımlarında açılan enerji yarığı buranın atmosferini temelden değiştirmeye başlamıştır.`,
    atmosphere: `Modern elektronik aletler arıza yapmakta, telefonlar çekmemekte, köyün köpekleri gece boyunca dağın karanlığına doğru koro halinde havlamakta ve gökyüzünde açıklanamayan mor fırtına bulutları toplanmaktadır.`,
    mythologicalLink: `Köyün hemen aşağısında antik Antandros kenti yer alır. Truvalı kahraman Aeneas, Truva düştükten sonra babasını sırtında taşıyarak bu topraklara kaçmış ve İda Dağı'nın kerestelerini kullanarak Roma'nın temelini atacak olan efsanevi filosunu burada inşa etmiştir.`,
    playerTips: 'İlk keşif noktanız. Köydeki ihtiyarlardan efsaneleri dinleyin, ekipman toplayın ve yaklaşan tehlikenin ilk belirtilerini gözlemleyin.',
  },
  {
    id: 'sutuven',
    name: 'Sütüven Şelalesi & Hasanboğuldu Göleti',
    subtitle: 'Gözyaşı Tapınağı',
    icon: '💧',
    dangerLevel: 2,
    dangerLabel: 'Orta',
    color: '#4a90d9',
    description: `Kızılkeçili Çayı üzerinde yer alan Sütüven Şelalesi yaklaşık 17 metreden büyük bir coşkuyla dökülür. Hemen ilerisinde doğal bir kaya havuzu olan Hasanboğuldu Göleti bulunur. Yerel halk arasında trajik bir aşk hikayesiyle bilinir.`,
    atmosphere: `Şelalenin sesi her yere hâkimdir. Suyun üzerinde ince bir sis perdesi süzülür ve bazen bu sisin içinden soluk mavi ışıklar yanıp söner. Roma döneminden kalma antik su kemeri sütunları buranın eski bir su tapınağı olduğuna işaret eder.`,
    mythologicalLink: `Bu sularda antik çağlardan beri yaşayan su perileri (Naiad) ve dağ perileri (Oread) barınmaktadır. İda Dağı, Skamandros gibi nehir tanrılarına ve sayısız Nymph'e ev sahipliği yapar. Enerji yarığının açılmasıyla bu periler, sularına giren yabancılara karşı son derece saldırganlaşmıştır.`,
    playerTips: 'Poseidon veya Aphrodite soyundan gelen karakterler burada diplomatik yollar açabilir. Dikkatli olun — su perileri güzel ama ölümcüldür.',
  },
  {
    id: 'sahindere',
    name: 'Şahindere Kanyonu',
    subtitle: 'Ölümcül Sınav & Oksijen Hezeyanları',
    icon: '⛰️',
    dangerLevel: 3,
    dangerLabel: 'Tehlikeli',
    color: '#e67e22',
    description: `Kaz Dağları'nın en tehlikeli, en sarp ve mikrokliması en güçlü alanı. Fiziksel dünyada ancak profesyonel rehberlerle girilebilen bu kanyon, mitolojik dünyanın aşılamaz bir savunma hattıdır.`,
    atmosphere: `Yüksek kayalıklar arasında esen rüzgarın uğultusu, antik savaş borularının ve savaş çığlıklarının sesini taşır. Dünyanın en yüksek oksijen seviyelerinden biri burada — enerji yarığı nedeniyle bu yoğun oksijen güçlü halüsinasyonlara neden olur.`,
    mythologicalLink: `Kanyon boyunca Athena'nın zekasını veya Herkül'ün gücünü sınayan antik bulmacalar ve mekanik tuzaklar yer alır. Dar boğazlarında, form değiştirmiş bir Sfenks ile bilmeceler çözmeniz gerekebilir.`,
    playerTips: 'Dayanıklılık testlerine hazır olun. Ekip çalışması burada hayati önem taşır — bu bölüm savaş dışı becerilerin ve işbirliğinin parladığı yerdir.',
  },
  {
    id: 'gargaros',
    name: 'Gargaros Zirvesi & Sarıkız Tepesi',
    subtitle: 'Kozmik Doruk Noktası',
    icon: '🌋',
    dangerLevel: 4,
    dangerLabel: 'Ölümcül',
    color: '#c0392b',
    description: `İda Dağı'nın en yüksek zirvesi. Truva Savaşı sırasında Zeus'un muazzam savaşı izlemek için tahtını kurduğu ve Hera'nın onu baştan çıkararak savaşın gidişatını değiştirdiği efsanevi zirve.`,
    atmosphere: `Gökyüzü mor, kızıl ve altın renklere bürünmüş, uzay ve zamanın gerçeklik dokusu yırtılmıştır. Yarığın içinden antik dünyanın yıkıntıları, alevler içindeki Truva şehrinin yansımaları ve yeraltı dünyası Tartarus'un çığlıkları duyulmaktadır.`,
    mythologicalLink: `Sarıkız efsanesi ile Yunan mitolojisi iç içe geçmiştir. Yüzlerce yıldır hürmet gören Sarıkız, kadim zamanlardan kalma bir koruyucu ruh olarak zirveye yaklaşan kahramanlara telepatik vizyonlar gönderir.`,
    playerTips: 'Burası son savaş alanı. Tanrısal yeteneklerinizin sınırlarını sonuna kadar zorlamalısınız. Palladium burada asıl yerine yerleştirilmelidir.',
  },
];

export const STORYLINE = [
  {
    act: 1,
    title: 'Sazlı\'da Uyanış',
    subtitle: 'Kimliğin Keşfi',
    icon: '🌅',
    summary: `Birbirlerini tanımayan sıradan insanlar olarak Kaz Dağları'na gelen kahramanlar, Sazlı Köyü'nde bir patlama ve toprak sarsıntısıyla karşılaşırlar. Gökyüzü mor ve kızıl renklere bürünür, elektronik aletler susar. Damarlarındaki ilahi kan ilk kez tepki verir — baş ağrıları vizyonlara, "kusurları" inanılmaz savaş yeteneklerine dönüşür.`,
    highlights: [
      'İlk mitolojik yaratıklarla yüzleşme',
      'Yarı-tanrı kimliğinizin keşfi',
      'Ekipman toplama ve köy keşfi',
      'Tanrısal güçlerin ilk kıvılcımları',
    ],
  },
  {
    act: 2,
    title: 'İda\'nın Sınavları',
    subtitle: 'Şahindere Kanyonu',
    icon: '⚔️',
    summary: `Palladium'u koruyarak İda Dağı'nın sarp yamaçlarına tırmanmaya başlarsınız. Medeniyet her adımda uzaklaşır. Sütüven Şelalesi'ndeki su perileri, Şahindere Kanyonu'nun oksijen hezeyanları ve devasa ejderhalar sizi beklemektedir.`,
    highlights: [
      'Su perileriyle diplomatik veya savaş yolları',
      'Kanyonda hayatta kalma sınavları',
      'Halüsinasyonlar ve geçmişle yüzleşme',
      'Antik bulmacalar ve tuzaklar',
    ],
  },
  {
    act: 3,
    title: 'Gargaros\'taki Çatlak',
    subtitle: 'Kozmik Kapanış',
    icon: '🌌',
    summary: `Gargaros zirvesine ulaştığınızda gökyüzünde devasa bir aether girdabı dönmektedir. İntikamcı Truva hayaletleri ve devasa Tahta At konstruktları yarığı korumaktadır. Palladium'u Zeus Altarı'na yerleştirip mühür ritüelini başlattığınızda, derinliklerden kozmik bir dehşet yükselecektir.`,
    highlights: [
      'Devasa kuşatma savaşı',
      'Tanrısal güçlerin tam potansiyeli',
      'Kozmik final patronuyla epik mücadele',
      'Kaz Dağları\'nın kaderi ellerinizde',
    ],
  },
];

export const CHARACTER_CONCEPTS = {
  demiGodExplanation: `Modern dünyada yaşayan oyuncu karakterleri, içlerindeki tanrısal kıvılcımın farkında olmadan büyümüş sıradan vatandaşlar olarak oyuna başlar. Bir öğrenci, bir iş insanı, bir kurye veya bir asker olabilirsiniz — ama içinizde antik Olimposluların kanı akmaktadır.`,
  dyslexiaReframe: `Birçok yarı-kanda görülen "Disleksi", beyinlerinin modern Latin alfabesinden ziyade antik Yunanca, Frigce veya ilahi sembolleri deşifre etmeye programlanmış olmasından kaynaklanır. Okuldaki harfler havada uçuşur, çünkü zihinleriniz üç boyutlu antik rünleri okumak üzere evrimleşmiştir.`,
  adhdReframe: `"Dikkat Eksikliği ve Hiperaktivite Bozukluğu" olarak teşhis edilen durum, modern bir sınıfta oturmak için uygun olmamalarından kaynaklanır. Bu hiperaktivite, aslında bir savaş alanındaki her detayı anında analiz etmelerini ve hayatta kalmalarını sağlayan doğuştan gelen savaş refleksleridir.`,
  powerEvolution: `Başlangıçta yetenekleriniz kontrolsüz, duygusal patlamalar şeklinde ortaya çıkar. Kaz Dağları'nın derinliklerine indikçe bu güçler odaklanmış, ölümcül beceri ağaçlarına dönüşecektir. Modern toplumda bir kusur olarak görülen özellikleriniz, İda Dağı'nın vahşi doğasına girdiğinizde en büyük silahlarınıza dönüşür.`,
  creationSteps: [
    { step: 1, title: 'Modern Kimlik', description: 'Karakterinizin modern dünyadaki mesleğini ve kişiliğini belirleyin. Öğrenci mi, asker mi, kuryeci mi?' },
    { step: 2, title: 'İlahi Soy Seçimi', description: '12 Olimposlu ebeveynden birini seçin. Bu seçim güçlerinizi, zayıflıklarınızı ve savaş rolünüzü belirler.' },
    { step: 3, title: 'Kusurlarınızı Kucaklayın', description: 'Her soyun kendine has kusurları vardır. Bunlar zayıflık değil, rol yapma fırsatıdır.' },
    { step: 4, title: 'Uyanış Anı', description: 'Karakteriniz güçlerini nasıl keşfedecek? Bu an, hikayenizin dönüm noktası olacaktır.' },
  ],
};
