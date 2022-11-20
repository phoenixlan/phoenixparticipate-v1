/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import React, { useState } from 'react';
import styled from 'styled-components';
import { Bars } from '@styled-icons/fa-solid/Bars';
import LogoImage from '../../assets/logo.svg';
import { Link } from 'react-router-dom';
import { HeaderMenu } from './HeaderMenu';

const Container = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    min-height: ${({ theme }) => theme.headerHeight};
    width: inherit;
    background-color: ${({ theme }) => theme.colors.LightGray};
`;

const StyledBars = styled(Bars)`
    margin: ${({ theme }) => theme.spacing.nil} ${({ theme }) => theme.spacing.l};
`;

const Logo = styled(Link)`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    max-height: ${({ theme }) => theme.fontSize.l};
    height: ${({ theme }) => theme.fontSize.l};
    font-size: ${({ theme }) => theme.fontSize.l};
`;

const PhoenixLogo = styled(LogoImage)`
    object-fit: contain;
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
    margin-right: ${({ theme }) => theme.spacing.xxs};
`;

const Nav = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-right: ${({ theme }) => theme.spacing.l};
`;

interface Props {
    onClick: () => void;
}

export const Header: React.FC<Props> = ({ onClick }) => {
    return (
        <Container>
            <StyledBars size="2rem" onClick={onClick} />
            <Nav>
                <Logo to="/">
                    <PhoenixLogo />
                    Delta
                </Logo>
                <HeaderMenu />
            </Nav>
        </Container>
    );
};
