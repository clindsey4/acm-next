'use server'
import { AccessLevel } from "@/data/types"
import { getEventType, updateEventType } from "@/data/webData"
import { getActiveSession } from "@/lib/oauth"
import { createEventTypeMinAccessLevel } from "@/lib/utils"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { EventTypeActionState } from "./create-event-type"

export async function editEventType(prevState: EventTypeActionState, formData: FormData) {
    
    const session = await getActiveSession(cookies())
    const accessLevel = session ? session.user.accessLevel : AccessLevel.NON_MEMBER

    if (createEventTypeMinAccessLevel > accessLevel) return {
        error: "Unauthorized"
    } as EventTypeActionState

    // get event
    const eventTypeId = Number(formData.get("id"))
    const eventType = !isNaN(eventTypeId) ? await getEventType(eventTypeId) : null
    if (eventType === null) return {
        error: "Provided event type ID is invalid."
    } as EventTypeActionState

    // get the formdata
    const formFields = {
        name: formData.get('name'),
        points: formData.get('points'),
        memberPoints: formData.get('member-points')
    }

    // try to insert the new event type into the database
    let redirectTo = ''
    try {
        await updateEventType({
            id: eventTypeId,
            name: formFields.name ? formFields.name.slice(0, 128).toString() : undefined,
            points: formFields.points ? Math.max(0, Math.min(100, Number.parseInt(formFields.points.toString()) || 0)) : undefined,
            memberPoints: formFields.memberPoints ? Math.max(0, Math.min(100, Number.parseInt(formFields.memberPoints.toString()) || 0)) || 0 : undefined
        })
        redirectTo = `../`
    } catch( error: any ) {
        console.log(error)
        return {
            error: error?.message || 'Error when creating event type.'
        } as EventTypeActionState
    }

    // redirect if allowed
    redirect(redirectTo)
}