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

    border-top: 1px solid ${({ theme }) => theme.colors.Gray};
    border-bottom: 1px solid ${({ theme }) => theme.colors.Gray};
`;

const Center = styled.div`
    text-align: center;
`;

const Name = styled.div`
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: ${({ theme }) => theme.spacing.xxs};
`;

const Description = styled.div``;

const Availability = styled.div`
    font-weight: bold;
    margin-top: ${({ theme }) => theme.spacing.xxs};
`;

const TicketPresentation = styled.div`
    flex: 5;
    padding: ${({ theme }) => theme.spacing.xxs};

    @media (max-width: ${({ theme }) => theme.media.smallTablet}) {
        flex-basis: 100%;
    }
`;

const Price = styled(Center)`
    flex: 1;

    @media (max-width: ${({ theme }) => theme.media.smallTablet}) {
        text-align: left;
        padding: ${({ theme }) => theme.spacing.xxs};
    }
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

    padding: ${({ theme }) => theme.spacing.m} 0 ${({ theme }) => theme.spacing.m} 0;
`;

// On mobile the price and ticket selector go on their own line under the ticket text
const TicketRow = styled(Row)`
    @media (max-width: ${({ theme }) => theme.media.smallTablet}) {
        flex-wrap: wrap;
    }
`;

const WarningSymbol = styled.span`
    color: orange;
    font-size: 1.5em;
    padding: ${({ theme }) => theme.spacing.s};
`;

interface Props {
    price: number;
    name: string;
    uuid: string;
    grantsMembership: boolean;
    grantsAdmission: boolean;
    description?: string;
    max: number;
    enabled: boolean;
    isSeatable: boolean;
    // How many tickets of this type are left, not counting the ones in the cart. null if unlimited
    remaining?: number | null;
}

// Only show the remaining count when it is low enough to matter
const LOW_AVAILABILITY_THRESHOLD = 10;

export const TypeRow: React.FC<Props> = ({
    price,
    name,
    uuid,
    description,
    max,
    enabled,
    grantsMembership,
    grantsAdmission,
    isSeatable,
    remaining = null,
}) => {
    const { data: membershipStatus, isLoading: isMembershipStatusLoading } = useMembershipStatus();

    const getAvailabilityText = () => {
        if (remaining === null || remaining >= LOW_AVAILABILITY_THRESHOLD) {
            return null;
        }
        if (remaining === 0) {
            return 'Utsolgt';
        }
        return `Kun ${remaining} igjen`;
    };
    const availabilityText = getAvailabilityText();

    return (
        <Container>
            <TicketRow>
                <TicketPresentation>
                    <Name>
                        {membershipStatus && grantsMembership ? <WarningSymbol>⚠</WarningSymbol> : null}
                        {name}
                    </Name>
                    <Description>{description}</Description>
                    {availabilityText ? <Availability>{availabilityText}</Availability> : null}
                </TicketPresentation>
                <Price>{`${price},-`}</Price>
                {enabled ? (
                    <>
                        <NumberInput name={uuid} max={max} />
                    </>
                ) : null}
            </TicketRow>
            {membershipStatus && grantsMembership ? (
                <Row>
                    {grantsAdmission ? (
                        <b>
                            Du har allerede et medlemskap for dette året ifølge våre systemer, så du kan kjøpe den
                            billigere billetten i stedet. Kjøp bare denne billetten om du skal kjøpe for venner som ikke
                            har medlemskap. Kjøp bare denne billetten om du skal kjøpe for venner som ikke har
                            medlemskap.
                        </b>
                    ) : (
                        <b>Du har allerede et medlemskap for dette året ifølge våre systemer</b>
                    )}
                </Row>
            ) : null}
        </Container>
    );
};
