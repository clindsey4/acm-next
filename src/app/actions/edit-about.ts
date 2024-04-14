'use server'
import { AccessLevel } from "@/data/types"
import { updateDocument } from "@/data/webData"
import { getActiveSession } from "@/lib/oauth"
import { editAboutUsMinAccessLevel } from "@/lib/utils"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export interface EditAboutActionState {
    error?: string
}

export async function editAbout(prevState: EditAboutActionState, formData: FormData) {
    const session = await getActiveSession(cookies())
    const accessLevel = session ? session.user.accessLevel : AccessLevel.NON_MEMBER

    if (editAboutUsMinAccessLevel > accessLevel) return {
        error: "Unauthorized"
    } as EditAboutActionState

    const newValue = formData.get('value')

    if (!newValue) return {
        error: "Invalid Input"
    } as EditAboutActionState

    // try to update the about us document entry
    let redirectTo = ''
    try {
        updateDocument('about', newValue.toString())
        redirectTo = `./`
    } catch( error: any ) {
        console.log(error)
        return {
            error: error?.message || 'Error when updating about us page.'
        } as EditAboutActionState
    }

    // redirect if allowed
    redirect(redirectTo)
}