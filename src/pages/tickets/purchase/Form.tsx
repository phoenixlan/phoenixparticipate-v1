/*
 * @created 31/03/2021 - 23:30
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import React, { useState } from 'react';
import styled from 'styled-components';
import { TicketsForm } from './steps/step1/TicketsForm';
import { useQuery } from '../../../hooks';
import {
    Cart,
    createPayment,
    createStoreSession,
    initiateVippsPayment,
    initiateVisaPayment,
    PaymentInfo,
    StoreSession,
    TicketType,
    VippsPayment,
    VisaPayment,
} from '@phoenixlan/phoenix.js';
import { PaymentMethods } from './steps/step4/PaymentMethods';
import { Tos } from './steps/step2and3/Tos';
import { Confirmation } from './steps/step5/Confirmation';
import { ChosenTicketType, PaymentMethodType, Step } from './utils/types';
import { Skeleton, SkeletonPlaceholder } from '../../../sharedComponents/Skeleton';
import { Stripe } from './vendors/stripe';
import useDidMountEffect from '../../../hooks/useDidMountEffect';
import { TicketMinting } from './steps/step6/TicketMinting';
import { useCurrentEventTicketTypes } from '../../../hooks/api/useCurrentEventTicketTypes';
import { Vipps } from './vendors/vipps';
import { toast } from 'react-toastify';
import { ShadowBox } from '../../../sharedComponents/boxes/ShadowBox';
import { PaymentMethodsInfo } from './PaymentMethodsInfo';

const Container = styled.div`
    overflow: auto;
    height: 100%;
    padding: ${({ theme }) => theme.spacing.m};
`;

export const Form: React.FC = () => {
    const uuid = useQuery('uuid');

    const { data: ticketTypes, isLoading, isLoadingError } = useCurrentEventTicketTypes();

    const [currentStep, setCurrentStep] = useState<Step>(Step.TicketSelection);
    const [chosenPaymentOption, setChosenPaymentOption] = useState<PaymentMethodType>(PaymentMethodType.None);
    const [chosenTickets, setChosenTickets] = useState<ChosenTicketType>({});
    const [storeSession, setStoreSession] = useState<StoreSession>();
    const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>();
    const [payment, setPayment] = useState<VisaPayment | VippsPayment>();

    const makeStoreSession = async () => {
        const data: Cart = {
            cart: [],
        };
        for (const [ticketUUID, amount] of Object.entries(chosenTickets)) {
            const cartItem = {
                uuid: ticketUUID,
                qty: amount,
            };
            data.cart.push(cartItem);
        }
        try {
            const session = await createStoreSession(data);
            setStoreSession(session);
        } catch {
            toast.error('Noe gikk galt. Venligst prøv igjen.');
        }
    };

    useDidMountEffect(() => {
        makeStoreSession();
    }, [chosenTickets]);

    useDidMountEffect(() => {
        const init = async () => {
            if (!storeSession || !process.env.HOST || chosenPaymentOption === PaymentMethodType.None) {
                return;
            }
            if (paymentInfo !== undefined) {
                setPaymentInfo(undefined);
                return await makeStoreSession();
            }
            try {
                const _paymentInfo = await createPayment(storeSession.uuid, chosenPaymentOption);

                switch (chosenPaymentOption) {
                    case PaymentMethodType.vipps: {
                        const fallbackUrl = `${process.env.HOST}/buy?uuid=${_paymentInfo.uuid}`;
                        const _payment = await initiateVippsPayment(_paymentInfo.uuid, fallbackUrl);
                        setPayment(_payment);
                        break;
                    }
                    case PaymentMethodType.card: {
                        const _payment = await initiateVisaPayment(_paymentInfo.uuid);
                        setPayment(_payment);
                        break;
                    }
                }
                setPaymentInfo(_paymentInfo);
            } catch {
                toast.error('Noe gikk galt. Venligst prøv igjen.');
            }
        };
        init();
    }, [chosenPaymentOption, storeSession]);

    const getVendor = () => {
        if (!payment) {
            return;
        }
        switch (chosenPaymentOption) {
            case PaymentMethodType.card: {
                const stripePayment = payment as VisaPayment;
                if (stripePayment && stripePayment.client_secret) {
                    return <Stripe clientSecret={stripePayment.client_secret} next={nextStep} />;
                }
                return;
            }
            case PaymentMethodType.vipps: {
                const vippsPayment = payment as VippsPayment;
                if (vippsPayment && vippsPayment.url && vippsPayment.slug) {
                    return <Vipps url={vippsPayment.url} slug={vippsPayment.slug} next={nextStep} />;
                }
                return;
            }
        }
    };

    const renderStep = (step: Step, ticketTypes: Array<TicketType.TicketType>) => {
        switch (step) {
            case Step.TicketSelection:
                return <TicketsForm ticketTypes={ticketTypes} onSubmit={setTickets} />;
            case Step.TOSrules:
                return <Tos onAccept={nextStep} showRules={true} />;
            case Step.TOSpayment:
                return <Tos onAccept={nextStep} showRules={false} />;
            case Step.PaymentMethod:
                return <PaymentMethods onClick={setPaymentMethod} />;
            case Step.Confirmation:
                if (!paymentInfo) {
                    return <SkeletonPlaceholder />;
                }
                return (
                    <Confirmation
                        chosenTickets={chosenTickets}
                        ticketTypes={ticketTypes}
                        chosenPaymentMethod={chosenPaymentOption}
                        goBack={previousStep}
                    >
                        {getVendor()}
                    </Confirmation>
                );
            case Step.TicketMinting:
                if (!paymentInfo) {
                    return <SkeletonPlaceholder />;
                }
                return <TicketMinting uuid={paymentInfo.uuid} />;
        }
    };

    const nextStep = () => {
        switch (currentStep) {
            case Step.TicketSelection:
                setCurrentStep(Step.TOSrules);
                break;
            case Step.TOSrules:
                setCurrentStep(Step.TOSpayment);
                break;
            case Step.TOSpayment:
                setCurrentStep(Step.PaymentMethod);
                break;
            case Step.PaymentMethod:
                setCurrentStep(Step.Confirmation);
                break;
            case Step.Confirmation:
                setCurrentStep(Step.TicketMinting);
        }
    };

    const previousStep = () => {
        switch (currentStep) {
            case Step.TOSrules:
                setCurrentStep(Step.TicketSelection);
                break;
            case Step.TOSpayment:
                setCurrentStep(Step.TOSrules);
                break;
            case Step.PaymentMethod:
                setCurrentStep(Step.TOSpayment);
                break;
            case Step.Confirmation:
                setCurrentStep(Step.PaymentMethod);
                break;
            case Step.TicketMinting:
                setCurrentStep(Step.Confirmation);
        }
    };

    const setTickets = (tickets: ChosenTicketType) => {
        setChosenTickets(tickets);
        nextStep();
    };

    const setPaymentMethod = (paymentMethod: PaymentMethodType) => {
        setChosenPaymentOption(paymentMethod);
        nextStep();
    };

    if (uuid) {
        return (
            <ShadowBox>
                <TicketMinting uuid={uuid} />
            </ShadowBox>
        );
    }

    return (
        <>
            <ShadowBox>
                <Container>
                    <Skeleton loading={isLoading}>
                        {isLoading && <div>Loading...</div>}
                        {!isLoading && isLoadingError && <div>Failed to load tickets</div>}
                        {!isLoading &&
                            !isLoadingError &&
                            ticketTypes &&
                            ticketTypes.length > 0 &&
                            renderStep(currentStep, ticketTypes)}
                    </Skeleton>
                </Container>
            </ShadowBox>
            {(currentStep === Step.TicketSelection ||
                currentStep === Step.TOSpayment ||
                currentStep === Step.TOSrules) && (
                <ShadowBox>
                    <PaymentMethodsInfo />
                </ShadowBox>
            )}
        </>
    );
};
