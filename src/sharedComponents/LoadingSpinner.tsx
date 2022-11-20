/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import React from 'react';
import styled from 'styled-components';
import { keyframes } from 'styled-components';

const spin = keyframes`
    to {
        transform: translate(-50%, -50%) rotate(360deg);
    }
`;

const InlineLoaderOuter = styled.div`
    width: 100%;
    min-height: 4em;

    display: flex;
    justify-content: center;
    align-items: center;
`;

const InlineLoader = styled.div`
    border: 0.25rem solid hsla(0, 0%, 0%, 0.5);
    border-right-color: #000;
    display: inline-block;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    animation: ${spin} 1s linear infinite;
    transform: translate(-50%, -50%);
`;

const Loader = styled.div`
    border: 0.25rem solid hsla(0, 0%, 0%, 0.5);
    border-right-color: #000;
    display: inline-block;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    animation: ${spin} 1s linear infinite;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
`;

export const LoadingSpinner: React.FC = () => {
    return <Loader />;
};

export const InlineSpinner: React.FC = () => {
    return (
        <InlineLoaderOuter>
            <InlineLoader />
        </InlineLoaderOuter>
    );
};
