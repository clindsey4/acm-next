'use client'
import { updateAccessLevel } from "@/app/actions/update-access-level";
import { SelectInput, SelectInputOption } from "@/components/input/select-input";
import { AccessLevel } from "@/data/types";

export function RoleChanger(
    {
        email,
        options,
        defaultValue
    }: {
        email: string,
        options: SelectInputOption[],
        defaultValue: AccessLevel
    }
) {
    return (
        <SelectInput
            name='accessLevel'
            options={options}
            value={defaultValue}
            className="bg-surface-container-high border-surface-container-high w-full"
            onValueChanged={async (newValue) => {
                const result = await updateAccessLevel(email, newValue)
                console.log(result)
            }}
        />
    )
}