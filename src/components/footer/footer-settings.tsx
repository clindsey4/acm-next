'use client'

import { LanguageDictionaryKey, Locale, langLocaleTokens, locales } from "@/localization"
import { Theme } from "../../lib/settings-types"
import { CustomSelectInput } from "../input/custom-select-input"
import { useEffect, useState } from "react"
import { useLocale } from "../providers/language-dict-provider"
import { useTheme } from "next-themes"
import { usePathname, useRouter } from "next/navigation"
import { useSettings } from "../providers/settings-provider"

export function FooterSettings(
    {
        initialSettings

    }: {
        initialSettings: {
            lang: Locale
            theme: Theme
        }
    }
) {
    const langDict = useLocale();
    
    // theme variables
    const themeProps = useTheme();

    // path variables
    const lang = initialSettings.lang
    const pathName = usePathname()
    const router = useRouter()

    // settings
    const { settings, setTheme, setLanguage } = useSettings()

    // wait for mount
    const [mounted, setMounted] = useState(false)
    useEffect(() => {
        setMounted(true)
    }, [])

    const currentSettings = mounted ? settings : initialSettings
    
    // select option stuff
    let selectedLocale = 0
    const localeOptions: string[] = []
    const localeSubOptions: string[] = []

    for (const locale in langLocaleTokens) {
        if (locale === lang) selectedLocale = localeOptions.length
        localeOptions.push(langDict[langLocaleTokens[locale as keyof typeof langLocaleTokens]])
        localeSubOptions.push(langDict[`${langLocaleTokens[locale as keyof typeof langLocaleTokens]}_local` as LanguageDictionaryKey])
    }

    return (
        <>
            {/* Language */}
            <CustomSelectInput
                value={selectedLocale}
                options={localeOptions}
                optionSubtitles={localeSubOptions}
                icon="language"
                onValueChanged={newValue => {
                    const newLang = locales[newValue]
                    router.push(pathName.replace(lang, newLang));
                    setLanguage(newLang as Locale)
                }}
            />

            {/* Theme */}
            <CustomSelectInput
                value={currentSettings.theme}
                options={[
                    langDict['theme_system'],
                    langDict['theme_dark'],
                    langDict['theme_light']
                ]}
                icon="dark_mode"
                onValueChanged={newValue => {
                    setTheme(newValue)
                    themeProps.setTheme(newValue === 0 ? 'system' : newValue === 1 ? 'dark' : 'light')
                }}
            />
        </>
    )
}