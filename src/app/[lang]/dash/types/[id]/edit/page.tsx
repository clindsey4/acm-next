import { AccessLevel } from "@/data/types";
import { getActiveSession } from "@/lib/oauth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SelectInputOption } from "@/components/input/select-input";
import { getAllEventTypes, getEvent, getEventType } from "@/data/webData";
import { createEventTypeMinAccessLevel } from "@/lib/utils";
import { Locale } from "@/localization";
import { EditEventTypeForm } from "./edit-event-form";

export default async function EditEventPage(
    {
        params,
    }: {
        params: {
            lang: Locale
            id: string
        }
    }
) {
    // get session & access level
    const session = await getActiveSession(cookies())
    const accessLevel = session ? session.user.accessLevel : AccessLevel.NON_MEMBER

    if (createEventTypeMinAccessLevel > accessLevel) return redirect('/')

    const lang = params.lang
    
    // get the event
    const eventTypeId = Number(params.id)
    const eventType = !isNaN(eventTypeId) ? await getEventType(eventTypeId) : null
    if (eventType === null) return redirect(`${lang}/dash/types`) // if the event doesn't exist, simply redirect to the events page.

    return (
        <article className="w-full flex flex-col gap-5">
            <EditEventTypeForm
                backHref={`/${lang}/dash/types`}
                values={{
                    id: Number(eventType.id),
                    name: eventType.name,
                    points: eventType.points,
                    memberPoints: eventType.memberPoints
                }}
            />
        </article>
    )
}
