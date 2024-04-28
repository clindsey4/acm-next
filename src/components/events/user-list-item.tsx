import { User } from "@/data/types"
import Image from "../image"
import Link from "next/link"

export function UserListItem(
    {
        user,
        href,
        action
    }: {
        user: User
        href: string
        action?: React.ReactNode
    }
) {
    return (
        <li className="w-full bg-surface-container-low rounded-3xl px-4 sm:py-2 py-4 flex flex-col sm:flex-row gap-5 items-center">
            <section className="flex gap-5 items-center w-full">
                <figure className="w-9 h-9">
                    <Image
                        height={36}
                        width={36}
                        src={user.picture}
                        alt={user.givenName}
                        className="rounded-full object-cover text-center bg-surface-container-high overflow-clip border border-outline-variant"
                    />
                </figure>
                <section className="flex flex-col">
                    <Link href={href}><h4 className="text-xl font-semibold hover:text-primary transition-colors">{user.givenName} {user.familyName}</h4></Link>
                    <h5 className="text-base text-on-surface-variant">{user.email}</h5>
                </section>
            </section>

            {action ? <section className="flex-1 flex justify-end w-full min-w-36">{action}</section> : undefined}
        </li>
    )
}