import { useMutation, useQueryClient } from 'react-query';

import { TicketVoucher } from '@phoenixlan/phoenix.js';
import { toast } from 'react-toastify';

import { ownedTicketVouchersDefaultQueryKey } from './useOwnedTicketVouchers';
import { ownedTicketsDefaultQueryKey } from './useOwnedTickets';

export const useBurnTicketVoucherMutation = () => {
    const queryClient = useQueryClient();

    return useMutation((voucher_uuid: string) => TicketVoucher.burnTicketVoucher(voucher_uuid), {
        onSuccess: () => {
            toast.success('Du har konvertert billett-gavekortet til en billett');
        },
        onError: (e) => {
            console.log(e);
            toast.error('Det skjede en feil');
        },
        onSettled: () => {
            queryClient.invalidateQueries([ownedTicketVouchersDefaultQueryKey, ownedTicketsDefaultQueryKey]);
        },
    });
};
