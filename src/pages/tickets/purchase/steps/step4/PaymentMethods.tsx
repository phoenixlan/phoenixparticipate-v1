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
import { PositiveButton } from '../../../../../sharedComponents/forms/Button';

const Container = styled.div``;

interface Props {
    isFree: boolean;
    onClick: (paymentMethod: PaymentMethodType) => void;
}

export const PaymentMethods: React.FC<Props> = ({ isFree, onClick }) => {
    const { data: siteConfig } = useSiteConfig();
    const features = siteConfig?.features ?? [];

    if (isFree) {
        return (
            <Container>
                <Header2 center={false}>Betalingsmetoder</Header2>
                <p>Du har bare valgt billetter som er gratis, og trenger ikke å betale.</p>
                <PositiveButton fluid={true} onClick={() => onClick(PaymentMethodType.free)}>
                    Bekreft - gi meg billettene
                </PositiveButton>
            </Container>
        );
    }

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
