/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import { AuthContext } from './AuthContext';
import React, { useCallback, useEffect, useState } from 'react';
import { AuthClient, AuthClientError, AuthClientEvent, AuthClientInitOptions } from './client/AuthClient';

interface Props {
    client: AuthClient;
    initOptions?: AuthClientInitOptions;
}

export const AuthProvider: React.FC<Props> = ({ children, client: _client, initOptions }) => {
    const [initialized, setInitialized] = useState(false);
    const [authenticated, setAuthenticated] = useState(false);
    const [client, setClient] = useState<AuthClient>();

    if (!process.env.BASE_URL) {
        throw new Error('BASE_URL is not defined');
    }

    const defaultInitOptions: AuthClientInitOptions = {
        baseUrl: process.env.BASE_URL,
    };

    const deepCopyClient = (client: AuthClient) => {
        return Object.assign(Object.create(Object.getPrototypeOf(client)), client);
    };

    const createNewClient = (client: AuthClient) => {
        const newClient = deepCopyClient(client);

        newClient.onReady = updateState('onReady', newClient);
        newClient.onAuthSuccess = updateState('onAuthSuccess', newClient);
        newClient.onAuthError = onError('onAuthError');
        newClient.onAuthRefreshSuccess = updateState('onAuthRefreshSuccess', newClient);
        newClient.onAuthRefreshError = onError('onAuthRefreshError');
        newClient.onAuthLogout = updateState('onAuthLogout', newClient);
        newClient.onAuthChange = updateState('onAuthChange', newClient);
        newClient.onTokenExpired = refreshToken();

        return newClient;
    };

    useEffect(() => {
        const newClient = createNewClient(_client);

        newClient.init({ ...defaultInitOptions, ...initOptions }).catch(onError('onInitError'));

        setClient(newClient);
    }, []);

    const updateState = (event: AuthClientEvent, movedClient?: AuthClient) => (authenticated?: boolean) => {
        switch (event) {
            case 'onReady':
                setInitialized(true);
                break;
            case 'onAuthSuccess':
                setAuthenticated(true);
                break;
            case 'onAuthRefreshSuccess':
                console.log('not supported');
                break;
            case 'onAuthError':
            case 'onAuthLogout':
            case 'onAuthRefreshError':
            case 'onInitError':
                setAuthenticated(false);
                setInitialized(true);
                break;
            case 'onAuthChange':
                if (movedClient) {
                    setClient(createNewClient(movedClient));
                }
                break;
            case 'onTokenExpired':
                console.log('not supported');
                break;
        }
    };

    const onError = (event: AuthClientEvent) => (error?: AuthClientError) => {
        updateState(event)();
    };

    const refreshToken = () => () => {
        updateState('onTokenExpired')();
    };

    const getValue = useCallback(
        () => ({
            initialized,
            authenticated,
            client: client || _client,
        }),
        [initialized, authenticated, client],
    );

    return <AuthContext.Provider value={getValue()}>{children}</AuthContext.Provider>;
};
