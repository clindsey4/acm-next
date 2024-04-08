'use server'

import { AccessLevel } from "@/data/types"
import { getUser, updateUser } from "@/data/webData"
import { getActiveSession } from "@/lib/oauth"
import { dashboardMinAccessLevel } from "@/lib/utils"
import { cookies } from "next/headers"
import { EventActionState } from "./create-event"

export async function updateAccessLevel(email: string, accessLevel: string) {

    const session = await getActiveSession(cookies())
    const sessionAccessLevel = session ? session.user.accessLevel : AccessLevel.NON_MEMBER

    if (!session || dashboardMinAccessLevel > sessionAccessLevel) return {
        error: "Unauthorized"
    } as EventActionState

    // get event
    const user = email ? await getUser(email.toString()) : null
    if (user === null || session.user.email === user.email) return {
        error: "Provided email is invalid."
    } as EventActionState

    // try to parse the access_level
    const newAccessLevel = accessLevel ? Math.max(0, Number.parseInt(accessLevel)) : null
    if (newAccessLevel === null || newAccessLevel > sessionAccessLevel) return {
        error: "Invalid access level provided."
    } as EventActionState

    // try to insert the new event into the database
    try {
        await updateUser({
            email: user.email,
            accessLevel: newAccessLevel
        })
    } catch( error: any ) {
        return {
            error: error?.message || 'Error when creating event.'
        } as EventActionState
    }

    return {} as EventActionState
}