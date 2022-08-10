/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import { useContext } from 'react';
import { AuthContext } from './AuthContext';

export const useAuth = () => {
    const ctx = useContext(AuthContext);

    if (!ctx) {
        throw new Error('useAuth hook must be used inside AuthProvider context');
    }

    if (!ctx.client) {
        throw new Error('authClient has not been assigned to AuthProvider');
    }

    return {
        initialized: ctx.initialized,
        authenticated: ctx.authenticated,
        client: ctx.client,
    };
};
