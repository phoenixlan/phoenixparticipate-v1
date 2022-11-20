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

const _getSeatableTickets = (client: AuthClient): Promise<Array<Ticket.FullTicket>> => {
    try {
        const user = client.user;

        if (!user) {
            return new Promise((res) => {
                res([]);
            });
        }
        return User.getSeatableTickets(user.uuid);
    } catch (e) {
        if (e instanceof RefreshError) {
            client.onAuthRefreshError && client.onAuthRefreshError();
        }
        throw e;
    }
};

export const useSeatableTickets = (): QueryObserverResult<Array<Ticket.FullTicket>> => {
    const { client } = useAuth();

    return useQuery<Array<Ticket.FullTicket>>({
        queryKey: [seatableTicketsDefaultQueryKey],
        queryFn: () => _getSeatableTickets(client),
    });
};
