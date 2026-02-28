/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import React from 'react';
import styled from 'styled-components';

const Header = styled.h1<{ center: boolean }>`
    font-size: ${({ theme }) => theme.fontSize.l};
    font-weight: 600;
    letter-spacing: -0.02em;
    line-height: 1.3;
    margin: 0 0 ${({ theme }) => theme.spacing.m};
    color: ${({ theme }) => theme.colors.Black};
    ${({ center }) => center && 'text-align: center;'};

    @media screen and (min-width: ${({ theme }) => theme.media.smallTablet}) {
        font-size: ${({ theme }) => theme.fontSize.xxl};
        line-height: 1.2;
    }
`;

interface Props {
    center?: boolean;
    className?: string;
}

export const Header1: React.FC<Props> = ({ children, center = true, className }) => {
    return (
        <Header center={center} className={className}>
            {children}
        </Header>
    );
};
