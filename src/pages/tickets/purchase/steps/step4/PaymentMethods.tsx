/*
 * @created 05/04/2021 - 14:21
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import React from 'react';
import styled from 'styled-components';
import { PaymentMethod } from './PaymentMethod';
import { Header2 } from '../../../../../sharedComponents/Header2';
import { TicketType } from '@phoenixlan/phoenix.js';
import { ChosenTicketType, PaymentMethodType } from '../../utils/types';
import { useSiteConfig } from '../../../../../hooks/api/useSiteConfig';
import { PositiveButton } from '../../../../../sharedComponents/forms/Button';

const Container = styled.div``;

const Receipt = {
    Table: styled.table`
        width: 100%;
        border-collapse: collapse;
        margin-bottom: ${({ theme }) => theme.spacing.l};
    `,
    HeaderCell: styled.th<{ alignRight?: boolean }>`
        text-align: ${({ alignRight }) => (alignRight ? 'right' : 'left')};
        padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.xxs};
        border-bottom: 2px solid ${({ theme }) => theme.colors.Gray};
    `,
    Cell: styled.td<{ alignRight?: boolean }>`
        text-align: ${({ alignRight }) => (alignRight ? 'right' : 'left')};
        padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.xxs};
        border-bottom: 1px dashed ${({ theme }) => theme.colors.Gray};
        white-space: ${({ alignRight }) => (alignRight ? 'nowrap' : 'normal')};
    `,
    TotalCell: styled.td<{ alignRight?: boolean }>`
        text-align: ${({ alignRight }) => (alignRight ? 'right' : 'left')};
        padding: ${({ theme }) => theme.spacing.s} ${({ theme }) => theme.spacing.xxs};
        border-top: 2px solid ${({ theme }) => theme.colors.Black};
        font-weight: bold;
        font-size: ${({ theme }) => theme.fontSize.M};
    `,
};

interface Props {
    isFree: boolean;
    chosenTickets: ChosenTicketType;
    ticketTypes: Array<TicketType.TicketType>;
    onClick: (paymentMethod: PaymentMethodType) => void;
}

export const PaymentMethods: React.FC<Props> = ({ isFree, chosenTickets, ticketTypes, onClick }) => {
    const { data: siteConfig } = useSiteConfig();
    const features = siteConfig?.features ?? [];

    const chosenTicketTypes = ticketTypes.filter((ticketType) => Number(chosenTickets[ticketType.uuid]) > 0);
    const total = chosenTicketTypes.reduce(
        (sum, ticketType) => sum + ticketType.price * Number(chosenTickets[ticketType.uuid]),
        0,
    );

    const receipt = (
        <>
            <Header2 center={false}>Du kjøper</Header2>
            <Receipt.Table>
                <thead>
                    <tr>
                        <Receipt.HeaderCell>Billett</Receipt.HeaderCell>
                        <Receipt.HeaderCell alignRight={true}>Antall</Receipt.HeaderCell>
                        <Receipt.HeaderCell alignRight={true}>Pris</Receipt.HeaderCell>
                        <Receipt.HeaderCell alignRight={true}>Sum</Receipt.HeaderCell>
                    </tr>
                </thead>
                <tbody>
                    {chosenTicketTypes.map((ticketType) => (
                        <tr key={ticketType.uuid}>
                            <Receipt.Cell>{ticketType.name}</Receipt.Cell>
                            <Receipt.Cell alignRight={true}>{chosenTickets[ticketType.uuid]}</Receipt.Cell>
                            <Receipt.Cell alignRight={true}>{ticketType.price},-</Receipt.Cell>
                            <Receipt.Cell alignRight={true}>
                                {ticketType.price * Number(chosenTickets[ticketType.uuid])},-
                            </Receipt.Cell>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <Receipt.TotalCell colSpan={3}>Totalt</Receipt.TotalCell>
                        <Receipt.TotalCell alignRight={true}>{total},-</Receipt.TotalCell>
                    </tr>
                </tfoot>
            </Receipt.Table>
        </>
    );

    if (isFree) {
        return (
            <Container>
                {receipt}
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
            {receipt}
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
