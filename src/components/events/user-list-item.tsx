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
        <li className="w-full bg-surface-container-low rounded-3xl px-4 py-2 flex gap-5 items-center">
            <figure className="w-9 h-9">
                <Image
                    height={36}
                    width={36}
                    src={user.picture}
                    alt={user.givenName}
                    className="rounded-full object-cover"
                />
            </figure>
            <section className="flex flex-col">
                <Link href={href}><h4 className="text-xl font-semibold hover:text-primary transition-colors">{user.givenName} {user.familyName}</h4></Link>
                <h5 className="text-base text-on-surface-variant">{user.email}</h5>
            </section>
            {action ? <section className="flex-1 flex justify-end">{action}</section> : undefined}
        </li>
    )
}