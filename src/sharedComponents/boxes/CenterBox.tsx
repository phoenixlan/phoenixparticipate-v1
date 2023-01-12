/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import React from 'react';
import styled, { css, SimpleInterpolation } from 'styled-components';

type size = 'large' | 'medium' | 'small';

const SIZES: Record<size, SimpleInterpolation> = {
    large: css`
        max-width: 1200px;
    `,
    medium: css`
        max-width: 900px;
    `,
    small: css`
        max-width: 600px;
    `,
};

const Box = styled.div<{ centerVertically: boolean }>`
    display: flex;
    ${({ centerVertically }) => centerVertically && 'align-items: center;'}
    justify-content: center;

    height: inherit;
    width: inherit;

    @media screen and (max-width: ${({ theme }) => theme.media.smallTablet}) {
        height: -webkit-fill-available;
    }
`;

const Content = styled.div<{ fluid: boolean; size: size }>`
    max-height: -webkit-fill-available;
    max-height: -moz-available;
    height: 100%;
    overflow: auto;
    display: inline-block;
    padding: ${({ theme }) => theme.spacing.s};

    ${(props) =>
        props.fluid
            ? `
        width: inherit;
    `
            : `
        width: calc(100vw - ${props.theme.spacing.m});
        ${props.size && SIZES[props.size]}
    `}
`;

interface Props {
    fluid?: boolean;
    centerVertically?: boolean;
    size?: size;
}

export const CenterBox: React.FC<Props> = ({ children, fluid = false, size = 'medium', centerVertically = true }) => {
    return (
        <Box centerVertically={centerVertically}>
            <Content fluid={fluid} size={size}>
                {children}
            </Content>
        </Box>
    );
};
