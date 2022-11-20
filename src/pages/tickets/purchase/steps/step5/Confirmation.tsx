/*
 * @created 05/04/2021 - 14:21
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import React from 'react';
import styled from 'styled-components';
import { Header2 } from '../../../../../sharedComponents/Header2';
import { PositiveButton } from '../../../../../sharedComponents/forms/Button';
import { ChosenTicketType, PaymentMethodType } from '../../utils/types';
import { TicketType } from '@phoenixlan/phoenix.js';
import { getPaymentMethodLogo } from '../../utils/getPaymentMethodLogo';
import { getPaymentMethodName } from '../../utils/getPaymentMethodName';

const Container = styled.form``;

const Tickets = styled.div`
    border-top: 2px solid ${({ theme }) => theme.colors.SemiDarkGray};
    border-bottom: 2px solid ${({ theme }) => theme.colors.SemiDarkGray};
`;

const TicketsCategory = styled.div`
    display: flex;
`;

const TicketsCategoryAmount = styled.span`
    padding: ${({ theme }) => theme.spacing.xxs} ${({ theme }) => theme.spacing.xs};
    margin: ${({ theme }) => theme.spacing.xs};
    margin-left: ${({ theme }) => theme.spacing.nil};
    border-radius: ${({ theme }) => theme.spacing.xxs};
    border: 2px solid ${({ theme }) => theme.colors.accentDark};
`;

const TicketsCategoryName = styled.span`
    flex: 1;
    display: flex;
    align-items: center;
`;

const TicketsCategoryTotal = styled.span`
    display: flex;
    align-items: center;
`;

const Total = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: ${({ theme }) => theme.spacing.m} ${({ theme }) => theme.spacing.nil};
`;

const PaymentMethodOption = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: ${({ theme }) => theme.spacing.m};
`;

const ChosenPaymentMethod = styled.div`
    height: 40px;
    display: flex;
    align-items: center;
`;

const ChosenPaymentMethodName = styled.span`
    margin-left: ${({ theme }) => theme.spacing.s};
`;

const ChangePaymentMethod = styled.span`
    cursor: pointer;
    color: ${({ theme }) => theme.colors.LinkColor};
`;

const PaymentVendor = styled.div`
    border-top: 2px solid ${({ theme }) => theme.colors.SemiDarkGray};
    border-bottom: 2px solid ${({ theme }) => theme.colors.SemiDarkGray};
    padding-top: ${({ theme }) => theme.spacing.m};
`;

interface Props {
    chosenTickets: ChosenTicketType;
    ticketTypes: Array<TicketType.TicketType>;
    chosenPaymentMethod: PaymentMethodType;
    goBack: () => void;
}

export const Confirmation: React.FC<Props> = ({
    children,
    chosenTickets,
    ticketTypes,
    chosenPaymentMethod,
    goBack,
}) => {
    const purchase: Array<{
        name: string;
        amount: number;
        price: number;
    }> = [];

    Object.keys(chosenTickets)
        .filter((ticketType) => chosenTickets[ticketType] > 0)
        .forEach((ticketType) => {
            const ticket = ticketTypes.find((_ticketType) => _ticketType.uuid === ticketType);
            if (!ticket) {
                return;
            }
            purchase.push({
                name: ticket.name,
                amount: chosenTickets[ticket.uuid],
                price: ticket.price,
            });
        });

    return (
        <>
            <Container>
                <Header2 center={false}>Din handlekurv</Header2>
                <Tickets>
                    {purchase.map((ticket) => (
                        <TicketsCategory key={ticket.name}>
                            <TicketsCategoryAmount>{ticket.amount}</TicketsCategoryAmount>
                            <TicketsCategoryName>{ticket.name}</TicketsCategoryName>
                            <TicketsCategoryTotal>{ticket.amount * ticket.price}kr</TicketsCategoryTotal>
                        </TicketsCategory>
                    ))}
                </Tickets>
                <Total>
                    <b>Sum</b>
                    <b>{purchase.reduce((prev, cur) => prev + cur.price * cur.amount, 0)}kr</b>
                </Total>
                <PaymentMethodOption>
                    <ChosenPaymentMethod>
                        {getPaymentMethodLogo(chosenPaymentMethod)}
                        <ChosenPaymentMethodName>{getPaymentMethodName(chosenPaymentMethod)}</ChosenPaymentMethodName>
                    </ChosenPaymentMethod>
                    <ChangePaymentMethod onClick={goBack}>Endre</ChangePaymentMethod>
                </PaymentMethodOption>
                {!children && <PositiveButton fluid={true}>Bekreft Bestilling</PositiveButton>}
            </Container>
            {children && <PaymentVendor>{children}</PaymentVendor>}
        </>
    );
};
