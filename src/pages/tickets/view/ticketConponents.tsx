import React from 'react';
import styled from 'styled-components';

export const Title = styled.span`
    color: ${({ theme }) => theme.colors.Black};
    font-size: ${({ theme }) => theme.fontSize.m};
`;

export const SubTitle = styled.span`
    color: ${({ theme }) => theme.colors.DarkGray};
    padding-right: ${({ theme }) => theme.spacing.s};
`;

export const Row = styled.div`
    width: 100%;
    display: flex;
    flex-direction: Row;
`;

export const Seat = styled(Row)`
    justify-content: space-around;
    display: flex;
    flex-direction: row;
`;

export const SeatRow = styled.div`
    display: flex;
    flex-direction: column;
`;

export const Corner = styled.div<{ left: boolean; top: boolean }>`
    position: absolute;
    ${({ top }) => (top ? 'top' : 'bottom')}: 0px;
    ${({ left }) => (left ? 'left' : 'right')}: 0px;

    &:before {
        content: '';
        position: absolute;
        top: -19px;
        ${({ left }) => (left ? 'left' : 'right')}: -19px;
        height: 30px;
        width: 30px;
        z-index: 1;
        border: 1px solid gray;
        border-radius: 100%;
        background: white;
    }
`;
