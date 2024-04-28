import { getUser } from "@/data/webData"
import { getActiveSession } from "@/lib/oauth"
import { Locale, getDictionary } from "@/localization"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { viewAnyAccountMinAccessLevel } from "@/lib/utils"
import { PortableAccountPage } from "../portable-account-page"

export default async function AnyAccountPage(
    {
        params,
        searchParams
    }: {
        params: {
            lang: Locale
            id: string
        },
        searchParams: {
            page: string
        }
    }
) {

    // get the current session
    const session = await getActiveSession(cookies())

    // redirect if the user is not able to view any account
    if (!session || viewAnyAccountMinAccessLevel > session.user.accessLevel) return redirect("./")

    // parse the user email
    const user_email = `${params.id}@${process.env.GOOGLE_OAUTH_HD || ''}`

    const user = await getUser(user_email)
    if (user === null) return redirect("./")

    // get the lang dict
    const lang = params.lang
    const langDict = await getDictionary(lang)

    return (
        <PortableAccountPage
            user={user}
            lang={lang}
            langDict={langDict}
            page={searchParams.page}
            isCurrentUser={session.user.email === user.email}
            showDashboardNavigation={true}
        />
    )

}