/*
 * @created 27/03/2021 - 23:34
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import { PersonCard } from '../pages/myCrews/PersonCard';

const shineLines = keyframes`
    0% {
        left: -100px;
    }
    100% {
        left: 100%;
    }
`;

const SkeletonAnimation = styled.div`
    & img {
        visibility: hidden;
    }
    & > * > * {
        visibility: hidden;
    }
    & > * {
        background-color: ${({ theme }) => theme.colors.LightGray};
        color: transparent !important;
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
    }
`;

const Placeholder = styled.div`
    width: 100%;
    height: 25px;
`;

interface Props {
    loading?: boolean;
}

export const Skeleton: React.FC<Props> = ({ children, loading = false }) => {
    if (loading) {
        return <SkeletonAnimation>{children}</SkeletonAnimation>;
    }
    return <>{children}</>;
};

export const SkeletonPlaceholder: React.FC = () => {
    return (
        <Skeleton loading={true}>
            <Placeholder></Placeholder>
        </Skeleton>
    );
};
