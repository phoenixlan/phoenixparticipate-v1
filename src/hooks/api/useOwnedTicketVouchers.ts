import { QueryObserverResult, useQuery } from 'react-query';
import { RefreshError, User, TicketVoucher } from '@phoenixlan/phoenix.js';
import { useAuth } from '../../authentication/useAuth';
import { AuthClient } from '../../authentication/client/AuthClient';

export const ownedTicketVouchersDefaultQueryKey = 'getOwnedTicketVouchers';

const _getOwnedTicketVouchers = (client: AuthClient): Promise<Array<TicketVoucher.BasicTicketVoucher>> => {
    try {
        const user = client.user;

        if (!user) {
            return new Promise((res) => {
                res([]);
            });
        }
        return User.getTicketVouchers(user.uuid);
    } catch (e) {
        if (e instanceof RefreshError) {
            client.onAuthRefreshError && client.onAuthRefreshError();
        }
        throw e;
    }
};

export const useOwnedTicketVouchers = (): QueryObserverResult<Array<TicketVoucher.BasicTicketVoucher>> => {
    const { client } = useAuth();

    return useQuery<Array<TicketVoucher.BasicTicketVoucher>>({
        queryKey: [ownedTicketVouchersDefaultQueryKey],
        queryFn: () => _getOwnedTicketVouchers(client),
    });
};
