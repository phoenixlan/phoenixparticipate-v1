/*
 * @created 31/03/2021 - 23:35
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import styled from 'styled-components';
import React from 'react';
import { NumberInput } from '../../../../../sharedComponents/forms/NumberInput';
import { useMembershipStatus } from '../../../../../hooks/api/useMembershipStatus';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
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

const Row = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
`;

const WarningSymbol = styled.span`
    color: orange;
    font-size: 1.5em;
    padding: ${({ theme }) => theme.spacing.s};
`;

interface Props {
    amount: number;
    price: number;
    name: string;
    uuid: string;
    grantsMembership: boolean;
    description?: string;
    max: number;
    enabled: boolean;
    isSeatable: boolean;
}

export const TypeRow: React.FC<Props> = ({
    amount,
    price,
    name,
    uuid,
    description,
    max,
    enabled,
    grantsMembership,
    isSeatable,
}) => {
    const { data: membershipStatus, isLoading: isMembershipStatusLoading } = useMembershipStatus();

    return (
        <Container>
            <Row>
                {membershipStatus && grantsMembership ? <WarningSymbol>⚠</WarningSymbol> : null}
                <Name>{name}</Name>
                <Description>{description}</Description>
                <Price>{`${price},-`}</Price>
                {enabled ? (
                    <>
                        <NumberInput name={uuid} max={max} />
                        <FullPrice>{`${amount * price},-`}</FullPrice>
                    </>
                ) : null}
            </Row>
            {membershipStatus && grantsMembership ? (
                <Row>
                    {isSeatable ? (
                        <b>
                            Du har allerede et Radar Event medlemskap for dette året ifølge våre systemer, så du kan
                            kjøpe den billigere billetten i stedet.
                        </b>
                    ) : (
                        <b>Du har allerede et Radar Event medlemskap for dette året ifølge våre systemer</b>
                    )}
                </Row>
            ) : null}
        </Container>
    );
};
