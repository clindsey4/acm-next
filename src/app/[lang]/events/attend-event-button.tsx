'use client'

import { BaseButton } from "@/components/material/base-button"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function AttendEventButton(
    {
        eventId,
        text,
        className = ''
    }: {
        eventId: number
        text: string
        className?: string
    }
) {
    const router = useRouter()
    const [attending, setAttending] = useState(false)

    function onAttend() {
        // debounce
        if (attending) return
        setAttending(true)

        // perform the API request
        fetch(`/api/events/attend?id=${eventId}`, {
            method: "GET"
        }).then(response => response.status)
        .then(statusCode => {
            // redirect if the request was a success
            if (statusCode === 200) {
                router.refresh()
            }
            setAttending(false)
        })

    }

    return <BaseButton
        text={text}
        onClick={onAttend}
        className={className}
        disabled={attending}
    />
}