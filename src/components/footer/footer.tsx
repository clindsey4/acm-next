'use client'

import Link from "next/link";
import { useLocale } from "../providers/language-dict-provider"
import Image from "../image";
import { LanguageDictionaryKey, Locale, langLocaleTokens, locales } from "@/localization";
import { Icon } from "../material/icon";
import { Divider } from "../material/divider";
import { FooterSelect } from "./footer-select";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";

export default function Footer(
    {
        lang
    }: {
        lang: Locale
    }
) {
    const langDict = useLocale();
    
    // theme variables
    const theme = useTheme();

    // path variables
    const root = `/${lang}`
    const pathName = usePathname()
    const router = useRouter()
    
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
        <footer>
            <Divider/>
            <ul className="w-full max-w-screen-xl min-h-24 h-fit box-border p-7 m-auto flex flex-col justify-center items-center gap-7 flex-wrap">
                <li className="w-fit">
                    <Link href={root} className="flex items-center gap-2 w-fit">
                        <Image className="w-7 h-7" src='/msu-shield.png' alt={langDict.home_title} />
                        <Image className="w-7 h-7" src='/acm-logo.png' alt={langDict.home_title} />
                        <h2 className="font-semibold text-2xl">MSU ACM</h2>
                    </Link>
                </li>
                <li className="w-full">
                    <ul className="flex flex-col sm:flex-row gap-7 justify-center items-center">
                        <FooterLink text={langDict.nav_about} href={`${root}/about`} />
                        <FooterLink text={langDict.nav_events} href={`${root}/events`} />
                        <FooterLink text={langDict.nav_join} href={`${root}/join`} />
                        <FooterLink text={langDict.nav_news} href={`${root}/news`} />
                        <FooterLink text={langDict.account_title} href={`${root}/account`} />
                    </ul>
                </li>
                <li className="w-full">
                    <ul className="gap-3 flex flex-col sm:flex-row justify-center items-center">
                        {/* Language */}
                        <FooterSelect
                            value={selectedLocale}
                            options={localeOptions}
                            optionSubtitles={localeSubOptions}
                            icon="language"
                            onValueChanged={newValue => {
                                const newLang = locales[newValue]
                                router.push(pathName.replace(lang, newLang));
                            }}
                        />

                        {/* Theme */}
                        <FooterSelect
                            value={theme.theme === 'system' ? 0 : theme.theme === 'dark' ? 1 : 2}
                            options={[
                                langDict['theme_system'],
                                langDict['theme_dark'],
                                langDict['theme_light']
                            ]}
                            icon="dark_mode"
                            onValueChanged={newValue => {
                                theme.setTheme(newValue === 0 ? 'system' : newValue === 1 ? 'dark' : 'light')
                            }}
                        />
                    </ul>
                </li>
                
            </ul>
        </footer>
    )
}

function FooterLink(
    {
        text,
        href
    }:
        {
            text: string,
            href: string
        }
) {
    return (
        <li><Link className="text-on-background text-md hover:text-primary transition-colors" href={href}>{text}</Link></li>
    )
}