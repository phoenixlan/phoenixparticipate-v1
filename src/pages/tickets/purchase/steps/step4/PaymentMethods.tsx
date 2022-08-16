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

const Container = styled.div``;

interface Props {
    onClick: (paymentMethod: PaymentMethodType) => void;
}

export const PaymentMethods: React.FC<Props> = ({ onClick }) => {
    return (
        <Container>
            <Header2 center={false}>Betalingsmetoder</Header2>
            <PaymentMethod onClick={onClick} name={PaymentMethodType.vipps} visibleName="Vipps" />
            <PaymentMethod onClick={onClick} name={PaymentMethodType.card} visibleName="Kort" />
        </Container>
    );
};
