/*
 * @created 05/04/2021 - 14:21
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import React from 'react';
import styled from 'styled-components';
import { PaymentMethod } from './PaymentMethod';
import { Header2 } from '../../../../../sharedComponents/Header2';
import { PaymentMethodType } from '../../utils/types';
import { useSiteConfig } from '../../../../../hooks/api/useSiteConfig';

const Container = styled.div``;

interface Props {
    onClick: (paymentMethod: PaymentMethodType) => void;
}

export const PaymentMethods: React.FC<Props> = ({ onClick }) => {
    const { data: siteConfig } = useSiteConfig();
    const features = siteConfig?.features ?? [];

    return (
        <Container>
            <Header2 center={false}>Betalingsmetoder</Header2>
            {features.includes('vipps') && (
                <PaymentMethod onClick={onClick} name={PaymentMethodType.vipps} visibleName="Vipps" />
            )}
            {features.includes('stripe') && (
                <PaymentMethod onClick={onClick} name={PaymentMethodType.card} visibleName="Kort" />
            )}
        </Container>
    );
};
