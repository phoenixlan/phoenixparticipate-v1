import React from 'react';
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
    const { data: seatableTickets, isLoading: isSeatableTicketsLoading } = useSeatableTickets();
    return (
        <Skeleton loading={isSeatableTicketsLoading}>
            <CenterBox centerVertically={false}>
                <Header1>Seating</Header1>
                <Container>
                    <TicketSelector tickets={seatableTickets ?? []} />
                    <SeatmapRenderer />
                </Container>
            </CenterBox>
        </Skeleton>
    );
};
