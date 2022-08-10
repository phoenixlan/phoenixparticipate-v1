/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import React from 'react';
import styled, { keyframes } from 'styled-components';

const Container = styled.div`
    height: inherit;
    width: inherit;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const AnimationHeight = 60;
const AnimationWeight = 60;
const AnimtationBounceHeight = 120;

const Bounce = keyframes`
    0% {
        top: ${AnimtationBounceHeight}px;
        height: 5px;
        border-radius: 60px 60px 20px 20px;
        transform: scaleX(2);
    }
    35% {
        height: ${AnimationHeight}px;
        border-radius: 50%;
        transform: scaleX(1);
    }
    100% {
        top: 0;
    }
`;

const Ball = styled.div`
    position: relative;
    display: inline-block;
    height: 37px;
    width: ${AnimationWeight}px;
    &:before {
        position: absolute;
        content: '';
        display: block;
        top: 0;
        width: ${AnimationWeight}px;
        height: ${AnimationHeight}px;
        border-radius: 50%;
        background-color: ${({ theme }) => theme.colors.primary};
        transform-origin: 50%;
        animation: ${Bounce} 500ms alternate infinite ease;
    }
`;

export const Loading: React.FC = () => {
    return (
        <Container>
            <Ball />
        </Container>
    );
};
