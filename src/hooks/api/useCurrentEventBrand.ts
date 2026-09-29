import { QueryObserverResult, useQuery } from 'react-query';
import { EventBrand } from '@phoenixlan/phoenix.js';
import { EVENT_BRAND } from '../../event_brand';

export const currentEventBrandDefaultQueryKey = 'getCurrentEventBrand';

export const useCurrentEventBrand = (): QueryObserverResult<EventBrand.EventBrand> => {
    return useQuery<EventBrand.EventBrand>({
        queryKey: [currentEventBrandDefaultQueryKey],
        queryFn: () => EventBrand.getEventBrand(EVENT_BRAND),
        staleTime: 5 * 60 * 1000,
    });
};
