import { useMutation, useQueryClient } from 'react-query';

import { User } from '@phoenixlan/phoenix.js';
import { toast } from 'react-toastify';

import { getDiscordMappingDefaultQueryKey } from './useDiscordMapping';

interface RevokeDiscordMappingMutationProps {
    uuid: string;
}

export const useRevokeDiscordMappingMutation = () => {
    const queryClient = useQueryClient();

    return useMutation((props: RevokeDiscordMappingMutationProps) => User.revokeDiscordMapping(props.uuid), {
        onSuccess: () => {
            toast.success('Discord-tilkoblingen ble fjernet');
        },
        onError: (e) => {
            console.log(e);
            toast.error('Det skjede en feil');
        },
        onSettled: () => {
            queryClient.invalidateQueries([getDiscordMappingDefaultQueryKey]);
        },
    });
};
