import React, { useState, useEffect } from 'react';
import styled, { css, keyframes } from 'styled-components';
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
    flex-direction: column;
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

const InnerTop = styled(Inner)`
    border-bottom: 1px dashed gray;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-size: ${({ theme }) => theme.fontSize.s};
`;

const InnerBottom = styled(Inner)`
    border-top: 1px dashed gray;
`;

const Top = styled.div`
    width: 14em;
    height: 8em;
    position: relative;
    overflow: hidden;
`;

const Bottom = styled.div<{ checked_in: boolean }>`
    width: 100%;
    height: 10em;
    position: relative;
    overflow: hidden;
    ${({ checked_in }) =>
        checked_in ? 'transform-origin: center top; transform: rotate(5deg) translateY(0.5em);' : ''}
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

const QrWrapper = styled.div<{ checked_in?: boolean }>`
    position: relative;
    padding: ${({ checked_in }) => (checked_in ? '0' : '0.15em')};
    overflow: hidden;
    border-radius: 4px;
    ${({ checked_in }) => (checked_in ? 'filter: grayscale(100%) opacity(0.5);' : '')}

    &::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        ${({ theme, checked_in }) =>
            !checked_in &&
            css`
                background: conic-gradient(
                    ${theme.colors.primary} 0deg,
                    ${theme.colors.primary} 60deg,
                    transparent 120deg,
                    transparent 240deg,
                    ${theme.colors.primary} 300deg,
                    ${theme.colors.primary} 360deg
                );
                animation: ${spinBorder} 3s linear infinite;
            `}
    }

    & > * {
        position: relative;
        display: block;
        background: white;
        border-radius: 2px;
        padding: 0.3em;
    }
`;

const UsedContainer = styled.div`
    position: relative;
    display: inline-block;

    & > canvas,
    & > svg {
        filter: grayscale(100%) opacity(0.4);
    }
`;

const UsedStamp = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-45deg);
    font-size: 1.8em;
    font-weight: bold;
    color: red;
    border: 0.15em solid red;
    padding: 0.1em 0.4em;
    z-index: 2;
    white-space: nowrap;
`;

const useTotpQrValue = (ticket_id: number) => {
    const { data: totp_data } = useTicketTotp(ticket_id);
    const [qrValue, setQrValue] = useState<string>('');

    const totp_key: string | undefined = totp_data?.totp;

    useEffect(() => {
        if (!totp_key) return;

        const update = async () => {
            const { otp } = await TOTP.generate(totp_key, { digits: 8 });
            const randomSalt = btoa(Math.random() + '');
            setQrValue(`${otp}:${randomSalt}`);
        };

        update();
        const interval = setInterval(update, 5000);
        return () => clearInterval(interval);
    }, [totp_key]);

    console.log(`qr value: ${qrValue}`);
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
            <Top>
                <Corner left={true} top={false} />
                <Corner left={false} top={false} />
                <InnerTop>
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
                        <span>Ingen sitteplass</span>
                    )}
                </InnerTop>
            </Top>
            <Bottom checked_in={!!ticket.checked_in}>
                <Corner left={true} top={true} />
                <Corner left={false} top={true} />
                <InnerBottom>
                    {ticket.checked_in ? (
                        <UsedContainer>
                            <QRCode
                                value="Look at you, hacker: a pathetic creature of meat and bone"
                                size={120}
                                level={'M'}
                            />
                            <UsedStamp>BRUKT</UsedStamp>
                        </UsedContainer>
                    ) : (
                        <QrWrapper>
                            <QRCode
                                value={btoa(`phoenix-ticket:${ticket.ticket_id}:${totpQrValue}`)}
                                size={120}
                                level={'M'}
                            />
                        </QrWrapper>
                    )}
                </InnerBottom>
            </Bottom>
        </Container>
    );
};
