import React from 'react';
import styled, { keyframes } from 'styled-components';

const shineLines = keyframes`
    0% {
        left: -100px;
    }
    100% {
        left: 100%;
    }
`;

const Shimmer = styled.span<{ width: string }>`
    display: inline-block;
    width: ${({ width }) => width};
    height: 1em;
    vertical-align: middle;
    background-color: ${({ theme }) => theme.colors.LightGray};
    border-radius: 0.25em;
    position: relative;
    overflow: hidden;

    &:before {
        animation: ${shineLines} 1.6s infinite linear;
        position: absolute;
        display: block;
        width: 100px;
        content: '';
        background-image: linear-gradient(
            90deg,
            rgba(248, 248, 248, 1) 0%,
            rgba(255, 255, 255, 1) 50%,
            rgba(248, 248, 248, 1) 100%
        );
        height: 100%;
    }
`;

interface Props {
    width?: string;
}

export const TextSkeleton: React.FC<Props> = ({ width = '6ch' }) => {
    return <Shimmer width={width} />;
};
