import { QueryObserverResult, useQuery } from 'react-query';
import { getApiServer } from '@phoenixlan/phoenix.js';

export const membershipInfoDefaultQueryKey = 'getMembershipInfo';

const getMembershipInfo = async (): Promise<string> => {
    const response = await fetch(`${getApiServer()}/static/tos/membership.md`, {
        method: 'GET',
    });
    if (!response.ok) {
        throw new Error('Unable to get membership info');
    }
    return response.text();
};

export const useMembershipInfo = (): QueryObserverResult<string> => {
    return useQuery<string>({
        queryKey: [membershipInfoDefaultQueryKey],
        queryFn: getMembershipInfo,
    });
};
