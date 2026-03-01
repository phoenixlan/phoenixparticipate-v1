/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import React, { useState } from 'react';
import styled from 'styled-components';
import { Bars } from '@styled-icons/fa-solid/Bars';
import { Link } from 'react-router-dom';
import { HeaderMenu } from './HeaderMenu';
import { useSiteConfig } from '../../hooks/api/useSiteConfig';

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

const LogoImg = styled.img`
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

const LogoSkeleton = styled.div`
    width: 2rem;
    height: 2rem;
    background-color: ${({ theme }) => theme.colors.Gray};
    border-radius: ${({ theme }) => theme.borderRadius.s};
`;

export const Header: React.FC<Props> = ({ onClick }) => {
    const { data: siteConfig, isLoading } = useSiteConfig();
    const logoUrl = siteConfig?.logo ? `${process.env.BASE_URL}/${siteConfig.logo}` : null;

    return (
        <Container>
            <StyledBars size="2rem" onClick={onClick} />
            <Nav>
                <Logo to="/">
                    {isLoading ? <LogoSkeleton /> : logoUrl ? <LogoImg src={logoUrl} /> : <LogoSkeleton />}
                </Logo>
                <HeaderMenu />
            </Nav>
        </Container>
    );
};
