/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { CrewSelect } from '../../sharedComponents/forms/CrewSelect';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, FormProvider } from 'react-hook-form';
import { PositiveButton } from '../../sharedComponents/forms/Button';
import { TextArea } from '../../sharedComponents/forms/TextArea';
import { Crew } from '@phoenixlan/phoenix.js';
import { useMutation, useQueryClient } from 'react-query';
import { userApplicationDefaultQueryKey } from '../../hooks/api/useUserApplications';
import { InlineSpinner, LoadingSpinner } from '../../sharedComponents/LoadingSpinner';
import { toast } from 'react-toastify';

const Form = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const Info = styled.div`
    margin-bottom: ${({ theme }) => theme.spacing.m};
`;

type FormData = {
    selectedCrew: string;
    applicationText: string;
};

const validationSchema = yup.object().shape({
    selectedCrew: yup.string().min(1, 'Vennligst velg et crew').required('Vennligst velg et crew'),
    applicationText: yup
        .string()
        .min(1, 'Du kan ikke sende en tom søknad')
        .max(10000, 'En søknad kan maks være 10000 tegn')
        .required('Vennligst skriv en søknad'),
});

export const ApplicationForm: React.FC = () => {
    const formMethods = useForm<FormData>({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            selectedCrew: '',
            applicationText: '',
        },
    });

    const queryClient = useQueryClient();
    const addApplicationMutation = useMutation(
        (newApplcation: { crew: string; contents: string }) =>
            Crew.Applications.createApplication(newApplcation.crew, newApplcation.contents),
        {
            onSuccess: (application) => {
                console.log('success');
            },
            onError: (e) => {
                toast.error('Kunne ikke send søknad');
            },
            onSettled: () => {
                console.log('settled');
                queryClient.invalidateQueries(userApplicationDefaultQueryKey);
            },
        },
    );

    const onSubmit = formMethods.handleSubmit(async (data, e) => {
        const newApplication = {
            crew: data.selectedCrew.toString(),
            contents: data.applicationText,
        };

        addApplicationMutation.mutate(newApplication);
        e?.target.reset();
    });

    return (
        <FormProvider {...formMethods}>
            <Form onSubmit={onSubmit}>
                <Info>
                    Velkommen! Som crew vil du oppleve ting du aldri ville som deltaker, få erfaring du kan sette på
                    CV-en, og møte mange nye og spennende mennesker. Dersom det er første gang du skal søke crew på
                    Phoenix, anbefaler vi at du leser igjennom beskrivelsene av våre crew.
                </Info>
                <CrewSelect onlyApplyable={true} />
                <TextArea name="applicationText" />
                {addApplicationMutation.isLoading ? <InlineSpinner /> : <PositiveButton>Søk</PositiveButton>}
            </Form>
        </FormProvider>
    );
};
