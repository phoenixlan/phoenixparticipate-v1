/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import React from 'react';
import { ThemeProvider } from 'styled-components';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import theme from './src/theme';
import { GlobalStyle } from './src/global-styles';
import { QueryClient, QueryClientProvider } from 'react-query';
import { PhoenixJs } from './src/PhoenixJs';
import { AuthProvider } from './src/authentication/AuthProvider';
import { ModalProvider } from './src/sharedComponents/modal/ModalProvider';

const queryClient = new QueryClient();

const GlobalProviders: React.FC = ({ children }) => {
    return (
        <ThemeProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
                <ModalProvider>
                    <AuthProvider client={PhoenixJs}>
                        {children}
                        <GlobalStyle />
                    </AuthProvider>
                </ModalProvider>
            </QueryClientProvider>
        </ThemeProvider>
    );
};

const customRender = (ui: React.ReactElement, options?: Omit<RenderOptions, 'queries'>): RenderResult =>
    render(ui, { wrapper: GlobalProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
