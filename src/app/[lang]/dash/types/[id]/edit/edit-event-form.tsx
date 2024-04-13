'use client'

import { useLocale } from "@/components/providers/language-dict-provider"
import { EventTypeForm, EventTypeFormValues } from "../../event-type-form"
import { editEventType } from "@/app/actions/edit-event-type"

export function EditEventTypeForm(
    {
        backHref,
        values
    }: {
        backHref: string
        values: EventTypeFormValues
    }
) {
    const langDict = useLocale()
    return <EventTypeForm
        backHref={backHref}
        title={langDict.dash_edit_type_title.replace(":name", values.name || '')}
        values={values}
        actionText={langDict.edit_event_save}
        action={editEventType}
    />
}