/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
export const persistState = (storageKey: string, state: Record<string, unknown>): void => {
    window.localStorage.setItem(storageKey, JSON.stringify(state));
};

export const removeState = (storageKey: string): void => {
    window.localStorage.removeItem(storageKey);
};

export const getInitialState = <T>(storageKey: string): T | undefined => {
    const savedState = window.localStorage.getItem(storageKey);
    try {
        if (!savedState) {
            return undefined;
        }
        return JSON.parse(savedState);
    } catch (e) {
        console.error(`Failed to load state : ${storageKey}`);
        return undefined;
    }
};
