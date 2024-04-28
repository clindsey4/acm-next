'use client'

import { useState } from "react"
import { MinimalIconButton } from "../material/minimal-icon-button"

export function NumberInputElement(
    {
        name,
        placeholder,
        required = false,
        minValue,
        maxValue,
        value,
        onValueChanged,
        className = ''
    }: {
        name: string,
        placeholder: string,
        required?: boolean,
        minValue?: number
        maxValue?: number
        value?: number
        onValueChanged?: (newValue: string) => void
        className?: string
    }
) {
    const [formValue, setValue] = useState(value !== undefined ? value.toString() : '')

    function updateValue(newValue: string) {
        setValue(newValue)
        if (onValueChanged)
            onValueChanged(newValue)
    }

    return (
        <div className="bg-surface-container rounded-full flex gap-5 items-center px-5 md:w-auto w-full">
            <input
                type='number'
                className={`w-full text-lg text-primary font-bold placeholder:font-normal placeholder:text-on-surface-variant py-2 bg-transparent rounded-full outline-none ${className}`}
                name={name}
                value={formValue}
                placeholder={placeholder}
                required={required}
                min={minValue}
                max={maxValue}
                onChange={(event) => updateValue(event.target.value)}
            />
            {formValue === '' ? undefined : <MinimalIconButton icon='close' onClick={event => {
                event.preventDefault()
                updateValue('0')
            }} />}
        </div>

    )
}