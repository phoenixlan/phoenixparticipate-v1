import React, { useState } from 'react';
import styled from 'styled-components';
import { Ticket as PhoenixTicket } from '@phoenixlan/phoenix.js';

import { Ticket } from './Ticket';
import { PositiveButton } from '../../../sharedComponents/forms/Button/PositiveButton';
import { NegativeButton } from '../../../sharedComponents/forms/Button';
import { Header2 } from '../../../sharedComponents/Header2';
import { InlineSpinner } from '../../../sharedComponents/LoadingSpinner';
import { useModal } from '../../../sharedComponents/modal/useModal';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    > button {
        margin: ${({ theme }) => theme.spacing.m} 0 0 0;
    }
`;

const EmailInput = styled.input`
    height: 3em;
    width: 100%;
`;

interface TicketSettingsProps {
    ticket: PhoenixTicket.FullTicket;
}

export const TicketSettings: React.FC<TicketSettingsProps> = ({ ticket }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSettingSeater, setIsSettingSeater] = useState(false);
    const { show, remove } = useModal();

    const showSeaterPrompt = () => {
        setIsSettingSeater(true);
    };

    const onEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const setSeater = async () => {
        setLoading(true);
        await PhoenixTicket.setTicketSeater(ticket.ticket_id, email);
        setLoading(false);
        location.reload();
    };

    const resetSeaterPrompt = async () => {
        setLoading(true);
        await PhoenixTicket.setTicketSeater(ticket.ticket_id, undefined);
        setLoading(false);
        location.reload();
    };

    return (
        <Container>
            <Ticket ticket={ticket} showQr={true} enlarge={true} />
            {!isSettingSeater ? (
                <>
                    <PositiveButton onClick={showSeaterPrompt}>Sett seater</PositiveButton>
                    <PositiveButton onClick={resetSeaterPrompt}>Fjern seater</PositiveButton>
                </>
            ) : null}
            {loading ? (
                <InlineSpinner />
            ) : isSettingSeater ? (
                <>
                    <Header2>Skriv inn e-post</Header2>
                    <EmailInput value={email} onChange={onEmailChange} />
                    <PositiveButton onClick={setSeater}>Sett seater</PositiveButton>
                </>
            ) : null}
        </Container>
    );
};
