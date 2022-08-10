/*
 * @created 28/03/2021 - 22:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import styled from 'styled-components';
import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';

const IconButton = styled.span`
    width: 30px;
    height: 30px;
    background-color: ${({ theme }) => theme.colors.DarkGray};
    border-radius: 50%;
    padding: ${({ theme }) => theme.spacing.xs};
    margin: ${({ theme }) => theme.spacing.xs};
    display: flex;
    align-items: center;
    justify-content: center;
    transition: filter ${({ theme }) => theme.animation.speed}ms;

    & > svg {
        fill: ${({ theme }) => theme.colors.White};
        height: 1.5rem;
    }

    &:hover {
        filter: brightness(1.2);
    }
`;

const MenuLink = styled(Link)`
    height: 50px;
    display: flex;
    align-items: center;
    border-radius: ${({ theme }) => theme.spacing.xs};
    transition: background ${({ theme }) => theme.animation.speed}ms;
    padding: ${({ theme }) => theme.spacing.xs};
`;

const MenuItem = styled.span`
    height: 50px;
    display: flex;
    align-items: center;
    border-radius: ${({ theme }) => theme.spacing.xs};
    transition: background ${({ theme }) => theme.animation.speed}ms;
    padding: ${({ theme }) => theme.spacing.xs};
    cursor: pointer;
`;

const IconRight = styled.span`
    margin-left: auto;
    & > svg {
        fill: ${({ theme }) => theme.colors.Black};
        height: 1rem;
    }
`;

interface Props {
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    to?: string;
    setActiveMenu?: () => void;
}

export const DropdownItem: React.FC<Props> = ({ children, leftIcon, rightIcon, to, setActiveMenu }) => {
    return (
        <>
            {to ? (
                <MenuLink to={to} onClick={() => setActiveMenu && setActiveMenu()}>
                    <IconButton>{leftIcon}</IconButton>
                    {children}
                    <IconRight>{rightIcon}</IconRight>
                </MenuLink>
            ) : (
                <MenuItem onClick={() => setActiveMenu && setActiveMenu()}>
                    <IconButton>{leftIcon}</IconButton>
                    {children}
                    <IconRight>{rightIcon}</IconRight>
                </MenuItem>
            )}
        </>
    );
};
