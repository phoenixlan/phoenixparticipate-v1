/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import React from 'react';

import { CenterBox } from '../../../sharedComponents/boxes/CenterBox';
import { Header1 } from '../../../sharedComponents/Header1';
import { TicketCarousel } from './TicketCarousel';

export const Tickets: React.FC = () => {
    return (
        <CenterBox centerVertically={false}>
            <Header1>Tickets</Header1>
            <TicketCarousel />
        </CenterBox>
    );
};
