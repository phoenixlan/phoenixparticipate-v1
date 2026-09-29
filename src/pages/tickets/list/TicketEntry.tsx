import React from 'react';
import styled from 'styled-components';
import { Ticket } from '@phoenixlan/phoenix.js';
import { useAuth } from '../../../authentication/useAuth';
import { useSiteConfig } from '../../../hooks/api/useSiteConfig';
import { ArrowRightSquare } from '@styled-icons/bootstrap/ArrowRightSquare';
import { NavLink, NavLinkProps } from 'react-router-dom';

interface TicketEntryProps {
    ticket: Ticket.FullTicket;
    showEvent?: boolean;
}

const S = {
    // Fixed columns so the seat and seater line up between rows
    Container: styled.div<{ hasSeatmap: boolean }>`
        display: grid;
        grid-template-columns: ${({ hasSeatmap }) =>
            hasSeatmap ? '8rem 1fr 7rem 9rem 1.5rem' : '8rem 1fr 1.5rem'};
        align-items: center;
        gap: ${({ theme }) => theme.spacing.s};
        text-align: left;
        padding: ${({ theme }) => theme.spacing.m} ${({ theme }) => theme.spacing.s};

        @media screen and (max-width: ${({ theme }) => theme.media.smallTablet}) {
            grid-template-columns: ${({ hasSeatmap }) =>
                hasSeatmap ? '8rem 1fr 6rem 1.5rem' : '8rem 1fr 1.5rem'};
        }

        :hover {
            background-color: ${({ theme }) => theme.colors.Gray};
            cursor: pointer;
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
    // Hidden on phones, where there is no room for it
    SeaterCell: styled.div`
        display: flex;
        flex-direction: column;
        min-width: 0;

        @media screen and (max-width: ${({ theme }) => theme.media.smallTablet}) {
            display: none;
        }
    `,
    Label: styled.span`
        font-size: ${({ theme }) => theme.fontSize.s};
        color: ${({ theme }) => theme.colors.DarkGray};
    `,
    ArrowRightSquare: styled(ArrowRightSquare)`
        height: 1.5em;
    `,
    ContainerLink: styled(NavLink)<NavLinkProps>`
        width: 100%;
    `,
    ContainerLinkOuter: styled.div`
        border-top: 1px solid ${({ theme }) => theme.colors.Gray};
        border-bottom: 1px solid ${({ theme }) => theme.colors.Gray};
    `,
};

export const TicketEntry: React.FC<TicketEntryProps> = ({ ticket, showEvent }) => {
    const { client } = useAuth();
    const { data: siteConfig } = useSiteConfig();
    const features = siteConfig?.features ?? [];
    const hasSeatmap = features.includes('seatmap');

    return (
        <S.ContainerLinkOuter>
            <S.ContainerLink to={`/ticket/${ticket.ticket_id}`}>
                <S.Container hasSeatmap={hasSeatmap}>
                    <S.TicketId>
                        {ticket.ticket_type.grants_admission ? 'Billett ' : 'Kjøp '}
                        <code>&#x23;{ticket.ticket_id}</code>
                    </S.TicketId>
                    <span>{ticket.ticket_type.name}</span>
                    {hasSeatmap && (
                        <S.Cell>
                            {ticket.seat ? (
                                <>
                                    <S.Label>Plass</S.Label>
                                    <span>
                                        Rad {ticket.seat.row.row_number}, sete {ticket.seat.number}
                                    </span>
                                </>
                            ) : ticket.ticket_type.seatable ? (
                                <b>Ikke seatet</b>
                            ) : ticket.ticket_type.grants_admission ? (
                                <S.Label>Ingen sitteplass</S.Label>
                            ) : (
                                <S.Label>Gir ikke inngang</S.Label>
                            )}
                        </S.Cell>
                    )}
                    {hasSeatmap && (
                        <S.SeaterCell>
                            {ticket.ticket_type.seatable && (
                                <>
                                    <S.Label>Seatet av</S.Label>
                                    <span>
                                        {ticket.seater && ticket.seater.uuid !== client.user!.uuid
                                            ? `${ticket.seater.firstname} ${ticket.seater.lastname}`
                                            : 'Deg'}
                                    </span>
                                </>
                            )}
                        </S.SeaterCell>
                    )}
                    <S.ArrowRightSquare />
                </S.Container>
            </S.ContainerLink>
        </S.ContainerLinkOuter>
    );
};
