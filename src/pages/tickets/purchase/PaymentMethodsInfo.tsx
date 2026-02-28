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
import { useSiteConfig } from '../../../hooks/api/useSiteConfig';

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

const featureFlagByPaymentMethod: Record<string, string> = {
    [PaymentMethodType.vipps]: 'vipps',
    [PaymentMethodType.card]: 'stripe',
};

export const PaymentMethodsInfo: React.FC = () => {
    const { data: siteConfig } = useSiteConfig();
    const features = siteConfig?.features ?? [];

    const createPaymentMethodElement = (paymentMethod: PaymentMethodType) => {
        const flag = featureFlagByPaymentMethod[paymentMethod];
        if (!flag || !features.includes(flag)) {
            return null;
        }
        const logo = getPaymentMethodLogo(paymentMethod);
        if (logo) {
            return (
                <PaymentMethod key={paymentMethod}>
                    {logo}
                    <PaymentMethodText>{getPaymentMethodName(paymentMethod)}</PaymentMethodText>
                </PaymentMethod>
            );
        }
    };

    const enabledMethods = Object.values(PaymentMethodType).filter((pm) => {
        const flag = featureFlagByPaymentMethod[pm];
        return flag && features.includes(flag);
    });

    if (enabledMethods.length === 0) {
        return null;
    }

    return (
        <Container>
            <PaymentHeader>Du kan betale med:</PaymentHeader>
            <PaymentMethods>
                {Object.values(PaymentMethodType).map((paymentMethod) => createPaymentMethodElement(paymentMethod))}
            </PaymentMethods>
        </Container>
    );
};
