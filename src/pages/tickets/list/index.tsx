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
import { PositiveButton } from '../../../sharedComponents/forms/Button';

import { useAuth } from '../../../authentication/useAuth';
import { useCurrentEvent } from '../../../hooks';
import { useOwnedTickets } from '../../../hooks/api/useOwnedTickets';
import { useOwnedTicketVouchers } from '../../../hooks/api/useOwnedTicketVouchers';
import { useTicketTransfers } from '../../../hooks/api/useTicketTransfers';

import { Ticket, TicketVoucher } from '@phoenixlan/phoenix.js';
import { Skeleton } from '../../../sharedComponents/Skeleton';
import { Header2 } from '../../../sharedComponents/Header2';
import { ShadowBox } from '../../../sharedComponents/boxes/ShadowBox';
import { TicketTransfer } from './TicketTransfer';
import { TicketEntry } from './TicketEntry';
import { InfoBox } from '../../../sharedComponents/NoticeBox';
import { useSiteConfig } from '../../../hooks/api/useSiteConfig';

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

const TicketEntryContainer = styled.div``;

export const Tickets: React.FC = () => {
    const history = useHistory();
    const { client } = useAuth();
    const { data: currentEvent, isLoading: isLoadingCurrentEvent } = useCurrentEvent();
    const { data: ownedTickets, isLoading: isLoadingOwnedTickets } = useOwnedTickets();
    const { data: ticketVouchers, isLoading: isTicketVouchersLoading } = useOwnedTicketVouchers();
    const { data: ticketTransfers, isLoading: isLoadingTicketTransfers } = useTicketTransfers();
    const { data: siteConfig } = useSiteConfig();
    const features = siteConfig?.features ?? [];

    const isLoading =
        isLoadingCurrentEvent || isLoadingOwnedTickets || isLoadingTicketTransfers || isTicketVouchersLoading;

    const buyTickets = () => {
        history.push('/buy');
    };

    const currentTickets = (ownedTickets ?? [])
        .filter((ticket: Ticket.FullTicket) => ticket.event.uuid === (currentEvent?.uuid ?? false))
        .sort((a, b) => a.ticket_id - b.ticket_id);
    const oldTickets = (ownedTickets ?? [])
        .filter((ticket: Ticket.FullTicket) => ticket.event.uuid !== (currentEvent?.uuid ?? false))
        .sort((a, b) => a.ticket_id - b.ticket_id);

    const currentTicketsSeatable = currentTickets.filter((ticket) => ticket.ticket_type.seatable);
    const currentTicketsNotSeatable = currentTickets.filter((ticket) => !ticket.ticket_type.seatable);

    return (
        <Skeleton loading={isLoading}>
            <CenterBox centerVertically={false}>
                {(ticketVouchers ?? []).filter(
                    (voucher: TicketVoucher.BasicTicketVoucher) => !voucher.is_used && !voucher.is_expired,
                ).length > 0 ? (
                    <InfoBox title="Du har ubrukte billett-gavekort">
                        <p>
                            Du har ubrukte billett-gavekort - dersom du vil delta på arrangementet med de må du først
                            konvertere dem til en billett. Det kan du gjøre her
                        </p>
                    </InfoBox>
                ) : null}
                {(ticketTransfers ?? []).length > 0 ? (
                    <>
                        <Header1>Billett-overføringer</Header1>
                        <TicketTransferContainer>
                            {(ticketTransfers ?? []).map((transfer) => (
                                <TicketTransfer key={transfer.uuid} transfer={transfer} />
                            ))}
                        </TicketTransferContainer>
                    </>
                ) : null}
                <Header1>Billetter til {currentEvent?.name ?? '(laster)'}</Header1>
                <TicketEntryContainer>
                    {currentTicketsSeatable.map((ticket) => (
                        <TicketEntry key={ticket.ticket_id} ticket={ticket} />
                    ))}
                </TicketEntryContainer>
                {currentTicketsSeatable.length === 0 ? (
                    <BuyTicketPrompt>
                        <p>Du har ingen billetter.</p>
                        <PositiveButton onClick={buyTickets}>Kjøp billetter</PositiveButton>
                    </BuyTicketPrompt>
                ) : null}
                {currentTicketsNotSeatable.length > 0 ? (
                    <>
                        <Header1>Andre ting for {currentEvent?.name ?? '(laster)'}</Header1>
                        <TicketEntryContainer>
                            {currentTicketsNotSeatable.map((ticket) => (
                                <TicketEntry key={ticket.ticket_id} ticket={ticket} />
                            ))}
                        </TicketEntryContainer>
                    </>
                ) : null}
                {oldTickets.length > 0 ? (
                    <>
                        <Header1>Tidligere kjøp</Header1>
                        <TicketEntryContainer>
                            {oldTickets.map((ticket) => (
                                <TicketEntry key={ticket.ticket_id} ticket={ticket} />
                            ))}
                        </TicketEntryContainer>
                    </>
                ) : null}
                <TutorialContainer>
                    <Header2>Hvordan fungerer overførte billetter?</Header2>
                    <p>
                        Du kan overføre billetter du har kjøpt til andre. Dette gjør du ved å trykke på billetten, velge
                        &quot;overfør billett&quot;, og skrive inn e-post addressen til mottakeren.
                    </p>
                    <p>
                        Du vil få 24 timer på å angre overføringen, skulle du ha sent billetten til feil person.
                        Mottakeren er også informert om at overføringen kan angres i 24 timer. Alle overføringer er
                        loggført, og mottakeren vil bli informert dersom overføringen blir angret.
                    </p>
                </TutorialContainer>
                {features.includes('seatmap') && (
                    <TutorialContainer>
                        <Header2>Hva er en seater? Hva gjør vi om vi er en gruppe?</Header2>
                        <p>
                            Du kan gi en annen person rettigheter til å plassere billetten din for deg, slik at en
                            person kan seate vennegjengen deres samlet. Trykk på en billett for å gjøre dette.
                        </p>
                        <p>
                            Dere kan også kjøpe billettene samlet og overføre til riktig eier senere. Husk i såfall å
                            kjøpe riktig billett til riktig person - folk med eksisterende medlemskap i Radar Event
                            trenger ikke å kjøpe et nytt medlemskap. Folk uten medlemskap i Radar Event er nødt til å ha
                            en billett med medlemskap(Eller den mye dyrere billetten for ikke-medlemmer). Det går også
                            an å kjøpe medlemskap separat senere.
                        </p>
                        <p>
                            <b>
                                Billetten MÅ være overført til riktig bruker innen LANet starter - ellers slipper du
                                ikke inn!
                            </b>
                        </p>
                    </TutorialContainer>
                )}
            </CenterBox>
        </Skeleton>
    );
};
