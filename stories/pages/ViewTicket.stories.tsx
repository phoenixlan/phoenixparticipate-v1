import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Route } from 'react-router-dom';
import { TicketViewer } from '../../src/pages/tickets/view';
import { AppShell } from '../helpers/AppShell';
import { ownedTickets } from '../mocks/fixtures';
import { LOADING } from '../mocks/mockApi';

/*
 * The ticket is picked by the ticket id in the route, and looked up in the owned tickets:
 *   1042: seated, grants membership
 *   1043: not seated, seated by a friend
 *   1044: hoodie, doesn't grant admission
 */
const meta: Meta = {
    title: 'Pages/Billett',
    parameters: { route: '/ticket/1042' },
    render: () => (
        <AppShell>
            <Route path="/ticket/:ticket_id">
                <TicketViewer />
            </Route>
        </AppShell>
    ),
};
export default meta;

type Story = StoryObj;

export const Seated: Story = {};

export const NotSeated: Story = {
    parameters: { route: '/ticket/1043' },
};

export const NoAdmission: Story = {
    name: 'No admission (hoodie)',
    parameters: { route: '/ticket/1044' },
};

export const CheckedIn: Story = {
    parameters: {
        api: {
            ownedTickets: ownedTickets.map((ticket) =>
                ticket.ticket_id === 1042 ? { ...ticket, checked_in: Math.floor(Date.now() / 1000) } : ticket,
            ),
        },
    },
};

export const NotTransferable: Story = {
    parameters: {
        api: {
            ownedTickets: ownedTickets.map((ticket) =>
                ticket.ticket_id === 1042
                    ? { ...ticket, ticket_type: { ...ticket.ticket_type, transferable: false } }
                    : ticket,
            ),
        },
    },
};

// Can't be seated or transferred, so the settings are hidden
export const NoSettings: Story = {
    parameters: {
        route: '/ticket/1044',
        api: {
            ownedTickets: ownedTickets.map((ticket) =>
                ticket.ticket_id === 1044
                    ? { ...ticket, ticket_type: { ...ticket.ticket_type, transferable: false } }
                    : ticket,
            ),
        },
    },
};

// Tickets that grant membership ask for membership personalia before showing the ticket
export const MissingMembershipPersonalia: Story = {
    parameters: { api: { membershipPersonalia: null } },
};

export const Loading: Story = {
    parameters: { api: { ownedTickets: LOADING } },
};
