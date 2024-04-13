'use client'
import { EventTypeActionState } from "@/app/actions/create-event-type"
import { InputSection } from "@/components/input/input-section"
import { NumberInputElement } from "@/components/input/number-input"
import { TextInputElement } from "@/components/input/text-input"
import { Divider } from "@/components/material/divider"
import { FilledButton } from "@/components/material/filled-button"
import { IconButton } from "@/components/material/icon-button"
import { PageHeader } from "@/components/page-header"
import { useLocale } from "@/components/providers/language-dict-provider"
import { useFormState, useFormStatus } from "react-dom"

const initialFormState = {
    error: undefined
} as EventTypeActionState

export interface EventTypeFormValues {
    id?: number,
    name?: string,
    points?: number,
    memberPoints?: number
}

export function EventTypeForm(
    {
        title,
        values,
        actionText,
        action,
        backHref = './'
    }: {
        title: string
        values: EventTypeFormValues
        actionText: string,
        action: (prevState: EventTypeActionState, formData: FormData) => Promise<EventTypeActionState>
        backHref?: string,
    }
) {
    const [formState, formAction] = useFormState(action, initialFormState)
    const { pending } = useFormStatus()
    const langDict = useLocale()

    return (
        <form className="flex flex-col gap-5 w-full" action={formAction}>
            <input type='text' name='id' value={values.id} hidden />
            <PageHeader
                text={title}
                preText={<IconButton icon='arrow_back' href={backHref}/>}
                actions={<FilledButton className="w-full md:w-fit sm:flex hidden" text={actionText} disabled={pending} />}
            />
            <Divider />

            {/* Error */}
            {formState.error ? <h2 className="text-2xl rounded-2xl px-5 py-3 bg-error font-bold text-on-error">{formState.error}</h2> : undefined}

            {/* Name Input */}
            <InputSection title={langDict.dash_create_type_name}>
                <TextInputElement
                    name='name'
                    placeholder={langDict.dash_create_type_name}
                    maxLength={128}
                    value={values.name}
                    required
                />
            </InputSection>

            {/* Points Input */}
            <InputSection title={langDict.dash_create_type_points}>
                <NumberInputElement
                    name='points'
                    placeholder={'0'}
                    minValue={0}
                    maxValue={100}
                    value={values.points}
                    required
                />
            </InputSection>

            {/* Member Input */}
            <InputSection title={langDict.dash_create_type_member_points}>
                <NumberInputElement
                    name='member-points'
                    placeholder={'0'}
                    minValue={0}
                    maxValue={100}
                    value={values.memberPoints}
                    required
                />
            </InputSection>

            <section className="flex sm:hidden flex-col gap-5 w-full">
                <Divider />
                <FilledButton className="w-full" text={actionText} disabled={pending} />
            </section>

        </form>
    )
}