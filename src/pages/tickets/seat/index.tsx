import React, { useState } from 'react';
import styled from 'styled-components';
import { useCurrentEvent } from '../../../hooks/api/useCurrentEvent';
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
    const { data: currentEvent, isLoading: isLoadingCurrentEvent } = useCurrentEvent();
    const { data: seatableTickets, isLoading: isSeatableTicketsLoading, refetch } = useSeatableTickets(
        isLoadingCurrentEvent ? null : currentEvent?.uuid,
    );
    const [selectedTicket, setSelectedTicket] = useState<number | null>(null);

    const isLoading = isSeatableTicketsLoading || isLoadingCurrentEvent;

    const onSeatedTicket = (ticket_id: number) => {
        refetch();
    };

    return (
        <Skeleton loading={isLoading}>
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
