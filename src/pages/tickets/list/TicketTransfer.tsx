import React, { useState } from 'react';
import styled from 'styled-components';
import { Ticket } from '@phoenixlan/phoenix.js';
import { useAuth } from '../../../authentication/useAuth';
import { NegativeButton } from '../../../sharedComponents/forms/Button';
import { useRevertTransferMutation } from '../../../hooks/api/useRevertTransferMutation';

const S = {
    // Same kind of proportional columns as TicketEntry, so rows line up and long text wraps
    Container: styled.div`
        display: grid;
        grid-template-columns: 8rem minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1.5fr) minmax(0, 1.5fr) 7rem;
        align-items: center;
        gap: ${({ theme }) => theme.spacing.s};
        text-align: left;
        overflow-wrap: anywhere;
        padding: ${({ theme }) => theme.spacing.m} ${({ theme }) => theme.spacing.s};

        @media screen and (max-width: ${({ theme }) => theme.media.tablet}) {
            grid-template-columns: 7rem minmax(0, 1fr) minmax(0, 1fr) 7rem;
        }
    `,
    TicketId: styled.span`
        text-align: center;
        white-space: nowrap;
    `,
    Cell: styled.div`
        min-width: 0;
    `,
    // Hidden on smaller screens, where there is no room for them
    WideOnly: styled.div`
        min-width: 0;

        @media screen and (max-width: ${({ theme }) => theme.media.tablet}) {
            display: none;
        }
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
            ? `Kan angres i ${Math.floor(secondsLeft / 60)} min`
            : `Kan angres i ${hoursLeft} ${hoursLeft === 1 ? 'time' : 'timer'}`;

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
                <S.WideOnly>{transfer.ticket.ticket_type.name}</S.WideOnly>
                <S.WideOnly>
                    {transfer.ticket.seat ? (
                        <span>
                            Rad {transfer.ticket.seat.row.row_number}, sete {transfer.ticket.seat.number}
                        </span>
                    ) : transfer.ticket.ticket_type.seatable ? (
                        <b>Ikke seatet</b>
                    ) : null}
                </S.WideOnly>
                <S.Cell>
                    {isSender ? 'Til' : 'Fra'} {otherUser.firstname} {otherUser.lastname}
                </S.Cell>
                <S.Cell>
                    {transfer.reverted ? 'Angret' : transfer.expired ? 'Angrefrist utløpt' : timeLeft}
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
