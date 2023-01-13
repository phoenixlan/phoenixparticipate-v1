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
    return (
        <Skeleton loading={isTicketLoading}>
            {ticket ? (
                <CenterBox>
                    <S.Container>
                        <Ticket ticket={ticket} />
                        <S.Spacing />
                        <S.ContentBox>
                            <Header2>Innstillinger</Header2>
                            <TicketSettings ticket={ticket as PhoenixJsTicket.FullTicket} />
                        </S.ContentBox>
                    </S.Container>
                </CenterBox>
            ) : null}
        </Skeleton>
    );
};
