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
import { useAuth } from '../../../authentication/useAuth';

const Container = styled.div`
    display: flex;
    flex-direction: row;
`;

const Hidden = styled.div`
    visibility: hidden;
`;

const Visibility = styled.div<{ visible: boolean }>`
    ${({ visible }) => !visible && 'opacity: 0.4'};
`;

export const TicketCarousel: React.FC = () => {
    const { show, remove } = useModal();
    const { client } = useAuth();

    const tickets = client.user?.owned_tickets ?? [];
    console.log(tickets);

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
            <SnapList direction={'horizontal'} ref={snapList}>
                {tickets.map((ticket: PhoenixTicket.BasicTicket, index: number) => {
                    return (
                        <SnapItem key={ticket.ticket_id} margin={{ left: '15px', right: '15px' }} snapAlign="center">
                            {index > tickets.length - 1 ? (
                                <Hidden>
                                    <Ticket ticket={ticket} qr={'placeholder'} />
                                </Hidden>
                            ) : (
                                <Visibility visible={visible === index}>
                                    <Ticket ticket={ticket} onClick={() => showTicket(index)} qr={'placeholder'} />
                                </Visibility>
                            )}
                        </SnapItem>
                    );
                })}
            </SnapList>
        </Container>
    );
};
