/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import { User } from '@phoenixlan/phoenix.js';

export interface AuthClientError {
    error: string;
    error_description: string;
}

export interface AuthClientInitOptions {
    baseUrl: string;
}

export interface AuthClient {
    token?: string;
    parsedToken?(): unknown;
    refreshToken?: string;
    user?: User.FullUser;

    onReady?(authenticated?: boolean): void;
    onAuthSuccess?(): void;
    onAuthError?(errorData: AuthClientError): void;
    onAuthRefreshSuccess?(): void;
    onAuthRefreshError?(): void;
    onAuthLogout?(): void;
    onAuthChange?(): void;
    onTokenExpired?(): void;
    init(initOptions: AuthClientInitOptions): Promise<void>;
    updateToken?(minValidity: number): Promise<boolean>;
    updateUser?(): Promise<void>;
    login(): void;
    logout(): void;
}

export type AuthClientTokens = Pick<AuthClient, 'refreshToken' | 'token'>;

export type AuthClientEvent =
    | 'onReady'
    | 'onInitError'
    | 'onAuthSuccess'
    | 'onAuthError'
    | 'onAuthRefreshSuccess'
    | 'onAuthRefreshError'
    | 'onAuthLogout'
    | 'onAuthChange'
    | 'onTokenExpired';
