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
    const firstName = user.givenName
    const email = user.email

    // handle date/semester stuff
    const dateNow = new Date()
    const currentSemester = getSemester(dateNow)
    const minSemesterDate = getMinimumSemesterDate(currentSemester)
    const maxSemesterDate = getMaximumSemesterDate(currentSemester)

    // get the user's attendance points for this semester
    const attendancePointsResult = await filterEventsAttendancePoints({
        userEmails: [email],
        maxEntries: 1,
        fromDate: minSemesterDate,
        toDate: maxSemesterDate
    })
    const attendancePointsTotal = attendancePointsResult.results[0]?.points || 0

    // parse search params
    const currentPage = Math.max(Number.parseInt(searchParams.page) || 0, 0) // parse the page search parameter, ensuring that it is >= 1
    const currentOffset = currentPage * entriesPerPage

    // get event attendance
    const attendanceResult = await filterEventsAttendance({
        userEmails: [email],
        offset: currentOffset,
        maxEntries: entriesPerPage
    })
    const attendanceSemesters: AttendanceSemester[] = []
    {
        let currentSemester: AttendanceSemester | null = null

        for (const attendance of attendanceResult.results) {
            const event = await getEvent(attendance.eventId)
            if (event) {
                const semester = getSemester(event.endDate)
                const minSemesterDate = getMinimumSemesterDate(semester, event.endDate)

                if (currentSemester !== null) {
                    if (currentSemester.semester !== semester || currentSemester.date.getFullYear() !== minSemesterDate.getFullYear()) {
                        attendanceSemesters.push(currentSemester)
                        currentSemester = {
                            date: minSemesterDate,
                            semester: semester,
                            items: [event]
                        }
                    } else {
                        currentSemester.items.push(event)
                    }
                } else {
                    currentSemester = {
                        date: minSemesterDate,
                        semester: semester,
                        items: [event]
                    }
                }
            }
        }
        if (currentSemester !== null) {
            attendanceSemesters.push(currentSemester)
        }
    }

    return (
        <article className="w-full flex flex-col gap-5">
            <PageHeader text={langDict.account_title} />
            <section className="w-full flex flex-col gap-6 items-center mt-5">
                {/* User Picture */}
                <figure className="w-24 h-24">
                    <Image
                        height={96}
                        width={96}
                        src={user.picture}
                        alt={firstName}
                        className="rounded-full object-cover"
                    />
                </figure>

                <section className="flex flex-col gap-2 items-center">
                    {/* User full name */}
                    <h2 className="text-4xl font-bold text-center">{langDict.account_full_name.replace(":givenName", firstName).replace(":familyName", user.familyName)}</h2>

                    {/* User email */}
                    <h3 className="text-xl text-on-surface-variant text-center">{email}</h3>
                </section>

                {/* Attendance points */}
                <h3 className="rounded-full border border-on-surface text-on-surface font-semibold text-base h-10 px-6 flex items-center">{langDict.account_attendance_points.replace(":points", attendancePointsTotal.toString())}</h3>

                {/* log out */}
                <BaseButton
                    icon="logout"
                    text={langDict.account_log_out}
                    className="w-full sm:w-fit bg-error text-on-error before:bg-on-error"
                    href="/api/logout"
                />
            </section>

            {/* Attendance history */}
            <h2 className="text-3xl font-semibold mt-14">{langDict.account_attendance_title}</h2>
            <Divider />
            {currentPage === 0 && 0 >= attendanceResult.totalCount ? <h3 className="text-center w-full text-2xl">{langDict.account_attendance_empty}</h3>
                : <ul className="flex flex-col gap-5">
                    {attendanceSemesters.map(semester => <InputSection
                        key={semester.date.toISOString()}
                        title={(semester.semester == Semester.SPRING ? langDict.account_spring_event : langDict.account_fall_event).replace(":year", semester.date.getFullYear().toString())}
                    >{semester.items.map(event => <FutureEventItem key={event.id} event={event}/>)}</InputSection>)}
                    <li><PageSelector
                        currentOffset={currentOffset}
                        totalCount={attendanceResult.totalCount}
                        pageSize={entriesPerPage}
                        href=''
                    /></li>
                </ul>
            }
        </article>
    )

}