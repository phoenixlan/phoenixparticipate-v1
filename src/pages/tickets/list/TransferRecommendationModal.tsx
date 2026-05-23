import React from 'react';
import styled from 'styled-components';
import { Header2 } from '../../../sharedComponents/Header2';
import { PositiveButton, NegativeButton } from '../../../sharedComponents/forms/Button';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: ${({ theme }) => theme.spacing.m};
    max-width: 480px;
    text-align: center;
`;

const ButtonRow = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.s};
    margin-top: ${({ theme }) => theme.spacing.m};
`;

interface TransferRecommendationModalProps {
    ticketCount: number;
    onTransfer: () => void;
    onDismiss: () => void;
}

export const TransferRecommendationModal: React.FC<TransferRecommendationModalProps> = ({
    ticketCount,
    onTransfer,
    onDismiss,
}) => {
    return (
        <Container>
            <Header2>Overfør en billett?</Header2>
            <p>
                Du har <b>{ticketCount} billetter</b> som gir inngang til dette arrangementet. Husk at hver person
                trenger sin egen billett knyttet til sin egen konto for å slippe inn.
            </p>
            <p>
                Dersom du har kjøpt billetter på vegne av andre, bør du overføre dem til riktig person så snart som
                mulig.
            </p>
            <ButtonRow>
                <PositiveButton onClick={onTransfer}>Overfør en billett</PositiveButton>
                <NegativeButton onClick={onDismiss}>Lukk</NegativeButton>
            </ButtonRow>
        </Container>
    );
};
