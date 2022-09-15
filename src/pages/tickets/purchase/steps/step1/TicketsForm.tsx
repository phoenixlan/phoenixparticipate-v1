/*
 * @created 01/04/2021 - 20:16
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import { TypeRow } from './TypeRow';
import { FormProvider, useForm } from 'react-hook-form';
import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import styled from 'styled-components';
import { TicketType, User } from '@phoenixlan/phoenix.js';
import { PositiveButton } from '../../../../../sharedComponents/forms/Button';
import { ChosenTicketType } from '../../utils/types';
import { ErrorMessage } from '../../../../../sharedComponents/forms/ErrorMessage';
import { useCurrentEvent } from '../../../../../hooks/api/useCurrentEvent';
import { Header2 } from '../../../../../sharedComponents/Header2';
import { useAuth } from '../../../../../authentication/useAuth';
import { ShadowBox } from '../../../../../sharedComponents/boxes/ShadowBox';

const Form = styled.form`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

interface Props {
    ticketTypes: Array<TicketType.TicketType>;
    onSubmit: (chosenTickets: ChosenTicketType) => void;
}

export const TicketsForm: React.FC<Props> = ({ ticketTypes, onSubmit }) => {
    const { data: currentEvent, isLoading: isLoadingCurrentEvent } = useCurrentEvent();
    const [canBypassTicketSaleRestriction, setCanBypassTicketSaleRestriction] = useState(false);
    const auth = useAuth();
    // Decode and extract the JWT token so we can see if the user has special permissions
    useEffect(() => {
        const inner = async () => {
            const token = (await Promise.resolve(
                auth.client.parsedToken ? auth.client.parsedToken() : { placeholder: true },
            )) as User.Oauth.JWTPayload;
            if (token.roles.indexOf('ticket_bypass_ticketsale_start_restriction') !== -1) {
                setCanBypassTicketSaleRestriction(true);
            }
        };
        inner();
    }, []);

    const bookingTime = currentEvent?.booking_time ?? 0;

    type validationSchemaType = { [index: string]: yup.AnySchema };
    const validationSchemaObject: validationSchemaType = {};
    for (const ticketType of ticketTypes) {
        validationSchemaObject[ticketType.uuid] = yup
            .number()
            .min(0, 'placeholder')
            .required('placeholder')
            .test('min', 'Du må velge minst en billett', function () {
                let sum = 0;
                for (const val of Object.values(this.parent)) {
                    sum += val as number;
                }
                return 0 <= sum;
            })
            .test('max', 'Du kan maks velge 10 billetter til sammen', function () {
                let sum = 0;
                for (const val of Object.values(this.parent)) {
                    sum += val as number;
                }
                return 10 >= sum;
            });
    }
    const validationSchema = yup.object().shape(validationSchemaObject);

    const defaultValues: ChosenTicketType = {};
    for (const ticketType of ticketTypes) {
        defaultValues[ticketType.uuid] = 0;
    }

    const formMethods = useForm(
        /*<FormData>*/ {
            resolver: yupResolver(validationSchema),
            defaultValues: defaultValues,
        },
    );

    const handleSubmit = formMethods.handleSubmit(async (data) => {
        onSubmit(data);
    });

    const getAmount = () => {
        let amount = 0;
        for (const ticketType of ticketTypes) {
            amount += ticketType.price * formMethods.watch(ticketType.uuid);
        }
        return amount;
    };

    const getTotalAmount = () => {
        let amount = 0;
        for (const ticketType of ticketTypes) {
            let part = formMethods.watch(ticketType.uuid);
            if (typeof part === 'string') {
                part = parseInt(part);
            }
            amount += part;
        }
        return amount;
    };

    const ticketSaleOpen = new Date().getTime() > bookingTime * 1000;

    return (
        <FormProvider {...formMethods}>
            <Form onSubmit={handleSubmit}>
                {formMethods.errors && ticketTypes && ticketTypes.length > 0 && (
                    <ErrorMessage name={ticketTypes[0].uuid} />
                )}
                {ticketTypes.map((ticketType) => (
                    <TypeRow
                        key={ticketType.name}
                        name={ticketType.name}
                        uuid={ticketType.uuid}
                        description={ticketType.description ?? undefined}
                        amount={formMethods.watch(ticketType.uuid)}
                        price={ticketType.price}
                        enabled={ticketSaleOpen || canBypassTicketSaleRestriction}
                        max={10 - getTotalAmount() + formMethods.watch(ticketType.uuid)}
                    />
                ))}
                {ticketSaleOpen || canBypassTicketSaleRestriction ? (
                    <>
                        {canBypassTicketSaleRestriction ? (
                            <>
                                <Header2>Du har spesielle tillatelser</Header2>
                                <p>
                                    Billettsalget åpner {new Date(bookingTime * 1000).toLocaleString()}, men du kan
                                    kjøpe billetter allerede da du har spesialtillatelse
                                </p>
                            </>
                        ) : null}
                        <PositiveButton
                            fluid={true}
                            disabled={getAmount() === 0}
                        >{`Betal ${getAmount()},-`}</PositiveButton>
                    </>
                ) : (
                    <>
                        <Header2>Billettsalget har ikke åpnet</Header2>
                        <p>Billettsalget åpner {new Date(bookingTime * 1000).toLocaleString()}</p>
                    </>
                )}
            </Form>
            <div>
                <Header2>Hva er &quot;Radar event medlemskap&quot;</Header2>
                <p>
                    LANet er eid av Radar Event. Radar Event er en organisasjon av ungdom for ungdom tilknyttet Radar på
                    Asker Kulturhus, som er ansvarlig for arrangering av ungdoms-arrangement i Asker-omerådet. For at
                    arrangementene skal være billige er vi avhengige av hodestøtte fra Hyperion(som får pengene fra
                    staten).{' '}
                </p>
                <p>
                    Vi selger derfor billetter med medlemskap inkludert i prisen, som da brukes for å finansiere
                    arrangementet. Dette gjør billetten billigere enn den hadde vært dersom medlemskap ikke var med i
                    bildet.{' '}
                    <b>
                        Billetten uten medlemskap i Radar Event koster mer fordi vi må kompansere for tap av hodestøtte.
                        De fleste vil ikke trenge denne billetten.
                    </b>
                </p>
                <p>
                    Et medlemskap i Radar Event koster 50kr varer ut kalenderåret, og fornyes ikke automatisk. Disse 50
                    kronene er inkludert i billettprisen dersom du kjøper billett med medlemskap inkludert. Den
                    vanligste måten å bli medlem på er å kjøpe billett med medfølgende medlemskap til et av våre
                    arrangementer. Fordelen med medlemskap er lavere priser på arrangement hos Radar Event ut
                    kalenderåret.
                </p>
            </div>
        </FormProvider>
    );
};
