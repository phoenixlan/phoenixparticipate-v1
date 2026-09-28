import React from 'react';
import { userEvent } from '@storybook/test';
import { Template } from '../../src/pages/template';

// The real header + sidebar layout around a page, as the router renders it in src/router/index.tsx
export const AppShell: React.FC = ({ children }) => <Template>{children}</Template>;

// Play function that opens the sidebar by clicking the hamburger icon in the header
export const openSidebar = async ({ canvasElement }: { canvasElement: HTMLElement }): Promise<void> => {
    // The hamburger is the first icon in the header
    const bars = canvasElement.querySelector('svg');
    if (bars) {
        await userEvent.click(bars);
    }
};
