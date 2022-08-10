/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import React from 'react';

import { CenterBox } from '../../sharedComponents/boxes/CenterBox';
import { Header1 } from '../../sharedComponents/Header1';
import { TicketCarousel } from './TicketCarousel';

export const Tickets: React.FC = () => {
    const tickets = [
        {
            id: 'Ticket1',
            name: '1 Andreas Jensen Jonassen',
            row: 10,
            seat: 10,
            qr: 'test',
            date: new Date(),
        },
        {
            id: 'Ticket2',
            name: '2 Andreas Jensen Jonassen',
            row: 10,
            seat: 10,
            qr: 'test',
            date: new Date(),
        },
        {
            id: 'Ticket3',
            name: '3 Andreas Jensen Jonassen',
            row: 10,
            seat: 10,
            qr: 'test',
            date: new Date(),
        },
        {
            id: 'Ticket4',
            name: '4 Andreas Jensen Jonassen',
            row: 10,
            seat: 10,
            qr: 'test',
            date: new Date(),
        },
        {
            id: 'Ticket5',
            name: '5 Andreas Jensen Jonassen',
            row: 10,
            seat: 10,
            qr: 'test',
            date: new Date(),
        },
        {
            id: 'Ticket6',
            name: '6 Andreas Jensen Jonassen',
            row: 10,
            seat: 10,
            qr: 'test',
            date: new Date(),
        },
        {
            id: 'Ticket7',
            name: '7 Andreas Jensen Jonassen',
            row: 10,
            seat: 10,
            qr: 'test',
            date: new Date(),
        },
    ];
    return (
        <CenterBox centerVertically={false}>
            <Header1>Tickets</Header1>
            <TicketCarousel _tickets={tickets} />
        </CenterBox>
    );
};
