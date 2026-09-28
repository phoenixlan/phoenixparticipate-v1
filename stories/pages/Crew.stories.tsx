import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Crew } from '../../src/pages/crew';
import { AppShell } from '../helpers/AppShell';
import { withCachedCurrentEvent } from '../helpers/withCachedCurrentEvent';
import { LOADING } from '../mocks/mockApi';

const meta: Meta = {
    title: 'Pages/Bli med å arrangere',
    parameters: { route: '/crew' },
    decorators: [withCachedCurrentEvent],
    render: () => (
        <AppShell>
            <Crew />
        </AppShell>
    ),
};
export default meta;

type Story = StoryObj;

export const WithApplications: Story = {};

export const NoApplications: Story = {
    parameters: { api: { userApplications: [] } },
};

export const DiscordNotConnected: Story = {
    parameters: { api: { discordMapping: null } },
};

export const NoAvatar: Story = {
    name: "No avatar (can't apply)",
    parameters: { user: { avatar_uuid: undefined } },
};

export const TooOld: Story = {
    parameters: { user: { birthdate: '1990-01-01' } },
};

export const Loading: Story = {
    parameters: { api: { discordMapping: LOADING } },
};
