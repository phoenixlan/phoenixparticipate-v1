import React from 'react';
import styled from 'styled-components';
import { Header2 } from './Header2';
import { ShadowBox } from './boxes/ShadowBox';
import theme from '../theme';

interface ContainerProps {
    color: string;
}

const Container = styled(ShadowBox)<ContainerProps>`
    border: 0.25em solid ${({ color }) => color};
    border-radius: 0.5rem;
    padding: ${({ theme }) => theme.spacing.m};
`;

const Message = styled.div``;

interface NoticeProps {
    title: string;
    children?: React.ReactNode;
}

type NoticeBoxProps = NoticeProps & {
    color?: string;
};

export const NoticeBox: React.FC<NoticeBoxProps> = ({ title, children, color }) => {
    return (
        <Container color={color ?? theme.colors.SnackbarYellow}>
            <Header2>{title}</Header2>
            <Message>{children}</Message>
        </Container>
    );
};

export const InfoBox: React.FC<NoticeProps> = ({ title, children }) => {
    return (
        <NoticeBox title={title} color={theme.colors.infoBlue}>
            {children}
        </NoticeBox>
    );
};

export const WarningBox: React.FC<NoticeProps> = ({ title, children }) => {
    return (
        <NoticeBox title={title} color={theme.colors.SnackbarYellow}>
            {children}
        </NoticeBox>
    );
};
