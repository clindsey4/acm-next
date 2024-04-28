'use client'

import { LanguageDictionary } from "@/localization"
import { LanguageDictionaryProvider } from "./language-dict-provider"
import { ThemeProvider } from 'next-themes'
import { SettingsProvider } from "./settings-provider"
import { OneSignalAPIProvider } from "./onesignal-api-provider"

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
                    <OneSignalAPIProvider>
                        {children}
                    </OneSignalAPIProvider>
                </LanguageDictionaryProvider>
            </SettingsProvider>
        </ThemeProvider>
    )
}