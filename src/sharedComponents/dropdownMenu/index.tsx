/*
 * @created 28/03/2021 - 21:28
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { CSSTransition, TransitionStatus } from 'react-transition-group';
import styled, { css, SimpleInterpolation } from 'styled-components';
import { DropdownItem } from './DropdownItem';
import theme from '../../theme';

const Dropdown = styled.div`
    position: absolute;
    z-index: 1;
    top: ${({ theme }) => theme.headerHeight};
    width: 300px;
    transform: translateX(-45%);
    background-color: ${({ theme }) => theme.colors.LightGray};
    border: 1px solid ${({ theme }) => theme.colors.SemiDarkGray};
    box-shadow: ${({ theme }) => theme.shadow.default};
    border-radius: ${({ theme }) => theme.spacing.xs};
    padding: 1rem;
    overflow: hidden;
    transition: height ${({ theme }) => theme.animation.speed}ms ease;
`;

const MainMenu = styled.div<{ state: TransitionStatus }>`
    width: 100%;
    ${({ state }) => MainAnimationState[state]}
`;

const SecondaryMenu = styled.div<{ state: TransitionStatus }>`
    width: 100%;
    ${({ state }) => SecondaryAnimationState[state]}
`;

const MainAnimationState: Record<TransitionStatus, SimpleInterpolation> = {
    entering: css`
        position: absolute;
        transform: translateX(-110%);
    `,
    entered: css`
        transform: translateX(0%);
        transition: all ${theme.animation.speed}ms ease;
    `,
    exiting: css`
        transform: translateX(-110%);
        transition: all ${theme.animation.speed}ms ease;
    `,
    exited: css`
        position: absolute;
    `,
    unmounted: css``,
};

const SecondaryAnimationState: Record<TransitionStatus, SimpleInterpolation> = {
    entering: css`
        transform: translateX(110%);
    `,
    entered: css`
        transform: translateX(0%);
        transition: all ${theme.animation.speed}ms ease;
    `,
    exiting: css`
        transform: translateX(110%);
        transition: all ${theme.animation.speed}ms ease;
    `,
    exited: css``,
    unmounted: css``,
};

interface MenuItem {
    name: string;
    icon?: {
        left?: ReactNode;
        right?: ReactNode;
    };
    subMenu?: string;
    to?: string;
    onClick?: () => void;
}

interface Menu {
    name: string;
    items: Array<MenuItem>;
}

interface Props {
    main: Menu;
    secondaries: Array<Menu>;
    onFinalClick?: () => void;
}

export const DropdownMenu: React.FC<Props> = ({ main, secondaries, onFinalClick }) => {
    const [activeMenu, setActiveMenu] = useState('main');
    const [menuHeight, setMenuHeight] = useState<number>(0);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (dropdownRef.current) {
            const child = dropdownRef.current?.firstElementChild as HTMLDivElement;
            calcHeight(child, false);
        }
    }, []);

    const remToPixels = (rem: number) => {
        return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
    };

    const calcHeight = (node: HTMLElement, isAppearing: boolean) => {
        const height = node.offsetHeight;
        setMenuHeight(height);
    };

    const finalClick = (subMenu?: string, onClick?: () => void) => {
        if (subMenu) {
            setActiveMenu(subMenu);
        } else {
            onClick && onClick();
            onFinalClick && onFinalClick();
        }
    };

    return (
        <Dropdown style={{ height: menuHeight + remToPixels(2) }} ref={dropdownRef}>
            <CSSTransition
                in={activeMenu === main.name}
                timeout={theme.animation.speed}
                unmountOnExit
                onEnter={calcHeight}
            >
                {(state) => (
                    <MainMenu state={state}>
                        {main.items.map(({ icon, name, subMenu, to, onClick }) => (
                            <DropdownItem
                                key={`main ${main.name} ${name}`}
                                leftIcon={icon?.left}
                                rightIcon={icon?.right}
                                to={to}
                                setActiveMenu={() => finalClick(subMenu, onClick)}
                            >
                                {name}
                            </DropdownItem>
                        ))}
                    </MainMenu>
                )}
            </CSSTransition>
            {secondaries.map((secondary) => (
                <CSSTransition
                    key={`secondary ${secondary.name}`}
                    in={activeMenu === secondary.name}
                    timeout={theme.animation.speed}
                    unmountOnExit
                    onEntering={calcHeight}
                >
                    {(state) => (
                        <SecondaryMenu state={state}>
                            {secondary.items.map(({ icon, name, onClick, subMenu, to }) => (
                                <DropdownItem
                                    key={`secondary ${secondary.name} ${name}`}
                                    leftIcon={icon?.left}
                                    rightIcon={icon?.right}
                                    to={to}
                                    setActiveMenu={() => finalClick(subMenu, onClick)}
                                >
                                    {name}
                                </DropdownItem>
                            ))}
                        </SecondaryMenu>
                    )}
                </CSSTransition>
            ))}
        </Dropdown>
    );
};
