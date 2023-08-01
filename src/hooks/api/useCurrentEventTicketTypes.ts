/*
 * @created 01/06/2021 - 21:20
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import { QueryObserverResult, useQuery } from 'react-query';
import { getEventTicketTypes, TicketType, RefreshError } from '@phoenixlan/phoenix.js';
import { useAuth } from '../../authentication/useAuth';
import { AuthClient } from '../../authentication/client/AuthClient';
import { useCurrentEvent } from './useCurrentEvent';

export const currentEventTicketTypesDefaultQueryKey = 'getCurrentEventTicketTypes';

const _getCurrentEventTicketTypes = (client: AuthClient, uuid: string): Promise<Array<TicketType.TicketType>> => {
    try {
        return getEventTicketTypes(uuid);
    } catch (e) {
        if (e instanceof RefreshError) {
            client.onAuthRefreshError && client.onAuthRefreshError();
        }
        throw e;
    }
};

export const useCurrentEventTicketTypes = (): QueryObserverResult<Array<TicketType.TicketType>> => {
    const { client } = useAuth();
    const { data: event } = useCurrentEvent();

    return useQuery<Array<TicketType.TicketType>>({
        queryKey: [currentEventTicketTypesDefaultQueryKey, event?.uuid],
        queryFn: () => {
            return _getCurrentEventTicketTypes(client, event?.uuid as string);
        },
        enabled: !!event,
    });
};
