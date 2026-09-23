import { QueryObserverResult, useQuery, useQueryClient } from 'react-query';
import { RefreshError, User } from '@phoenixlan/phoenix.js';
import { useAuth } from '../../authentication/useAuth';
import { AuthClient } from '../../authentication/client/AuthClient';

export const membershipPersonaliaDefaultQueryKey = 'getMembershipPersonalia';

const _getMembershipPersonalia = (client: AuthClient): Promise<User.MembershipPersonalia.MembershipPersonalia | null> => {
    try {
        const user = client.user;

        // make type checker happy
        return User.MembershipPersonalia.getMembershipPersonalia(user?.uuid??"");
    } catch (e) {
        if (e instanceof RefreshError) {
            client.onAuthRefreshError && client.onAuthRefreshError();
        }
        throw e;
    }
};

export const useMembershipPersonalia = (): QueryObserverResult<User.MembershipPersonalia.MembershipPersonalia| null> => {
    const { client } = useAuth();

    return useQuery<User.MembershipPersonalia.MembershipPersonalia| null>({
        queryKey: [membershipPersonaliaDefaultQueryKey],
        queryFn: () => _getMembershipPersonalia(client),
        enabled: !!client.user
    });
};

// Returns a function that always asks the API, bypassing any cached value
export const useFetchMembershipPersonalia = (): (() => Promise<User.MembershipPersonalia.MembershipPersonalia | null>) => {
    const { client } = useAuth();
    const queryClient = useQueryClient();

    return () =>
        queryClient.fetchQuery([membershipPersonaliaDefaultQueryKey], () => _getMembershipPersonalia(client), {
            staleTime: 0,
        });
};
