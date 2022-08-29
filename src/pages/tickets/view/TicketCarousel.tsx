/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Ticket as PhoenixTicket } from '@phoenixlan/phoenix.js';
import { SnapList, SnapItem, useVisibleElements, useScroll } from 'react-snaplist-carousel';
import { Ticket } from './Ticket';
import { useSwipeable } from 'react-swipeable';
import { useModal } from '../../../sharedComponents/modal/useModal';

const Container = styled.div`
    display: flex;
    flex-direction: row;
`;
const TicketContainer = styled.div`
    display: flex;
    justify-content: space-around;
    width: 100%;
    flex-wrap: wrap;
`;

const OuterContainer = styled.div``;

const Hidden = styled.div`
    visibility: hidden;
`;

const Visibility = styled.div<{ visible: boolean }>`
    ${({ visible }) => !visible && 'opacity: 0.4'};
`;

interface TicketCarouselProps {
    tickets: Array<PhoenixTicket.FullTicket>;
    used?: boolean;
}

export const TicketCarousel: React.FC<TicketCarouselProps> = ({ tickets, used }) => {
    const { show, remove } = useModal();

    const snapList = useRef<HTMLDivElement | null>(null);
    /*
    useEffect(() => {
        const ticketWidth = 165;
        if (snapList.current !== null) {
            const ticketsWidth = tickets.length * ticketWidth;
            console.log(ticketsWidth);
            if (ticketsWidth > snapList.current?.clientWidth) {
                const emptyTicket = [];
                const count = Math.floor(snapList.current?.clientWidth / ticketWidth) - 1;
                for (let i = 0; i < count; i++) {
                    const newTicket = {
                        id: `empty${i}`,
                        name: 'empty',
                        row: 0,
                        seat: 0,
                        date: new Date(),
                        qr: 'empty',
                    };
                    emptyTicket.push(newTicket);
                }
                setTickets([..._tickets, ...emptyTicket]);
            }
        }
    }, [_tickets, snapList]);
*/
    const visible = useVisibleElements({ debounce: 10, ref: snapList }, (elements) => {
        return elements[0];
    });

    // This is needed to not trigger the Sidebar onSwipe.
    // If this wasnt here the sidebar would open when you swipped to hard to the right
    // to view your tickets.
    const handlers = useSwipeable({
        onSwiping: ({ event }) => {
            event.stopPropagation();
        },
    });

    const showTicket = (index: number) => {
        show(<Ticket ticket={tickets[index]} qr={'placeholder'} showQr={true} enlarge={true} />);
    };

    return (
        <Container {...handlers}>
            <TicketContainer>
                {tickets.map((ticket: PhoenixTicket.FullTicket, index: number) => {
                    return (
                        <SnapItem key={ticket.ticket_id} margin={{ left: '15px', right: '15px' }} snapAlign="center">
                            {index > tickets.length - 1 ? (
                                <Hidden>
                                    <Ticket ticket={ticket} qr={`PHOENIX-${ticket.ticket_id}`} />
                                </Hidden>
                            ) : (
                                <Ticket
                                    ticket={ticket}
                                    onClick={() => showTicket(index)}
                                    qr={`PHOENIX_TICKET_${ticket.ticket_id}`}
                                />
                            )}
                        </SnapItem>
                    );
                })}
            </TicketContainer>
        </Container>
    );
};
