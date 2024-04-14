export function PageHeader(
    {
        text,
        preText,
        subtitle,
        actions
    }: {
        text: string
        preText?: React.ReactNode
        subtitle?: React.ReactNode
        actions?: React.ReactNode
    }
) {
    return (
        <section className="w-full flex flex-col md:flex-row gap-5 items-end">
            <section className="w-full flex flex-col gap-5 flex-1 items-center md:items-start">
                <section className="flex gap-5 items-center">
                    {preText}
                    <h1 className="text-on-surface md:text-5xl text-4xl font-bold text-wrap break-words">{text}</h1>
                </section>

                {subtitle}
            </section>
            {actions}
        </section>
    )
}