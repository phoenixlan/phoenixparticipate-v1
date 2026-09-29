import React from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { useTicket } from '../../../hooks/api/useTicket';
import { Header1 } from '../../../sharedComponents/Header1';
import { Skeleton } from '../../../sharedComponents/Skeleton';
import { Ticket } from './Ticket';
import { ShadowBox } from '../../../sharedComponents/boxes/ShadowBox';
import { Header2 } from '../../../sharedComponents/Header2';
import { CenterBox } from '../../../sharedComponents/boxes/CenterBox';
import { TicketSettings } from './TicketSettings';
import { Ticket as PhoenixJsTicket } from '@phoenixlan/phoenix.js';
import { useAuth } from '../../../authentication/useAuth';
import { useMembershipPersonalia } from '../../../hooks/api/useMembershipPersonalia';
import { MembershipPersonaliaForm } from '../../membership/MembershipPersonaliaForm';

const S = {
    Container: styled.div`
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    `,
    ContentBox: styled.div`
        width: 100%;
        box-shadow: ${({ theme }) => theme.shadow.default};
        border: 1px solid ${({ theme }) => theme.colors.Gray};
        padding: ${({ theme }) => theme.spacing.m};
        margin-bottom: ${({ theme }) => theme.spacing.xxxl};

        &:first-child {
            margin-top: ${({ theme }) => theme.spacing.xxxl};
        }
    `,
    Spacing: styled.div`
        height: 2em;
    `,
};

interface TicketViewerParams {
    ticket_id: string;
}

export const TicketViewer: React.FC = (props) => {
    const { ticket_id } = useParams<TicketViewerParams>();
    const { data: ticket, isLoading: isTicketLoading } = useTicket(Number.parseInt(ticket_id, 10));
    const { data: membershipPersonalia, isLoading: isMembershipPersonaliaLoading } = useMembershipPersonalia();
    const { client } = useAuth();

    const mustFillMembershipPersonalia =
        !!ticket &&
        ticket.owner.uuid === client.user?.uuid &&
        ticket.ticket_type.grants_membership &&
        !membershipPersonalia;

    return (
        <Skeleton loading={isTicketLoading || isMembershipPersonaliaLoading}>
            {ticket && mustFillMembershipPersonalia ? (
                <CenterBox>
                    <S.Container>
                        <S.ContentBox>
                            <Header2>Medlemsinformasjon mangler</Header2>
                            <MembershipPersonaliaForm
                                showIntro={true}
                                introText="Denne billetten gir medlemskap i Radar Event, men du har ikke registrert medlemskapsinformasjon enda. For å registrere medlemskapet trenger vi litt informasjon om deg."
                                submitText="Lagre og vis billett"
                            />
                        </S.ContentBox>
                    </S.Container>
                </CenterBox>
            ) : ticket ? (
                <CenterBox>
                    <S.Container>
                        <Ticket ticket={ticket} />
                        <p>
                            <b>Merk:</b> Billetten er beskyttet mot forfalskning - et screenshot holder ikke
                        </p>
                        <S.Spacing />
                        <TicketSettings ticket={ticket as PhoenixJsTicket.FullTicket} />
                    </S.Container>
                </CenterBox>
            ) : null}
        </Skeleton>
    );
};
