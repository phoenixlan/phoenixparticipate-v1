import React from 'react';
import styled from 'styled-components';
import { Ticket } from '@phoenixlan/phoenix.js';
import { useAuth } from '../../../authentication/useAuth';
import { ArrowRightSquare } from '@styled-icons/bootstrap/ArrowRightSquare';
import { NavLink, NavLinkProps } from 'react-router-dom';

interface TicketEntryProps {
    ticket: Ticket.FullTicket;
    showEvent?: boolean;
}

const S = {
    Container: styled.div`
        display: flex;
        justify-content: space-between;

        padding: ${({ theme }) => theme.spacing.m} ${({ theme }) => theme.spacing.s} ${({ theme }) => theme.spacing.m}
            ${({ theme }) => theme.spacing.s};

        :hover {
            background-color: ${({ theme }) => theme.colors.Gray};
            cursor: pointer;
        }
    `,
    TicketId: styled.span``,
    TicketType: styled.span``,
    TicketSeater: styled.span``,
    SeatContainer: styled.span`
        display: flex;
        flex-direction: column;
        justify-content: center;
    `,
    Row: styled.span``,
    Seat: styled.span``,
    TicketStatus: styled.span``,
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

    return (
        <S.ContainerLinkOuter>
            <S.ContainerLink to={`/ticket/${ticket.ticket_id}`}>
                <S.Container>
                    <S.TicketId>
                        {ticket.ticket_type.seatable ? 'Billett ' : 'Kjøp '}&#x23;{ticket.ticket_id}
                    </S.TicketId>
                    <S.TicketType>{ticket.ticket_type.name}</S.TicketType>
                    {ticket.seat ? (
                        <S.SeatContainer>
                            <S.Row>Rad {ticket.seat.row.row_number}</S.Row>
                            <S.Seat>Sete {ticket.seat.number}</S.Seat>
                        </S.SeatContainer>
                    ) : (
                        <b>Ikke seatet</b>
                    )}
                    <S.TicketSeater>
                        {ticket.ticket_type.seatable ? (
                            ticket.seater && ticket.seater.uuid !== client.user!.uuid ? (
                                <span>
                                    Seatet av:
                                    <br />
                                    <b>
                                        {ticket.seater.firstname} {ticket.seater.lastname}
                                    </b>
                                </span>
                            ) : (
                                <span>
                                    Seatet av:
                                    <br />
                                    <b>deg</b>
                                </span>
                            )
                        ) : (
                            <b>Ikke sittebillett</b>
                        )}
                    </S.TicketSeater>
                    <S.ArrowRightSquare />
                </S.Container>
            </S.ContainerLink>
        </S.ContainerLinkOuter>
    );
};
