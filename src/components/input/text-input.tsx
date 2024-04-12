'use client'

import { useState } from "react"
import { MinimalIconButton } from "../material/minimal-icon-button"

export function TextInputElement(
    {
        name,
        placeholder,
        required = false,
        maxLength,
        value,
        onValueChanged,
        className = ''
    }: {
        name: string,
        placeholder: string,
        required?: boolean,
        maxLength?: number
        value?: string
        onValueChanged?: (newValue: string) => void
        className?: string
    }
) {
    const [formValue, setValue] = useState(value || '')

    function updateValue(newValue: string) {
        setValue(newValue)
        if (onValueChanged)
            onValueChanged(newValue)
    }

    return (
        <div className="bg-surface-container rounded-full flex gap-5 items-center px-5 md:w-auto w-full">
            <input
                type='text'
                className={`w-full text-lg text-primary font-bold placeholder:font-normal placeholder:text-on-surface-variant py-2 bg-transparent rounded-full outline-none ${className}`}
                name={name}
                value={formValue}
                placeholder={placeholder}
                required={required}
                maxLength={maxLength}
                onChange={(event) => updateValue(event.target.value)}
            />
            {formValue === '' ? undefined : <MinimalIconButton icon='close' onClick={_ => updateValue('')}/>}
        </div>

    )
}