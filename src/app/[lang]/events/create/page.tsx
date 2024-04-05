import { AccessLevel } from "@/data/types";
import { getActiveSession } from "@/lib/oauth";
import { cookies } from "next/headers";
import { createEventMinAccessLevel } from "@/lib/utils";
import { redirect } from "next/navigation";
import { EventForm } from "../form";
import { SelectInputOption } from "@/components/input/select-input";
import { getAllEventTypes } from "@/data/webData";
import { Locale, getDictionary } from "@/localization";
import { CreateEventForm } from "./create-event-form";

export default async function CreateEventPage(
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

    if (createEventMinAccessLevel > accessLevel) return redirect('./')

    // get lang dict
    const langDict = await getDictionary(params.lang)

    // get event types
    const eventTypeOptions: SelectInputOption[] = []
    const types = await getAllEventTypes()

    for (const event of types) {
        eventTypeOptions.push({
            name: event.name,
            value: String(event.id)
        })
    }

    return (
        <article className="w-full flex flex-col gap-5">
            <CreateEventForm
                eventTypeOptions={eventTypeOptions}
            />
        </article>
    )
}
