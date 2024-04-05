import { DateFormatter } from "@/components/formatters/date-formatter";
import { DateFormatterMode } from "@/components/formatters/types";
import { Icon } from "@/components/material/icon";
import { Event } from "@/data/types";
import Link from "next/link";


export function FutureEventItem(
    {
        event
    }: {
        event: Event;
    }
) {
    return (
        <li className="w-full flex sm:flex-row flex-col gap-3 items-center py-3 px-5 rounded-2xl bg-surface-container">
            <Link href={`./events/${event.id}`} className="text-2xl font-semibold flex-1 hover:text-primary transition-colors">{event.title}</Link>
            <section className="flex gap-2 flex-row items-center">
                <Icon icon='calendar_month' />
                <h4 className="text-xl"><DateFormatter date={event.startDate} mode={DateFormatterMode.NARROW} /></h4>
            </section>
        </li>
    );
}
