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
// Pages / routes
import { Login } from '../pages/login';
import { Loading } from '../pages/loading';
import { Tickets } from '../pages/tickets';
import { Template } from '../pages/template';
import { Error404 } from '../pages/errors/Error404';
import { Crew } from '../pages/crew';
import { Avatar } from '../pages/avatar';
import { MyCrew } from '../pages/myCrews';

export const Router: React.FC = () => {
    const { initialized } = useAuth();

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
                            <AuthRoute {...props} exact path="/crew">
                                <Crew />
                            </AuthRoute>
                            <AuthRoute {...props} exact path="/">
                                <Tickets/>
                            </AuthRoute>
                            <AuthRoute {...props} exact path="/avatar">
                                <Avatar />
                            </AuthRoute>
                            <AuthRoute {...props} exact path="/my-crew">
                                <MyCrew />
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
