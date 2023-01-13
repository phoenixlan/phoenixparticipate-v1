import React, { useState } from 'react';
import styled from 'styled-components';
import { Ticket } from '@phoenixlan/phoenix.js';
import { Corner, Row, SubTitle, Title } from './ticketConponents';
import { useAuth } from '../../../authentication/useAuth';
import { NegativeButton } from '../../../sharedComponents/forms/Button';
import { useRevertTransferMutation } from '../../../hooks/api/useRevertTransferMutation';
import { InlineSpinner } from '../../../sharedComponents/LoadingSpinner';

const Outer = styled.div``;

const TicketOuter = styled.div`
    height: 200px;
    width: 150px;

    position: relative;
    overflow: hidden;

    margin-bottom: ${({ theme }) => theme.spacing.m};
`;

const Container = styled.div`
    border: 1px solid gray;
    border-bottom: 1px dashed gray;
    border-radius: 0.5rem;

    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-direction: column;

    font-size: ${({ theme }) => theme.fontSize.s};

    width: 100%;
    height: 100%;
`;

interface TicketTransferProps {
    transfer: Ticket.FullTicketTransfer;
}

export const TicketTransfer: React.FC<TicketTransferProps> = ({ transfer }) => {
    const { client } = useAuth();
    const [reverting, setReverting] = useState(false);
    const revertTransferMutation = useRevertTransferMutation();

    const user_uuid = client.user?.uuid;

    const cancelTime = transfer.expires - new Date().getTime() / 1000;

    let timeLeftLabel = (
        <span>
            {cancelTime < 60 * 60
                ? `${Math.floor(cancelTime / 60)} minutter`
                : `${Math.floor(cancelTime / 60 / 60)} timer`}
        </span>
    );
    if (transfer.reverted) {
        timeLeftLabel = (
            <span>
                <b>Overføring er angret</b>
            </span>
        );
    } else if (transfer.expired) {
        timeLeftLabel = (
            <span>
                <b>Utgått - kan ikke angres</b>
            </span>
        );
    }

    const revert = async () => {
        setReverting(true);
        await revertTransferMutation.mutateAsync(transfer.uuid);
    };

    return (
        <Outer>
            <TicketOuter>
                <Corner left={true} top={false} />
                <Corner left={false} top={false} />
                <Container>
                    <Row>
                        <Title>Phoenix Lan</Title>
                    </Row>
                    <Row>
                        <SubTitle>Billett-ID</SubTitle>
                        <span>#{transfer.ticket.ticket_id}</span>
                    </Row>
                    <Row>
                        <SubTitle>Til</SubTitle>
                        <span>
                            {transfer.to_user.uuid == user_uuid ? (
                                <b>Deg</b>
                            ) : (
                                `${transfer.to_user.firstname} ${transfer.to_user.lastname}`
                            )}
                        </span>
                    </Row>
                    <Row>
                        <SubTitle>Fra</SubTitle>
                        <span>
                            {transfer.from_user.uuid == user_uuid ? (
                                <b>Deg</b>
                            ) : (
                                `${transfer.from_user.firstname} ${transfer.from_user.lastname}`
                            )}
                        </span>
                    </Row>
                    {transfer.reverted ? (
                        <Row>
                            <SubTitle>Angrefrist</SubTitle>
                            <span>
                                <b>Overføring er angret</b>
                            </span>
                        </Row>
                    ) : (
                        <Row>
                            <SubTitle>Angrefrist</SubTitle>
                            <span>{timeLeftLabel}</span>
                        </Row>
                    )}
                </Container>
            </TicketOuter>
            {transfer.from_user.uuid === user_uuid && !transfer.expired && !transfer.reverted ? (
                reverting ? (
                    <InlineSpinner />
                ) : (
                    <NegativeButton onClick={revert}>Angre</NegativeButton>
                )
            ) : null}
        </Outer>
    );
};
