/*
 * @created 05/04/2021 - 19:21
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import { QueryObserverResult, useQuery } from 'react-query';
import { getTosPayment, getTosRules } from '@phoenixlan/phoenix.js';

export const tosDefaultQueryKey = 'getTos';

const getTos = async (rules: boolean): Promise<string> => {
    if (rules) {
        return getTosRules();
    }
    return getTosPayment();
};

export const useTos = (rules: boolean): QueryObserverResult<string> => {
    return useQuery<string>({
        queryKey: [tosDefaultQueryKey, rules],
        queryFn: () => getTos(rules),
    });
};
