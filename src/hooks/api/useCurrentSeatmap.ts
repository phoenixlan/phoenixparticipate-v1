/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import { QueryObserverResult, useQuery } from 'react-query';
import { RefreshError, Seatmap, Ticket, getCurrentEvent } from '@phoenixlan/phoenix.js';
import { useAuth } from '../../authentication/useAuth';
import { AuthClient } from '../../authentication/client/AuthClient';

export const currentSeatmapDefaultQueryKey = 'getCurrentSeatmap';

const _getCurrentSeatmap = async (client: AuthClient): Promise<Seatmap.SeatmapAvailability | null> => {
    try {
        const event = await getCurrentEvent();
        if (!event) {
            return new Promise((res) => {
                res(null);
            });
        }
        if (!event.seatmap_uuid) {
            return new Promise((res) => {
                res(null);
            });
        }
        return Seatmap.getSeatmapAvailability(event.seatmap_uuid);
    } catch (e) {
        if (e instanceof RefreshError) {
            client.onAuthRefreshError && client.onAuthRefreshError();
        }
        throw e;
    }
};

export const useCurrentSeatmap = (): QueryObserverResult<Seatmap.SeatmapAvailability | null> => {
    const { client } = useAuth();

    return useQuery<Seatmap.SeatmapAvailability | null>({
        queryKey: [currentSeatmapDefaultQueryKey],
        queryFn: () => _getCurrentSeatmap(client),
    });
};
