'use client'

import { useEffect, useRef, useState } from "react"
import { Icon } from "../material/icon"
import { FadeInOut } from "../transitions/fade-in-out"

export function CustomSelectInput(
    {
        value,
        options,
        icon,
        modalClassName = 'bottom-3',
        optionSubtitles,
        onValueChanged = () => { }
    }: {
        value: number,
        options: string[],
        icon: string
        modalClassName?: string
        optionSubtitles?: string[]
        onValueChanged?: (newValue: number) => void
    }
) {
    const [modalOpen, setModalOpen] = useState(false)

    // refs
    const buttonRef = useRef<HTMLButtonElement>(null)
    const modalRef = useRef<HTMLUListElement>(null)

    // functions
    function setValue(newValue: number) {
        setModalOpen(false)
        if (newValue !== value && onValueChanged) onValueChanged(newValue)
    }

    /* clicking outside of the modal closes the modal */
    useEffect(() => {
        function handleClick(event: MouseEvent) {
            if (!buttonRef.current?.contains(event.target as Node) && !modalRef.current?.contains(event.target as Node)) {
                setModalOpen(false);
            }
        }
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, [modalOpen]);

    return (
        <ul className="flex flex-col items-center">
            <FadeInOut visible={modalOpen} className="z-10">
                <li className="relative w-0 h-0">
                    <ul className={`absolute w-48 -left-24 shadow-md flex flex-col gap-2 rounded-2xl bg-surface-container-high p-2 max-h-52 overflow-x-hidden overflow-y-scroll ${modalClassName}`}>
                        {options.map((option, index) => {
                            return (
                                <li key={index}>
                                    <button
                                        className="w-full text-lg text-center transition-colors hover:bg-surface-container-highest rounded-2xl py-1"
                                        onClick={(event) => {
                                            event.preventDefault()
                                            setValue(index)
                                        }}
                                    >
                                        {option}
                                        {optionSubtitles ? <h4 className="text-base text-on-surface-variant">{optionSubtitles[index]}</h4> : undefined}
                                    </button>
                                </li>
                            )
                        })}
                    </ul>
                </li>
            </FadeInOut>
            <li>
                <button
                    ref={buttonRef}
                    className="text-lg text-on-surface px-4 py-2 border-outline-variant border bg-transparent rounded-2xl flex gap-3 justify-center items-center"
                    onClick={(_) => {
                        setModalOpen(!modalOpen)
                    }}
                >
                    <Icon icon={icon} />
                    <h3 className="text-lg">{options[value]}</h3>
                    <Icon icon="unfold_more" />
                </button>
            </li>
        </ul>
    )

}