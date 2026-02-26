import { QueryObserverResult, useQuery } from 'react-query';
import { getSiteConfig, SiteConfig } from '@phoenixlan/phoenix.js';

export const siteConfigDefaultQueryKey = 'getSiteConfig';

export const useSiteConfig = (): QueryObserverResult<SiteConfig> => {
    return useQuery({
        queryKey: [siteConfigDefaultQueryKey],
        queryFn: () => getSiteConfig(),
        staleTime: 5 * 60 * 1000,
    });
};
