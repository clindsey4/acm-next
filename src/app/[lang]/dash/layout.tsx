import { Icon } from "@/components/material/icon";
import { Locale, getDictionary } from "@/localization";
import Link from "next/link";

export default async function Layout(
    {
        children,
        params
    }: {
        children: React.ReactNode;
        params: {
            lang: Locale
        }
    }
) {
    const locale = params.lang
    const langDict = await getDictionary(locale)

    const navLinks: { icon: string, href: string, text: string }[] = [
        {
            icon: 'account_circle',
            href: `/${locale}/dash/account`,
            text: langDict.dash_nav_profile
        },
        {
            icon: 'manage_accounts',
            href: `/${locale}/dash/roles`,
            text: langDict.dash_nav_roles
        },
        {
            icon: 'edit_calendar',
            href: `/${locale}/dash/types`,
            text: langDict.dash_nav_types
        },
        {
            icon: 'group',
            href: `/${locale}/dash/attendance`,
            text: langDict.dash_nav_attendance
        }, 
        {
            icon: 'workspaces',
            href: `/${locale}/dash/social`,
            text: langDict.dash_nav_social
        },
    ]

    return (
        <article className="flex flex-col md:grid md:grid-cols-dashboard gap-8 w-full">
            <aside className="w-full px-3 py-5 rounded-3xl bg-surface-container h-fit">
                <ul className="w-full flex flex-col gap-3">
                    {navLinks.map(link => <DashboardLink
                        key={link.href}
                        icon={link.icon}
                        text={link.text}
                        href={link.href}
                    />)}
                </ul>
            </aside>
            <section className="w-full">
                {children}
            </section>
        </article>
    );
}

function DashboardLink(
    {
        icon,
        text,
        href,
        selected = false
    }: {
        icon: string
        text: string
        href: string
        selected?: boolean
    }
) {
    return (
        <li>
            <Link
                href={href}
                className={`text-base h-9 md:h-11 gap-5 px-4 rounded-full flex items-center justify-center md:justify-start relative before:transition-opacity before:absolute before:w-full before:h-full before:left-0 before:top-0 before:rounded-full before:opacity-0 before:hover:opacity-[0.12] transition-opacity ${selected ? 'text-on-secondary-container bg-secondary-container before:bg-on-secondary-container' : 'before:bg-primary'}`}
            >
                <Icon icon={icon} />
                <h3>{text}</h3>
            </Link>
        </li>
    )
}