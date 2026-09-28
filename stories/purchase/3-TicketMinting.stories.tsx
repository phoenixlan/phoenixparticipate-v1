import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TicketMinting } from '../../src/pages/tickets/purchase/steps/step6/TicketMinting';
import { TicketPurchase } from '../../src/pages/tickets/purchase';
import { AppShell } from '../helpers/AppShell';
import { PurchaseStepFrame } from '../helpers/PurchaseStepFrame';
import { accelerateTimers } from '../helpers/purchase';

/*
 * 6 · Waiting for the payment to go through. TicketMinting polls the payment every 5 seconds; the mocked poll answers
 * with `paymentStates` in order. The "long wait" and "failure" messages normally take 1 and 5 minutes to show up,
 * so those stories run the timers faster.
 */
const meta: Meta = {
    title: 'Ticket purchase/3 · Ticket minting',
    parameters: { route: '/buy' },
    render: () => (
        <PurchaseStepFrame>
            <TicketMinting uuid="payment-mock" />
        </PurchaseStepFrame>
    ),
};
export default meta;

type Story = StoryObj;

export const Waiting: Story = {
    name: '6 · Waiting for payment',
    parameters: { api: { paymentStates: ['PaymentState.created'] } },
};

export const TakingLong: Story = {
    name: '6 · Taking longer than usual',
    parameters: { api: { paymentStates: ['PaymentState.created'] } },
    // Shows up after ~1.3 seconds
    beforeEach: accelerateTimers(50),
};

export const Failure: Story = {
    name: '6 · No answer from payment provider',
    parameters: { api: { paymentStates: ['PaymentState.created'] } },
    // Shows up after ~3 seconds
    beforeEach: accelerateTimers(100),
};

export const Success: Story = {
    name: '6 · Tickets ready',
    parameters: { api: { paymentStates: ['PaymentState.tickets_minted'] } },
    // The first poll is after 5 seconds, sped up to 0.5 seconds. The page would then redirect to "/", which does
    // nothing here
    beforeEach: accelerateTimers(10),
};

// Vipps sends the user back to /buy?uuid=<payment>, which goes straight to this step
export const ReturningFromVipps: Story = {
    name: '6 · Returning from Vipps',
    parameters: { route: '/buy?uuid=payment-mock', api: { paymentStates: ['PaymentState.created'] } },
    render: () => (
        <AppShell>
            <TicketPurchase />
        </AppShell>
    ),
};
