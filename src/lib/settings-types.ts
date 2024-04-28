import { Locale } from "@/localization"

export enum Theme {
    SYSTEM,
    LIGHT,
    DARK
}

export interface InitialSettings {
    theme: number
    language: string | null
}

export interface RawSettings {
    theme: Theme,
    language: Locale | null
}

export interface SettingsProxy {
    get theme(): Theme

    get language(): Locale | null

    set language(newLanguage: Locale | null)
}

export interface UseSettingsProps {
    settings: RawSettings

    setTheme: (newTheme: Theme) => void
    setLanguage: (newLanguage: Locale | null) => void
}

export interface SettingsProviderProps {
    cookieName?: string
    
    cookieExpires?: Date

    defaultSettings?: RawSettings

    children?: React.ReactNode
}