/*
 * @created 01/04/2021 - 20:16
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import { TypeRow } from './TypeRow';
import { FormProvider, useForm } from 'react-hook-form';
import React from 'react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import styled from 'styled-components';
import { TicketType } from '@phoenixlan/phoenix.js';
import { PositiveButton } from '../../../../../sharedComponents/forms/Button';
import { ChosenTicketType } from '../../utils/types';
import { ErrorMessage } from '../../../../../sharedComponents/forms/ErrorMessage';

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
                        max={10 - getTotalAmount() + formMethods.watch(ticketType.uuid)}
                    />
                ))}
                <PositiveButton fluid={true} disabled={getAmount() === 0}>{`Betal ${getAmount()},-`}</PositiveButton>
            </Form>
        </FormProvider>
    );
};
