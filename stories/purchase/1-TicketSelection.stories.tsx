import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TicketPurchase } from '../../src/pages/tickets/purchase';
import { AppShell } from '../helpers/AppShell';
import { addTickets } from '../helpers/purchase';
import { availabilityWithRemaining, currentEvent, ticketVouchers } from '../mocks/fixtures';
import { ERROR, LOADING } from '../mocks/mockApi';

const inTwoWeeks = Math.floor(Date.now() / 1000) + 14 * 24 * 60 * 60;

// The real /buy page. It always starts at this step
const meta: Meta = {
    title: 'Ticket purchase/1 · Ticket selection',
    parameters: { route: '/buy' },
    render: () => (
        <AppShell>
            <TicketPurchase />
        </AppShell>
    ),
};
export default meta;

type Story = StoryObj;

export const SaleOpen: Story = {};

export const WithTicketsSelected: Story = {
    play: async ({ canvasElement }) => {
        // Rows are sorted by price within each section: member, with membership | non-member | free, hoodie
        await addTickets(canvasElement, 1, 2);
        await addTickets(canvasElement, 4, 1);
    },
};

export const SaleNotOpen: Story = {
    parameters: { api: { currentEvent: { ...currentEvent, booking_time: inTwoWeeks } } },
};

export const SaleNotOpenWithBypassRole: Story = {
    name: 'Sale not open (bypass role)',
    parameters: {
        api: { currentEvent: { ...currentEvent, booking_time: inTwoWeeks } },
        roles: ['ticket_bypass_ticketsale_start_restriction'],
    },
};

export const LowAvailability: Story = {
    parameters: { api: { ticketAvailability: availabilityWithRemaining(4) } },
};

export const SoldOut: Story = {
    parameters: { api: { ticketAvailability: availabilityWithRemaining(0) } },
};

export const HasUnusedVouchers: Story = {
    parameters: { api: { ticketVouchers } },
};

export const AlreadyMember: Story = {
    parameters: { api: { membershipStatus: true } },
};

export const TooOld: Story = {
    parameters: { user: { birthdate: '1990-01-01' } },
};

export const NoEventAnnounced: Story = {
    parameters: { api: { currentEvent: null } },
};

export const Loading: Story = {
    parameters: { api: { ticketTypes: LOADING } },
};

export const FailedToLoad: Story = {
    parameters: { api: { ticketTypes: ERROR } },
};
