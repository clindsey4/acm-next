import { CreateEventTypeForm } from "./create-event-type-form";
import { createEventTypeMinAccessLevel } from "@/lib/utils";
import { redirect } from "next/navigation";
import { AccessLevel } from "@/data/types";
import { getActiveSession } from "@/lib/oauth";
import { cookies } from "next/headers";

export default async function CreateEventTypePage() {

    // get session & access level
    const session = await getActiveSession(cookies())
    const accessLevel = session ? session.user.accessLevel : AccessLevel.NON_MEMBER

    if (createEventTypeMinAccessLevel > accessLevel) return redirect('/')

    return (
        <CreateEventTypeForm/>
    )
}