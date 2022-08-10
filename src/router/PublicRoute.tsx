/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import * as React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { useAuth } from '../authentication/useAuth';

interface PublicRouteProps extends RouteProps {
    redirect?: string;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children, redirect = '/', ...rest }) => {
    const { authenticated } = useAuth();

    return (
        <Route
            {...rest}
            render={() => {
                return authenticated ? <Redirect to={redirect} /> : children;
            }}
        />
    );
};
