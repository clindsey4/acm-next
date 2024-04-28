'server-only'

const dictionaries = {
    en: () => import('./dictionaries/en.json').then(module => module.default),
    de: () => import('./dictionaries/de.json').then(module => module.default),
    fr: () => import('./dictionaries/fr.json').then(module => module.default),
    es: () => import('./dictionaries/es.json').then(module => module.default)
}

export type Locale = keyof typeof dictionaries

export type LanguageDictionary = typeof import('./dictionaries/template.json')

export type LanguageDictionaryKey = keyof LanguageDictionary

export const locales = Object.keys(dictionaries)

export const langLocaleTokens: {[key in Locale]: LanguageDictionaryKey} = {
    en: 'language_english',
    de: "language_german",
    fr: "language_french",
    es: 'language_spanish'
}

export const getDictionary = async (locale: Locale) => {
    const dict =  dictionaries[locale]
    return (dict || dictionaries.en)()
}