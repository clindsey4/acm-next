'use client'

import { CustomSelectInput } from "@/components/input/custom-select-input"
import { useLocale } from "@/components/providers/language-dict-provider"
import { Semester } from "@/data/types"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function AttendanceFilters(
    {
        defaultSemester,
        defaultYear,
        maxYear = new Date().getFullYear(),
        minYear = 2024
    }: {
        defaultSemester: Semester,
        defaultYear: number,
        maxYear?: number
        minYear?: number
    }
) {
    // states
    const [semester, setSemester] = useState(defaultSemester)
    const [year, setYear] = useState(Math.min(maxYear, Math.max(minYear, defaultYear)))

    const router = useRouter()
    const langDict = useLocale()

    // generate year options
    const yearOptions: string[] = []

    for (let i = maxYear; i >= minYear; i--) {
        yearOptions.push(i.toString())
    }

    function updateRouter(
        newSemester: Semester = semester,
        newYear: number = year
    ) {
        router.replace(`?semester=${newSemester}&year=${newYear}`)
    }

    // effects
    useEffect(() => {
        
    }, [semester, year])

    return (
        <ul className="md:w-fit w-full flex lg:flex-row flex-col gap-5">
            {/* Semester */}
            <CustomSelectInput
                value={semester}
                options={[
                    langDict.spring,
                    langDict.fall
                ]}
                icon="school"
                modalClassName="top-14"
                onValueChanged={newValue => {
                    setSemester(newValue)
                    updateRouter(newValue)
                }}
            />

            {/* Year */}
            <CustomSelectInput
                value={(maxYear - year)}
                options={yearOptions}
                icon="calendar_month"
                modalClassName="top-14"
                onValueChanged={newValue => {
                    const newYear = maxYear - newValue
                    setYear(newYear)
                    updateRouter(undefined, newYear)
                }}
            />
        </ul>
    )
}