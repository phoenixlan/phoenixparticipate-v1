/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import React from 'react';
import { NavLink, NavLinkProps } from 'react-router-dom';
import styled from 'styled-components';
const Link = styled(NavLink)<NavLinkProps>`
    margin-bottom: ${({ theme }) => theme.spacing.xxs};
    background-color: transparent;
    border-radius: ${({ theme }) => theme.borderRadius.m};
    padding: ${({ theme }) => theme.spacing.s} ${({ theme }) => theme.spacing.m};
    white-space: nowrap;
    font-weight: 500;
    font-size: ${({ theme }) => theme.fontSize.m};
    color: ${({ theme }) => theme.colors.Black};
    text-decoration: none;
    transition: all ${({ theme }) => theme.transition.default};
    border-left: 3px solid transparent;

    @media (max-width: ${({ theme }) => theme.media.smallTablet}) {
        font-size: ${({ theme }) => theme.fontSize.l};
        padding: ${({ theme }) => theme.spacing.m} ${({ theme }) => theme.spacing.l};
    }

    &:hover {
        background-color: ${({ theme }) => theme.colors.White};
        border-left-color: ${({ theme }) => theme.colors.accent2};
        box-shadow: ${({ theme }) => theme.shadow.lowKey};
    }

    &.active {
        background-color: ${({ theme }) => theme.colors.White};
        border-left-color: ${({ theme }) => theme.colors.primary};
        color: ${({ theme }) => theme.colors.primary};
        font-weight: 600;
        box-shadow: ${({ theme }) => theme.shadow.default};
    }
`;

export const ActiveLink: React.FC<NavLinkProps> = ({ children, ...rest }) => {
    return (
        <Link exact activeClassName="active" {...rest}>
            {children}
        </Link>
    );
};
