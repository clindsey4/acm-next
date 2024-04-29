'use client'
import { Locale } from "@/localization"
import { useLocale } from "../providers/language-dict-provider"
import { DashboardNavLink } from "./dash_nav_link";
import { usePathname } from "next/navigation";

export function DashboardNavigation(
    {
        lang
    }: {
        lang: Locale
    }
) {
    const langDict = useLocale();
    const pathName = usePathname();

    const navLinks: { icon: string, href: string, text: string }[] = [
        {
            icon: 'account_circle',
            href: `/${lang}/account`,
            text: langDict.dash_nav_profile
        },
        {
            icon: 'manage_accounts',
            href: `/${lang}/dash/roles`,
            text: langDict.dash_nav_roles
        },
        {
            icon: 'edit_calendar',
            href: `/${lang}/dash/types`,
            text: langDict.dash_nav_types
        },
        {
            icon: 'group',
            href: `/${lang}/dash/attendance`,
            text: langDict.dash_nav_attendance
        }
    ]

    

    return (
        <ul className="w-full flex flex-col gap-3">
            {navLinks.map(link => <DashboardNavLink
                key={link.href}
                icon={link.icon}
                text={link.text}
                href={link.href}
                selected={pathName == link.href}
            />)}
        </ul>
    )
}