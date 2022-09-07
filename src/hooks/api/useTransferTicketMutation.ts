import { useMutation, useQueryClient } from 'react-query';

import { Ticket } from '@phoenixlan/phoenix.js';
import { toast } from 'react-toastify';

import { ownedTicketsDefaultQueryKey } from './useOwnedTickets';
import { ticketTransfersDefaultQueryKey } from './useTicketTransfers';

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
            toast.error('Det skjede en feil');
        },
        onSettled: () => {
            queryClient.invalidateQueries([ticketTransfersDefaultQueryKey]);
            queryClient.invalidateQueries([ownedTicketsDefaultQueryKey]);
        },
    });
};
