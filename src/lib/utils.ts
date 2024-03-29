import { Event, Semester } from "@/data/types"

export function dateToDateInputValue(
    date: Date
): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')

    return `${year}-${month}-${day}T${hours}:${minutes}`
}

export function isEventInProgress(
    event: Event
) {
    const dateTimeNow = new Date()
    return dateTimeNow >= event.startDate && event.endDate > dateTimeNow
}

/**
 * Gets the semester that a provided date is in.
 * 
 * @param date The date to check the semester of. Is the current date by default.
 * @returns The semester that the provided date was in.
 */
export function getSemester(
    date: Date = new Date()
): Semester {
    return date.getMonth() >= 6 ? Semester.FALL : Semester.SPRING
}

/**
 * Changes a date in-place to be at the start of the provided semester.
 * 
 * @param semester The semester to change the date to the start of
 * @param date The date to change in-place
 * @returns The date.
 */
export function getMinimumSemesterDate(
    semester: Semester,
    date: Date = new Date()
): Date {
    date.setDate(1)
    date.setMonth(semester === Semester.SPRING ? 0 : 6)
    date.setHours(0, 0, 0, 0)
    return date
}

/**
 * Changes a date in-place to be at the end of the provided semester.
 * 
 * @param semester The semester to change the date to the end of
 * @param date The date to change in-place
 * @returns The date.
 */
export function getMaximumSemesterDate(
    semester: Semester,
    date: Date = new Date()
): Date {
    // June 30th is the end of the Spring semester, December 31st is the end of the Winter semester
    date.setDate(semester === Semester.SPRING ? 30 : 31)
    date.setMonth(semester === Semester.SPRING ? 5 : 11)
    date.setHours(23,59,59, 0)

    return date
}