import { AccessLevel } from "@/data/types";
import { LanguageDictionaryKey } from ".";

export const MapAccessLevelToDictKey: { [key in AccessLevel]: LanguageDictionaryKey } = {
    [AccessLevel.NON_MEMBER]: 'access_level_non_member',
    [AccessLevel.MEMBER]: 'access_level_member',
    [AccessLevel.OFFICER]: 'access_level_officer',
    [AccessLevel.ADVISOR]: 'access_level_advisor'
}