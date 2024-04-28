import { Divider } from "@/components/material/divider";
import { FilledButton } from "@/components/material/filled-button";
import { PageHeader } from "@/components/page-header";
import { AccessLevel } from "@/data/types";
import { getDocument } from "@/data/webData";
import { getActiveSession } from "@/lib/oauth";
import { editAboutUsMinAccessLevel } from "@/lib/utils";
import { Locale, getDictionary } from "@/localization";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Markdown from "react-markdown";
import { EditAboutForm } from "./edit-about-form";

export default async function EditAboutPage(
    {
        params
    }: {
        params: {
            lang: Locale
        }
    }
) {
    // get about us doc
    const databaseMarkdown = await getDocument('about')
    // @ts-expect-error
    const defaultMarkdown = databaseMarkdown === '' || databaseMarkdown === null ? await import(`@/localization/docs/about.md`).then(module => module.default) : databaseMarkdown

    // get language dictionary
    const langDict = await getDictionary(params.lang)

    // get session
    const activeSession = await getActiveSession(cookies())
    const accessLevel = activeSession === null ? AccessLevel.NON_MEMBER : activeSession.user.accessLevel

    if (editAboutUsMinAccessLevel > accessLevel) return redirect("./")

    return (
        <article className="w-full flex flex-col gap-5">
            <EditAboutForm value={defaultMarkdown}/>
        </article>
    )
}