/*
 * @created 09/04/2021 - 22:35
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import React, { useState } from 'react';
import { StripeCardElementOptions, Stripe, PaymentIntentResult, StripeCardElement } from '@stripe/stripe-js';
import { PositiveButton } from '../../../../../sharedComponents/forms/Button';
import styled from 'styled-components';
import { toast } from 'react-toastify';

const CARD_OPTIONS: StripeCardElementOptions = {
    iconStyle: 'solid',
    style: {
        base: {
            iconColor: '#c4f0ff',
            color: '#000',
            fontWeight: 500,
            fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
            fontSize: '16px',
            fontSmoothing: 'antialiased',
            ':-webkit-autofill': {
                color: '#fce883',
            },
            '::placeholder': {
                color: '#87bbfd',
            },
        },
        invalid: {
            iconColor: '#ffc7ee',
            color: '#ffc7ee',
        },
    },
    hidePostalCode: true,
};

const CardWrapper = styled.div`
    border-radius: ${({ theme }) => theme.spacing.xxs};
    padding: ${({ theme }) => theme.spacing.xs};
    margin-bottom: ${({ theme }) => theme.spacing.m};
    box-shadow: ${({ theme }) => theme.shadow.lowKey};
`;

interface Props {
    clientSecret: string;
    next: () => void;
}

export const StripeForm: React.FC<Props> = ({ clientSecret, next }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        // Block native form submission.
        event.preventDefault();

        if (!stripe || !elements) {
            toast.warn('Unable to load payment method');
            // Stripe.js has not loaded yet. Make sure to disable
            // form submission until Stripe.js has loaded.
            return;
        }

        // Get a reference to a mounted CardElement. Elements knows how
        // to find your CardElement because there can only ever be one of
        // each type of element.
        const cardElement = elements.getElement(CardElement);

        if (cardElement === null) {
            toast.warn('Unable to load payment method');
            return;
        }

        setIsLoading(true);
        const res = await payWithCard(stripe, cardElement, clientSecret);
        setIsLoading(false);
        if (res) {
            next();
        }
    };

    const payWithCard = async (stripe: Stripe, card: StripeCardElement, clientSecret: string) => {
        const result: PaymentIntentResult = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: card,
            },
        });

        if (result.error) {
            console.log(result.error);
            toast.error('Noe gikk galt med betalingen.');
            return false;
        } else {
            console.log(result);
            return true;
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardWrapper>
                <CardElement options={CARD_OPTIONS} />
            </CardWrapper>
            <PositiveButton fluid={true} isLoading={isLoading}>
                Betal
            </PositiveButton>
        </form>
    );
};
