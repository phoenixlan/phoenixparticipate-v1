/*
 * @created 07/04/2021 - 20:44
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { PlusSquareFill } from '@styled-icons/bootstrap/PlusSquareFill';
import { IosShare } from '@styled-icons/material/IosShare';
import { useSiteConfig } from '../hooks/api/useSiteConfig';
import { TextSkeleton } from './TextSkeleton';

const IosBanner = styled.div<{ isIpad: boolean }>`
    position: fixed;
    ${({ isIpad }) => (isIpad ? 'top: ' : 'bottom: ')} 0px;
    margin: ${({ theme }) => theme.spacing.xs};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const Container = styled.div`
    padding: ${({ theme }) => theme.spacing.xxs};
    border: 1px solid ${({ theme }) => theme.colors.DarkGray};
    background-color: ${({ theme }) => theme.colors.White};
    width: 100%;
`;

const AndroidBanner = styled.div`
    position: fixed;
    top: 0px;
    margin: ${({ theme }) => theme.spacing.xs};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: Calc(100% - ${({ theme }) => theme.spacing.m});
`;

const AndroidContainer = styled.div`
    padding: ${({ theme }) => theme.spacing.xxs};
    border: 1px solid ${({ theme }) => theme.colors.DarkGray};
    background-color: ${({ theme }) => theme.colors.White};
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
`;

const Arrow = styled.div<{ isPad: boolean }>`
    width: 0;
    height: 0;
    ${({ isPad, theme }) =>
        isPad
            ? `
    border-left: 20px solid transparent;
    border-right: 20px solid transparent;

    border-bottom: 20px solid ${theme.colors.DarkGray};
  `
            : `
    border-left: 20px solid transparent;
    border-right: 20px solid transparent;
  
    border-top: 20px solid ${theme.colors.DarkGray};
  `}
`;

const Icon = styled.div`
    width: ${({ theme }) => theme.spacing.s};
    height: ${({ theme }) => theme.spacing.s};
    border-radius: 100%;
    margin-right: ${({ theme }) => theme.spacing.xs};
    cursor: pointer;
    background-color: ${({ theme }) => theme.colors.SnackbarRed};
    position: absolute;
    top: -0.4rem;
    right: -0.75rem;

    &::before {
        position: absolute;
        width: 2px;
        height: 90%;
        transform: rotate(45deg);
        background-color: black;
        content: '';
        color: #000;
        left: 44%;
        top: 5%;
    }
    &::after {
        left: 44%;
        top: 5%;
        position: absolute;
        width: 2px;
        height: 90%;
        transform: rotate(130deg);
        background-color: black;
        content: '';
        color: #000;
    }
`;

interface BeforeInstallPromptEvent extends Event {
    readonly platforms: Array<string>;
    readonly userChoice: Promise<{
        outcome: 'accepted' | 'dismissed';
        platform: string;
    }>;
    prompt(): Promise<void>;
}

export const InstallAppBanner: React.FC = () => {
    const { data: siteConfig } = useSiteConfig();
    const name = siteConfig?.name;
    const [show, setShow] = useState(false);
    const [showIosInstallMessage, setShowIosInstallMessage] = useState(false);
    const [installable, setInstallable] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent>();

    useEffect(() => {
        window.addEventListener('beforeinstallprompt', (e: any) => {
            e = e as BeforeInstallPromptEvent;
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e);
            // Update UI notify the user they can install the PWA
            setInstallable(true);
        });
        const savedPreference = localStorage.getItem('showBanner');
        console.log(savedPreference);
        if (savedPreference !== 'false' || savedPreference === null) {
            setShow(true);
        }
    }, []);

    const onInstallClick = (e: React.MouseEvent) => {
        // Hide the app provided install promotion
        setInstallable(false);
        // Show the install prompt
        if (deferredPrompt) {
            deferredPrompt.prompt();
            // Wait for the user to respond to the prompt
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                } else {
                    console.log('User dismissed the install prompt');
                }
            });
        }
    };

    const onHideBannerClick = () => {
        setShow(false);
        localStorage.setItem('showBanner', 'false');
    };

    const isIos = () => {
        const userAgent = window.navigator.userAgent.toLowerCase();
        return /iphone|ipad|ipod/.test(userAgent);
    };

    const isIpad = () => {
        const userAgent = window.navigator.userAgent.toLowerCase();
        return /ipad/.test(userAgent);
    };

    const isInStandaloneMode = () => {
        if ('standalone' in window.navigator) {
            return window.navigator['standalone'];
        }
        return false;
    };

    useEffect(() => {
        if (isIos() && !isInStandaloneMode()) {
            setShowIosInstallMessage(true);
        }
    });

    return (
        <>
            {show && (
                <>
                    {showIosInstallMessage && (
                        <IosBanner isIpad={isIpad()}>
                            {isIpad() && <Arrow isPad={isIpad()} />}
                            <Container>
                                <Icon onClick={onHideBannerClick} />
                                <PlusSquareFill size="1rem" />{' '}
                                <span>
                                    Installer {name ?? <TextSkeleton />}-appen på iPhonen din: klikk{' '}
                                    <IosShare size="1rem" /> og deretter &quot;Add to homescreen&quot;.
                                </span>
                            </Container>
                            {!isIpad() && <Arrow isPad={isIpad()} />}
                        </IosBanner>
                    )}
                    {installable && (
                        <AndroidBanner>
                            <AndroidContainer>
                                <Icon onClick={onHideBannerClick} />
                                <span>Installer {name ?? <TextSkeleton />}-appen: </span>
                                <PlusSquareFill size="2rem" onClick={onInstallClick} />
                            </AndroidContainer>
                        </AndroidBanner>
                    )}
                </>
            )}
        </>
    );
};
