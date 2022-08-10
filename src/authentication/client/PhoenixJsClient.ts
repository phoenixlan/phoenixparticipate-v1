/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import {AuthClient, AuthClientError, AuthClientInitOptions} from "./AuthClient";
import {AuthError, User} from "@phoenixlan/phoenix.js";
import {getInitialState, persistState, removeState} from "../../utils";

export class PhoenixJsClient implements AuthClient {
    token?: string = undefined;
    refreshToken?: string = undefined;
    user?: User.FullUser = undefined;
    onReady?: (authenticated?: boolean) => void = undefined;
    onAuthSuccess?: () => void = undefined;
    onAuthError?: (errorData: AuthClientError) => void = undefined;
    onAuthRefreshSuccess?: () => void = undefined;
    onAuthRefreshError?: () => void = undefined;
    onAuthLogout?: () => void = undefined;
    onAuthChange?: () => void = undefined;
    onTokenExpired?: () => void = undefined;

    async init(initOptions: AuthClientInitOptions): Promise<void> {
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");
        if (code) {
            const success = await User.Oauth.authenticateByCode(code);
            if (success) {
                this.token = await User.Oauth.getToken();
                this.user = await User.getAuthenticatedUser();
                this.refreshToken = await User.Oauth.getRefreshToken();

                persistState('auth', {
                    token: this.token,
                    refreshToken: this.refreshToken,
                    user: this.user,
                })
            }
        } else {
            let authState = getInitialState<{token?: string, refreshToken?: string, user?: User.FullUser}>('auth')
            if (authState) {
                this.token = authState.token;
                this.refreshToken = authState.refreshToken;
                this.user = authState.user;

                //Update the library
                await User.Oauth.setAuthState(this.token, this.refreshToken ?? "");
            }
        }

        if (this.token && this.refreshToken && this.user) {
            this.onAuthSuccess && this.onAuthSuccess();
        }

        this.onReady && this.onReady();

        if(code) {
            window.location.href = url.origin;
        }

        return new Promise<void>((resolve) => {
            resolve();
        })
    }

    parsedToken() {
        return User.Oauth.getTokenPayload();
    }

    async updateUser(): Promise<void> {
        this.user = await User.getAuthenticatedUser();
        persistState('auth', {
            token: this.token,
            refreshToken: this.refreshToken,
            user: this.user,
        });

        this.onAuthChange && this.onAuthChange();

        return new Promise<void>((resolve) => {
            resolve();
        })
    }

    login() {
        if (process.env.HOST) {
            const url = User.getAuthenticationUrl(`${process.env.HOST}`, process.env.REACT_APP_OAUTH_CLIENT_ID??"phoenix-delta-test");
            window.location.replace(url);
        }
    }

    logout() {
        removeState('auth');
        this.onAuthLogout && this.onAuthLogout();
    }
}