import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { Locale } from "@/localization";
import { RawSettings, SettingsProxy, Theme } from "./settings-types";

export const rawSettingsDefault: RawSettings = {
    theme: Theme.SYSTEM,
    language: null
}

export class Settings implements SettingsProxy {
    private cookies: RequestCookies | ReadonlyRequestCookies
    private cookieName: string
    private settings: RawSettings

    constructor(
        cookies: RequestCookies | ReadonlyRequestCookies,
        cookieName: string = 'settings',
        defaultSettings: RawSettings = rawSettingsDefault
    ) {
        this.cookies = cookies
        this.cookieName = cookieName
        
        // import settings
        const rawCookie = cookies.get(cookieName)
        let parsedCookie: RawSettings = defaultSettings

        if (rawCookie) {
            try {
                parsedCookie = {
                    ...defaultSettings,
                    ...JSON.parse(rawCookie.value)
                }
            } catch (error) {}
        }

        this.settings = parsedCookie
    }

    private saveSettings() {
        try {
            const stringified = JSON.stringify(this.settings)
            this.cookies.set(this.cookieName, stringified)
        } catch (error) { console.log(error) }
    }

    // theme
    get theme() {
        return this.settings.theme
    }

    // locale
    get language(): Locale | null {
        return this.settings.language
    }

    set language(newLanguage: Locale) {
        this.settings.language = newLanguage
        this.saveSettings()
    }

}