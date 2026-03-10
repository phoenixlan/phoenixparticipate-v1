import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Ticket as PhoenixApiTicket } from '@phoenixlan/phoenix.js';
import { HandIndexFill } from '@styled-icons/bootstrap/HandIndexFill';
import { SeatRow, Seat, Row, SubTitle, Title, Corner } from './ticketConponents';
import QRCode from 'qrcode.react';
import { TOTP } from 'totp-generator';
import { useTicketTotp } from '../../../hooks/api/useTicketTotp';

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
    width: 14em;
    position: relative;
    overflow: hidden;
`;

const Right = styled.div<{ checked_in: boolean }>`
    height: 8em;
    width: 7em;
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

const spinBorder = keyframes`
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
`;

const QrWrapper = styled.div`
    position: relative;
    padding: 0.15em;
    overflow: hidden;
    border-radius: 4px;

    &::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: ${({ theme }) => `conic-gradient(
            ${theme.colors.primary} 0deg,
            ${theme.colors.primary} 60deg,
            transparent 120deg,
            transparent 240deg,
            ${theme.colors.primary} 300deg,
            ${theme.colors.primary} 360deg
        )`};
        animation: ${spinBorder} 3s linear infinite;
    }

    & > * {
        position: relative;
        display: block;
        background: white;
        border-radius: 2px;
        padding: 0.3em;
    }
`;

const useTotpQrValue = (ticket_id: number) => {
    const { data: totp_data } = useTicketTotp(ticket_id);
    const [qrValue, setQrValue] = useState<string>('');

    const totp_key: string | undefined = totp_data?.totp

    useEffect(() => {
        if (!totp_key) return;

        const update = async () => {
            const { otp } = await TOTP.generate(totp_key, { digits: 8 });
            setQrValue(otp);
        };

        update();
        const interval = setInterval(update, 5000);
        return () => clearInterval(interval);
    }, [totp_key]);

    console.log(`qr value: ${qrValue}`)
    return qrValue;
};

interface TicketProps {
    ticket?: PhoenixApiTicket.FullTicket;
}
export const Ticket: React.FC<TicketProps> = ({ ticket }) => {
    const totpQrValue = useTotpQrValue(ticket?.ticket_id ?? 0);

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
                        <SubTitle>{ticket.ticket_type.grants_admission ? 'Billett-ID' : 'Kjøp-ID'}</SubTitle>
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
                        <QrWrapper>
                            <QRCode value={`phoenix-ticket:${ticket.ticket_id}:${totpQrValue}`} size={80} level={"M"}/>
                        </QrWrapper>
                    )}
                </InnerRight>
            </Right>
        </Container>
    );
};
