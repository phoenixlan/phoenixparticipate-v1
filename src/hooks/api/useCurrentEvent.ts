/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import { QueryObserverResult, useQuery } from 'react-query';
import { getCurrentEvent, Event, RefreshError } from '@phoenixlan/phoenix.js';
import { useAuth } from '../../authentication/useAuth';
import { AuthClient } from '../../authentication/client/AuthClient';
import { EVENT_BRAND } from '../../event_brand';

export const currentEventDefaultQueryKey = 'getCurrentEvent';

const _getCurrentEvent = (client: AuthClient): Promise<Event | null> => {
    try {
        return getCurrentEvent(EVENT_BRAND);
    } catch (e) {
        if (e instanceof RefreshError) {
            client.onAuthRefreshError && client.onAuthRefreshError();
        }
        throw e;
    }
};

export const useCurrentEvent = (): QueryObserverResult<Event | null> => {
    const { client } = useAuth();

    return useQuery<Event | null>({
        queryKey: [currentEventDefaultQueryKey],
        queryFn: () => _getCurrentEvent(client),
    });
};
