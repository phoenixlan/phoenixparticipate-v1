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
import { TicketType, TicketVoucher, User } from '@phoenixlan/phoenix.js';
import { PositiveButton } from '../../../../../sharedComponents/forms/Button';
import { ChosenTicketType } from '../../utils/types';
import { ErrorMessage } from '../../../../../sharedComponents/forms/ErrorMessage';
import { Skeleton } from '../../../../../sharedComponents/Skeleton';
import { useCurrentEvent } from '../../../../../hooks/api/useCurrentEvent';
import { Header2 } from '../../../../../sharedComponents/Header2';
import { useAuth } from '../../../../../authentication/useAuth';
import { ShadowBox } from '../../../../../sharedComponents/boxes/ShadowBox';
import { MembershipInfo } from '../../../MembershipInfo';
import { useMembershipStatus } from '../../../../../hooks/api/useMembershipStatus';
import { InfoBox, WarningBox } from '../../../../../sharedComponents/NoticeBox';
import { useSiteConfig } from '../../../../../hooks/api/useSiteConfig';
import { useTicketAvailability } from '../../../../../hooks/api/useTicketAvailability';

const Form = styled.form`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

interface Props {
    ticketTypes: Array<TicketType.TicketType>;
    ticketVouchers: Array<TicketVoucher.BasicTicketVoucher>;
    onSubmit: (chosenTickets: ChosenTicketType) => void;
}

export const TicketsForm: React.FC<Props> = ({ ticketTypes, ticketVouchers, onSubmit }) => {
    const { data: currentEvent, isLoading: isLoadingCurrentEvent } = useCurrentEvent();
    const { data: ticketAvailability, isLoading: isLoadingTicketAvailability } = useTicketAvailability();
    const [canBypassTicketSaleRestriction, setCanBypassTicketSaleRestriction] = useState(false);
    const { data: siteConfig } = useSiteConfig();
    const features = siteConfig?.features ?? [];

    const isLoading = isLoadingCurrentEvent || isLoadingTicketAvailability;

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

    const apiReportedTicketAvailability = (ticketAvailability?.total);
    // Fallback to 10 if availability hasnt loaded, should never happen in practice
    const availableTickets = Math.min(10, apiReportedTicketAvailability != undefined ? apiReportedTicketAvailability : 10);

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
            .test('max', `Du kan maks velge ${availableTickets} billetter til sammen`, function () {
                let sum = 0;
                for (const val of Object.values(this.parent)) {
                    sum += val as number;
                }
                return availableTickets >= sum;
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

    const admissionTickets = ticketTypes.filter(
        (type) => type.grants_admission && (type.requires_membership || type.grants_membership),
    );
    const noMembershipTickets = ticketTypes.filter(
        (type) => type.grants_admission && !(type.requires_membership || type.grants_membership),
    );
    const otherTickets = ticketTypes.filter((type) => !type.grants_admission);

    const ticketSaleOpen = new Date().getTime() > bookingTime * 1000;

    return (
        <Skeleton loading={isLoading}>
            {ticketVouchers.filter(
                (voucher: TicketVoucher.BasicTicketVoucher) => !voucher.is_used && !voucher.is_expired,
            ).length > 0 ? (
                <InfoBox title="Du har ubrukte billett-gavekort">
                    <p>
                        Du har ubrukte billett-gavekort - du trenger ikke nødvendigvis å kjøpe en billett. Du kan bruke
                        billett-gavekortet ditt ved å gå hit.
                    </p>
                </InfoBox>
            ) : null}

            {
                ticketAvailability?.total == 0 ? (
                    <WarningBox title="Utsolgt">
                        <p>
                            Arrangementet er utsolgt for denne gangen. Takk for din interesse - vi håper du kommer neste gang i stedet.
                        </p>
                        <p><b>NB: </b>Vi holder av billetter imens kunder betaler. Dersom arrangementet ble nylig utsolgt er det sjangs for at billetter kan dukke opp ila den neste timen.</p>
                    </WarningBox>
                ) : null
            }
            {
                (ticketAvailability?.total !== 0) && (ticketAvailability != undefined && ticketAvailability?.total < 10) ? (
                    <InfoBox title="Få billetter igjen">
                        <p>
                            Det er kun {ticketAvailability?.total} billett(er) igjen - arrangementet er i ferd med å bli utsolgt.
                        </p>
                    </InfoBox>
                ) : null
            }
            <FormProvider {...formMethods}>
                <Form onSubmit={handleSubmit}>
                    {formMethods.errors && ticketTypes && ticketTypes.length > 0 && (
                        <ErrorMessage name={ticketTypes[0].uuid} />
                    )}
                    <Header2>Billetter(Lar deg være med på Arrangementet)</Header2>
                    {admissionTickets.map((ticketType) => (
                        <TypeRow
                            key={ticketType.name}
                            name={ticketType.name}
                            uuid={ticketType.uuid}
                            description={ticketType.description ?? undefined}
                            amount={formMethods.watch(ticketType.uuid)}
                            price={ticketType.price}
                            isSeatable={ticketType.seatable}
                            grantsMembership={ticketType.grants_membership}
                            grantsAdmission={ticketType.grants_admission}
                            enabled={ticketSaleOpen || canBypassTicketSaleRestriction}
                            max={availableTickets - getTotalAmount() + formMethods.watch(ticketType.uuid)}
                        />
                    ))}
                    {noMembershipTickets.length > 0 ? <Header2>Spesielle billetter</Header2> : null}
                    {noMembershipTickets.map((ticketType) => (
                        <TypeRow
                            key={ticketType.name}
                            name={ticketType.name}
                            uuid={ticketType.uuid}
                            description={ticketType.description ?? undefined}
                            amount={formMethods.watch(ticketType.uuid)}
                            price={ticketType.price}
                            isSeatable={ticketType.seatable}
                            grantsMembership={ticketType.grants_membership}
                            grantsAdmission={ticketType.grants_admission}
                            enabled={ticketSaleOpen || canBypassTicketSaleRestriction}
                            max={availableTickets - getTotalAmount() + formMethods.watch(ticketType.uuid)}
                        />
                    ))}
                    {otherTickets.length > 0 ? <Header2>Annet</Header2> : null}
                    {otherTickets.map((ticketType) => (
                        <TypeRow
                            key={ticketType.name}
                            name={ticketType.name}
                            uuid={ticketType.uuid}
                            description={ticketType.description ?? undefined}
                            amount={formMethods.watch(ticketType.uuid)}
                            price={ticketType.price}
                            isSeatable={ticketType.seatable}
                            grantsMembership={ticketType.grants_membership}
                            grantsAdmission={ticketType.grants_admission}
                            enabled={ticketSaleOpen || canBypassTicketSaleRestriction}
                            max={availableTickets - getTotalAmount() + formMethods.watch(ticketType.uuid)}
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
                            <Header2>Totalsum: {getAmount()},-</Header2>
                            <PositiveButton fluid={true} disabled={getAmount() === 0}>{`Betal`}</PositiveButton>
                        </>
                    ) : (
                        <>
                            <Header2>Billettsalget har ikke åpnet</Header2>
                            <p>Billettsalget åpner {new Date(bookingTime * 1000).toLocaleString()}</p>
                        </>
                    )}
                </Form>
                {features.includes('membership') ? <MembershipInfo /> : null}
            </FormProvider>
        </Skeleton>
    );
};
