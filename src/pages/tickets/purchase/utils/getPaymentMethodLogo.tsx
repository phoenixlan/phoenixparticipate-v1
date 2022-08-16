/*
 * @created 05/04/2021 - 23:23
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import React from 'react';
import { PaymentMethodType } from './types';
import Card from '../../../../assets/card.svg';
import Vipps from '../../../../assets/vipps_mark.svg';
import styled from 'styled-components';

const StyledCard = styled(Card)`
    height: 100%;
`;

const StyledVipps = styled(Vipps)`
    height: 100%;
`;

export const getPaymentMethodLogo: (paymentOption: PaymentMethodType) => JSX.Element | undefined = (
    paymentOption: PaymentMethodType,
) => {
    switch (paymentOption) {
        case PaymentMethodType.vipps:
            return <StyledVipps />;
        case PaymentMethodType.card:
            return <StyledCard />;
    }
};
