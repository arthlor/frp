import { useState } from 'react'
import { WORLD_LORE, REGIONS, STORYLINE, CHARACTER_CONCEPTS } from '../data/lore'
import { BLOODLINE_LIST } from '../data/bloodlines'
import { BESTIARY } from '../data/bestiary'
import { LEGENDARY_ITEMS } from '../data/items'
import './LorePage.css'

const TABS = [
    { id: 'world', label: 'Dünya', icon: '🌍' },
    { id: 'bloodlines', label: 'Soylar', icon: '⚡' },
    { id: 'story', label: 'Hikaye', icon: '📖' },
    { id: 'bestiary', label: 'Yaratıklar', icon: '🐉' },
    { id: 'regions', label: 'Bölgeler', icon: '🗺️' },
]

const GLOSSARY = [
    {
        term: 'Zırh (AC)',
        description: 'Bir saldırının sana isabet etmesinin ne kadar zor olduğunu gösteren savunma değeri.',
    },
    {
        term: 'İnisiyatif',
        description: 'Savaşta kimin hangi sırayla oynayacağını belirleyen sıra düzeni.',
    },
    {
        term: 'Kritik',
        description: 'd20 sonucunda 20 gelirse çok güçlü başarı, 1 gelirse kritik başarısızlık olur.',
    },
]

