import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TicketVouchers } from '../../src/pages/tickets/vouchers';
import { AppShell } from '../helpers/AppShell';
import { ticketVouchers } from '../mocks/fixtures';

const meta: Meta = {
    title: 'Pages/Mine gavekort',
    parameters: { route: '/ticket-vouchers', api: { ticketVouchers } },
    render: () => (
        <AppShell>
            <TicketVouchers />
        </AppShell>
    ),
};
export default meta;

type Story = StoryObj;

export const UnusedUsedAndExpired: Story = {
    name: 'Unused, used and expired',
};

export const OnlyUnused: Story = {
    parameters: { api: { ticketVouchers: ticketVouchers.filter((v) => !v.is_used && !v.is_expired) } },
};

export const NoVouchers: Story = {
    parameters: { api: { ticketVouchers: [] } },
};
