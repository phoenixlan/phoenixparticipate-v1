import React, { useState } from 'react';
import styled from 'styled-components';
import { TicketType } from '@phoenixlan/phoenix.js';
import { PrimaryButton } from '../../../../../sharedComponents/forms/Button';
import { Header2 } from '../../../../../sharedComponents/Header2';

const Container = styled.form`
    overflow: auto;
    height: 100%;
    position: relative;
`;

const Disclaimer = styled.div`
    margin-bottom: ${({ theme }) => theme.spacing.m};
`;

const DisclaimerTitle = styled.h3`
    margin: 0 0 ${({ theme }) => theme.spacing.xxs};
`;

const DisclaimerText = styled.p`
    margin: 0;
    white-space: pre-wrap;
`;

const Acceptance = styled.label`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.s};
    margin-bottom: ${({ theme }) => theme.spacing.m};
    cursor: pointer;
`;

interface Props {
    ticketTypes: Array<TicketType.TicketType>;
    onAccept: () => void;
}

export const Disclaimers: React.FC<Props> = ({ ticketTypes, onAccept }) => {
    const [accepted, setAccepted] = useState(false);
    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        onAccept();
    };
    return (
        <Container onSubmit={submit}>
            <Header2>Noen av billettene dine har spesielle vilkår</Header2>
            {ticketTypes.map((ticketType) => (
                <Disclaimer key={ticketType.uuid}>
                    <DisclaimerTitle>{ticketType.name}</DisclaimerTitle>
                    <DisclaimerText>{ticketType.disclaimer}</DisclaimerText>
                </Disclaimer>
            ))}
            <Acceptance>
                <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} />
                Jeg har lest og forstått
            </Acceptance>
            <PrimaryButton fluid={true} disabled={!accepted}>
                Neste
            </PrimaryButton>
        </Container>
    );
};
