/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import { QueryObserverResult, useQuery } from 'react-query';
import { RefreshError, User, Ticket } from '@phoenixlan/phoenix.js';
import { useAuth } from '../../authentication/useAuth';
import { AuthClient } from '../../authentication/client/AuthClient';

export const ticketTransfersDefaultQueryKey = 'getTicketTransfers';

const _getTicketTransfers = (client: AuthClient, event_uuid: string): Promise<Array<Ticket.FullTicketTransfer>> => {
    try {
        const user = client.user;

        if (!user) {
            return new Promise((res) => {
                res([]);
            });
        }
        return User.getTicketTransfers(user.uuid, event_uuid);
    } catch (e) {
        if (e instanceof RefreshError) {
            client.onAuthRefreshError && client.onAuthRefreshError();
        }
        throw e;
    }
};

export const useTicketTransfers = (event_uuid?: string): QueryObserverResult<Array<Ticket.FullTicketTransfer>> => {
    const { client } = useAuth();

    return useQuery<Array<Ticket.FullTicketTransfer>>({
        queryKey: [ticketTransfersDefaultQueryKey, event_uuid],
        queryFn: () => _getTicketTransfers(client, event_uuid??""),
        enabled: !!event_uuid
    });
};
