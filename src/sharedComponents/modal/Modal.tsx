/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useSwipeable } from 'react-swipeable';
import { Transition, TransitionStatus } from 'react-transition-group';

const Background = styled.div<{ state: TransitionStatus; duration: number }>`
    z-index: 20;
    width: 100%;
    /*height: 100%;*/
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);

    overflow: hidden;
    transition: height ${({ duration }) => duration}ms, opacity ${({ duration }) => duration}ms;
    ${({ state }) => {
        switch (state) {
            case 'entering':
                return 'height: 0px; opacity: 0;';
            case 'entered':
                return 'height: 100%; opacity: 1;';
            case 'exiting':
                return 'height: 100%; opacity: 1;';
            case 'exited':
                return 'height: 0px; opacity: 0;';
        }
    }}

    @media (max-width: ${({ theme }) => theme.media.smallTablet}) {
        background-color: rgba(0, 0, 0, 0.1);
        align-items: flex-end;
    }
`;

const Bar = styled.div`
    position: absolute;
    top: ${({ theme }) => theme.spacing.xs};
    border: 2px solid black;
    width: 120px;
    border-radius: 2rem;

    @media (min-width: ${({ theme }) => theme.media.smallTablet}) {
        display: none;
    }
`;

const Snackbar = styled.div`
    width: 100%;
    height: 30px;
    margin-bottom: ${({ theme }) => theme.spacing.xs};
    display: flex;
    align-items: center;
    background-color: ${({ theme }) => theme.colors.Gray};
    border-radius: ${({ theme }) => theme.spacing.s} ${({ theme }) => theme.spacing.s}
        ${({ theme }) => theme.spacing.nil} ${({ theme }) => theme.spacing.nil};

    @media (max-width: ${({ theme }) => theme.media.smallTablet}) {
        border-radius: ${({ theme }) => theme.spacing.nil};
        display: none;
    }
`;

const Icons = styled.div`
    display: flex;
    align-items: center;
`;

const Icon = styled.div`
    width: ${({ theme }) => theme.spacing.s};
    height: ${({ theme }) => theme.spacing.s};
    border-radius: 100%;
    margin-right: ${({ theme }) => theme.spacing.xs};
    cursor: pointer;

    &:first-child {
        margin-left: ${({ theme }) => theme.spacing.xs};
    }
`;

const RedIcon = styled(Icon)`
    background-color: ${({ theme }) => theme.colors.SnackbarRed};
`;

const GreenIcon = styled(Icon)`
    background-color: ${({ theme }) => theme.colors.SnackbarGreen};
    filter: grayscale(0.75);
    cursor: not-allowed;
`;

const YellowIcon = styled(Icon)`
    background-color: ${({ theme }) => theme.colors.SnackbarYellow};
    filter: grayscale(0.75);
    cursor: not-allowed;
`;

const Wrapper = styled.div`
    position: relative;
    z-index: 10;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background-color: ${({ theme }) => theme.colors.White};
    border-radius: ${({ theme }) => theme.spacing.s} ${({ theme }) => theme.spacing.s}
        ${({ theme }) => theme.spacing.nil} ${({ theme }) => theme.spacing.nil};

    @media (max-width: ${({ theme }) => theme.media.smallTablet}) {
        box-shadow: ${({ theme }) => theme.shadow.modal};
        width: 100%;
        height: calc(100% - 80px);
        border-radius: ${({ theme }) => theme.spacing.l} ${({ theme }) => theme.spacing.l}
            ${({ theme }) => theme.spacing.nil} ${({ theme }) => theme.spacing.nil};
    }
`;

const Padding = styled.div`
    @media (min-width: ${({ theme }) => theme.media.smallTablet}) {
        padding: ${({ theme }) => theme.spacing.nil} ${({ theme }) => theme.spacing.m} ${({ theme }) => theme.spacing.m}
            ${({ theme }) => theme.spacing.m};
    }
`;

interface Props {
    exitModalCallback: () => void;
    animationDuration: number;
    hide: boolean;
}

export const Modal: React.FC<Props> = ({ children, exitModalCallback, animationDuration, hide }) => {
    const stopPropagationCall = (e: React.SyntheticEvent) => {
        e.stopPropagation();
    };

    useEffect(() => {
        if (children !== null) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [children]);

    const handlers = useSwipeable({
        onSwipedDown: () => exitModalCallback(),
        ...{
            delta: 100,
            preventDefaultTouchmoveEvent: true,
            trackTouch: true,
            trackMouse: false,
            rotationAngle: 0,
        },
    });

    return (
        <Transition in={!hide} timeout={0}>
            {(state) => (
                <Background duration={animationDuration} state={state} {...handlers} onClick={exitModalCallback}>
                    <Wrapper onClick={stopPropagationCall}>
                        <Bar />
                        <Snackbar>
                            <Icons>
                                <RedIcon onClick={exitModalCallback} />
                                <YellowIcon />
                                <GreenIcon />
                            </Icons>
                        </Snackbar>
                        <Padding>{children}</Padding>
                    </Wrapper>
                </Background>
            )}
        </Transition>
    );
};
