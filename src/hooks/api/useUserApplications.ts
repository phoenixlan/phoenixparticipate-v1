/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import { QueryObserverResult, useQuery } from 'react-query';
import { Crew, Event, RefreshError } from '@phoenixlan/phoenix.js';
import { AuthClient } from '../../authentication/client/AuthClient';
import { useAuth } from '../../authentication/useAuth';

export const userApplicationDefaultQueryKey = 'getUserApplications';

const _getUserApplications = (client: AuthClient): Promise<Array<Crew.Applications.BasicApplication>> => {
    try {
        return Crew.Applications.getUserApplications();
    } catch (e) {
        if (e instanceof RefreshError) {
            client.onAuthRefreshError && client.onAuthRefreshError();
        }
        throw e;
    }
};

export const useUserApplications = (): QueryObserverResult<Array<Crew.Applications.BasicApplication>> => {
    const { client } = useAuth();

    return useQuery<Array<Crew.Applications.BasicApplication>>({
        queryKey: [userApplicationDefaultQueryKey],
        queryFn: () => _getUserApplications(client),
    });
};
