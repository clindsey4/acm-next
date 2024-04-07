'use client'

import { TextInputElement } from "@/components/input/text-input"
import { timeoutDebounce } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { useRef } from "react"

export function RoleSearchElement(
    {
        placeholder,
        defaultValue = ''
    }: {
        placeholder: string
        defaultValue?: string
    }
) {
    const timeout = useRef<NodeJS.Timeout>()
    const router = useRouter()

    function submit(value: string) {
        router.replace(`?search=${value}`)
    }

    return (
        <TextInputElement
            name='search'
            placeholder={placeholder}
            value={defaultValue}
            onValueChanged={newVal => {
                timeoutDebounce(timeout, 500, () => {
                    submit(newVal)
                })
            }}
        />
    )
}