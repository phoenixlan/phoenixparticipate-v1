import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Tickets } from '../../src/pages/tickets/list';
import { AppShell } from '../helpers/AppShell';
import { ticketTransfers, ticketVouchers } from '../mocks/fixtures';
import { LOADING } from '../mocks/mockApi';

const meta: Meta = {
    title: 'Pages/Mine billetter',
    parameters: { route: '/' },
    render: () => (
        <AppShell>
            <Tickets />
        </AppShell>
    ),
};
export default meta;

type Story = StoryObj;

export const WithTickets: Story = {};

export const NoTickets: Story = {
    parameters: { api: { ownedTickets: [] } },
};

export const WithTransfers: Story = {
    parameters: { api: { ticketTransfers } },
};

export const WithUnusedVouchers: Story = {
    parameters: { api: { ticketVouchers } },
};

export const NoEventAnnounced: Story = {
    parameters: { api: { currentEvent: null } },
};

export const Loading: Story = {
    parameters: { api: { ownedTickets: LOADING } },
};
