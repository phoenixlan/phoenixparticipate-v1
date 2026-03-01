/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import { useCurrentEvent } from '../../hooks';
import { useCurrentEventTicketTypes } from '../../hooks/api/useCurrentEventTicketTypes';

const shineLines = keyframes`
    0% {
        left: -100px;
    }
    100% {
        left: 100%;
    }
`;

const Link = styled.a`
    color: blue;
    :visited {
        color: purple;
    }
`;
const Container = styled.div<{ skeleton: boolean }>`
    padding: ${({ theme }) => theme.spacing.m};

    ${({ theme, skeleton }) =>
        skeleton &&
        css`
            & > p {
                background-color: ${theme.colors.LightGray};
                color: transparent;
                position: relative;
                overflow: hidden;

                &:before {
                    animation: ${shineLines} 1.6s infinite linear;
                    position: relative;
                    display: block;
                    width: 100px;
                    content: '';
                    background-image: linear-gradient(
                        90deg,
                        rgba(248, 248, 248, 1) 0%,
                        rgba(255, 255, 255, 1) 50%,
                        rgba(248, 248, 248, 1) 100%
                    );
                    height: 100%;
                }
            }
        `}
`;

export const NextLanInformation: React.FC = () => {
    const { data: event, isLoading: isEventLoading, isLoadingError: isEventLoadingError } = useCurrentEvent();
    const {
        data: ticketTypes,
        isLoading: isTicketTypesLoading,
        isLoadingError: isTicketTypesLoadingError,
    } = useCurrentEventTicketTypes();

    const typesSorted = (ticketTypes ?? []).filter((type) => type.grants_admission).sort((a, b) => a.price - b.price);
    console.log(typesSorted);

    const cheapestPrice = typesSorted.length == 0 ? 0 : typesSorted[0].price;

    const isLoading = isEventLoading || isTicketTypesLoading;
    const isLoadingError = isEventLoadingError || isTicketTypesLoadingError;

    const toHourString = (date: number) => {
        const newDate = new Date(date);
        return newDate.toLocaleString('no-NB', { hour: '2-digit', minute: '2-digit' });
    };

    const toDayRangeString = (date1: number, date2: number) => {
        const newDate1 = new Date(date1);
        const newDate2 = new Date(date2);
        return `${newDate1.toLocaleString('no-NB', { day: '2-digit' })} - 
        ${newDate2.toLocaleString('no-NB', { month: 'long', day: '2-digit' })}`;
    };

    const toDateString = (date: number) => {
        const newDate = new Date(date);
        return `${newDate.toLocaleString('no-NB', {
            month: 'long',
            day: 'numeric',
        })} kl. ${newDate.toLocaleString('no-NB', { hour: '2-digit', minute: '2-digit' })}`;
    };

    return (
        <Container skeleton={isLoading}>
            {event?.cancellation_reason ? (
                <>
                    <h2>Kansellert: </h2>
                    <p>{event?.cancellation_reason}</p>
                </>
            ) : (
                <>
                    <h2>Neste arrangement er:</h2>
                    <p>
                        {event?.start_time &&
                            event?.end_time &&
                            toDayRangeString(event.start_time * 1000, event.end_time * 1000)}
                        , dørene åpner kl. {event?.start_time && toHourString(event.start_time * 1000)}
                    </p>
                    <p>Pris per billett: fra {cheapestPrice},-</p>
                    <p>Billettsalget starter {event?.booking_time && toDateString(event.booking_time * 1000)}</p>
                    {event?.seatmap_uuid ? (
                        <>
                            <p>
                                Gruppe-seating starter{' '}
                                {event?.booking_time &&
                                    toDateString((event.booking_time + event.priority_seating_time_delta) * 1000)}
                            </p>
                            <p>
                                Seating for resten starter{' '}
                                {event?.booking_time &&
                                    toDateString((event.booking_time + event.seating_time_delta) * 1000)}
                            </p>
                        </>
                    ) : null}
                    <p>
                        <Link href={process.env.REACT_APP_MAIN_SITE}>Les mer om arrangementet her</Link>
                    </p>
                </>
            )}
        </Container>
    );
};
