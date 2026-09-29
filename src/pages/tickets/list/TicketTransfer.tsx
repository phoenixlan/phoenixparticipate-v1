import React, { useState } from 'react';
import styled from 'styled-components';
import { Ticket } from '@phoenixlan/phoenix.js';
import { useAuth } from '../../../authentication/useAuth';
import { NegativeButton } from '../../../sharedComponents/forms/Button';
import { useRevertTransferMutation } from '../../../hooks/api/useRevertTransferMutation';

const S = {
    // Same kind of fixed columns as TicketEntry, so rows line up
    Container: styled.div`
        display: grid;
        grid-template-columns: 8rem 1fr 7rem 9rem 8rem 7rem;
        align-items: center;
        gap: ${({ theme }) => theme.spacing.s};
        text-align: left;
        padding: ${({ theme }) => theme.spacing.m} ${({ theme }) => theme.spacing.s};

        @media screen and (max-width: ${({ theme }) => theme.media.tablet}) {
            grid-template-columns: 7rem 1fr 1fr 7rem;
        }
    `,
    TicketId: styled.span`
        text-align: center;
        white-space: nowrap;
    `,
    Cell: styled.div`
        display: flex;
        flex-direction: column;
        min-width: 0;
    `,
    // Hidden on smaller screens, where there is no room for them
    WideOnly: styled.div`
        display: flex;
        flex-direction: column;
        min-width: 0;

        @media screen and (max-width: ${({ theme }) => theme.media.tablet}) {
            display: none;
        }
    `,
    Label: styled.span`
        font-size: ${({ theme }) => theme.fontSize.s};
        color: ${({ theme }) => theme.colors.DarkGray};
    `,
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

    const isSender = transfer.from_user.uuid === client.user?.uuid;
    const otherUser = isSender ? transfer.to_user : transfer.from_user;

    const secondsLeft = Math.max(0, transfer.expires - new Date().getTime() / 1000);
    const hoursLeft = Math.floor(secondsLeft / 60 / 60);
    const timeLeft =
        secondsLeft < 60 * 60
            ? `${Math.floor(secondsLeft / 60)} min igjen`
            : `${hoursLeft} ${hoursLeft === 1 ? 'time' : 'timer'} igjen`;

    const revert = async () => {
        setReverting(true);
        try {
            await revertTransferMutation.mutateAsync(transfer.uuid);
        } catch {
            // Error is reported by the mutation
        }
        setReverting(false);
    };

    return (
        <S.ContainerLinkOuter>
            <S.Container>
                <S.TicketId>
                    {transfer.ticket.ticket_type.grants_admission ? 'Billett ' : 'Kjøp '}
                    <code>&#x23;{transfer.ticket.ticket_id}</code>
                </S.TicketId>
                <S.WideOnly>
                    <span>{transfer.ticket.ticket_type.name}</span>
                </S.WideOnly>
                <S.WideOnly>
                    {transfer.ticket.seat ? (
                        <>
                            <S.Label>Plass</S.Label>
                            <span>
                                Rad {transfer.ticket.seat.row.row_number}, sete {transfer.ticket.seat.number}
                            </span>
                        </>
                    ) : transfer.ticket.ticket_type.seatable ? (
                        <b>Ikke seatet</b>
                    ) : null}
                </S.WideOnly>
                <S.Cell>
                    <S.Label>{isSender ? 'Til' : 'Fra'}</S.Label>
                    <span>
                        {otherUser.firstname} {otherUser.lastname}
                    </span>
                </S.Cell>
                <S.Cell>
                    <S.Label>Angrefrist</S.Label>
                    <span>{transfer.reverted ? 'Angret' : transfer.expired ? 'Utløpt' : timeLeft}</span>
                </S.Cell>
                <div>
                    {isSender && !transfer.expired && !transfer.reverted ? (
                        <NegativeButton size="small" isLoading={reverting} onClick={revert}>
                            Angre
                        </NegativeButton>
                    ) : null}
                </div>
            </S.Container>
        </S.ContainerLinkOuter>
    );
};
