import { DefaultApi, createConfiguration } from '@onesignal/node-onesignal';
import { createContext, useContext } from 'react';

const clientContext = createContext<DefaultApi>({} as DefaultApi);

export const useClient = () => useContext(clientContext);

export const configuration = createConfiguration({
    appKey: process.env.ONESIGNAL_API_KEY
});

export const client = new DefaultApi(configuration);

export function OneSignalAPIProvider({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <clientContext.Provider value={client}>
            {children}
        </clientContext.Provider>
    )
}