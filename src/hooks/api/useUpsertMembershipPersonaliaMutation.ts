import { useMutation, useQueryClient } from 'react-query';

import { User } from '@phoenixlan/phoenix.js';
import { toast } from 'react-toastify';

import { useAuth } from '../../authentication/useAuth';
import { membershipPersonaliaDefaultQueryKey } from './useMembershipPersonalia';

interface UpsertMembershipPersonaliaMutationProps {
    address: string;
    postal_code: string;
}

export const useUpsertMembershipPersonaliaMutation = () => {
    const queryClient = useQueryClient();
    const { client } = useAuth();

    return useMutation(
        (props: UpsertMembershipPersonaliaMutationProps) =>
            User.MembershipPersonalia.upsertMembershipPersonalia(
                client.user?.uuid ?? '',
                props.address,
                props.postal_code,
            ),
        {
            onSuccess: () => {
                toast.success('Medlemsinformasjonen er lagret');
            },
            onError: (e) => {
                console.log(e);
                toast.error('Kunne ikke lagre medlemsinformasjonen');
            },
            onSettled: () => {
                queryClient.invalidateQueries([membershipPersonaliaDefaultQueryKey]);
            },
        },
    );
};
