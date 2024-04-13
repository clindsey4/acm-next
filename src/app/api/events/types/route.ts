import { deleteEventType } from "@/data/webData"
import { getActiveSession } from "@/lib/oauth"
import { createEventTypeMinAccessLevel } from "@/lib/utils"
import { cookies } from "next/headers"
import { NextRequest } from "next/server"

export async function DELETE(
    request: NextRequest
) {

    const params = request.nextUrl.searchParams

    // verify session
    const session = await getActiveSession(cookies())
    if (session === null || createEventTypeMinAccessLevel > session.user.accessLevel) return new Response(JSON.stringify({ message: `Unauthorized` }), { status: 401 })

    // get event type
    const rawEventTypeId = Number(params.get("id"))
    const eventTypeId = !isNaN(rawEventTypeId) ? rawEventTypeId : null
    if (eventTypeId === null) return new Response(JSON.stringify({ message: `Invalid event type ID.` }), { status: 400 })

    // delete attendance
    try {
        await deleteEventType(
            eventTypeId
        )
    } catch (error) {
        return new Response(JSON.stringify({ message: `Error when deleting event attendance.` }), { status: 500 })
    }

    return new Response(null, { status: 200 })
}