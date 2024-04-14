'use client'

import { IconButton } from "@/components/material/icon-button"
import { Id } from "@/data/types"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function DeleteEventTypeButton(
    {
        id,
    }: {
        id: Id
    }
) {
    const router = useRouter()
    const [deleting, setDeleting] = useState(false)

    function onDelete() {
        // debounce
        if (deleting) return
        setDeleting(true)

        // perform the API request
        fetch(`/api/events/types?id=${id}`, {
            method: "DELETE"
        }).then(response => response.status)
        .then(statusCode => {
            // redirect if the request was a success
            if (statusCode === 200) {
                router.refresh()
            }
            setDeleting(false)
        })

    }

    return <IconButton
        icon="delete"
        onClick={onDelete}
    />
}