export default function LorePage({ onBack }) {
    const [activeTab, setActiveTab] = useState('world')
    const [expandedBloodline, setExpandedBloodline] = useState(null)
    const [expandedCreature, setExpandedCreature] = useState(null)
    const [expandedItem, setExpandedItem] = useState(null)
    const [selectedGlossary, setSelectedGlossary] = useState(GLOSSARY[0])

    return (
        <div className="lore-page">
            <div className="lore-bg">
                <div className="lore-particles" />
                <div className="lore-fog" />
            </div>

            <div className="lore-container">
                {/* Header */}
                <header className="lore-header animate-fade-in">
                    <button className="btn btn-ghost btn-sm lore-back" onClick={onBack} id="btn-lore-back">
                        ← Geri Dön
                    </button>
                    <div className="lore-title-group">
                        <h1>📜 Oyun Rehberi</h1>
                        <p className="lore-subtitle">{WORLD_LORE.title} — Oyuncu El Kitabı</p>
                    </div>
                </header>

                <section className="lore-glossary card animate-fade-in">
                    <h3>🧩 Hızlı Terimler</h3>
                    <div className="glossary-pills">
                        {GLOSSARY.map((item) => (
                            <button
                                key={item.term}
                                type="button"
                                className={`glossary-pill ${selectedGlossary.term === item.term ? 'active' : ''}`}
                                title={item.description}
                                onClick={() => setSelectedGlossary(item)}
                            >
                                {item.term}
                            </button>
                        ))}
                    </div>
                    <p className="text-sm">{selectedGlossary.description}</p>
                </section>

                {/* Tab Navigation */}
                <nav className="lore-tabs" role="tablist">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            role="tab"
                            aria-selected={activeTab === tab.id}
                            className={`lore-tab ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                            id={`tab-${tab.id}`}
                        >
                            <span className="lore-tab-icon">{tab.icon}</span>
                            <span className="lore-tab-label">{tab.label}</span>
                        </button>
                    ))}
                </nav>

                {/* Tab Content */}
                <main className="lore-content animate-fade-in" key={activeTab}>

                    {/* ── WORLD TAB ── */}
                    {activeTab === 'world' && (
                        <div className="tab-world">
                            <section className="lore-section">
                                <h2>🏔️ Kaz Dağları: İda'nın Kadim Toprakları</h2>
                                <p className="lore-text">{WORLD_LORE.overview}</p>
                                <p className="lore-text">{WORLD_LORE.premise}</p>
                            </section>

                            <div className="divider" />

                            <section className="lore-section">
                                <h2>⚡ Kriz: Enerji Yarığı</h2>
                                <p className="lore-text">{WORLD_LORE.conflict}</p>
                            </section>

                            <div className="divider" />

                            <section className="lore-section">
                                <h2>🗡️ Göreviniz</h2>
                                <p className="lore-text lore-text-highlight">{WORLD_LORE.playerRole}</p>
                            </section>

                            <div className="divider" />

                            <section className="lore-section">
                                <h2>Evrenin Temaları</h2>
                                <div className="theme-grid">
                                    {WORLD_LORE.themes.map((theme, i) => (
                                        <div className="theme-card card" key={i}>
                                            <span className="theme-icon">{theme.icon}</span>
                                            <h4>{theme.title}</h4>
                                            <p>{theme.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    )}

                    {/* ── BLOODLINES TAB ── */}
                    {activeTab === 'bloodlines' && (
                        <div className="tab-bloodlines">
                            <section className="lore-section">
                                <h2>⚡ Yarı-Kan Mirası: Kim Olduğunuzu Keşfedin</h2>
                                <p className="lore-text">{CHARACTER_CONCEPTS.demiGodExplanation}</p>
                            </section>

                            {/* Reframing cards */}
                            <div className="reframe-grid">
                                <div className="reframe-card card">
                                    <h4>🧠 Disleksi Gerçeği</h4>
                                    <p>{CHARACTER_CONCEPTS.dyslexiaReframe}</p>
                                </div>
                                <div className="reframe-card card">
                                    <h4>⚡ DEHB Gerçeği</h4>
                                    <p>{CHARACTER_CONCEPTS.adhdReframe}</p>
                                </div>
                            </div>

                            <div className="divider" />

                            <section className="lore-section">
                                <h2>🎯 Karakter Yaratım Adımları</h2>
                                <div className="steps-grid">
                                    {CHARACTER_CONCEPTS.creationSteps.map(step => (
                                        <div className="step-card" key={step.step}>
                                            <div className="step-number">{step.step}</div>
                                            <div className="step-info">
                                                <h4>{step.title}</h4>
                                                <p>{step.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <div className="divider" />

                            <section className="lore-section">
                                <h2>🏛️ 12 İlahi Soy</h2>
                                <p className="lore-text">{CHARACTER_CONCEPTS.powerEvolution}</p>
                                <div className="bloodline-grid">
                                    {BLOODLINE_LIST.map(bl => (
                                        <div
                                            key={bl.id}
                                            className={`bloodline-card card ${expandedBloodline === bl.id ? 'expanded' : ''}`}
                                            style={{ '--bl-color': bl.color, '--bl-dark': bl.colorDark }}
                                            onClick={() => setExpandedBloodline(expandedBloodline === bl.id ? null : bl.id)}
                                            id={`bloodline-${bl.id}`}
                                        >
                                            <div className="bl-header">
                                                <span className="bl-icon">{bl.icon}</span>
                                                <div className="bl-title">
                                                    <h3>{bl.name}</h3>
                                                    <span className="bl-subtitle">{bl.title}</span>
                                                </div>
                                                <span className="bl-expand">{expandedBloodline === bl.id ? '▲' : '▼'}</span>
                                            </div>

                                            {expandedBloodline === bl.id && (
                                                <div className="bl-details animate-fade-in">
                                                    <p className="bl-desc">{bl.description}</p>

                                                    <div className="bl-section">
                                                        <h4>🏙️ Modern Arketip</h4>
                                                        <p>{bl.modernArchetype}</p>
                                                    </div>

                                                    <div className="bl-section">
                                                        <h4>⚔️ Tanrısal Güçler</h4>
                                                        <div className="bl-powers">
                                                            {bl.domainPowers.map((p, i) => (
                                                                <div className="bl-power" key={i}>
                                                                    <span className="bl-power-level">Lv.{p.level}</span>
                                                                    <span className="bl-power-name">{p.name}</span>
                                                                    <span className="bl-power-desc">{p.description}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="bl-section">
                                                        <h4>💔 Kusurlar & Zayıflıklar</h4>
                                                        <div className="bl-flaws">
                                                            {bl.flaws.map((f, i) => (
                                                                <span className="bl-flaw badge badge-crimson" key={i}>{f}</span>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="bl-section">
                                                        <h4>📊 Stat Bonusları</h4>
                                                        <div className="bl-stats">
                                                            <span className="badge badge-gold">{bl.primaryStat.toUpperCase()} +{bl.primaryBonus}</span>
                                                            <span className="badge badge-emerald">{bl.secondaryStat.toUpperCase()} +{bl.secondaryBonus}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    )}

                    {/* ── STORY TAB ── */}
                    {activeTab === 'story' && (
                        <div className="tab-story">
                            <section className="lore-section">
                                <h2>📖 Destanın Üç Perdesi</h2>
                                <p className="lore-text">
                                    İda'nın Son Muhafızları, gerilimi ve epik ölçeği giderek artan üç ana perdelik bir yapıya sahiptir.
                                    Sıradan vatandaşlardan efsanevi muhafızlara dönüşen kahramanların yolculuğu burada başlar.
                                </p>
                            </section>

                            <div className="story-timeline">
                                {STORYLINE.map((act, i) => (
                                    <div className="story-act card" key={act.act}>
                                        <div className="act-connector">
                                            <div className="act-dot">{act.icon}</div>
                                            {i < STORYLINE.length - 1 && <div className="act-line" />}
                                        </div>
                                        <div className="act-content">
                                            <div className="act-badge badge badge-gold">Perde {act.act}</div>
                                            <h3>{act.title}</h3>
                                            <span className="act-subtitle">{act.subtitle}</span>
                                            <p>{act.summary}</p>
                                            <div className="act-highlights">
                                                {act.highlights.map((h, j) => (
                                                    <div className="act-highlight" key={j}>
                                                        <span className="act-bullet">◆</span>
                                                        <span>{h}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="divider" />

                            {/* Legendary Items */}
                            <section className="lore-section">
                                <h2>🏺 Efsanevi Eşyalar & Tılsımlar</h2>
                                <p className="lore-text">
                                    Kaz Dağları, Truva Savaşı'ndan arta kalan ganimetlere ve tanrıların unuttuğu eşyalara ev sahipliği yapar.
                                    Bu eşyalar güçlü ama çoğu zaman lanetlidir — kullanım her zaman bir bedel taşır.
                                </p>
                                <div className="items-grid">
                                    {LEGENDARY_ITEMS.map(item => (
                                        <div
                                            key={item.id}
                                            className={`item-card card ${expandedItem === item.id ? 'expanded' : ''}`}
                                            onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                                            id={`item-${item.id}`}
                                        >
                                            <div className="item-header">
                                                <span className="item-icon">{item.icon}</span>
                                                <div className="item-title">
                                                    <h4>{item.name}</h4>
                                                    <span className="item-rarity" style={{ color: item.rarityColor }}>{item.rarity}</span>
                                                </div>
                                                <span className="bl-expand">{expandedItem === item.id ? '▲' : '▼'}</span>
                                            </div>

                                            {expandedItem === item.id && (
                                                <div className="item-details animate-fade-in">
                                                    <p className="item-origin"><em>{item.origin}</em></p>
                                                    <p>{item.lore}</p>
                                                    <p>{item.history}</p>
                                                    <div className="item-hint">
                                                        <span className="item-hint-icon">💡</span>
                                                        <span>{item.gameHint}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    )}

                    {/* ── BESTIARY TAB ── */}
                    {activeTab === 'bestiary' && (
                        <div className="tab-bestiary">
                            <section className="lore-section">
                                <h2>🐉 İda'nın Uyanan Dehşetleri</h2>
                                <p className="lore-text">
                                    İda Dağı'nın derinliklerinden çıkan varlıklar, doğrudan Anadolu, Troas ve Phrygia bölgesine özgü kökleri olan mitolojik varlıklardır.
                                    Onları tanımak hayatta kalmanın ilk adımıdır.
                                </p>
                            </section>

                            <div className="creature-grid">
                                {BESTIARY.map(cr => (
                                    <div
                                        key={cr.id}
                                        className={`creature-card card ${expandedCreature === cr.id ? 'expanded' : ''}`}
                                        onClick={() => setExpandedCreature(expandedCreature === cr.id ? null : cr.id)}
                                        id={`creature-${cr.id}`}
                                    >
                                        <div className="cr-header">
                                            <span className="cr-icon">{cr.icon}</span>
                                            <div className="cr-title">
                                                <h3>{cr.name}</h3>
                                                <div className="cr-meta">
                                                    <span className="badge badge-crimson">{cr.type}</span>
                                                    <span className="badge badge-gold">{cr.challenge}</span>
                                                </div>
                                            </div>
                                            <span className="bl-expand">{expandedCreature === cr.id ? '▲' : '▼'}</span>
                                        </div>

                                        {expandedCreature === cr.id && (
                                            <div className="cr-details animate-fade-in">
                                                <p className="cr-desc">{cr.description}</p>

                                                <div className="cr-section">
                                                    <h4>📍 Görüldüğü Bölge</h4>
                                                    <p>{cr.location}</p>
                                                </div>

                                                <div className="cr-section">
                                                    <h4>⚠️ Bilinen Yetenekler</h4>
                                                    <ul className="cr-abilities">
                                                        {cr.abilities.map((a, i) => (
                                                            <li key={i}>{a}</li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                <div className="cr-section">
                                                    <h4>🎯 Bilinen Zayıflıklar</h4>
                                                    <div className="cr-weaknesses">
                                                        {cr.weaknesses.map((w, i) => (
                                                            <span className="badge badge-emerald" key={i}>{w}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── REGIONS TAB ── */}
                    {activeTab === 'regions' && (
                        <div className="tab-regions">
                            <section className="lore-section">
                                <h2>🗺️ Keşif Bölgeleri</h2>
                                <p className="lore-text">
                                    Yolculuğunuz, güvenli kabul edilen modern dünyadan giderek daha tehlikeli,
                                    yerçekimi ve rasyonalite kurallarının esnediği efsanevi bölgelere doğru dikey bir tırmanışı içerir.
                                </p>
                            </section>

                            <div className="region-list">
                                {REGIONS.map((region, i) => (
                                    <div className="region-card card" key={region.id} style={{ '--region-color': region.color }} id={`region-${region.id}`}>
                                        <div className="region-header">
                                            <span className="region-icon">{region.icon}</span>
                                            <div className="region-title">
                                                <h3>{region.name}</h3>
                                                <span className="region-subtitle">{region.subtitle}</span>
                                            </div>
                                            <div className="region-danger">
                                                <div className="danger-bar">
                                                    {[1, 2, 3, 4].map(lvl => (
                                                        <div
                                                            key={lvl}
                                                            className={`danger-pip ${lvl <= region.dangerLevel ? 'active' : ''}`}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="danger-label" style={{ color: region.color }}>{region.dangerLabel}</span>
                                            </div>
                                        </div>

                                        <div className="region-body">
                                            <p>{region.description}</p>

                                            <div className="region-section">
                                                <h4>🌫️ Atmosfer</h4>
                                                <p>{region.atmosphere}</p>
                                            </div>

                                            <div className="region-section">
                                                <h4>🏛️ Mitolojik Bağlantı</h4>
                                                <p>{region.mythologicalLink}</p>
                                            </div>

                                            <div className="region-tip">
                                                <span className="region-tip-icon">💡</span>
                                                <span>{region.playerTips}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </main>
            </div>
        </div>
    )
}
