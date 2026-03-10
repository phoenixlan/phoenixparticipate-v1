import { QueryObserverResult, useQuery } from 'react-query';
import { RefreshError, Ticket } from '@phoenixlan/phoenix.js';
import { useAuth } from '../../authentication/useAuth';
import { AuthClient } from '../../authentication/client/AuthClient';

export const ticketTotpDefaultQueryKey = 'getTicketTotp';

const _getTicketTotp = (client: AuthClient, ticket_id: number): Promise<Ticket.TicketTotp> => {
    try {
        return Ticket.getTicketTotp(ticket_id);
    } catch (e) {
        if (e instanceof RefreshError) {
            client.onAuthRefreshError && client.onAuthRefreshError();
        }
        throw e;
    }
};

export const useTicketTotp = (ticket_id: number): QueryObserverResult<Ticket.TicketTotp> => {
    const { client } = useAuth();

    return useQuery<Ticket.TicketTotp>({
        queryKey: [ticketTotpDefaultQueryKey, ticket_id],
        queryFn: () => _getTicketTotp(client, ticket_id),
    });
};
