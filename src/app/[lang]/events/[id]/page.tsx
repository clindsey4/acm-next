import { EventCard } from "@/components/events/event-card"
import { AccessLevel, User } from "@/data/types"
import { filterEventsAttendance, getEvent, getUser, hasUserAttendedEvent } from "@/data/webData"
import { getActiveSession } from "@/lib/oauth"
import { Locale, getDictionary } from "@/localization"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createEventMinAccessLevel, showQRCodeMinAccessLevel } from "@/lib/utils"
import { isEventInProgress } from "@/lib/utils"
import { BaseButton } from "@/components/material/base-button"
import { FilledButton } from "@/components/material/filled-button"
import { Divider } from "@/components/material/divider"
import Image from "@/components/image"
import { IconButton } from "@/components/material/icon-button"
import { PageSelector } from "@/components/page-selector"
import { DeleteEventButton } from "./delete-event-button"
import { DeleteEventAttendanceButton } from "./delete-event-attendance-button"
import Link from "next/link"
import { UserListItem } from "@/components/events/user-list-item"
import QRCode from "react-qr-code"
import Markdown from "react-markdown"
import { DateFormatter } from "@/components/formatters/date-formatter"
import { DateFormatterMode } from "@/components/formatters/types"
import { DateRangeFormatter } from "@/components/formatters/date-range-formatter"
import { Icon } from "@/components/material/icon"
import { AttendEventButton } from "../attend-event-button"

const entriesPerPage = 20

export default async function EventsPage(
    {
        params,
        searchParams
    }: {
        params: {
            lang: Locale,
            id: string
        }
        searchParams: {
            page: string
        }
    }
) {
    // get the language dictionary
    const lang = params.lang
    const langDict = await getDictionary(lang)

    // get the event
    const eventId = Number(params.id)
    const event = !isNaN(eventId) ? await getEvent(eventId) : null
    if (!event) return redirect(`/${lang}/events`) // if the event doesn't exist, simply redirect to the events page.

    // get the active session
    const session = await getActiveSession(cookies())
    const accessLevel = session !== null ? session.user.accessLevel : AccessLevel.NON_MEMBER

    // ensure that the user is authorized to view this event
    if (event.accessLevel > accessLevel) return redirect(`/${lang}/events`)

    // parse search params
    const currentPage = Math.max(Number.parseInt(searchParams.page) || 0, 0) // parse the page search parameter, ensuring that it is >= 1
    const currentOffset = currentPage * entriesPerPage

    // get event attendance
    const attendanceResult = await filterEventsAttendance({
        eventIds: [eventId],
        offset: currentOffset,
        maxEntries: entriesPerPage
    })
    const attendanceUsers: User[] = []
    for (const attendance of attendanceResult.results) {
        const user = await getUser(attendance.userEmail)
        if (user) {
            attendanceUsers.push(user)
        }
    }

    // check if the current user has attended the event
    const hasAttendedEvent = session !== null ? await hasUserAttendedEvent(eventId, session.user.email) : false

    // event variables
    const showQRCode = accessLevel >= showQRCodeMinAccessLevel
    const canCreateEvents = accessLevel >= createEventMinAccessLevel
    const eventInProgress = isEventInProgress(event)

    // elements
    const buttons = (
        <>
            {eventInProgress && !showQRCode ?
                hasAttendedEvent ? <div className="w-full sm:w-fit font-bold flex gap-1 border-2 border-primary text-primary h-10 px-6 items-center justify-center rounded-full">
                    <Icon icon="check" />
                    {langDict.event_attended}
                </div> : <BaseButton
                    href={`/api/events/attend?id=${event.id}&lang=${lang}`}
                    text={langDict.events_attend}
                    className="w-full sm:w-fit bg-primary text-on-primary before:bg-on-primary"
                    prefetch={false}
                /> : undefined}
            {canCreateEvents ? <>
                <FilledButton
                    icon="edit"
                    text={langDict.event_edit}
                    href={`./${eventId}/edit`}
                    className="w-full sm:w-fit"
                />
                <DeleteEventButton
                    eventId={eventId}
                    text={langDict.event_delete}
                />
            </> : undefined}
        </>
    )

    return (
        <article className="w-full flex flex-col gap-5">
            <section className={`flex sm:flex-row flex-col gap-5 sm:items-end items-center h-fit`}>
                <section className="flex-1 flex gap-5 flex-col justify-end w-full">
                    <h1 className="text-on-surface text-5xl font-bold text-wrap break-words text-center sm:text-left">{event.title}</h1>

                    {eventInProgress && showQRCode ? <section className="flex-1 flex flex-col gap-3 w-full sm:flex-row justify-end sm:justify-start mt-2">{buttons}</section> : undefined}
                </section>
                {eventInProgress && showQRCode ? (
                    <QRCode className="w-full h-full max-w-56 max-h-56 p-3 bg-white rounded-3xl border border-outline-variant" value={`https://msu-acm.fly.dev/api/events/attend?id=${event.id}`} />
                ) : (
                    <section className="flex-1 flex flex-col gap-3 sm:w-fit w-full sm:flex-row justify-end">{buttons}</section>
                )}
            </section>
            <Divider />

            <article className="flex flex-col md:grid md:grid-cols-dashboard gap-8 w-full">
                <aside className="w-full px-5 py-3 rounded-3xl bg-surface-container h-fit">
                    <ul className="flex md:flex-col flex-row gap-5 overflow-x-auto overflow-y-clip md:overflow-x-clip">
                        {/* Date */}
                        <Field
                            title={langDict.event_field_date}
                            text={<DateFormatter date={event.startDate} mode={DateFormatterMode.NARROW} />}
                        />

                        {/* Location */}
                        <Field
                            title={langDict.event_field_location}
                            text={event.location}
                        />

                        {/* Duration */}
                        <Field
                            title={langDict.event_field_duration}
                            text={<DateRangeFormatter dateFrom={event.startDate} dateTo={event.endDate} />}
                        />

                        {/* Type */}
                        {event.type ? <Field
                            title={langDict.event_field_type}
                            text={event.type.name}
                        /> : undefined}

                    </ul>
                </aside>
                <section className="w-full">
                    <Markdown className='prose prose-xl prose-material break-words'>{event.body}</Markdown>
                </section>
            </article>

            {/* Only show attendance to officers and higher */}
            {canCreateEvents ? <>
                <Divider />
                {currentPage === 0 && 0 >= attendanceResult.totalCount ? <h3 className="text-center w-full text-3xl font-bold">{langDict.event_no_attendance}</h3>
                    : <section>
                        <h3 className="text-3xl font-bold mb-3">{langDict.event_attendance}</h3>
                        <ul className="flex gap-3 flex-col w-full">
                            {attendanceUsers.map(user => <UserListItem
                                key={user.email}
                                user={user}
                                action={<DeleteEventAttendanceButton
                                    eventId={eventId}
                                    email={user.email}
                                />}
                                href={`/${lang}/account/${user.email.split('@')[0]}`}
                            />)}
                            <li><PageSelector
                                currentOffset={currentOffset}
                                totalCount={attendanceResult.totalCount}
                                pageSize={entriesPerPage}
                                href=''
                            /></li>
                        </ul>
                    </section>
                }
            </> : undefined}
        </article>
    )

}

function Field(
    {
        title,
        text
    }: {

        title: string
        text: React.ReactNode
    }
) {
    return <li className="whitespace-nowrap">
        <h4 className="text-lg text-on-surface font-semibold w-full md:whitespace-break-spaces">{title}</h4>
        <span className="text-lg text-on-surface-variant w-full md:whitespace-break-spaces">{text}</span>
    </li>
}