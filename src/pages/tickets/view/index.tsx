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
import { useOwnedTickets } from '../../../hooks/api/useOwnedTickets';
import { useTicketTransfers } from '../../../hooks/api/useTicketTransfers';

import { Ticket } from '@phoenixlan/phoenix.js';
import { Skeleton } from '../../../sharedComponents/Skeleton';
import { Header2 } from '../../../sharedComponents/Header2';
import { ShadowBox } from '../../../sharedComponents/boxes/ShadowBox';
import { TicketTransfer } from './TicketTransfer';

const BuyTicketPrompt = styled.div`
    text-align: center;
`;

const TutorialContainer = styled(ShadowBox)`
    padding: ${({ theme }) => theme.spacing.m};
`;

const TicketTransferContainer = styled.div`
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
`;

export const Tickets: React.FC = () => {
    const history = useHistory();
    const { client } = useAuth();
    const { data: currentEvent, isLoading: isLoadingCurrentEvent } = useCurrentEvent();
    const { data: ownedTickets } = useOwnedTickets();
    const { data: ticketTransfers } = useTicketTransfers();

    const buyTickets = () => {
        history.push('/buy');
    };

    const currentTickets = (ownedTickets ?? [])
        .filter((ticket: Ticket.FullTicket) => ticket.event_uuid === (currentEvent?.uuid ?? false))
        .sort((a, b) => a.ticket_id - b.ticket_id);
    const oldTickets = (ownedTickets ?? [])
        .filter((ticket: Ticket.FullTicket) => ticket.event_uuid !== (currentEvent?.uuid ?? false))
        .sort((a, b) => a.ticket_id - b.ticket_id);

    const currentTicketsSeatable = currentTickets.filter((ticket) => ticket.ticket_type.seatable);
    const currentTicketsNotSeatable = currentTickets.filter((ticket) => !ticket.ticket_type.seatable);

    return (
        <Skeleton loading={isLoadingCurrentEvent}>
            <CenterBox centerVertically={false}>
                {(ticketTransfers ?? []).length > 0 ? (
                    <>
                        <Header1>Billett-overf??ringer</Header1>
                        <TicketTransferContainer>
                            {(ticketTransfers ?? []).map((transfer) => (
                                <TicketTransfer key={transfer.uuid} transfer={transfer} />
                            ))}
                        </TicketTransferContainer>
                    </>
                ) : null}
                <Header1>Billetter til {currentEvent?.name ?? '(laster)'}</Header1>
                <TicketCarousel tickets={currentTicketsSeatable} />
                {currentTicketsSeatable.length === 0 ? (
                    <BuyTicketPrompt>
                        <p>Du har ingen billetter.</p>
                        <PositiveButton onClick={buyTickets}>Kj??p billetter</PositiveButton>
                    </BuyTicketPrompt>
                ) : null}
                {currentTicketsNotSeatable.length > 0 ? (
                    <>
                        <Header1>Andre ting for {currentEvent?.name ?? '(laster)'}</Header1>
                        <TicketCarousel used={true} tickets={currentTicketsNotSeatable} />
                    </>
                ) : null}
                {oldTickets.length > 0 ? (
                    <>
                        <Header1>Tidligere kj??p</Header1>
                        <TicketCarousel used={true} tickets={oldTickets} />
                    </>
                ) : null}
                <TutorialContainer>
                    <Header2>Hvordan fungerer overf??rte billetter?</Header2>
                    <p>
                        Du kan overf??re billetter du har kj??pt til andre. Dette gj??r du ved ?? trykke p?? billetten, velge
                        &quot;overf??r billett&quot;, og skrive inn e-post addressen til mottakeren.
                    </p>
                    <p>
                        Du vil f?? 24 timer p?? ?? angre overf??ringen, skulle du ha sent billetten til feil person.
                        Mottakeren er ogs?? informert om at overf??ringen kan angres i 24 timer. Alle overf??ringer er
                        loggf??rt, og mottakeren vil bli informert dersom overf??ringen blir angret.
                    </p>
                </TutorialContainer>
                <TutorialContainer>
                    <Header2>Hva er en seater? Hva gj??r vi om vi er en gruppe?</Header2>
                    <p>
                        Du kan gi en annen person rettigheter til ?? plassere billetten din for deg, slik at en person
                        kan seate vennegjengen deres samlet. Trykk p?? en billett for ?? gj??re dette.
                    </p>
                    <p>
                        Dere kan ogs?? kj??pe billettene samlet og overf??re til riktig eier senere. Husk i s??fall ?? kj??pe
                        riktig billett til riktig person - folk med eksisterende medlemskap i Radar Event trenger ikke ??
                        kj??pe et nytt medlemskap. Folk uten medlemskap i Radar Event er n??dt til ?? ha en billett med
                        medlemskap(Eller den mye dyrere billetten for ikke-medlemmer). Det g??r ogs?? an ?? kj??pe
                        medlemskap separat senere.
                    </p>
                    <p>
                        <b>
                            Billetten M?? v??re overf??rt til riktig bruker innen LANet starter - ellers slipper du ikke
                            inn!
                        </b>
                    </p>
                </TutorialContainer>
            </CenterBox>
        </Skeleton>
    );
};
