/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import { useContext } from 'react';
import { ModalContext } from './ModalContext';

export const useModal = () => {
    const ctx = useContext(ModalContext);

    if (!ctx) {
        throw new Error('useAuth hook must be used inside AuthProvider context');
    }

    if (!ctx.remove || !ctx.show) {
        throw new Error('something went wrong');
    }

    return {
        remove: ctx.remove,
        show: ctx.show,
        __content__: ctx.content,
    };
};
