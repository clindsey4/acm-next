'use client'
import { EditAboutActionState, editAbout } from "@/app/actions/edit-about"
import { MarkdownInput } from "@/components/input/markdown-input"
import { Divider } from "@/components/material/divider"
import { FilledButton } from "@/components/material/filled-button"
import { PageHeader } from "@/components/page-header"
import { useLocale } from "@/components/providers/language-dict-provider"
import { useFormState, useFormStatus } from "react-dom"

const initialFormState = {
    error: undefined
} as EditAboutActionState

export function EditAboutForm(
    {
        value,
    }: {
        value: string,
    }
) {
    const [formState, formAction] = useFormState(editAbout, initialFormState)
    const { pending } = useFormStatus()
    const langDict = useLocale()

    return (
        <form className="flex flex-col gap-5 w-full" action={formAction}>
            <PageHeader
                text={langDict.edit_about_title}
                actions={<FilledButton className="w-full md:w-fit" text={langDict.edit_event_save} icon='save' disabled={pending} />}
            />
            <Divider />

            {/* Error */}
            {formState.error ? <h2 className="text-2xl rounded-2xl px-5 py-3 bg-error font-bold text-on-error">{formState.error}</h2> : undefined}

            {/* Body Section */}
            <MarkdownInput
                title={langDict.edit_about_markdown}
                name='value'
                value={value}
            />

        </form>
    )
}