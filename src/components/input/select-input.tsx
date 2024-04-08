'use client'

import { ChangeEvent, useState } from "react"

export interface SelectInputOption {
    value: string
    name: string
}

export function SelectInput(
    {
        name,
        options,
        required = false,
        value,
        className = '',
        onValueChanged
    }: {
        name: string
        options: SelectInputOption[]
        required?: boolean
        value?: number
        className?: string
        onValueChanged?: (newValue: string) => void
    }
) {
    const [formValue, setValue] = useState(String(value) || "0")

    return (
        <select
            name={name}
            className={`text-lg text-on-surface px-5 py-2 bg-surface-container rounded-full border-r-8 border-surface-container ${className}`}
            required={required}
            value={formValue}
            onChange={event => {
                const newValue = event.target.value
                setValue(newValue)
                if (onValueChanged) onValueChanged(newValue)
            }}
        >
            {options.map(option => (
                <option value={option.value} key={option.value}>{option.name}</option>
            ))}
        </select>
    )
}