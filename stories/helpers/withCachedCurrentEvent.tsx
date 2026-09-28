import React, { useState } from 'react';
import type { Decorator } from '@storybook/react';
import { useQueryClient } from 'react-query';
import { currentEventDefaultQueryKey } from '../../src/hooks/api/useCurrentEvent';
import { ERROR, getMockApi, LOADING } from '../mocks/mockApi';

const CachedCurrentEvent: React.FC = ({ children }) => {
    const queryClient = useQueryClient();
    useState(() => {
        const event = getMockApi().currentEvent;
        if (event !== LOADING && event !== ERROR) {
            queryClient.setQueryData([currentEventDefaultQueryKey], event);
        }
    });
    return <>{children}</>;
};

/*
 * Puts the current event in the query cache before the story renders, as it is when navigating to a page from
 * elsewhere in the app. Needed by the crew page: ApplicationForm returns early before some of its hooks while the
 * event is loading, which makes React throw ("Rendered more hooks than during the previous render") once it loads.
 */
export const withCachedCurrentEvent: Decorator = (Story) => (
    <CachedCurrentEvent>
        <Story />
    </CachedCurrentEvent>
);
