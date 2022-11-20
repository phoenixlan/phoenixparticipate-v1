/*
 * @created 05/04/2021 - 19:46
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import React from 'react';
import styled from 'styled-components';
import { RightArrow } from '@styled-icons/boxicons-solid/RightArrow';
import { PaymentMethodType } from '../../utils/types';
import { getPaymentMethodLogo } from '../../utils/getPaymentMethodLogo';

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    padding: ${({ theme }) => theme.spacing.m};
    border-top: 1px solid ${({ theme }) => theme.colors.SemiDarkGray};

    &:last-child {
        border-bottom: 1px solid ${({ theme }) => theme.colors.SemiDarkGray};
    }
`;

const Method = styled.div`
    display: flex;
    align-items: center;
`;

const Name = styled.span`
    margin-left: ${({ theme }) => theme.spacing.m};
`;

const LogoContainer = styled.div`
    height: 40px;
`;

interface Props {
    name: PaymentMethodType;
    visibleName: string;
    onClick: (paymentMethod: PaymentMethodType) => void;
}

export const PaymentMethod: React.FC<Props> = ({ name, visibleName, onClick }) => {
    const onPaymentMethodClick = () => {
        onClick(name);
    };

    return (
        <Container onClick={onPaymentMethodClick}>
            <Method>
                <LogoContainer>{getPaymentMethodLogo(name)}</LogoContainer>
                <Name>{visibleName}</Name>
            </Method>
            <RightArrow size="1rem" />
        </Container>
    );
};
