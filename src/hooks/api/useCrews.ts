/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import { QueryObserverResult, useQuery } from 'react-query';
import { Crew, RefreshError } from '@phoenixlan/phoenix.js';
import { useAuth } from '../../authentication/useAuth';
import { AuthClient } from '../../authentication/client/AuthClient';
import { BaseCrew } from '@phoenixlan/phoenix.js/build/crew';

export const crewsDefaultQueryKey = 'getCrews';

const _getCrews = (client: AuthClient): Promise<Array<BaseCrew>> => {
    try {
        return Crew.getCrews();
    } catch (e) {
        if (e instanceof RefreshError) {
            client.onAuthRefreshError && client.onAuthRefreshError();
        }
        throw e;
    }
};

export const useCrews = (): QueryObserverResult<Array<BaseCrew>> => {
    const { client } = useAuth();

    return useQuery<Array<BaseCrew>>({
        queryKey: [crewsDefaultQueryKey],
        queryFn: () => _getCrews(client),
    });
};
