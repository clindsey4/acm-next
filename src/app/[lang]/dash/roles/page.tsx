import { PageHeader } from "@/components/page-header";
import { filterUsers } from "@/data/webData";
import { Locale, getDictionary } from "@/localization";
import { PageSelector } from "@/components/page-selector";
import { Divider } from "@/components/material/divider";
import { getActiveSession } from "@/lib/oauth";
import { cookies } from "next/headers";
import { dashboardMinAccessLevel } from "@/lib/utils";
import { redirect } from "next/navigation";
import { UserListItem } from "@/components/events/user-list-item";
import { RoleSearchElement } from "./role-search-element";
import { RoleChanger } from "./role-changer";
import { SelectInputOption } from "@/components/input/select-input";
import { AccessLevel } from "@/data/types";
import { MapAccessLevelToDictKey } from "@/localization/locale-maps";

const entriesPerPage = 50; // how many users to display per page

export default async function RolesPage(
    {
        params,
        searchParams
    }: {
        params: {
            lang: Locale
        }
        searchParams: {
            search: string
            page: string
        }
    }
) {
    const lang = params.lang
    // get the current session
    const session = await getActiveSession(cookies())
    const sessionAccessLevel = session ? session.user.accessLevel : AccessLevel.NON_MEMBER

    // redirect if the user is not able to view any account
    if (!session || dashboardMinAccessLevel > sessionAccessLevel) return redirect(`/${lang}`)

    const langDict = await getDictionary(lang)

    // parse search params
    const currentPage = Math.max(Number.parseInt(searchParams.page) || 0, 0) // parse the page search parameter, ensuring that it is >= 1
    const currentOffset = currentPage * entriesPerPage

    // get a list of every advisor
    const users = await filterUsers({
        search: searchParams.search,
        maxEntries: entriesPerPage,
        offset: currentOffset
    })

    // options
    const roleOptions: SelectInputOption[] = [
        {
            name: langDict.access_level_officer,
            value: AccessLevel.OFFICER.toString(),
        },
        {
            name: langDict.access_level_member,
            value: AccessLevel.MEMBER.toString(),
        },
        {
            name: langDict.access_level_non_member,
            value: AccessLevel.NON_MEMBER.toString(),
        },
    ]
    if (sessionAccessLevel >= AccessLevel.ADVISOR) {
        roleOptions.push({
            name: langDict.access_level_advisor,
            value: AccessLevel.ADVISOR.toString(),
        })
    }

    return (
        <>
            <PageHeader
                text={langDict.dash_roles_title}
                actions={<RoleSearchElement
                    placeholder={langDict.dash_roles_search}
                    defaultValue={searchParams.search}
                />}
            />
            <Divider className="mt-5"/>
            <ul className="flex flex-col gap-5 mt-5 mb-5 min-h-screen">
                {users.totalCount > 0 ? users.results.map(user => <UserListItem
                    key={user.email}
                    user={user}
                    href={`/${lang}/account/${user.email.split('@')[0]}`}
                    action={(user.email === session.user.email || user.accessLevel > sessionAccessLevel) ? <h4 className="text-xl text-right mr-3">{langDict[MapAccessLevelToDictKey[user.accessLevel]]}</h4>
                        : <RoleChanger
                            email={user.email}
                            options={roleOptions}
                            defaultValue={user.accessLevel}
                        />
                    }
                />) : <li><h3 className="text-3xl font-semibold text-center w-full">{langDict.dash_roles_empty}</h3></li>}
            </ul>
            <PageSelector
                currentOffset={currentOffset}
                totalCount={users.totalCount}
                pageSize={entriesPerPage}
                href=''
            />
        </>
    )
}