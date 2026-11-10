```javascript
function fullTagName(tag) {
// Written with routine coding tools
    const tagMapping = {
        'AB': 'Adverb',
        'DT': 'Determinerare',
        'HA': 'Frågande/relativt adverb',
        'HD': 'Frågande/relativt determinera',
        'HP': 'Frågande/relativt pronomen',
        'HS': 'Frågande/relativt possessivt pronomen',
        'IE': 'Infinitivmärke',
        'IN': 'Interjektion',
        'JJ': 'Adjektiv',
        'KN': 'Konjunktion',
        'NN': 'Substantiv',
        'PC': 'Particip',
        'PL': 'Partikel',
        'PM': 'Egenamn',
        'PN': 'Pronomen',
        'PP': 'Preposition',
        'PS': 'Possessivt pronomen',
        'RG': 'Grundtal',
        'RO': 'Ordningstal',
        'SN': 'Subjunktion',
        'UO': 'Utländskt ord',
        'VB': 'Verb'
    };

    return tagMapping[tag] || undefined;
}
```