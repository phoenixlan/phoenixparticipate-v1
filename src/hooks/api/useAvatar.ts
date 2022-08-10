import { QueryObserverResult, useQuery } from 'react-query';
import { Avatar, RefreshError } from '@phoenixlan/phoenix.js';
import { useAuth } from '../../authentication/useAuth';
import { AuthClient } from '../../authentication/client/AuthClient';

export const avatarDefaultQueryKey = 'getCrews';

const _getAvatar= (client: AuthClient, uuid?: string): Promise<Avatar.Avatar | undefined> => {
    try {
        if(!uuid) {
            return new Promise((res) => {
                res(undefined)
            })
        }
        return Avatar.getAvatar(uuid);
    } catch (e) {
        if (e instanceof RefreshError) {
            client.onAuthRefreshError && client.onAuthRefreshError();
        }
        throw e;
    }
};

export const useAvatar = (uuid?: string): QueryObserverResult<Avatar.Avatar | undefined> => {
    const { client } = useAuth();

    return useQuery<Avatar.Avatar | undefined>({
        queryKey: [avatarDefaultQueryKey, uuid],
        queryFn: () => _getAvatar(client, uuid),
    });
};

