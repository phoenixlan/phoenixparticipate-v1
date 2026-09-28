import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TicketSeating } from '../../src/pages/tickets/seat';
import { AppShell } from '../helpers/AppShell';
import { currentEvent } from '../mocks/fixtures';

const meta: Meta = {
    title: 'Pages/Plassreservering',
    parameters: { route: '/seating' },
    render: () => (
        <AppShell>
            <TicketSeating />
        </AppShell>
    ),
};
export default meta;

type Story = StoryObj;

export const WithSeatableTickets: Story = {};

export const NoSeatableTickets: Story = {
    parameters: { api: { seatableTickets: [] } },
};

export const SeatingNotOpen: Story = {
    parameters: { api: { currentEvent: { ...currentEvent, seating_time_delta: 60 * 60 * 24 * 30 } } },
};

export const NoSeatmap: Story = {
    parameters: { api: { seatmap: null } },
};
