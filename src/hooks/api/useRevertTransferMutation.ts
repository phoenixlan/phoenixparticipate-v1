import { useMutation, useQueryClient } from 'react-query';

import { Ticket } from '@phoenixlan/phoenix.js';
import { toast } from 'react-toastify';

import { ticketTransfersDefaultQueryKey } from './useTicketTransfers';
import { ownedTicketsDefaultQueryKey } from './useOwnedTickets';

export const useRevertTransferMutation = () => {
    const queryClient = useQueryClient();

    return useMutation((uuid: string) => Ticket.revertTransfer(uuid), {
        onSuccess: () => {
            toast.success('Overføringen er angret');
        },
        onError: (e) => {
            console.log(e);
            toast.error('Det skjede en feil');
        },
        onSettled: () => {
            queryClient.invalidateQueries([ticketTransfersDefaultQueryKey]);
            // The ticket goes back to the sender
            queryClient.invalidateQueries([ownedTicketsDefaultQueryKey]);
        },
    });
};
