/*
 * @created 31/03/2021 - 23:35
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import styled from 'styled-components';
import React from 'react';
import { NumberInput } from '../../../../../sharedComponents/forms/NumberInput';

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    &:not(:last-child) {
        margin-bottom: ${({ theme }) => theme.spacing.m};
    }
`;

const Center = styled.div`
    text-align: center;
`;

const Name = styled.div`
    flex: 2;
    text-align: left;
`;

const Description = styled(Center)`
    flex: 3;
`;

const Price = styled(Center)`
    flex: 1;
`;

const FullPrice = styled.div`
    flex: 1;
    text-align: right;
`;

interface Props {
    amount: number;
    price: number;
    name: string;
    uuid: string;
    description?: string;
    max: number;
}

export const TypeRow: React.FC<Props> = ({ amount, price, name, uuid, description, max }) => {
    return (
        <Container>
            <Name>{name}</Name>
            <Description>{description}</Description>
            <Price>{`${price},-`}</Price>
            <NumberInput name={uuid} max={max} />
            <FullPrice>{`${amount * price},-`}</FullPrice>
        </Container>
    );
};
