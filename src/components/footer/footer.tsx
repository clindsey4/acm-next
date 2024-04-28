import { Locale, getDictionary } from "@/localization";
import Link from "next/link";
import Image from "../image";
import { Divider } from "../material/divider";
import { FooterSettings } from "./footer-settings";
import { Settings } from "@/lib/settings";
import { cookies } from "next/headers";

export default async function Footer(
    {
        lang
    }: {
        lang: Locale
    }
) {
    const langDict = await getDictionary(lang)
    const root = `/${lang}`
    const settings = new Settings(cookies())
    
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
                        <section className="flex gap-7 justify-center items-center">
                            <FooterLink text={langDict.nav_about} href={`${root}/about`} />
                            <FooterLink text={langDict.nav_events} href={`${root}/events`} />
                            <FooterLink text={langDict.nav_join} href={`${root}/join`} />
                        </section>
                        <section className="flex gap-7 justify-center items-center">
                            <FooterLink text={langDict.account_title} href={`${root}/account`} />
                            <FooterLink text={langDict.nav_news} href={`${root}/news`} />
                        </section>
                        <section className="flex gap-7 justify-center items-center">
                            <FooterLink text={langDict.privacy_policy} href="./PrivacyPolicy.pdf"/>
                            <FooterLink text={langDict.data_deletion} href={`${root}/datadeletion`}/>
                        </section>
                    </ul>
                </li>
                <li className="w-full">
                    <ul className="gap-3 flex flex-col sm:flex-row justify-center items-center">
                        <FooterSettings
                            initialSettings={{
                                lang: lang,
                                theme: settings.theme
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