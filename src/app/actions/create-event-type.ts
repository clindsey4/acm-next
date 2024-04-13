'use server'
import { AccessLevel } from "@/data/types"
import { getAllEventTypes, insertEventType } from "@/data/webData"
import { getActiveSession } from "@/lib/oauth"
import { createEventTypeMinAccessLevel } from "@/lib/utils"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export interface EventTypeActionState {
    error?: string
}

const maximumEventTypesCount = 15

export async function createEventType(prevState: EventTypeActionState, formData: FormData) {
    
    const session = await getActiveSession(cookies())
    const accessLevel = session ? session.user.accessLevel : AccessLevel.NON_MEMBER

    if (createEventTypeMinAccessLevel > accessLevel) return {
        error: "Unauthorized"
    } as EventTypeActionState

    // check if event types has exceeded the maximum amount
    const types = await getAllEventTypes()
    if (types.length > maximumEventTypesCount) return {
        error: `Can have no more than ${maximumEventTypesCount} event types.`
    } as EventTypeActionState

    // get the formdata
    const formFields = {
        name: formData.get('name'),
        points: formData.get('points'),
        memberPoints: formData.get('member-points')
    }

    // verify that required fields aren't missing
    if (!formFields.name || !formFields.points || !formFields.memberPoints ) return {
        error: 'Missing input fields.'
    } as EventTypeActionState

    // try to parse the points
    const rawPoints = Number.parseInt(formFields.points.toString())
    const points = !isNaN(rawPoints) ? rawPoints : 0

    const rawMemberPoints = Number.parseInt(formFields.memberPoints.toString())
    const memberPoints = !isNaN(rawMemberPoints) ? rawMemberPoints : 0

    // try to insert the new event type into the database
    let redirectTo = ''
    try {
        await insertEventType({
            name: formFields.name.slice(0, 128).toString(),
            points: Math.max(0, Math.min(100, points)),
            memberPoints: Math.max(0, Math.min(100, memberPoints))
        })
        redirectTo = `./`
    } catch( error: any ) {
        console.log(error)
        return {
            error: error?.message || 'Error when creating event type.'
        } as EventTypeActionState
    }

    // redirect if allowed
    redirect(redirectTo)
}