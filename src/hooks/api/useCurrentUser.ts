/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import { QueryObserverResult, useQuery } from 'react-query';
import { User, RefreshError } from '@phoenixlan/phoenix.js';
import { useAuth } from '../../authentication/useAuth';
import { AuthClient } from '../../authentication/client/AuthClient';

export const currentUserDefaultQueryKey = 'getCurrentUser';

const _getCurrentUser = (client: AuthClient): Promise<User.FullUser | null> => {
    try {
        const user = client.user;

        if (!user) {
            return new Promise((res) => {
                res(null);
            });
        }
        return User.getUser(user.uuid);
    } catch (e) {
        if (e instanceof RefreshError) {
            client.onAuthRefreshError && client.onAuthRefreshError();
        }
        throw e;
    }
};

export const useCurrentUser = (): QueryObserverResult<User.FullUser | null> => {
    const { client } = useAuth();

    return useQuery<User.FullUser | null>({
        queryKey: [currentUserDefaultQueryKey],
        queryFn: () => _getCurrentUser(client),
    });
};
