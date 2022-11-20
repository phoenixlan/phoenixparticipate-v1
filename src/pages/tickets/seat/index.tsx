import React, { useState } from 'react';
import styled from 'styled-components';
import { useSeatableTickets } from '../../../hooks/api/useSeatableTickets';
import { CenterBox } from '../../../sharedComponents/boxes/CenterBox';
import { Header1 } from '../../../sharedComponents/Header1';
import { Skeleton } from '../../../sharedComponents/Skeleton';
import { SeatmapRenderer } from './SeatmapRenderer';
import { TicketSelector } from './TicketSelector';

const Container = styled.div`
    display: flex;

    @media only screen and (max-width: 800px) {
        flex-direction: column;
    }
`;

export const TicketSeating: React.FC = () => {
    const { data: seatableTickets, isLoading: isSeatableTicketsLoading, refetch } = useSeatableTickets();
    const [selectedTicket, setSelectedTicket] = useState<number | null>(null);

    const onSeatedTicket = (ticket_id: number) => {
        refetch();
    };

    return (
        <Skeleton loading={isSeatableTicketsLoading}>
            <CenterBox centerVertically={false}>
                <Header1>Seating</Header1>
                <Container>
                    <TicketSelector
                        tickets={seatableTickets?.sort((a, b) => a.ticket_id - b.ticket_id) ?? []}
                        activeTicket={selectedTicket}
                        onTicketSelected={setSelectedTicket}
                    />
                    <SeatmapRenderer activeTicket={selectedTicket} onSeatedTicket={onSeatedTicket} />
                </Container>
            </CenterBox>
        </Skeleton>
    );
};
