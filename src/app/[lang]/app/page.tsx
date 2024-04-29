import Image from "@/components/image"
import { FilledButton } from "@/components/material/filled-button"
import { Locale, getDictionary } from "@/localization"

const download_href = "https://github.com/djimenezmsu/acmNative/releases/latest/download/universal-android-release.apk"

export default async function AppPage(
    {
        params
    }: {
        params: {
            lang: Locale
        }
    }
) {
    const langDict = await getDictionary(params.lang)

    return (
        <article className="flex flex-col gap-10 w-full">
            {/* Header */}
            <section className="flex gap-12 flex-col lg:flex-row items-center">
                <figure className="md:w-[434px] md:h-[464px] w-[342px] h-[350px] relative">
                    <div className="bg-primary rounded-3xl md:w-[202px] md:h-[408px] w-[161px] h-[326px] absolute top-0"/>
                    <Image
                        src='/mobile-screenshot-2.png'
                        className="rounded-3xl object-cover md:w-[202px] md:h-[408px] w-[161px] h-[326px] border border-outline-variant absolute md:top-7 md:left-[232px] top-3 left-[181px] drop-shadow-md"
                        alt={langDict.join_title}
                    />
                    <Image
                        src='/mobile-screenshot.png'
                        className="rounded-3xl object-cover md:w-[202px] md:h-[408px] w-[161px] h-[326px] border border-outline-variant absolute md:top-14 md:left-[116px] top-6 left-[91px] drop-shadow-xl"
                        alt={langDict.join_title}
                    />
                </figure>
                <ul className="flex flex-col gap-5 flex-1 justify-center lg:items-end items-center">
                    <li><h1 className="text-on-surface lg:text-5xl lg:text-right text-center text-4xl font-bold text-wrap break-words">{langDict.app_title}</h1></li>
                    <li><h2 className="text-on-surface-variant text-2xl lg:text-right text-center text-wrap break-words">{langDict.app_sub_title}</h2></li>
                    <li className="w-fit"><FilledButton icon='download' text={langDict.app_download} href={download_href}/></li>
                </ul>
            </section>

            {/* Features */}
            <section className="mt-16">
                <h3 className="text-on-surface text-3xl font-bold mb-3 md:text-left text-center">{langDict.app_features}</h3>
                <ul className="flex flex-col gap-5">
                    <Feature
                        title={langDict.app_features_push_title}
                        description={langDict.app_features_push_description}
                    />
                    <Feature
                        title={langDict.app_features_view_title}
                        description={langDict.app_features_view_description}
                    />
                    <Feature
                        title={langDict.app_features_speed_title}
                        description={langDict.app_features_speed_description}
                    />
                </ul>
            </section>

            {/* Download */}
            <section>
                <h3 className="text-on-surface text-3xl font-bold mb-3 md:text-left text-center">{langDict.app_download}</h3>
                <h4 className="text-on-surface-variant text-xl mb-4 md:text-left text-center">{langDict.app_download_sub_title}</h4>
                <FilledButton icon='download' text={langDict.app_download} href={download_href} className="w-fit m-auto"/>
            </section>               
        
        </article>        
    )
}

function Feature(
    {
        title,
        description
    }: {
        title: string,
        description: string
    }
) {
    return (
        <li className="px-5 py-3 rounded-3xl border border-outline-variant flex flex-col gap-2">
            <h2 className="text-xl font-bold sm:text-left text-center">{title}</h2>
            <h3 className="text-on-surface-variant text-lg">{description}</h3>
        </li>
    )
}