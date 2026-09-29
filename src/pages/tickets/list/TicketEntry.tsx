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
    // Proportional columns so the seat and seater line up between rows, while long text wraps instead of overflowing
    Container: styled.div<{ hasSeatmap: boolean }>`
        display: grid;
        grid-template-columns: ${({ hasSeatmap }) =>
            hasSeatmap ? '8rem minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1.5fr) 1.5rem' : '8rem minmax(0, 1fr) 1.5rem'};
        align-items: center;
        gap: ${({ theme }) => theme.spacing.s};
        text-align: left;
        overflow-wrap: anywhere;
        padding: ${({ theme }) => theme.spacing.m} ${({ theme }) => theme.spacing.s};

        @media screen and (max-width: ${({ theme }) => theme.media.smallTablet}) {
            grid-template-columns: ${({ hasSeatmap }) =>
                hasSeatmap ? '8rem minmax(0, 2fr) minmax(0, 1fr) 1.5rem' : '8rem minmax(0, 1fr) 1.5rem'};
        }

        :hover {
            background-color: ${({ theme }) => theme.colors.Gray};
            cursor: pointer;
        }
    `,
    TicketId: styled.span`
        white-space: nowrap;
    `,
    Cell: styled.div`
        min-width: 0;
    `,
    // Hidden on phones, where there is no room for it
    SeaterCell: styled.div`
        min-width: 0;

        @media screen and (max-width: ${({ theme }) => theme.media.smallTablet}) {
            display: none;
        }
    `,
    NoSeat: styled.span`
        font-style: italic;
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
                                <span>
                                    Rad {ticket.seat.row.row_number}, sete {ticket.seat.number}
                                </span>
                            ) : ticket.ticket_type.seatable ? (
                                <b>Ikke seatet</b>
                            ) : ticket.ticket_type.grants_admission ? (
                                <S.NoSeat>Ingen sitteplass</S.NoSeat>
                            ) : (
                                <S.NoSeat>Gir ikke inngang</S.NoSeat>
                            )}
                        </S.Cell>
                    )}
                    {hasSeatmap && (
                        <S.SeaterCell>
                            {ticket.ticket_type.seatable && (
                                <span>
                                    Seatet av{' '}
                                    {ticket.seater && ticket.seater.uuid !== client.user!.uuid
                                        ? `${ticket.seater.firstname} ${ticket.seater.lastname}`
                                        : 'deg'}
                                </span>
                            )}
                        </S.SeaterCell>
                    )}
                    <S.ArrowRightSquare />
                </S.Container>
            </S.ContainerLink>
        </S.ContainerLinkOuter>
    );
};
