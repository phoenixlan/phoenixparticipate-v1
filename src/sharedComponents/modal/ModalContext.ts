/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import React, { createContext } from 'react';

export interface ModalContextOptions {
    content: React.ReactNode;
    show: (_content: React.ReactNode) => void;
    remove: () => void;
}

export const ModalContext = createContext<Partial<ModalContextOptions>>({});
