/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import { QueryObserverResult, useQuery } from 'react-query';
import { ApiGetError, User } from '@phoenixlan/phoenix.js';
import { useAuth } from '../../authentication/useAuth';
import { AuthClient } from '../../authentication/client/AuthClient';

export const getDiscordMappingDefaultQueryKey = 'getDiscordMapping';

const _getDiscordMapping = (client: AuthClient, uuid: string): Promise<User.DiscordMapping | null> => {
    try {
        return User.getDiscordMapping(uuid);
    } catch (e) {
        if (e instanceof ApiGetError) {
            client.onAuthRefreshError && client.onAuthRefreshError();
        }
        throw e;
    }
};

export const useDiscordMapping = (uuid: string): QueryObserverResult<User.DiscordMapping | null> => {
    const { client } = useAuth();

    return useQuery<User.DiscordMapping | null>({
        queryKey: [getDiscordMappingDefaultQueryKey, uuid],
        queryFn: () => _getDiscordMapping(client, uuid),
    });
};
