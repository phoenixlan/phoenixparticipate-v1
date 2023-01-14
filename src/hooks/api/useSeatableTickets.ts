/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import { QueryObserverResult, useQuery } from 'react-query';
import { RefreshError, User, Ticket } from '@phoenixlan/phoenix.js';
import { useAuth } from '../../authentication/useAuth';
import { AuthClient } from '../../authentication/client/AuthClient';

export const seatableTicketsDefaultQueryKey = 'getSeatableTickets';

const _getSeatableTickets = (client: AuthClient, event_uuid: string | undefined): Promise<Array<Ticket.FullTicket>> => {
    try {
        const user = client.user;

        if (!user) {
            return new Promise((res) => {
                res([]);
            });
        }
        return User.getSeatableTickets(user.uuid, event_uuid);
    } catch (e) {
        if (e instanceof RefreshError) {
            client.onAuthRefreshError && client.onAuthRefreshError();
        }
        throw e;
    }
};

export const useSeatableTickets = (
    event_uuid: string | undefined | null,
): QueryObserverResult<Array<Ticket.FullTicket>> => {
    const { client } = useAuth();

    return useQuery<Array<Ticket.FullTicket>>({
        queryKey: [seatableTicketsDefaultQueryKey],
        queryFn: () => _getSeatableTickets(client, event_uuid as string | undefined), // enabled filters away null
        enabled: event_uuid !== null, // null means not available yet
    });
};
