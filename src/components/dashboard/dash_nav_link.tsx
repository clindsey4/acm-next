import Link from "next/link"
import { Icon } from "../material/icon"

export function DashboardNavLink(
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