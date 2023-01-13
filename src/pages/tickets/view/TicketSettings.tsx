import React, { useState } from 'react';
import styled from 'styled-components';
import { Ticket as PhoenixTicket } from '@phoenixlan/phoenix.js';

import { PositiveButton } from '../../../sharedComponents/forms/Button/PositiveButton';
import { NegativeButton } from '../../../sharedComponents/forms/Button';
import { Header2 } from '../../../sharedComponents/Header2';
import { InlineSpinner } from '../../../sharedComponents/LoadingSpinner';
import { useTransferTicketMutation } from '../../../hooks/api/useTransferTicketMutation';
import { useHistory } from 'react-router-dom';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    > button {
        margin: ${({ theme }) => theme.spacing.m} 0 0 0;
    }
`;

const InlineP = styled.p`
    max-width: 100%;
`;

const TextContainer = styled.div`
    max-width: 100%;
`;

const EmailInput = styled.input`
    height: 3em;
    width: 100%;
`;

interface TicketSettingsProps {
    ticket: PhoenixTicket.FullTicket;
}

enum ModificationState {
    NONE,
    TRANSFER,
    SET_SEATER,
}

export const TicketSettings: React.FC<TicketSettingsProps> = ({ ticket }) => {
    const [email, setEmail] = useState('');
    const history = useHistory();
    const [loading, setLoading] = useState(false);

    const [state, setState] = useState<ModificationState>(ModificationState.NONE);

    const transferTicketMutation = useTransferTicketMutation();

    const showSeaterPrompt = () => {
        setState(ModificationState.SET_SEATER);
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

    const transferTicketPrompt = () => {
        setState(ModificationState.TRANSFER);
    };

    const transferTicket = async () => {
        setLoading(true);
        await transferTicketMutation.mutateAsync({ ticket_id: ticket.ticket_id, email });
        setLoading(false);
        history.push('/');
    };

    let TicketModifyer: React.ReactElement | undefined = undefined;

    if (ticket.ticket_type.seatable) {
        switch (state) {
            case ModificationState.SET_SEATER:
                TicketModifyer = (
                    <>
                        <Header2>Skriv inn e-post</Header2>
                        <EmailInput value={email} onChange={onEmailChange} />
                        <PositiveButton onClick={setSeater}>Sett seater</PositiveButton>
                    </>
                );
                break;
            case ModificationState.TRANSFER:
                TicketModifyer = (
                    <>
                        <Header2>Skriv inn e-post</Header2>
                        <EmailInput value={email} onChange={onEmailChange} />
                        <NegativeButton onClick={transferTicket}>Overfør</NegativeButton>
                    </>
                );
                break;
            default:
                TicketModifyer = (
                    <>
                        <PositiveButton onClick={showSeaterPrompt}>Sett seater</PositiveButton>
                        <PositiveButton onClick={resetSeaterPrompt}>Fjern seater</PositiveButton>
                        <NegativeButton onClick={transferTicketPrompt}>Overfør billett</NegativeButton>
                    </>
                );
                break;
        }
    }

    return <Container>{loading ? <InlineSpinner /> : TicketModifyer}</Container>;
};
