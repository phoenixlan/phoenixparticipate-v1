import React, { useState } from 'react';
import styled from 'styled-components';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, FormProvider } from 'react-hook-form';
import { Ticket as PhoenixTicket } from '@phoenixlan/phoenix.js';

import { NegativeButton, PositiveButton, TertiaryButton } from '../../../sharedComponents/forms/Button';
import { FormLabel } from '../../../sharedComponents/forms/FormLabel';
import { TextInput } from '../../../sharedComponents/forms/TextInput';
import { Header2 } from '../../../sharedComponents/Header2';
import { ShadowBox } from '../../../sharedComponents/boxes/ShadowBox';
import { useTransferTicketMutation } from '../../../hooks/api/useTransferTicketMutation';
import { useSiteConfig } from '../../../hooks/api/useSiteConfig';
import { useCurrentEvent } from '../../../hooks';
import { useAuth } from '../../../authentication/useAuth';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';

const Box = styled(ShadowBox)`
    width: 100%;
    padding: ${({ theme }) => theme.spacing.m};
`;

const Action = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${({ theme }) => theme.spacing.s};
    padding: ${({ theme }) => theme.spacing.s} 0;

    & + & {
        border-top: 1px solid ${({ theme }) => theme.colors.Gray};
    }

    p {
        margin: 0;
    }
`;

const MutedText = styled.p`
    color: ${({ theme }) => theme.colors.DarkGray};
`;

const Buttons = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: ${({ theme }) => theme.spacing.xs};
`;

type FormData = {
    email: string;
};

const validationSchema = yup.object().shape({
    email: yup.string().trim().email('Ugyldig e-postadresse').required('Vennligst skriv inn e-postadresse'),
});

interface TicketSettingsProps {
    ticket: PhoenixTicket.FullTicket;
}

enum ModificationState {
    NONE,
    TRANSFER,
    SET_SEATER,
}

export const TicketSettings: React.FC<TicketSettingsProps> = ({ ticket }) => {
    const history = useHistory();
    const { client } = useAuth();
    const { data: siteConfig } = useSiteConfig();
    const { data: currentEvent } = useCurrentEvent();
    const [loading, setLoading] = useState(false);

    const [state, setState] = useState<ModificationState>(ModificationState.NONE);

    const formMethods = useForm<FormData>({
        resolver: yupResolver(validationSchema),
        defaultValues: { email: '' },
    });

    const transferTicketMutation = useTransferTicketMutation();

    const isOwner = ticket.owner.uuid === client.user?.uuid;
    const isCurrentEvent = !!currentEvent && ticket.event.uuid === currentEvent.uuid;
    const canSetSeater = isOwner && isCurrentEvent && ticket.ticket_type.seatable && (siteConfig?.features ?? []).includes('seatmap');
    const canTransfer = isOwner && isCurrentEvent && ticket.ticket_type.transferable && !ticket.checked_in;
    const hasOtherSeater = !!ticket.seater && ticket.seater.uuid !== ticket.owner.uuid;

    const updateSeater = async (seaterEmail: string | undefined) => {
        setLoading(true);
        try {
            await PhoenixTicket.setTicketSeater(ticket.ticket_id, seaterEmail);
        } catch (e) {
            console.log(e);
            const reason = e instanceof Error && e.message ? `: ${e.message}` : '';
            toast.error(`Kunne ikke endre seater${reason}`);
            setLoading(false);
            return;
        }
        setLoading(false);
        location.reload();
    };

    const transferTicket = async (email: string) => {
        setLoading(true);
        try {
            await transferTicketMutation.mutateAsync({ ticket_id: ticket.ticket_id, email });
        } catch {
            // Error is reported by the mutation. Stay on the prompt so the email can be corrected
            setLoading(false);
            return;
        }
        setLoading(false);
        history.push('/');
    };

    const onSubmit = formMethods.handleSubmit(({ email }) =>
        state === ModificationState.TRANSFER ? transferTicket(email.trim()) : updateSeater(email.trim()),
    );

    const cancel = () => {
        formMethods.reset();
        setState(ModificationState.NONE);
    };

    if (!canSetSeater && !canTransfer) {
        return null;
    }

    if (state !== ModificationState.NONE) {
        const isTransfer = state === ModificationState.TRANSFER;
        const SubmitButton = isTransfer ? NegativeButton : PositiveButton;

        return (
            <Box>
                <Header2>{isTransfer ? 'Overfør billett' : 'Sett seater'}</Header2>
                {isTransfer ? (
                    <p>
                        Merk at mottakeren <b>må være registrert</b>. Du kan angre overføringen i 24 timer, men dersom
                        du angrer vil mottakeren få beskjed om dette. Det blir også loggført.
                    </p>
                ) : (
                    <p>
                        Du må kunne e-post addressen til personen som skal seate billetten din. Denne personen må
                        allerede ha en konto.
                    </p>
                )}
                <FormProvider {...formMethods}>
                    <form onSubmit={onSubmit}>
                        <FormLabel>{isTransfer ? 'E-post til mottaker' : 'E-post til seater'}</FormLabel>
                        <TextInput name="email" type="email" autoComplete="off" />
                        <Buttons>
                            <TertiaryButton type="button" size="small" onClick={cancel} disabled={loading}>
                                Avbryt
                            </TertiaryButton>
                            <SubmitButton size="small" isLoading={loading}>
                                {isTransfer ? 'Overfør' : 'Sett seater'}
                            </SubmitButton>
                        </Buttons>
                    </form>
                </FormProvider>
            </Box>
        );
    }

    return (
        <Box>
            <Header2>Innstillinger</Header2>
            {canSetSeater && (
                <Action>
                    <div>
                        <p>
                            <b>Seater</b>
                        </p>
                        <MutedText>
                            {hasOtherSeater ? `${ticket.seater?.firstname} ${ticket.seater?.lastname}` : 'Deg'}
                        </MutedText>
                    </div>
                    <Buttons>
                        {hasOtherSeater && (
                            <TertiaryButton size="small" isLoading={loading} onClick={() => updateSeater(undefined)}>
                                Fjern
                            </TertiaryButton>
                        )}
                        <PositiveButton size="small" onClick={() => setState(ModificationState.SET_SEATER)}>
                            Endre
                        </PositiveButton>
                    </Buttons>
                </Action>
            )}
            {canTransfer && (
                <Action>
                    <div>
                        <p>
                            <b>Overfør billett</b>
                        </p>
                        <MutedText>Gi billetten til en annen bruker</MutedText>
                    </div>
                    <Buttons>
                        <NegativeButton size="small" onClick={() => setState(ModificationState.TRANSFER)}>
                            Overfør
                        </NegativeButton>
                    </Buttons>
                </Action>
            )}
        </Box>
    );
};
