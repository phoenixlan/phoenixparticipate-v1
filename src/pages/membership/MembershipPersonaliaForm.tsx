import React from 'react';
import styled from 'styled-components';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, FormProvider } from 'react-hook-form';
import { User } from '@phoenixlan/phoenix.js';

import { useUpsertMembershipPersonaliaMutation } from '../../hooks/api/useUpsertMembershipPersonaliaMutation';
import { PrimaryButton, TertiaryButton } from '../../sharedComponents/forms/Button';
import { FormLabel } from '../../sharedComponents/forms/FormLabel';
import { TextInput } from '../../sharedComponents/forms/TextInput';

const Form = styled.form`
    display: flex;
    flex-direction: column;
`;

const Info = styled.div`
    margin-bottom: ${({ theme }) => theme.spacing.m};
`;

const InfoButtons = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: ${({ theme }) => theme.spacing.s};
`;

type FormData = {
    address: string;
    postal_code: string;
};

const validationSchema = yup.object().shape({
    address: yup.string().trim().required('Vennligst skriv inn adresse'),
    postal_code: yup
        .string()
        .trim()
        .matches(/^[0-9]{4}$/, 'Postnummer må være fire siffer')
        .required('Vennligst skriv inn postnummer'),
});

interface Props {
    onDone?: () => void;
    defaultValues?: User.MembershipPersonalia.MembershipPersonalia | null;
    showIntro?: boolean;
    // Replaces the first paragraph of the intro, which is written for the purchase flow
    introText?: string;
    submitText?: string;
}

export const MembershipPersonaliaForm: React.FC<Props> = ({
    onDone,
    defaultValues,
    showIntro = false,
    introText = 'En eller flere av billettene dine inkluderer medlemskap i Radar Event. For å registrere medlemskapet trenger vi litt informasjon om deg. Denne informasjonen gir oss hodestøtte, les mer på medlemskapssiden.',
    submitText = 'Lagre',
}) => {
    const formMethods = useForm<FormData>({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            address: defaultValues?.address ?? '',
            postal_code: defaultValues?.postal_code ?? '',
        },
    });

    const upsertMutation = useUpsertMembershipPersonaliaMutation();

    const onSubmit = formMethods.handleSubmit(async (data) => {
        try {
            await upsertMutation.mutateAsync(data);
        } catch {
            // Error is reported by the mutation
            return;
        }
        onDone && onDone();
    });

    return (
        <FormProvider {...formMethods}>
            <Form onSubmit={onSubmit}>
                {showIntro && (
                    <Info>
                        <p>{introText}</p>
                        <p>Informasjonen behandles i henhold til våre bruksvilkår.</p>
                        <InfoButtons>
                            <TertiaryButton type="button" size="small" onClick={() => window.open('/membership', '_blank')}>
                                Les mer om medlemskap
                            </TertiaryButton>
                            <TertiaryButton
                                type="button"
                                size="small"
                                onClick={() => window.open(`${process.env.BASE_URL}/static/tos.html`, '_blank')}
                            >
                                Bruksvilkår
                            </TertiaryButton>
                        </InfoButtons>
                    </Info>
                )}
                <FormLabel>Adresse</FormLabel>
                <TextInput name="address" autoComplete="street-address" />
                <FormLabel>Postnummer</FormLabel>
                <TextInput name="postal_code" autoComplete="postal-code" />
                <PrimaryButton fluid={true} isLoading={upsertMutation.isLoading}>
                    {submitText}
                </PrimaryButton>
            </Form>
        </FormProvider>
    );
};
