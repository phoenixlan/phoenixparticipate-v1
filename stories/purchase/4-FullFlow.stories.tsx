import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TicketPurchase } from '../../src/pages/tickets/purchase';
import { AppShell } from '../helpers/AppShell';
import { accelerateTimers } from '../helpers/purchase';

/*
 * The real /buy page with nothing faked but the API. Click through every step yourself: pick tickets, accept the
 * terms, choose a payment method and so on. Ticket types with special terms trigger the disclaimer step, and tickets
 * that include membership trigger the personalia step when `membershipPersonalia` is null.
 */
const meta: Meta = {
    title: 'Ticket purchase/4 · Full flow (interactive)',
    parameters: { route: '/buy' },
    render: () => (
        <AppShell>
            <TicketPurchase />
        </AppShell>
    ),
    // Payment polling is sped up so the minting step finishes within a few seconds
    beforeEach: accelerateTimers(5),
};
export default meta;

type Story = StoryObj;

export const Interactive: Story = {};

export const InteractiveWithoutPersonalia: Story = {
    name: 'Interactive (no membership personalia yet)',
    parameters: { api: { membershipPersonalia: null } },
};
