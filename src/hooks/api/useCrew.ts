/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import { QueryObserverResult, useQuery } from 'react-query';
import { Crew, RefreshError } from '@phoenixlan/phoenix.js';
import { useAuth } from '../../authentication/useAuth';
import { AuthClient } from '../../authentication/client/AuthClient';
import { FullCrew, FullPosition } from '@phoenixlan/phoenix.js/build/crew';

export const crewDefaultQueryKey = 'getCrews';

const _getCrew = (client: AuthClient, uuid: string): Promise<FullCrew> => {
    try {
        return Crew.getCrew(uuid);
    } catch (e) {
        if (e instanceof RefreshError) {
            client.onAuthRefreshError && client.onAuthRefreshError();
        }
        throw e;
    }
};

export const useCrew = (uuid: string): QueryObserverResult<FullCrew> => {
    const { client } = useAuth();

    return useQuery<FullCrew>({
        queryKey: [crewDefaultQueryKey, uuid],
        queryFn: () => _getCrew(client, uuid),
    });
};
