/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import React from 'react';
import { AuthProvider } from './authentication/AuthProvider';
import { GlobalStyle } from './global-styles';
import { ThemeProvider } from 'styled-components';
import theme from './theme';
import { Router } from './router';
import { PhoenixJs } from './PhoenixJs';
import { ModalProvider } from './sharedComponents/modal/ModalProvider';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { InstallAppBanner } from './sharedComponents/InstallAppBanner';

const queryClient = new QueryClient();

export const App: React.FC = () => {
    return (
        <ThemeProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
                <ModalProvider>
                    <AuthProvider client={PhoenixJs}>
                        <GlobalStyle />
                        <InstallAppBanner />
                        <Router />
                        <ToastContainer
                            position="top-center"
                            autoClose={5000}
                            hideProgressBar={false}
                            newestOnTop
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                        />
                    </AuthProvider>
                </ModalProvider>
            </QueryClientProvider>
        </ThemeProvider>
    );
};

export default App;
