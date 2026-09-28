import { userEvent, waitFor } from '@storybook/test';

// Clicks the plus button of the `rowIndex`th ticket type in the ticket selection form `count` times
export const addTickets = async (canvasElement: HTMLElement, rowIndex: number, count: number): Promise<void> => {
    const input = await waitFor(() => {
        const inputs = canvasElement.querySelectorAll<HTMLInputElement>('input[name="quantity"]');
        if (inputs.length <= rowIndex) {
            throw new Error('Ticket types not rendered yet');
        }
        return inputs[rowIndex];
    });
    const plus = input.parentElement?.querySelector<HTMLButtonElement>('button[type="button"]');
    if (!plus) {
        throw new Error('Could not find the plus button');
    }
    for (let i = 0; i < count; i++) {
        await userEvent.click(plus);
    }
};

/*
 * Speeds up setTimeout/setInterval by `factor` while a story is mounted, for UI that only changes after minutes.
 * Use as a story's `beforeEach`; the returned function restores the real timers.
 */
export const accelerateTimers = (factor: number) => (): (() => void) => {
    const realSetTimeout = window.setTimeout;
    const realSetInterval = window.setInterval;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    window.setTimeout = ((handler: TimerHandler, timeout = 0, ...args: Array<any>) =>
        realSetTimeout(handler, timeout / factor, ...args)) as typeof window.setTimeout;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    window.setInterval = ((handler: TimerHandler, timeout = 0, ...args: Array<any>) =>
        realSetInterval(handler, timeout / factor, ...args)) as typeof window.setInterval;
    return () => {
        window.setTimeout = realSetTimeout;
        window.setInterval = realSetInterval;
    };
};
