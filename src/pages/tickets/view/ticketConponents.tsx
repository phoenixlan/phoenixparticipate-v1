import React from 'react';
import styled from 'styled-components';

export const Title = styled.span<{ enlarge: boolean }>`
    color: ${({ theme }) => theme.colors.DarkGray};
    font-size: ${({ theme, enlarge }) => (enlarge ? theme.fontSize.l : theme.fontSize.m)};
`;

export const SubTitle = styled.span`
    color: ${({ theme }) => theme.colors.DarkGray};
`;

export const Row = styled.div`
    width: 100%;
    text-align: center;
    display: flex;
    flex-direction: column;
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
