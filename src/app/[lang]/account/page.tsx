import Image from "@/components/image"
import { BaseButton } from "@/components/material/base-button"
import { Divider } from "@/components/material/divider"
import { PageHeader } from "@/components/page-header"
import { PageSelector } from "@/components/page-selector"
import { Event, Semester } from "@/data/types"
import { filterEventsAttendance, filterEventsAttendancePoints, getEvent } from "@/data/webData"
import { getActiveSession } from "@/lib/oauth"
import { Locale, getDictionary } from "@/localization"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { FutureEventItem } from "../events/page"
import { getMaximumSemesterDate, getMinimumSemesterDate, getSemester } from "@/lib/utils"
import { InputSection } from "@/components/input/input-section"
import { PortableAccountPage } from "./portable-account-page"

const entriesPerPage = 30

interface AttendanceSemester {
    date: Date
    semester: Semester
    items: Event[]
}

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
    const langDict = await getDictionary(params.lang)

    // get the user from the session
    const user = session.user
    
    return (
        <PortableAccountPage
            user={user}
            langDict={langDict}
            page={searchParams.page}
            isCurrentUser
        />
    )
}