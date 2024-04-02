'use client'
import React, { Fragment, createContext, useCallback, useContext, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import { Locale } from "@/localization";
import { RawSettings, SettingsProviderProps, Theme, UseSettingsProps } from "../../lib/settings-types";
import { getCookie, setCookie } from "cookies-next";
import { rawSettingsDefault } from "@/lib/settings";

const settingsContext = createContext<UseSettingsProps | undefined>(undefined)
const defaultSettingsContext: UseSettingsProps = {
    setTheme: () => {},
    setLanguage: () => {},
    settings: rawSettingsDefault
}

const mapThemeToString: { [key in Theme]: string} = {
    [Theme.SYSTEM]: 'system',
    [Theme.LIGHT]: 'light',
    [Theme.DARK]: 'dark'
}

export const useSettings = () => useContext(settingsContext) ?? defaultSettingsContext

export const SettingsProvider: React.FC<SettingsProviderProps> = props => {
    const context = useContext(settingsContext)

    if (context) { return <Fragment>{props.children}</Fragment> }
    return <SettingsElement {...props} />
}

const SettingsElement: React.FC<SettingsProviderProps> = ({
    cookieName = 'settings',
    cookieExpires = new Date('2037/12/31'),
    defaultSettings = rawSettingsDefault,
    children
}) => {
    const [settings, setSettingsState] = useState(() => getSettings(cookieName, defaultSettings))
    const { setTheme } = useTheme()

    const saveSettings = useCallback(
        (settings: RawSettings) => {
            setSettingsState(settings)
            // try to save to local storage
            try {
                setCookie(cookieName, JSON.stringify(settings), {
                    expires: cookieExpires,
                    sameSite: true
                })
            } catch (_) { }
        },
        [cookieExpires, cookieName]
    )

    const setThemeSetting = useCallback(
        (newTheme: Theme) => {
            setTheme(mapThemeToString[newTheme])
            saveSettings({
                ...settings,
                theme: newTheme
            })
        },
        [saveSettings, settings, setTheme]
    )

    const setLanguage = useCallback(
        (newLanguage: Locale | null) => {
            saveSettings({
                ...settings,
                language: newLanguage
            })
        },
        [saveSettings, settings]
    )

    const providerValue = useMemo(() => ({
        settings,
        setTheme: setThemeSetting,
        setLanguage: setLanguage
    }), [settings, setThemeSetting, setLanguage])

    return (
        <settingsContext.Provider
            value={providerValue}
        >
            {children}
        </settingsContext.Provider>
    )

}

const getSettings = (key: string, fallback: RawSettings): RawSettings => {
    let settings
    try {
        const item = getCookie(key)?.toString()
        settings = item ? JSON.parse(item) as RawSettings : null
    } catch (_) { }
    return settings || fallback
}