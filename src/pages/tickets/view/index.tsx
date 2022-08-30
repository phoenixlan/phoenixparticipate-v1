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
import { useOwnedTickets } from '../../../hooks/api/useOwnedTickets';
import { Header2 } from '../../../sharedComponents/Header2';
import { ShadowBox } from '../../../sharedComponents/boxes/ShadowBox';

const BuyTicketPrompt = styled.div`
    text-align: center;
`;

const TutorialContainer = styled(ShadowBox)`
    padding: ${({ theme }) => theme.spacing.m};
`;

export const Tickets: React.FC = () => {
    const history = useHistory();
    const { client } = useAuth();
    const { data: currentEvent, isLoading: isLoadingCurrentEvent } = useCurrentEvent();
    const { data: ownedTickets } = useOwnedTickets();

    const buyTickets = () => {
        history.push('/buy');
    };

    const currentTickets = (ownedTickets ?? [])
        .filter((ticket: Ticket.FullTicket) => ticket.event_uuid === (currentEvent?.uuid ?? false))
        .sort((a, b) => a.ticket_id - b.ticket_id);
    const oldTickets = (ownedTickets ?? [])
        .filter((ticket: Ticket.FullTicket) => ticket.event_uuid !== (currentEvent?.uuid ?? false))
        .sort((a, b) => a.ticket_id - b.ticket_id);

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
                <TutorialContainer>
                    <Header2>Hva er en seater? Hva gjør vi om vi er en gruppe?</Header2>
                    <p>
                        Du kan gi en annen person rettigheter til å plassere billetten din for deg, slik at en person
                        kan seate vennegjengen deres samlet. Trykk på en billett for å gjøre dette.
                    </p>
                    <p>
                        Dere kan også kjøpe billettene samlet og overføre til riktig eier senere. Det vil være mulighet
                        for å overføre billetter i løpet av uken.
                    </p>
                    <p>
                        <b>
                            Billetten MÅ være overført til riktig bruker innen LANet starter - ellers slipper du ikke
                            inn!
                        </b>
                    </p>
                </TutorialContainer>
            </CenterBox>
        </Skeleton>
    );
};
