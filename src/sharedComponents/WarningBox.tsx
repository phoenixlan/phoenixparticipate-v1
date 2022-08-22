import React from 'react';
import styled from 'styled-components';
import { Header2 } from './Header2';
import { ShadowBox } from './boxes/ShadowBox';

const Container = styled(ShadowBox)`
    background-color: ${({ theme }) => theme.colors.SnackbarYellow};
    padding: ${({ theme }) => theme.spacing.m};
`;

const Message = styled.div``;

interface WarningBoxProps {
    title: string;
}

export const WarningBox: React.FC<WarningBoxProps> = ({ title, children }) => {
    return (
        <Container>
            <Header2>{title}</Header2>
            <Message>{children}</Message>
        </Container>
    );
};
