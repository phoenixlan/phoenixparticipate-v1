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
import { Header2 } from '../../sharedComponents/Header2';
import { FormLabel } from '../../sharedComponents/forms/FormLabel';

const Form = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const Info = styled.div`
    margin-bottom: ${({ theme }) => theme.spacing.m};
`;

const Center = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

type FormData = {
    crew1: string;
    crew2: string;
    crew3: string;
    applicationText: string;
};

const validationSchema = yup.object().shape({
    crew1: yup.string().min(1, 'Vennligst velg et crew').required('Vennligst velg et crew'),
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
            crew1: '',
            crew2: '',
            crew3: '',
            applicationText: '',
        },
    });

    const queryClient = useQueryClient();
    const addApplicationMutation = useMutation(
        (newApplcation: { crews: Array<string>; contents: string }) =>
            Crew.Applications.createApplication(newApplcation.crews, newApplcation.contents),
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
        const crews = [];
        crews.push(data.crew1.toString());
        if (data.crew2.toString()) {
            crews.push(data.crew2.toString());
        }
        if (data.crew3.toString()) {
            crews.push(data.crew3.toString());
        }
        const newApplication = {
            crews,
            contents: data.applicationText,
        };

        addApplicationMutation.mutate(newApplication);
        e?.target.reset();
    });

    return (
        <FormProvider {...formMethods}>
            <Form onSubmit={onSubmit}>
                <Info>
                    <p>
                        Velkommen! Som crew vil du oppleve ting du aldri ville som deltaker, få erfaring du kan sette på
                        CV-en, og møte mange nye og spennende mennesker. Dersom det er første gang du søker anbefaler vi
                        at du leser igjennom beskrivelsene av våre grupper.
                    </p>
                    <p>Som crew får du:</p>
                    <ul>
                        <li>
                            Sitteplass(I eget område - du må kjøpe deltakerbillett om du vil sitte med deltakere. Snakk
                            med gruppelederen din først!)
                        </li>
                        <li>Invitasjon til egne crew-aktiviteter</li>
                        <li>Noe å skrive på CVen</li>
                        <li>Nye erfaringer og opplevelser for livet</li>
                    </ul>
                    <p>
                        Crew holder også lengre på enn deltakere - vi pleier å starte et par dager før, og avslutter
                        arbeidet vårt på ettermiddagen samme dag som arrangementet slutter.
                    </p>
                    <p>Dersom du melder deg inn i Radar Event får du også mat for hele helgen og merch.</p>
                    <p>
                        Usikker på hva du skal skrive? Skriv litt om deg selv - hva du gjør på fritiden og hvorfor du
                        valgte å søke. Legg gjerne ved en måte du kan bli nådd enkelt for videre spørsmål fra oss.
                    </p>
                    <p>
                        Du kan søke opptil 3 crew i en søknad. Vi oppfordrer deg til å velge flere crew, da enkelte crew
                        fylles raskt opp.
                    </p>
                </Info>
                <FormLabel>Første valg</FormLabel>
                <CrewSelect required={true} name="crew1" onlyApplyable={true} />
                <FormLabel>Andre valg</FormLabel>
                <CrewSelect name="crew2" onlyApplyable={true} />
                <FormLabel>Tredje valg</FormLabel>
                <CrewSelect name="crew3" onlyApplyable={true} />
                <FormLabel>Søknad</FormLabel>
                <TextArea name="applicationText" />
                {addApplicationMutation.isLoading ? (
                    <InlineSpinner />
                ) : (
                    <Center>
                        <PositiveButton>Søk</PositiveButton>
                    </Center>
                )}
            </Form>
        </FormProvider>
    );
};
