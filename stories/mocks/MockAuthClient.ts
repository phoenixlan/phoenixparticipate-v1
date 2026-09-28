import type { User } from '@phoenixlan/phoenix.js';
import type { AuthClient } from '../../src/authentication/client/AuthClient';

// Always-logged-in stand-in for PhoenixJsClient
export class MockAuthClient implements AuthClient {
    token = 'mock-token';
    refreshToken = 'mock-refresh-token';
    user?: User.FullUser;
    roles: Array<string>;

    onReady?: (authenticated?: boolean) => void = undefined;
    onAuthSuccess?: () => void = undefined;
    onAuthLogout?: () => void = undefined;
    onAuthChange?: () => void = undefined;

    constructor(user: User.FullUser, roles: Array<string> = []) {
        this.user = user;
        this.roles = roles;
    }

    async init(): Promise<void> {
        this.onAuthSuccess && this.onAuthSuccess();
        this.onReady && this.onReady();
    }

    parsedToken(): User.Oauth.JWTPayload {
        return { sub: this.user?.uuid ?? '', exp: 0, iat: 0, roles: this.roles };
    }

    async updateUser(): Promise<void> {
        this.onAuthChange && this.onAuthChange();
    }

    login(): void {
        console.log('[storybook] login() called');
    }

    logout(): void {
        console.log('[storybook] logout() called');
    }
}
