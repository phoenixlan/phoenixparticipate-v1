import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Tickets } from '../../src/pages/tickets/list';
import { AppShell, openSidebar } from '../helpers/AppShell';
import { siteConfig, ticketVouchers } from '../mocks/fixtures';

const meta: Meta = {
    title: 'Sidebar',
    render: () => (
        <AppShell>
            <Tickets />
        </AppShell>
    ),
};
export default meta;

type Story = StoryObj;

export const Closed: Story = {};

export const Open: Story = {
    play: openSidebar,
};

export const OpenWithVouchers: Story = {
    name: 'Open (with "Mine gavekort")',
    parameters: { api: { ticketVouchers } },
    play: openSidebar,
};

export const OpenMinimalFeatures: Story = {
    name: 'Open (no optional features)',
    parameters: { api: { siteConfig: { ...siteConfig, features: [] } } },
    play: openSidebar,
};
