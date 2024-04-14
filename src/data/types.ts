import { Credentials } from "google-auth-library"

// general types
export enum Databases {
    WEB_DATA
}

export enum Pragma {
    DEFAULT
}

export type Id = number | bigint

export enum FilterDirection {
    DESCENDING,
    ASCENDING
}

export enum Semester {
    SPRING,
    FALL
}

// users types
export enum AccessLevel {
    NON_MEMBER,
    MEMBER,
    OFFICER,
    ADVISOR
}

export interface RawUser {
    email: string
    given_name: string
    family_name: string
    picture: string,
    access_level: number
}

export interface User {
    email: string
    givenName: string
    familyName: string
    picture: string,
    accessLevel: AccessLevel
}

export interface RawFilterUser extends RawUser {
    total_count: number
}

export interface UsersFilterParams {
    search?: string
    givenName?: string
    familyName?: string
    accessLevel?: number
    offset?: number
    maxEntries?: number
    direction?: FilterDirection
}

export interface UsersFilterResults {
    totalCount: number,
    results: User[]
}

// sessions types
export interface RawSession {
    token: string,
    email: string,
    google_tokens: string,
    expires: string
}

export interface Session {
    token: string,
    user: User,
    googleTokens: Credentials,
    expires: Date

}

//news types
export interface RawNews {
    id: number,
    title: string,
    subject: string | null,
    body: string,
    post_date: string,
    image_url: string | null
}

export interface News {
    id: number,
    title: string,
    subject: string | null,
    body: string,
    postDate: Date,
    imageURL: string | null
}

// event types types

export interface RawEventType {
    id: Id
    name: string
    points: number
    member_points: number
}

export interface EventType {
    id: Id
    name: string
    points: number
    memberPoints: number
}

// event types
export interface RawEvent {
    id: Id
    title: string
    body: string
    location: string
    start_date: string
    end_date: string
    type: number | null
    access_level: number
}

export interface RawFilterEvent extends RawEvent {
    total_count: number
}

export interface Event {
    id: Id
    title: string
    body: string
    location: string
    startDate: Date
    endDate: Date
    type: EventType | null
    accessLevel: AccessLevel
}

export interface EventFilterParams {
    fromDate?: Date
    toDate?: Date
    offset?: number
    minAccessLevel?: AccessLevel
    maxEntries?: number
    direction?: FilterDirection
}

export interface EventFilterResult {
    totalCount: number,
    results: Event[]
}

/* Event Attendance */
export interface RawEventAttendance {
    event_id: Id,
    user_email: string
}

export interface RawFilterEventAttendance extends RawEventAttendance{
    total_count: number
}

export interface EventAttendance {
    eventId: Id,
    userEmail: string
}

export interface EventsAttendanceFilterParams {
    eventIds?: Id[],
    userEmails?: string[],
    fromDate?: Date
    toDate?: Date
    offset?: number
    maxEntries?: number
    direction?: FilterDirection
}

export interface EventsAttendanceFilterResults {
    totalCount: number,
    results: EventAttendance[]
}

export interface EventsAttendancePointsFilterParams {
    eventIds?: Id[],
    userEmails?: string[],
    fromDate?: Date
    toDate?: Date
    type?: EventType
    offset?: number
    maxEntries?: number
    direction?: FilterDirection
}

export interface EventsAttendancePointsFilterResults {
    totalCount: number,
    results: EventsAttendancePointsFilterResult[]
}

export interface RawEventsAttendancePointsFilterResult {
    user_email: string,
    points: number,
    total_count: number
}

export interface EventsAttendancePointsFilterResult {
    user: User,
    points: number
}