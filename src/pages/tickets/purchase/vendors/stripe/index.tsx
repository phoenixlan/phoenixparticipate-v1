/*
 * @created 09/04/2021 - 22:35
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { StripeForm } from './StripeForm';

if (!process.env.STRIPE_PK) {
    throw Error('STRIPE_PK is not defined');
}

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(process.env.STRIPE_PK);

interface Props {
    clientSecret: string;
    next: () => void;
}

export const Stripe: React.FC<Props> = ({ clientSecret, next }) => {
    return (
        <Elements stripe={stripePromise}>
            <StripeForm clientSecret={clientSecret} next={next} />
        </Elements>
    );
};
