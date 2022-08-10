/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import { createContext } from 'react';
import { AuthClient } from './client/AuthClient';

export interface AuthContextOptions {
    initialized: boolean;
    authenticated: boolean;
    client: AuthClient;
}

export const AuthContext = createContext<Partial<AuthContextOptions>>({});
