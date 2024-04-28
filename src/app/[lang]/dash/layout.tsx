import { DashboardNavigation } from "@/components/dashboard/dash_nav";
import { Icon } from "@/components/material/icon";
import { Locale, getDictionary } from "@/localization";
import Link from "next/link";

export default async function Layout(
    {
        children,
        params
    }: {
        children: React.ReactNode;
        params: {
            lang: Locale
        }
    }
) {
    const lang = params.lang

    return (
        <article className="flex flex-col md:grid md:grid-cols-dashboard gap-8 w-full">
            <aside className="w-full px-3 py-5 rounded-3xl bg-surface-container h-fit">
                <DashboardNavigation lang={lang}/>
            </aside>
            <section className="w-full">
                {children}
            </section>
        </article>
    );
}