import { Divider } from "@/components/material/divider";
import { PageHeader } from "@/components/page-header";
import { Locale, getDictionary } from "@/localization";
import { AttendanceFilters } from "./attendance-filters";
import { AccessLevel, Semester } from "@/data/types";
import { dashboardMinAccessLevel, getMaximumSemesterDate, getMinimumSemesterDate, getSemester } from "@/lib/utils";
import { filterEventsAttendance, filterEventsAttendancePoints } from "@/data/webData";
import { UserListItem } from "@/components/events/user-list-item";
import { PageSelector } from "@/components/page-selector";
import { getActiveSession } from "@/lib/oauth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const entriesPerPage = 50;

export default async function AttendancePage(
    {
        params,
        searchParams
    }: {
        params: {
            lang: Locale
        }
        searchParams: {
            year?: string
            semester?: string
            page?: string
        }
    }
) {
    // get the current session
    const session = await getActiveSession(cookies())
    const sessionAccessLevel = session ? session.user.accessLevel : AccessLevel.NON_MEMBER

    // redirect if the user is not able to view any account
    if (!session || dashboardMinAccessLevel > sessionAccessLevel) return redirect(`/`)

    // get language dictionary
    const lang = params.lang
    const langDict = await getDictionary(lang)

    // parse semester & year search params
    const currentSemster = getSemester()
    const semester = searchParams.semester ? Number.parseInt(searchParams.semester) || currentSemster : currentSemster
    const currentYear = new Date().getFullYear()
    const year = searchParams.year ? Number.parseInt(searchParams.year) || currentYear : currentYear 
    

    // semester calculations
    const minSemesterDate = new Date()
    minSemesterDate.setFullYear(year)
    getMinimumSemesterDate(semester, minSemesterDate)

    const maxSemesterDate = new Date()
    maxSemesterDate.setFullYear(year)
    getMaximumSemesterDate(semester, maxSemesterDate)

    // parse search params
    const currentPage = searchParams.page ? Math.max(Number.parseInt(searchParams.page) || 0, 0) : 0 // parse the page search parameter, ensuring that it is >= 1
    const currentOffset = currentPage * entriesPerPage

    // get event attendance
    const attendanceResult = await filterEventsAttendancePoints({
        fromDate: minSemesterDate,
        toDate: maxSemesterDate,
        offset: currentOffset,
        maxEntries: entriesPerPage
    })

    return (
        <>
            <PageHeader
                text={langDict.dash_attendance_title}
                actions={<AttendanceFilters defaultSemester={semester} defaultYear={year} />}
            />
            <Divider className="mt-5"/>
            <ul className="flex flex-col gap-5 mt-5 mb-5 min-h-screen">
                {attendanceResult.totalCount > 0 ? attendanceResult.results.map(result => <UserListItem
                    key={result.user.email}
                    user={result.user}
                    href={`/${lang}/account/${result.user.email.split('@')[0]}`}
                    action={<h4 className="text-xl sm:text-right text-center mr-3 sm:w-auto w-full">{result.points === 1 ? langDict.dash_attendance_point : langDict.dash_attendance_points.replace(":points", result.points.toString()) }</h4>}
                />) : <li><h3 className="text-3xl font-semibold text-center w-full">{langDict.dash_attendance_empty}</h3></li>}
            </ul>
            <PageSelector
                currentOffset={currentOffset}
                totalCount={attendanceResult.totalCount}
                pageSize={entriesPerPage}
                href=''
            />
        </>
    )
}