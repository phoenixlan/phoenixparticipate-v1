/*
 * @created 01/04/2021 - 20:16
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import { TypeRow } from './TypeRow';
import { UnlockTicketTypeForm } from './UnlockTicketTypeForm';
import { FormProvider, useForm } from 'react-hook-form';
import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import styled from 'styled-components';
import { TicketAvailability, TicketType, TicketVoucher, User } from '@phoenixlan/phoenix.js';
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

const Countdown = {
    Box: styled.div`
        width: 100%;
        margin-top: ${({ theme }) => theme.spacing.l};
        text-align: center;
    `,
    Units: styled.div`
        display: flex;
        justify-content: center;
        gap: ${({ theme }) => theme.spacing.l};
        margin: ${({ theme }) => theme.spacing.m} 0;
    `,
    Unit: styled.div`
        display: flex;
        flex-direction: column;
        align-items: center;
        min-width: 3.5rem;
    `,
    Value: styled.span`
        font-size: ${({ theme }) => theme.fontSize.xxl};
        font-weight: bold;
        font-variant-numeric: tabular-nums;
        line-height: 1;
        color: ${({ theme }) => theme.colors.primary};
    `,
    Label: styled.span`
        margin-top: ${({ theme }) => theme.spacing.xxs};
    `,
    Date: styled.p`
        margin: 0;
    `,
};

interface TicketSaleCountdownProps {
    opensAt: number;
    onOpen: () => void;
}

const TicketSaleCountdown: React.FC<TicketSaleCountdownProps> = ({ opensAt, onOpen }) => {
    const [now, setNow] = useState(Date.now());

    useEffect(() => {
        const interval = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(interval);
    }, []);

    const secondsLeft = Math.max(Math.ceil((opensAt - now) / 1000), 0);

    useEffect(() => {
        if (secondsLeft === 0) {
            onOpen();
        }
    }, [secondsLeft === 0]);

    const days = Math.floor(secondsLeft / 86400);
    const units = [
        { value: days, label: days === 1 ? 'dag' : 'dager' },
        { value: Math.floor(secondsLeft / 3600) % 24, label: 'timer' },
        { value: Math.floor(secondsLeft / 60) % 60, label: 'min' },
        { value: secondsLeft % 60, label: 'sek' },
    ].filter((unit, i) => i > 0 || unit.value > 0);

    return (
        <Countdown.Box>
            <Header2>Billettsalget åpner om</Header2>
            <Countdown.Units>
                {units.map((unit) => (
                    <Countdown.Unit key={unit.label}>
                        <Countdown.Value>{String(unit.value).padStart(2, '0')}</Countdown.Value>
                        <Countdown.Label>{unit.label}</Countdown.Label>
                    </Countdown.Unit>
                ))}
            </Countdown.Units>
            <Countdown.Date>
                {new Date(opensAt).toLocaleString('nb-NO', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    hour: '2-digit',
                    minute: '2-digit',
                })}
            </Countdown.Date>
        </Countdown.Box>
    );
};

interface Props {
    ticketTypes: Array<TicketType.TicketType>;
    ticketVouchers: Array<TicketVoucher.BasicTicketVoucher>;
    onSubmit: (chosenTickets: ChosenTicketType) => void;
}

// Hard limit on how many tickets can be bought in one purchase, regardless of availability
const MAX_TICKETS_PER_PURCHASE = 10;

// max is how many tickets of the type the cart may contain, remaining is how many more can be added.
// Both are null if nothing limits the ticket type
type CartAvailability = { [ticketTypeUuid: string]: { max: number | null; remaining: number | null } };

// Form values can be strings, so they are normalized to numbers
const toAmount = (value: unknown): number => {
    const amount = typeof value === 'string' ? parseInt(value) : Number(value);
    return isNaN(amount) ? 0 : amount;
};

// A ticket type is limited by its own remaining count and by every group it belongs to. Tickets of other types in the
// cart use up the groups they share with the ticket type, so they lower how many of it can be bought
const applyCartToAvailability = (
    availability: TicketAvailability | undefined,
    cart: ChosenTicketType,
): CartAvailability => {
    const result: CartAvailability = {};
    if (!availability) {
        return result;
    }

    const groupRemaining = new Map<string, number>();
    for (const group of availability.groups) {
        groupRemaining.set(group.group, group.remaining);
    }

    for (const entry of availability.ticket_types) {
        const uuid = entry.ticket_type.uuid;
        const limits: Array<number> = [];
        if (entry.remaining !== null) {
            limits.push(entry.remaining);
        }
        for (const group of entry.groups) {
            const remaining = groupRemaining.get(group);
            // Groups without a configured cap don't limit anything
            if (remaining === undefined) {
                continue;
            }
            let usedByOthers = 0;
            for (const other of availability.ticket_types) {
                if (other.ticket_type.uuid !== uuid && other.groups.includes(group)) {
                    usedByOthers += toAmount(cart[other.ticket_type.uuid]);
                }
            }
            limits.push(remaining - usedByOthers);
        }

        const max = limits.length > 0 ? Math.max(Math.min(...limits), 0) : null;
        result[uuid] = {
            max,
            remaining: max === null ? null : Math.max(max - toAmount(cart[uuid]), 0),
        };
    }
    return result;
};

export const TicketsForm: React.FC<Props> = ({ ticketTypes, ticketVouchers, onSubmit }) => {
    const { data: currentEvent, isLoading: isLoadingCurrentEvent } = useCurrentEvent();
    const { data: ticketAvailability, isLoading: isLoadingTicketAvailability } = useTicketAvailability();
    const [canBypassTicketSaleRestriction, setCanBypassTicketSaleRestriction] = useState(false);
    // Set by the countdown so the form opens by itself when the sale starts
    const [hasCountdownEnded, setHasCountdownEnded] = useState(false);
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
            .test('max', `Du kan maks velge ${MAX_TICKETS_PER_PURCHASE} billetter til sammen`, function () {
                let sum = 0;
                for (const val of Object.values(this.parent)) {
                    sum += val as number;
                }
                return MAX_TICKETS_PER_PURCHASE >= sum;
            })
            .test('available', 'Det er ikke nok billetter igjen av en av billettypene du har valgt', function () {
                const cartAvailability = applyCartToAvailability(ticketAvailability, this.parent);
                return Object.entries(cartAvailability).every(
                    ([uuid, { max }]) => max === null || toAmount(this.parent[uuid]) <= max,
                );
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

    const cart: ChosenTicketType = {};
    for (const ticketType of ticketTypes) {
        cart[ticketType.uuid] = toAmount(formMethods.watch(ticketType.uuid));
    }

    const getAmount = () => {
        let amount = 0;
        for (const ticketType of ticketTypes) {
            amount += ticketType.price * cart[ticketType.uuid];
        }
        return amount;
    };
    const cartAvailability = applyCartToAvailability(ticketAvailability, cart);

    const getTotalAmount = () => {
        let amount = 0;
        for (const ticketType of ticketTypes) {
            amount += cart[ticketType.uuid];
        }
        return amount;
    };

    // The per-purchase limit always applies. Availability can only lower it
    const getMax = (uuid: string) => {
        const purchaseMax = MAX_TICKETS_PER_PURCHASE - getTotalAmount() + cart[uuid];
        const availableMax = cartAvailability[uuid]?.max ?? null;
        return availableMax === null ? purchaseMax : Math.min(purchaseMax, availableMax);
    };

    const admissionAvailability = (ticketAvailability?.ticket_types ?? []).filter(
        (entry) => entry.ticket_type.grants_admission,
    );
    const isSoldOut = admissionAvailability.length > 0 && admissionAvailability.every((entry) => entry.remaining === 0);

    // Most expensive first within each category
    const byPriceDescending = (a: TicketType.TicketType, b: TicketType.TicketType) => b.price - a.price;
    const admissionTickets = ticketTypes
        .filter((type) => type.grants_admission && (type.requires_membership || type.grants_membership))
        .sort(byPriceDescending);
    const noMembershipTickets = ticketTypes
        .filter((type) => type.grants_admission && !(type.requires_membership || type.grants_membership))
        .sort(byPriceDescending);
    const otherTickets = ticketTypes.filter((type) => !type.grants_admission).sort(byPriceDescending);

    const ticketSaleOpen = hasCountdownEnded || new Date().getTime() > bookingTime * 1000;

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

            {isSoldOut ? (
                <WarningBox title="Utsolgt">
                    <p>
                        Arrangementet er utsolgt for denne gangen. Takk for din interesse - vi håper du kommer neste
                        gang i stedet.
                    </p>
                    <p>
                        <b>NB: </b>Vi holder av billetter imens kunder betaler. Dersom arrangementet ble nylig utsolgt
                        er det sjangs for at billetter kan dukke opp ila den neste timen.
                    </p>
                </WarningBox>
            ) : null}
            <FormProvider {...formMethods}>
                <Form onSubmit={handleSubmit}>
                    {formMethods.errors && ticketTypes && ticketTypes.length > 0 && (
                        <ErrorMessage name={ticketTypes[0].uuid} />
                    )}
                    { admissionTickets.length > 0 && (<Header2>Billetter(Lar deg være med på Arrangementet)</Header2>)}
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
                            max={getMax(ticketType.uuid)}
                            remaining={cartAvailability[ticketType.uuid]?.remaining ?? null}
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
                            max={getMax(ticketType.uuid)}
                            remaining={cartAvailability[ticketType.uuid]?.remaining ?? null}
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
                            max={getMax(ticketType.uuid)}
                            remaining={cartAvailability[ticketType.uuid]?.remaining ?? null}
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
                            <PositiveButton fluid={true} disabled={getTotalAmount() === 0}>
                                {getTotalAmount() > 0 && getAmount() === 0 ? 'Løs ut' : 'Betal'}
                            </PositiveButton>
                        </>
                    ) : (
                        <TicketSaleCountdown
                            opensAt={bookingTime * 1000}
                            onOpen={() => setHasCountdownEnded(true)}
                        />
                    )}
                </Form>
                <UnlockTicketTypeForm />
                {features.includes('membership') ? <MembershipInfo /> : null}
            </FormProvider>
        </Skeleton>
    );
};
