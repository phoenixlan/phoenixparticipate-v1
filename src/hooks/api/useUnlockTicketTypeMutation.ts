import { useMutation, useQueryClient } from 'react-query';

import { unlockEventTicketType } from '@phoenixlan/phoenix.js';
import { toast } from 'react-toastify';

import { currentEventTicketTypesDefaultQueryKey } from './useCurrentEventTicketTypes';
import { ticketAvailabilityDefaultQueryKey } from './useTicketAvailability';

interface UnlockTicketTypeMutationProps {
    eventUuid: string;
    code: string;
}

export const useUnlockTicketTypeMutation = () => {
    const queryClient = useQueryClient();

    return useMutation((props: UnlockTicketTypeMutationProps) => unlockEventTicketType(props.eventUuid, props.code), {
        onSuccess: (success) => {
            if (success) {
                toast.success('Gyldig kode');
            } else {
                toast.error('Ugyldig kode');
            }
        },
        onError: (e) => {
            console.log(e);
            toast.error('Det skjede en feil');
        },
        onSettled: () => {
            // Unlocked ticket types show up in both the ticket type list and the availability
            queryClient.invalidateQueries(currentEventTicketTypesDefaultQueryKey);
            queryClient.invalidateQueries(ticketAvailabilityDefaultQueryKey);
        },
    });
};
