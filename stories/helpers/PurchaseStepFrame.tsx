import React from 'react';
import styled from 'styled-components';
import { CenterBox } from '../../src/sharedComponents/boxes/CenterBox';
import { ShadowBox } from '../../src/sharedComponents/boxes/ShadowBox';
import { Header1 } from '../../src/sharedComponents/Header1';
import { Tutorial } from '../../src/pages/tickets/purchase/Tutorial';
import { PaymentMethodsInfo } from '../../src/pages/tickets/purchase/PaymentMethodsInfo';
import { AppShell } from './AppShell';

/*
 * The page around a single purchase step. The step lives in Form.tsx's internal state and can't be jumped to from
 * outside, so this repeats the markup of TicketPurchase (pages/tickets/purchase/index.tsx) and Form
 * (pages/tickets/purchase/Form.tsx) around the step component. Keep it in sync if those layouts change.
 */

// Copied from TicketPurchase
const StyledShadowBox = styled(ShadowBox)`
    margin-bottom: ${({ theme }) => theme.spacing.xxl};
`;

// Copied from Form
const Container = styled.div`
    overflow: auto;
    height: 100%;
    padding: ${({ theme }) => theme.spacing.m};
`;

interface Props {
    // Form shows the payment method info box below the first steps only
    showPaymentMethodsInfo?: boolean;
}

export const PurchaseStepFrame: React.FC<Props> = ({ children, showPaymentMethodsInfo = false }) => (
    <AppShell>
        <CenterBox>
            <Header1>Kjøp Billetter</Header1>
            <StyledShadowBox>
                <Tutorial />
            </StyledShadowBox>
            <ShadowBox>
                <Container>{children}</Container>
            </ShadowBox>
            {showPaymentMethodsInfo && (
                <ShadowBox>
                    <PaymentMethodsInfo />
                </ShadowBox>
            )}
        </CenterBox>
    </AppShell>
);
