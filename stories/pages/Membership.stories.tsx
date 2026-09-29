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

export const MemberWithNextYear: Story = {
    parameters: { api: { membershipStatus: true, otherYearMembershipStatus: true } },
};

export const NextYearOnly: Story = {
    parameters: { api: { membershipStatus: false, otherYearMembershipStatus: true } },
};

// Members must fill in personalia before they can see their membership
export const MemberWithoutPersonalia: Story = {
    parameters: { api: { membershipStatus: true, membershipPersonalia: null } },
};

export const NextYearOnlyWithoutPersonalia: Story = {
    parameters: { api: { membershipStatus: false, otherYearMembershipStatus: true, membershipPersonalia: null } },
};

export const NotMember: Story = {
    parameters: { api: { membershipStatus: false } },
};
