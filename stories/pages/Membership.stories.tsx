import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { MembershipStatus } from '../../src/pages/membership';
import { AppShell } from '../helpers/AppShell';

const meta: Meta = {
    title: 'Pages/RE-Medlemskap',
    parameters: { route: '/membership' },
    render: () => (
        <AppShell>
            <MembershipStatus />
        </AppShell>
    ),
};
export default meta;

type Story = StoryObj;

export const Member: Story = {
    parameters: { api: { membershipStatus: true } },
};

export const MemberWithoutPersonalia: Story = {
    parameters: { api: { membershipStatus: true, membershipPersonalia: null } },
};

export const NotMember: Story = {
    parameters: { api: { membershipStatus: false } },
};
