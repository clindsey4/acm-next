import { Icon } from "./icon";
import Link from "next/link";

export function FloatingActionButton(
    {
        icon,
        href,
        title,
        className = '',
    }: {
        icon: string
        href: string
        title?: string
        className?: string
        
    }
) {
    return (
        <Link
            className={`${className} w-14 h-14 fixed rounded-2xl right-4 bottom-4 bg-primary-container text-on-primary-container shadow-md flex items-center justify-center before:bg-on-primary-container before:absolute before:w-full before:h-full before:rounded-2xl before:opacity-0 hover:before:opacity-5 before:transition-opacity z-10`}
            href={href}
            title={title}
        >
            <Icon icon={icon} />
        </Link>
    )
}