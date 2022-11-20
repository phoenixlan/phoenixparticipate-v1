/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import { QueryObserverResult, useQuery } from 'react-query';
import { RefreshError, User, Ticket } from '@phoenixlan/phoenix.js';
import { useAuth } from '../../authentication/useAuth';
import { AuthClient } from '../../authentication/client/AuthClient';

export const membershipStatusDefaultQueryKey = 'getMembershipStatus';

const _getMembershipStatus = (client: AuthClient): Promise<boolean> => {
    try {
        const user = client.user;

        if (!user) {
            return new Promise((res) => {
                res(false);
            });
        }
        return User.getUserMembershipStatus(user.uuid);
    } catch (e) {
        if (e instanceof RefreshError) {
            client.onAuthRefreshError && client.onAuthRefreshError();
        }
        throw e;
    }
};

export const useMembershipStatus = (): QueryObserverResult<boolean> => {
    const { client } = useAuth();

    return useQuery<boolean>({
        queryKey: [membershipStatusDefaultQueryKey],
        queryFn: () => _getMembershipStatus(client),
    });
};
