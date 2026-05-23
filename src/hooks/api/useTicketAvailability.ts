import { QueryObserverResult, useQuery } from 'react-query';
import { getEventTicketAvailability, TicketAvailability, RefreshError } from '@phoenixlan/phoenix.js';
import { useAuth } from '../../authentication/useAuth';
import { AuthClient } from '../../authentication/client/AuthClient';
import { useCurrentEvent } from './useCurrentEvent';

export const ticketAvailabilityDefaultQueryKey = 'getTicketAvailability';

const _getTicketAvailability = (client: AuthClient, uuid: string): Promise<TicketAvailability> => {
    try {
        return getEventTicketAvailability(uuid);
    } catch (e) {
        if (e instanceof RefreshError) {
            client.onAuthRefreshError && client.onAuthRefreshError();
        }
        throw e;
    }
};

export const useTicketAvailability = (): QueryObserverResult<TicketAvailability> => {
    const { client } = useAuth();
    const { data: event } = useCurrentEvent();

    return useQuery<TicketAvailability>({
        queryKey: [ticketAvailabilityDefaultQueryKey, event?.uuid],
        queryFn: () => {
            return _getTicketAvailability(client, event?.uuid as string);
        },
        enabled: !!event,
    });
};
