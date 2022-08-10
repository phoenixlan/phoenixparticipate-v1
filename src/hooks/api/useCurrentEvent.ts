/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import { QueryObserverResult, useQuery } from 'react-query';
import { getCurrentEvent, Event, RefreshError } from '@phoenixlan/phoenix.js';
import { useAuth } from '../../authentication/useAuth';
import { AuthClient } from '../../authentication/client/AuthClient';

export const currentEventDefaultQueryKey = 'getCurrentEvent';

const _getCurrentEvent = (client: AuthClient): Promise<Event> => {
    try {
        return getCurrentEvent();
    } catch (e) {
        if (e instanceof RefreshError) {
            client.onAuthRefreshError && client.onAuthRefreshError();
        }
        throw e;
    }
};

export const useCurrentEvent = (): QueryObserverResult<Event> => {
    const { client } = useAuth();

    return useQuery<Event>({
        queryKey: [currentEventDefaultQueryKey],
        queryFn: () => _getCurrentEvent(client),
    });
};
