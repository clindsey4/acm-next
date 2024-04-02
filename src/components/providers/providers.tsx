'use client'

import { LanguageDictionary } from "@/localization"
import { LanguageDictionaryProvider } from "./language-dict-provider"
import { ThemeProvider } from 'next-themes'
import { SettingsProvider } from "./settings-provider"

export function Providers(
    {
        dictionary,
        children
    }: {
        dictionary: LanguageDictionary,
        children: React.ReactNode
    }
) {
    return (
        <ThemeProvider>
            <SettingsProvider>
                <LanguageDictionaryProvider dictionary={dictionary}>
                    {children}
                </LanguageDictionaryProvider>
            </SettingsProvider>
        </ThemeProvider>
    )
}