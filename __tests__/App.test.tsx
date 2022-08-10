/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import React from 'react';
import { cleanup, render } from '../jest.test-utils';
import App from '../src/App';

describe('The application', () => {
    afterEach(() => {
        cleanup();
    });

    it('Should render without errors', async () => {
        render(<App />);
    });
});
