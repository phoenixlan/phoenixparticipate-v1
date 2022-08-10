/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import { useLocation } from 'react-router-dom';

export const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};
