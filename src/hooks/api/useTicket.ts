/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import { QueryObserverResult, useQuery } from 'react-query';
import { RefreshError, User, Ticket } from '@phoenixlan/phoenix.js';
import { useAuth } from '../../authentication/useAuth';
import { AuthClient } from '../../authentication/client/AuthClient';

export const ticketDefaultQueryKey = 'getTicket';

const _getTicket = (client: AuthClient, ticket_id: number): Promise<Ticket.FullTicket> => {
    try {
        return Ticket.getTicket(ticket_id);
    } catch (e) {
        if (e instanceof RefreshError) {
            client.onAuthRefreshError && client.onAuthRefreshError();
        }
        throw e;
    }
};

export const useTicket = (ticket_id: number): QueryObserverResult<Ticket.FullTicket> => {
    const { client } = useAuth();

    return useQuery<Ticket.FullTicket>({
        queryKey: [ticketDefaultQueryKey],
        queryFn: () => _getTicket(client, ticket_id),
    });
};
