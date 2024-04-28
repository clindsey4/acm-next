import { Divider } from "@/components/material/divider";
import { FilledButton } from "@/components/material/filled-button";
import { PageHeader } from "@/components/page-header";
import { AccessLevel } from "@/data/types";
import { getDocument } from "@/data/webData";
import { getActiveSession } from "@/lib/oauth";
import { editAboutUsMinAccessLevel } from "@/lib/utils";
import { Locale, getDictionary } from "@/localization";
import { cookies } from "next/headers";
import Markdown from "react-markdown";

export default async function About(
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
    const markdown = databaseMarkdown === '' || databaseMarkdown === null ? await import(`@/localization/docs/about.md`).then(module => module.default) : databaseMarkdown

    // get language dictionary
    const langDict = await getDictionary(params.lang)

    // get session
    const activeSession = await getActiveSession(cookies())
    const accessLevel = activeSession === null ? AccessLevel.NON_MEMBER : activeSession.user.accessLevel

    return (
        <article className="w-full flex flex-col gap-5">
            <PageHeader 
                text={langDict.nav_about}
                actions={accessLevel >= editAboutUsMinAccessLevel ? <FilledButton href='./about/edit' text={langDict.event_edit}/> : undefined}
            />
            <Divider/>
            <Markdown className='prose prose-xl prose-material break-words w-full max-w-full'>{markdown}</Markdown>
        </article>
    )
}