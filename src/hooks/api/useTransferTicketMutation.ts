import { useMutation, useQueryClient } from 'react-query';

import { Ticket } from '@phoenixlan/phoenix.js';
import { toast } from 'react-toastify';

import { ownedTicketsDefaultQueryKey } from './useOwnedTickets';
import { ticketTransfersDefaultQueryKey } from './useTicketTransfers';
import { ticketDefaultQueryKey } from './useTicket';

interface TransferTicketMutationProps {
    ticket_id: number;
    email: string;
}

export const useTransferTicketMutation = () => {
    const queryClient = useQueryClient();

    return useMutation((props: TransferTicketMutationProps) => Ticket.transferTicket(props.ticket_id, props.email), {
        onSuccess: () => {
            toast.success('Billetten er overført');
        },
        onError: (e) => {
            console.log(e);
            // The API explains why, e.g. that the recipient has no account
            const reason = e instanceof Error && e.message ? `: ${e.message}` : '';
            toast.error(`Kunne ikke overføre billetten${reason}`);
        },
        onSettled: () => {
            queryClient.invalidateQueries([ticketTransfersDefaultQueryKey]);
            queryClient.invalidateQueries([ownedTicketsDefaultQueryKey]);
            queryClient.invalidateQueries([ticketDefaultQueryKey]);
        },
    });
};
