import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { MyCrew } from '../../src/pages/myCrews';
import { AppShell } from '../helpers/AppShell';
import { user } from '../mocks/fixtures';

const meta: Meta = {
    title: 'Pages/Mine verv',
    parameters: { route: '/my-crew' },
    render: () => (
        <AppShell>
            <MyCrew />
        </AppShell>
    ),
};
export default meta;

type Story = StoryObj;

export const WithPositions: Story = {};

export const NoPositions: Story = {
    parameters: { api: { currentUser: { ...user, position_mappings: [] } } },
};
