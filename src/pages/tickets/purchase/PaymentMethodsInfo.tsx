/*
 * @created 12/06/2021 - 17:47
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import React from 'react';
import styled from 'styled-components';
import { PaymentMethodType } from './utils/types';
import { getPaymentMethodLogo } from './utils/getPaymentMethodLogo';
import { getPaymentMethodName } from './utils/getPaymentMethodName';

const Container = styled.div`
    padding: ${({ theme }) => theme.spacing.m};
`;

const PaymentMethods = styled.div`
    display: flex;
    flex-direction: row;
`;

const PaymentMethod = styled.div`
    display: flex;
    flex-direction: column;
    font-size: ${({ theme }) => theme.spacing.s};

    & > svg {
        height: 2rem;
    }
    &:not(:last-child) {
        margin-right: ${({ theme }) => theme.spacing.m};
    }
`;

const PaymentMethodText = styled.span`
    text-align: center;
`;

const PaymentHeader = styled.div`
    margin-bottom: ${({ theme }) => theme.spacing.s};
    font-weight: bold;
`;

export const PaymentMethodsInfo: React.FC = () => {
    const createPaymentMethodElement = (paymentMethod: PaymentMethodType) => {
        const logo = getPaymentMethodLogo(paymentMethod);
        if (logo) {
            return (
                <PaymentMethod>
                    {logo}
                    <PaymentMethodText>{getPaymentMethodName(paymentMethod)}</PaymentMethodText>
                </PaymentMethod>
            );
        }
    };
    return (
        <Container>
            <PaymentHeader>Du kan betale med:</PaymentHeader>
            <PaymentMethods>
                {Object.values(PaymentMethodType).map((paymentMethod) => createPaymentMethodElement(paymentMethod))}
            </PaymentMethods>
        </Container>
    );
};
