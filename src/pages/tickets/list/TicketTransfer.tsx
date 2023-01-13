import React, { useState } from 'react';
import styled from 'styled-components';
import { Ticket } from '@phoenixlan/phoenix.js';
import { useAuth } from '../../../authentication/useAuth';
import { NegativeButton } from '../../../sharedComponents/forms/Button';
import { useRevertTransferMutation } from '../../../hooks/api/useRevertTransferMutation';
import { InlineSpinner } from '../../../sharedComponents/LoadingSpinner';

const S = {
    Container: styled.div`
        display: flex;
        justify-content: space-between;

        padding: ${({ theme }) => theme.spacing.m} ${({ theme }) => theme.spacing.s} ${({ theme }) => theme.spacing.m}
            ${({ theme }) => theme.spacing.s};
    `,
    TicketId: styled.span``,
    TicketType: styled.span`
        @media only screen and (max-width: 40em) {
            display: none;
        }
    `,
    TicketSeater: styled.span``,
    TicketGiver: styled.div``,
    TicketReceiver: styled.div``,
    TicketRevertNotice: styled.div``,
    SeatContainer: styled.span`
        @media only screen and (max-width: 40em) {
            display: none;
        }
        display: flex;
        flex-direction: column;
        justify-content: center;
    `,
    Row: styled.span``,
    Seat: styled.span``,
    TicketStatus: styled.span``,
    ContainerLinkOuter: styled.div`
        width: 100%;
        border-top: 1px solid ${({ theme }) => theme.colors.Gray};
        border-bottom: 1px solid ${({ theme }) => theme.colors.Gray};
    `,
};

interface TicketTransferProps {
    transfer: Ticket.FullTicketTransfer;
}

export const TicketTransfer: React.FC<TicketTransferProps> = ({ transfer }) => {
    const { client } = useAuth();
    const [reverting, setReverting] = useState(false);
    const revertTransferMutation = useRevertTransferMutation();

    const user_uuid = client.user?.uuid;

    const cancelTime = transfer.expires - new Date().getTime() / 1000;

    let timeLeftLabel = (
        <span>
            {cancelTime < 60 * 60
                ? `${Math.floor(cancelTime / 60)} minutter`
                : `${Math.floor(cancelTime / 60 / 60)} timer`}
        </span>
    );
    if (transfer.reverted) {
        timeLeftLabel = (
            <span>
                <b>Overføring er angret</b>
            </span>
        );
    } else if (transfer.expired) {
        timeLeftLabel = (
            <span>
                <b>Utgått - kan ikke angres</b>
            </span>
        );
    }

    const revert = async () => {
        setReverting(true);
        await revertTransferMutation.mutateAsync(transfer.uuid);
    };

    return (
        <S.ContainerLinkOuter>
            <S.Container>
                <S.TicketId>
                    {transfer.ticket.ticket_type.seatable ? 'Billett ' : 'Kjøp '}&#x23;{transfer.ticket.ticket_id}
                </S.TicketId>
                <S.TicketType>{transfer.ticket.ticket_type.name}</S.TicketType>
                {transfer.ticket.seat ? (
                    <S.SeatContainer>
                        <S.Row>Rad {transfer.ticket.seat.row.row_number}</S.Row>
                        <S.Seat>Sete {transfer.ticket.seat.number}</S.Seat>
                    </S.SeatContainer>
                ) : (
                    <b>Ikke seatet</b>
                )}
                <S.TicketReceiver>
                    <span>
                        Til:
                        <br />
                        {transfer.to_user.uuid == user_uuid ? (
                            <b>Deg</b>
                        ) : (
                            `${transfer.to_user.firstname} ${transfer.to_user.lastname}`
                        )}
                    </span>
                </S.TicketReceiver>
                <S.TicketGiver>
                    <span>
                        Fra:
                        <br />
                        {transfer.from_user.uuid == user_uuid ? (
                            <b>Deg</b>
                        ) : (
                            `${transfer.from_user.firstname} ${transfer.from_user.lastname}`
                        )}
                    </span>
                </S.TicketGiver>
                <S.TicketRevertNotice>
                    {transfer.reverted ? (
                        <b>Overføring er angret</b>
                    ) : (
                        <span>
                            Angrefrist:
                            <br />
                            {timeLeftLabel}
                        </span>
                    )}
                </S.TicketRevertNotice>
                {transfer.from_user.uuid === user_uuid && !transfer.expired && !transfer.reverted ? (
                    reverting ? (
                        <InlineSpinner />
                    ) : (
                        <NegativeButton onClick={revert}>Angre</NegativeButton>
                    )
                ) : null}
            </S.Container>
        </S.ContainerLinkOuter>
    );
};
