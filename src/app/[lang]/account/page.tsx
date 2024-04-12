import { getActiveSession } from "@/lib/oauth"
import { Locale, getDictionary } from "@/localization"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { PortableAccountPage } from "./portable-account-page"
import { dashboardMinAccessLevel } from "@/lib/utils"

export default async function AccountPage(
    {
        params,
        searchParams
    }: {
        params: {
            lang: Locale
        },
        searchParams: {
            page: string
        }
    }
) {

    // get the current session
    const session = await getActiveSession(cookies())

    // redirect to the login route if not logged in
    if (session === null) return redirect("/api/oauth?refer=/account")

    // get the lang dict
    const lang = params.lang
    const langDict = await getDictionary(lang)

    // get the user from the session
    const user = session.user
    
    return (
        <PortableAccountPage
            user={user}
            lang={lang}
            langDict={langDict}
            page={searchParams.page}
            isCurrentUser
            showDashboardNavigation={session.user.accessLevel >= dashboardMinAccessLevel}
        />
    )
}