import React from 'react';
import styled from 'styled-components';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';

import { useCurrentEvent } from '../../../../../hooks/api/useCurrentEvent';
import { useUnlockTicketTypeMutation } from '../../../../../hooks/api/useUnlockTicketTypeMutation';
import { Header2 } from '../../../../../sharedComponents/Header2';
import { PositiveButton } from '../../../../../sharedComponents/forms/Button';
import { ErrorMessage } from '../../../../../sharedComponents/forms/ErrorMessage';

const Form = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    margin: ${({ theme }) => theme.spacing.xl} 0 ${({ theme }) => theme.spacing.l} 0;
`;

const Description = styled.p`
    margin: 0 0 ${({ theme }) => theme.spacing.s} 0;
    text-align: center;
`;

const Row = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.xs};
`;

// Kept the same height as a small button so the two line up
const Input = styled.input`
    width: 12rem;
    height: 2.5rem;
    padding: 0 ${({ theme }) => theme.spacing.s};
    border: 1px solid ${({ theme }) => theme.colors.SemiDarkGray};
    border-radius: ${({ theme }) => theme.borderRadius.m};
    font-size: ${({ theme }) => theme.fontSize.m};
    font-family: inherit;
    transition: border-color ${({ theme }) => theme.transition.default},
        box-shadow ${({ theme }) => theme.transition.default};

    &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.colors.primary};
        box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}22;
    }
`;

type FormData = {
    code: string;
};

const validationSchema = yup.object().shape({
    code: yup.string().trim().required('Vennligst skriv inn en kode'),
});

export const UnlockTicketTypeForm: React.FC = () => {
    const { data: currentEvent } = useCurrentEvent();
    const unlockMutation = useUnlockTicketTypeMutation();

    const formMethods = useForm<FormData>({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            code: '',
        },
    });

    const onSubmit = formMethods.handleSubmit(async (data) => {
        if (!currentEvent) {
            return;
        }
        let success = false;
        try {
            success = await unlockMutation.mutateAsync({ eventUuid: currentEvent.uuid, code: data.code.trim() });
        } catch {
            // Error is reported by the mutation
            return;
        }
        if (success) {
            formMethods.reset();
        }
    });

    return (
        <FormProvider {...formMethods}>
            <Form onSubmit={onSubmit}>
                <Header2>Aktiver kode</Header2>
                <Description>Har du fått en billettkode kan du skrive den inn her</Description>
                <Row>
                    <Input ref={formMethods.register} name="code" placeholder="Billettkode" autoComplete="off" />
                    <PositiveButton size="small" isLoading={unlockMutation.isLoading}>
                        Aktiver
                    </PositiveButton>
                </Row>
                <ErrorMessage name="code" />
            </Form>
        </FormProvider>
    );
};
