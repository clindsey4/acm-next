import Image from "@/components/image"
import { Locale, getDictionary } from "@/localization"

export default async function JoinPage(
    {
        params
    }: {
        params: {
            lang: Locale
        }
    }
) {

    // get the language dictionary
    const langDict = await getDictionary(params.lang)

    return (
        <article className="flex flex-col gap-5 w-full">
            {/* Header */}
            <section className="flex gap-12 flex-col md:flex-row items-center">
                <ul className="flex flex-col gap-5 flex-1 justify-center">
                    <li><h1 className="text-on-surface md:text-5xl md:text-left text-center text-4xl font-bold text-wrap break-words">{langDict.join_title}</h1></li>
                    <li><h2 className="text-on-surface-variant text-2xl md:text-left text-center text-wrap break-words">{langDict.join_sub_title}</h2></li>
                </ul>
                <figure className="md:max-w-md w-full h-64">
                    <Image
                        src='/membership.jpg'
                        className="rounded-3xl object-cover h-full w-full"
                        alt={langDict.join_title}
                    />
                </figure>
            </section>

            {/* Benefits */}
            <h3 className="text-on-surface text-3xl font-bold mt-8 text-center">{langDict.join_benefits}</h3>
            <ul className="flex flex-col gap-5">
                <Benefit
                    title={langDict.join_benefit_shirt_title}
                    description={langDict.join_benefit_shirt_description}
                />
                <Benefit
                    title={langDict.join_benefit_points_title}
                    description={langDict.join_benefit_points_description}
                />
                <Benefit
                    title={langDict.join_benefit_support_title}
                    description={langDict.join_benefit_support_description}
                />
            </ul>

            {/* Get Started */}
            <section className="flex flex-col gap-3 mt-5">
                <h3 className="text-on-surface text-3xl font-bold text-center">{langDict.join_process}</h3>
                <h4 className="text-on-surface-variant text-2xl ">{langDict.join_process_fee}</h4>
                <h4 className="text-on-surface-variant text-2xl ">{langDict.join_process_details}</h4>
            </section>

        </article>
    )

}

function Benefit(
    {
        title,
        description
    }: {
        title: string,
        description: string
    }
) {
    return (
        <li className="p-5 rounded-3xl border border-outline-variant flex flex-col gap-2">
            <h2 className="text-2xl font-bold sm:text-left text-center">{title}</h2>
            <h3 className="text-on-surface-variant text-xl">{description}</h3>
        </li>
    )
}