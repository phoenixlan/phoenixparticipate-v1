import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSeatableTickets } from '../../../hooks/api/useSeatableTickets';
import { CenterBox } from '../../../sharedComponents/boxes/CenterBox';
import { Header1 } from '../../../sharedComponents/Header1';
import { Skeleton } from '../../../sharedComponents/Skeleton';
import { Ticket } from '@phoenixlan/phoenix.js';
import { Header2 } from '../../../sharedComponents/Header2';

const Container = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
`;
interface TicketComponentProps {
    selected: boolean;
}

const TicketComponent = styled.div<TicketComponentProps>`
    box-sizing: border-box;
    cursor: pointer;

    user-select: none;
    -webkit-user-select: none;

    width: calc(100% - ${({ theme }) => theme.spacing.s}*2);
    border: 1px solid #000;
    padding: ${({ theme }) => theme.spacing.m};
    margin: ${({ theme }) => theme.spacing.s};
    box-shadow: ${({ theme }) => theme.spacing.xxs} ${({ theme }) => theme.spacing.xxs}
        ${({ theme }) => theme.spacing.xs} gray;
    :hover {
        background-color: ${({ theme }) => theme.colors.Gray};
    }

    ${({ selected, theme }) => (selected ? 'background-color: ' + theme.colors.DarkGray : '')}
`;

interface TicketSelectorProps {
    tickets: Array<Ticket.FullTicket>;
    activeTicket: number | null;
    onTicketSelected: (ticket_id: number) => void;
}

const TicketData = styled.div`
    font-size: 1.3em;
`;
const TicketOwner = styled.div``;

export const TicketSelector: React.FC<TicketSelectorProps> = ({ tickets, activeTicket, onTicketSelected }) => {
    // When the ticket list is first loaded, set a default.
    useEffect(() => {
        if (tickets.length != 0) {
            onTicketSelected(tickets[0].ticket_id);
        }
    }, [tickets.length]);
    return (
        <Container>
            <Header2>Billetter du kan seate</Header2>
            {tickets.map((ticket) => (
                <TicketComponent
                    key={ticket.ticket_id}
                    selected={activeTicket == ticket.ticket_id}
                    onClick={() => {
                        onTicketSelected(ticket.ticket_id);
                    }}
                >
                    <TicketData>
                        #{ticket.ticket_id}{' '}
                        {ticket.seat ? `Rad ${ticket.seat?.row.row_number} Sete ${ticket.seat?.number}` : 'Ikke seatet'}
                    </TicketData>
                    <TicketOwner>
                        Eier: {ticket.owner.firstname} {ticket.owner.lastname}
                    </TicketOwner>
                </TicketComponent>
            ))}
        </Container>
    );
};
