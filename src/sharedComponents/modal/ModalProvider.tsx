/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ModalContext } from './ModalContext';
import { Modal } from './Modal';

export const ModalProvider: React.FC = ({ children }) => {
    const [root, setRoot] = useState<HTMLDivElement | null>(null);
    const [hideModal, setHideModal] = useState(true);
    const [content, setContent] = useState<React.ReactNode | null>(null);
    const ANIMATION_DURATION = 250;

    useEffect(() => {
        const rootElement = document.createElement('div');
        rootElement.id = 'modal';
        document.body.appendChild(rootElement);
        setRoot(rootElement);

        return () => {
            root && document.body.removeChild(root);
        };
    }, []);

    const remove = useCallback(() => {
        setHideModal(true);
        setTimeout(() => {
            setContent(null);
        }, ANIMATION_DURATION);
    }, []);

    const show = useCallback(
        (_content: React.ReactNode) => {
            setContent(_content);
            setHideModal(false);
        },
        [remove],
    );

    return (
        <ModalContext.Provider value={{ content, show, remove }}>
            {children}
            {root &&
                createPortal(
                    <Modal hide={hideModal} animationDuration={ANIMATION_DURATION} exitModalCallback={remove}>
                        {content}
                    </Modal>,
                    root,
                )}
        </ModalContext.Provider>
    );
};
