'use client'

import { useLocale } from "@/components/providers/language-dict-provider"
import { createEventType } from "@/app/actions/create-event-type"
import { EventTypeForm } from "../event-type-form"

export function CreateEventTypeForm() {
    const langDict = useLocale()
    return <EventTypeForm
        title={langDict.dash_create_type_title}
        values={{}}
        actionText={langDict.new_event_create}
        action={createEventType}
    />
}