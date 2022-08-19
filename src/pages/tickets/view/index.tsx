/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import React from 'react';
import styled from 'styled-components';
import { Link, useHistory } from 'react-router-dom';

import { CenterBox } from '../../../sharedComponents/boxes/CenterBox';
import { Header1 } from '../../../sharedComponents/Header1';
import { TicketCarousel } from './TicketCarousel';
import { PositiveButton } from '../../../sharedComponents/forms/Button';
import { useAuth } from '../../../authentication/useAuth';
import { useCurrentEvent } from '../../../hooks';

import { Ticket } from '@phoenixlan/phoenix.js';
import { Skeleton } from '../../../sharedComponents/Skeleton';

const BuyTicketPrompt = styled.div`
    text-align: center;
`;

export const Tickets: React.FC = () => {
    const history = useHistory();
    const { client } = useAuth();
    const { data: currentEvent, isLoading: isLoadingCurrentEvent } = useCurrentEvent();

    const buyTickets = () => {
        history.push('/buy');
    };

    const ownedTickets = client.user?.owned_tickets ?? [];
    const currentTickets = ownedTickets.filter(
        (ticket: Ticket.BasicTicket) => ticket.event_uuid === (currentEvent?.uuid ?? false),
    );
    const oldTickets = ownedTickets.filter(
        (ticket: Ticket.BasicTicket) => ticket.event_uuid !== (currentEvent?.uuid ?? false),
    );
    console.log(currentTickets);
    console.log(oldTickets);
    console.log(currentEvent);
    console.log(isLoadingCurrentEvent);

    return (
        <Skeleton loading={isLoadingCurrentEvent}>
            <CenterBox centerVertically={false}>
                <Header1>Billetter til {currentEvent?.name ?? '(laster)'}</Header1>
                <TicketCarousel tickets={currentTickets} />
                {currentTickets.length === 0 ? (
                    <BuyTicketPrompt>
                        <p>Du har ingen billetter.</p>
                        <PositiveButton onClick={buyTickets}>Kjøp billetter</PositiveButton>
                    </BuyTicketPrompt>
                ) : null}
                {oldTickets.length > 0 ? (
                    <>
                        <Header1>Andre billetter</Header1>
                        <TicketCarousel used={true} tickets={oldTickets} />
                    </>
                ) : null}
            </CenterBox>
        </Skeleton>
    );
};
