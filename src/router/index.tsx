/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import React from 'react';
import { Switch, Route, BrowserRouter, Redirect } from 'react-router-dom';

// Local dependencies
import { AuthRoute } from './AuthRoute';
import { PublicRoute } from './PublicRoute';
import { useAuth } from '../authentication/useAuth';
import { useSiteConfig } from '../hooks/api/useSiteConfig';
// Pages / routes
import { Login } from '../pages/login';
import { Loading } from '../pages/loading';
import { Tickets } from '../pages/tickets/list';
import { Template } from '../pages/template';
import { Error404 } from '../pages/errors/Error404';
import { Crew } from '../pages/crew';
import { Avatar } from '../pages/avatar';
import { MyCrew } from '../pages/myCrews';
import { TicketPurchase } from '../pages/tickets/purchase';
import { TicketSeating } from '../pages/tickets/seat';
import { MembershipStatus } from '../pages/membership';
import { DiscordMappingManagement } from '../pages/discord';
import { TicketViewer } from '../pages/tickets/view';
import { TicketVouchers } from '../pages/tickets/vouchers';

export const Router: React.FC = () => {
    const { initialized } = useAuth();
    const { data: siteConfig } = useSiteConfig();
    const features = siteConfig?.features ?? [];

    if (!initialized) {
        return <Loading />;
    }

    return (
        <BrowserRouter>
            <Switch>
                <PublicRoute path="/login">
                    <Login />
                </PublicRoute>
                <Route
                    path="/"
                    render={(props) => (
                        <Template>
                            {features.includes('crew') && (
                                <AuthRoute {...props} exact path="/crew">
                                    <Crew />
                                </AuthRoute>
                            )}
                            <AuthRoute {...props} exact path="/">
                                <Tickets />
                            </AuthRoute>
                            <AuthRoute {...props} exact path="/ticket/:ticket_id">
                                <TicketViewer />
                            </AuthRoute>
                            <AuthRoute {...props} exact path="/seating">
                                <TicketSeating />
                            </AuthRoute>
                            {features.includes('membership') && (
                                <AuthRoute {...props} exact path="/membership">
                                    <MembershipStatus />
                                </AuthRoute>
                            )}
                            {features.includes('discord') && (
                                <AuthRoute {...props} exact path="/third_party_mapping">
                                    <DiscordMappingManagement />
                                </AuthRoute>
                            )}
                            <AuthRoute {...props} exact path="/buy">
                                <TicketPurchase />
                            </AuthRoute>
                            {features.includes('avatar') && (
                                <AuthRoute {...props} exact path="/avatar">
                                    <Avatar />
                                </AuthRoute>
                            )}
                            {features.includes('crew') && (
                                <AuthRoute {...props} exact path="/my-crew">
                                    <MyCrew />
                                </AuthRoute>
                            )}
                            <AuthRoute {...props} exact path="/ticket-vouchers">
                                <TicketVouchers />
                            </AuthRoute>
                            <AuthRoute {...props} path="*">
                                <Error404 />
                            </AuthRoute>
                        </Template>
                    )}
                />
            </Switch>
        </BrowserRouter>
    );
};
