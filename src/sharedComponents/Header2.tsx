/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import React from 'react';
import styled from 'styled-components';

const Header = styled.h2<{ center: boolean }>`
    font-size: ${({ theme }) => theme.fontSize.m};
    font-weight: 600;
    letter-spacing: -0.01em;
    line-height: 1.4;
    margin: 0 0 ${({ theme }) => theme.spacing.s};
    color: ${({ theme }) => theme.colors.Black};
    ${({ center }) => center && 'text-align: center;'};

    @media screen and (min-width: ${({ theme }) => theme.media.smallTablet}) {
        font-size: ${({ theme }) => theme.fontSize.l};
        line-height: 1.3;
    }
`;

interface Props {
    center?: boolean;
    className?: string;
}

export const Header2: React.FC<Props> = ({ children, center = true, className }) => {
    return (
        <Header className={className} center={center}>
            {children}
        </Header>
    );
};
