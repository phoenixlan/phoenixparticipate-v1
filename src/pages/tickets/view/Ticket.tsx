import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Ticket as PhoenixApiTicket } from '@phoenixlan/phoenix.js';
import { HandIndexFill } from '@styled-icons/bootstrap/HandIndexFill';
import { SeatRow, Seat, Row, SubTitle, Title, Corner } from './ticketConponents';
import QRCode from 'qrcode.react';

const Container = styled.div`
    cursor: pointer;
    user-select: none;
    display: flex;
    flex-direction: row;
    padding: ${({ theme }) => theme.spacing.m} 0 ${({ theme }) => theme.spacing.m} 0;
`;

const Inner = styled.div`
    width: 100%;
    height: 100%;
    border: 1px solid gray;
    border-radius: 0.5rem;
    padding: ${({ theme }) => theme.spacing.s};
    padding-bottom: ${({ theme }) => theme.spacing.m};

    display: flex;
    align-items: center;
    justify-content: center;
`;

const InnerLeft = styled(Inner)`
    border-right: 1px dashed gray;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-size: ${({ theme }) => theme.fontSize.s};
`;

const InnerRight = styled(Inner)`
    border-left: 1px dashed gray;
`;

const Left = styled.div`
    height: 8em;
    width: 10em;
    position: relative;
    overflow: hidden;
`;

const Right = styled.div<{ checked_in: boolean }>`
    height: 8em;
    width: 5em;
    position: relative;
    overflow: hidden;
    ${({ checked_in }) =>
        checked_in ? 'transform: translateY(2em) rotate(45deg) translateY(-2em) translateX(1em);' : ''}
`;

const ripple = (color: string) => keyframes`
    0% {
        box-shadow: 0 0 0 0 ${color},
                    0 0 0 0.4em ${color},
                    0 0 0 0.8em ${color},
                    0 0 0 1.2em ${color};
    }
    100% {
        box-shadow: 0 0 0 0.4em ${color},
                    0 0 0 0.8em ${color},
                    0 0 0 1.2em ${color},
                    0 0 0 1.8em #ffffffff;
    }
`;

const Tap = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 0em;
    height: 0em;
    border-radius: 50%;
    animation: ${({ theme }) => ripple(theme.colors.primary)} 1.5s linear infinite;
`;

const TapIcon = styled(HandIndexFill)`
    min-width: 1em;
    color: slategray;
`;

interface TicketProps {
    ticket?: PhoenixApiTicket.FullTicket;
}
export const Ticket: React.FC<TicketProps> = ({ ticket }) => {
    if (!ticket) {
        return <b>Laster</b>;
    }
    return (
        <Container>
            <Left>
                <Corner left={false} top={true} />
                <Corner left={false} top={false} />
                <InnerLeft>
                    <Row>
                        <Title>{ticket.event.name}</Title>
                    </Row>
                    <Row>
                        <SubTitle>{ticket.ticket_type.seatable ? 'Billett-ID' : 'Kjøp-ID'}</SubTitle>
                        <span>#{ticket.ticket_id}</span>
                    </Row>
                    <Row>
                        <SubTitle>Type</SubTitle>
                        <span>{ticket.ticket_type.name}</span>
                    </Row>
                    {ticket.seat ? (
                        <>
                            <Row>
                                <SubTitle>Seater</SubTitle>
                                <span>
                                    {ticket.seater ? `${ticket.seater.firstname} ${ticket.seater.lastname}` : 'Deg'}
                                </span>
                            </Row>
                            <Seat>
                                <SeatRow>
                                    <SubTitle>Rad</SubTitle>
                                    <span>{ticket.seat.row.row_number}</span>
                                </SeatRow>
                                <SeatRow>
                                    <SubTitle>Sete</SubTitle>
                                    <span>{ticket.seat.number}</span>
                                </SeatRow>
                            </Seat>
                        </>
                    ) : ticket.ticket_type.seatable ? (
                        <span>
                            <b>Ikke seatet</b>
                        </span>
                    ) : (
                        <span>Ikke sittebillett</span>
                    )}
                </InnerLeft>
            </Left>
            <Right checked_in={!!ticket.checked_in}>
                <Corner left={true} top={true} />
                <Corner left={true} top={false} />
                <InnerRight>
                    {ticket.checked_in ? (
                        <b>
                            Sjekket
                            <br />
                            inn
                        </b>
                    ) : (
                        <QRCode value={`test`} size={60} />
                    )}
                </InnerRight>
            </Right>
        </Container>
    );
};
