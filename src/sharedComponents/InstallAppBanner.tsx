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
    left: 0;
    right: 0;
    ${({ isIpad }) =>
        isIpad ? 'top: env(safe-area-inset-top, 0px);' : 'bottom: env(safe-area-inset-bottom, 0px);'}
    z-index: 1000;
    margin: ${({ theme }) => theme.spacing.xs};
    display: flex;
    flex-direction: column;
    align-items: center;
    /* The iPad share button sits in the top right corner, the iPhone one in the middle of the bottom bar */
    ${({ isIpad }) => (isIpad ? 'align-items: flex-end;' : '')}
`;

const IosCard = styled.div`
    position: relative;
    /* Keeps the pointer's shadow from drawing over the card */
    z-index: 1;
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
    width: 100%;
    max-width: 24rem;
    padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.xl}
        ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.xs};
    background-color: ${({ theme }) => theme.colors.White};
    border-radius: ${({ theme }) => theme.borderRadius.l};
    box-shadow: ${({ theme }) => theme.shadow.modal};
    box-sizing: border-box;
`;

const AppIcon = styled.div`
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    border-radius: ${({ theme }) => theme.borderRadius.m};
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.White};
`;

const IosText = styled.div`
    line-height: 1.3;
`;

const IosTitle = styled.div`
    font-weight: bold;
`;

const ShareIcon = styled(IosShare)`
    color: ${({ theme }) => theme.colors.primary};
    vertical-align: text-bottom;
`;

// Points at the share button in Safari
const Pointer = styled.div<{ isIpad: boolean }>`
    width: 0.75rem;
    height: 0.75rem;
    background-color: ${({ theme }) => theme.colors.White};
    transform: rotate(45deg);
    box-shadow: ${({ theme }) => theme.shadow.levelEffect};
    ${({ isIpad }) => (isIpad ? 'margin: 0 4.5rem -0.375rem 0;' : 'margin: -0.375rem 0 0 0;')}
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

const CloseButton = styled.button`
    position: absolute;
    top: ${({ theme }) => theme.spacing.xxs};
    right: ${({ theme }) => theme.spacing.xxs};
    width: 1.5rem;
    height: 1.5rem;
    border: none;
    border-radius: 100%;
    background-color: ${({ theme }) => theme.colors.LightGray};
    cursor: pointer;
    transition: background-color ${({ theme }) => theme.transition.default};

    &:hover {
        background-color: ${({ theme }) => theme.colors.Gray};
    }

    &::before,
    &::after {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0.7rem;
        height: 2px;
        background-color: ${({ theme }) => theme.colors.Black};
        content: '';
    }
    &::before {
        transform: translate(-50%, -50%) rotate(45deg);
    }
    &::after {
        transform: translate(-50%, -50%) rotate(-45deg);
    }
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
                            {isIpad() && <Pointer isIpad={true} />}
                            <IosCard>
                                <CloseButton type="button" aria-label="Lukk" onClick={onHideBannerClick} />
                                <AppIcon>
                                    <PlusSquareFill size="1.1rem" />
                                </AppIcon>
                                <IosText>
                                    <IosTitle>
                                        Installer {name ?? <TextSkeleton />}-appen på {isIpad() ? 'iPaden' : 'iPhonen'}{' '}
                                        din
                                    </IosTitle>
                                    Trykk på <ShareIcon size="1.1rem" /> og velg &quot;Legg til på Hjem-skjerm&quot;.
                                </IosText>
                            </IosCard>
                            {!isIpad() && <Pointer isIpad={false} />}
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
