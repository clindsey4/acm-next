import { Divider } from "@/components/material/divider";
import { FilledButton } from "@/components/material/filled-button";
import { IconButton } from "@/components/material/icon-button";
import { PageHeader } from "@/components/page-header";
import { AccessLevel, EventType } from "@/data/types";
import { getAllEventTypes } from "@/data/webData";
import { getActiveSession } from "@/lib/oauth";
import { dashboardMinAccessLevel } from "@/lib/utils";
import { Locale, getDictionary } from "@/localization";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DeleteEventTypeButton } from "./delete-event-type-button";

export default async function EventTypesPage(
    {
        params,
        searchParams
    }: {
        params: {
            lang: Locale
        }
        searchParams: {
            page: string
        }
    }
) {
    // get the current session
    const session = await getActiveSession(cookies())
    const sessionAccessLevel = session ? session.user.accessLevel : AccessLevel.NON_MEMBER

    // redirect if the user is not able to view any account
    if (!session || dashboardMinAccessLevel > sessionAccessLevel) return redirect(`/`)

    // import langauge dictionary
    const lang = params.lang
    const langDict = await getDictionary(lang)

    // get event types
    const types = await getAllEventTypes()

    return (
        <>
            <PageHeader
                text={langDict.dash_types_title}
                actions={<FilledButton className="w-full md:w-fit" href={`/${lang}/dash/types/create`} text={langDict.dash_types_create} />}
            />
            <Divider className="mt-5"/>
            <ul className="flex flex-col gap-4 mt-5 mb-5 min-h-screen">
                {types.length > 0 ? types.map(type => <EventTypeListItem
                    key={type.id}
                    type={type}
                    subtitle={langDict.dash_types_points.replace(":regular", type.points.toString()).replace(":member", type.memberPoints.toString())}
                />) : <li><h3 className="text-3xl font-semibold text-center w-full">{langDict.dash_types_empty}</h3></li>}
            </ul>
        </>
    )
}

function EventTypeListItem(
    {
        type,
        subtitle
    }: {
        type: EventType,
        subtitle: string
    }
) {
    return (
        <li className="w-full bg-surface-container-low rounded-3xl px-6 sm:py-2 py-4 flex flex-col sm:flex-row gap-5 items-center">
            <section className="flex gap-5 items-center w-full">
                <section className="flex flex-col w-full">
                    <h4 className="text-xl font-semibold">{type.name}</h4>
                    <h5 className="text-base text-on-surface-variant">{subtitle}</h5>
                </section>
                <IconButton icon='edit' href={`types/${type.id}/edit`}/>
                <DeleteEventTypeButton id={type.id}/>
            </section>
        </li>
    )
}