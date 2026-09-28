import React, { useMemo } from 'react';
import type { Decorator, Preview } from '@storybook/react';
import { ThemeProvider } from 'styled-components';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import type { User } from '@phoenixlan/phoenix.js';

import theme from '../src/theme';
import { GlobalStyle } from '../src/global-styles';
import { ModalProvider } from '../src/sharedComponents/modal/ModalProvider';
import { AuthProvider } from '../src/authentication/AuthProvider';
import { getMockApi, MockApiOverrides, respond, setMockApi } from '../stories/mocks/mockApi';
import { resetPolling } from '../stories/mocks/phoenix';
import { MockAuthClient } from '../stories/mocks/MockAuthClient';
import { user as defaultUser } from '../stories/mocks/fixtures';

/*
 * Story parameters understood by the global decorator:
 *   api:   overrides for the mocked API responses (see stories/mocks/mockApi.ts)
 *   user:  overrides for the logged-in user
 *   roles: roles in the user's token
 *   route: initial router location, e.g. '/buy'
 */
export interface AppParameters {
    api?: MockApiOverrides;
    user?: Partial<User.FullUser>;
    roles?: Array<string>;
    route?: string;
}

// useMembershipInfo fetches a static file instead of going through phoenix.js
const originalFetch = window.fetch.bind(window);
window.fetch = (input: RequestInfo, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input.url;
    if (url.endsWith('/static/tos/membership.md')) {
        return respond(getMockApi().membershipInfo).then(
            (text) => new Response(text),
            () => new Response('', { status: 500 }),
        );
    }
    return originalFetch(input, init);
};

interface AppProvidersProps extends AppParameters {
    storyId: string;
}

// The providers from src/App.tsx, backed by the mocks
const AppProviders: React.FC<AppProvidersProps> = ({ children, storyId, api, user, roles, route = '/' }) => {
    // Runs before any query of this story fires, as children render after this
    setMockApi(api);

    const { queryClient, authClient } = useMemo(() => {
        resetPolling();
        return {
            queryClient: new QueryClient({
                defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } },
            }),
            authClient: new MockAuthClient({ ...defaultUser, ...user }, roles),
        };
        // Everything starts fresh per story, but not on re-renders of the same story
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [storyId]);

    return (
        <ThemeProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
                <ModalProvider>
                    <AuthProvider client={authClient}>
                        <GlobalStyle />
                        <MemoryRouter key={storyId} initialEntries={[route]}>
                            {children}
                        </MemoryRouter>
                        <ToastContainer position="top-center" autoClose={5000} newestOnTop closeOnClick />
                    </AuthProvider>
                </ModalProvider>
            </QueryClientProvider>
        </ThemeProvider>
    );
};

const withApp: Decorator = (Story, context) => (
    <AppProviders storyId={context.id} {...(context.parameters as AppParameters)}>
        <Story />
    </AppProviders>
);

const preview: Preview = {
    decorators: [withApp],
    parameters: {
        layout: 'fullscreen',
        controls: { disable: true },
        actions: { disable: true },
        viewport: {
            viewports: {
                phone: { name: 'Phone', styles: { width: '390px', height: '844px' }, type: 'mobile' },
                tablet: { name: 'Tablet', styles: { width: '820px', height: '1180px' }, type: 'tablet' },
                laptop: { name: 'Laptop', styles: { width: '1366px', height: '768px' }, type: 'desktop' },
            },
        },
        options: {
            storySort: {
                order: ['Sidebar', 'Pages', 'Ticket purchase'],
            },
        },
    },
};

export default preview;
