import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Disclaimers } from '../../src/pages/tickets/purchase/steps/disclaimers/Disclaimers';
import { Tos } from '../../src/pages/tickets/purchase/steps/step2and3/Tos';
import { MembershipPersonaliaForm } from '../../src/pages/membership/MembershipPersonaliaForm';
import { PaymentMethods } from '../../src/pages/tickets/purchase/steps/step4/PaymentMethods';
import { Confirmation } from '../../src/pages/tickets/purchase/steps/step5/Confirmation';
import { Stripe } from '../../src/pages/tickets/purchase/vendors/stripe';
import { Vipps } from '../../src/pages/tickets/purchase/vendors/vipps';
import { PaymentMethodType } from '../../src/pages/tickets/purchase/utils/types';
import { PurchaseStepFrame } from '../helpers/PurchaseStepFrame';
import {
    siteConfig,
    ticketTypeHoodie,
    ticketTypeNonMember,
    ticketTypes,
    ticketTypeWithMembership,
} from '../mocks/fixtures';
import { ERROR, LOADING } from '../mocks/mockApi';

/*
 * The steps after ticket selection, in the order Form.tsx walks through them. Each renders the real step component
 * with the props Form would pass it, inside a copy of the purchase page layout.
 */
const meta: Meta = {
    title: 'Ticket purchase/2 · Later steps',
    parameters: { route: '/buy' },
};
export default meta;

type Story = StoryObj;

const noop = () => console.log('[storybook] next step');

const chosenTickets = {
    [ticketTypeWithMembership.uuid]: 2,
    [ticketTypeHoodie.uuid]: 1,
};

// ************** 1.5 Disclaimers **************
export const DisclaimersStep: Story = {
    name: '1.5 · Disclaimers',
    render: () => (
        <PurchaseStepFrame showPaymentMethodsInfo>
            <Disclaimers ticketTypes={[ticketTypeNonMember, ticketTypeHoodie]} onAccept={noop} />
        </PurchaseStepFrame>
    ),
};

// ************** 2 Event rules **************
export const EventRules: Story = {
    name: '2 · Event rules',
    render: () => (
        <PurchaseStepFrame showPaymentMethodsInfo>
            <Tos onAccept={noop} showRules={true} />
        </PurchaseStepFrame>
    ),
};

export const EventRulesLoading: Story = {
    ...EventRules,
    name: '2 · Event rules (loading)',
    parameters: { api: { tosRules: LOADING } },
};

export const EventRulesError: Story = {
    ...EventRules,
    name: '2 · Event rules (failed to load)',
    parameters: { api: { tosRules: ERROR } },
};

// ************** 2.5 Membership personalia **************
export const MembershipPersonalia: Story = {
    name: '2.5 · Membership personalia',
    render: () => (
        <PurchaseStepFrame showPaymentMethodsInfo>
            <MembershipPersonaliaForm showIntro={true} onDone={noop} submitText="Lagre og fortsett" />
        </PurchaseStepFrame>
    ),
};

// ************** 3 Payment terms **************
export const PaymentTerms: Story = {
    name: '3 · Payment terms',
    render: () => (
        <PurchaseStepFrame showPaymentMethodsInfo>
            <Tos onAccept={noop} showRules={false} />
        </PurchaseStepFrame>
    ),
};

// ************** 4 Payment method **************
export const PaymentMethod: Story = {
    name: '4 · Payment method',
    render: () => (
        <PurchaseStepFrame>
            <PaymentMethods isFree={false} onClick={noop} />
        </PurchaseStepFrame>
    ),
};

export const PaymentMethodVippsOnly: Story = {
    ...PaymentMethod,
    name: '4 · Payment method (only Vipps enabled)',
    parameters: {
        api: { siteConfig: { ...siteConfig, features: siteConfig.features.filter((f) => f !== 'stripe') } },
    },
};

export const PaymentMethodFree: Story = {
    name: '4 · Payment method (free tickets)',
    render: () => (
        <PurchaseStepFrame>
            <PaymentMethods isFree={true} onClick={noop} />
        </PurchaseStepFrame>
    ),
};

// ************** 5 Confirmation **************
export const ConfirmationVipps: Story = {
    name: '5 · Confirmation (Vipps)',
    render: () => (
        <PurchaseStepFrame>
            <Confirmation
                chosenTickets={chosenTickets}
                ticketTypes={ticketTypes}
                chosenPaymentMethod={PaymentMethodType.vipps}
                goBack={noop}
            >
                <Vipps url="#vipps-mock" slug="mock" next={noop} />
            </Confirmation>
        </PurchaseStepFrame>
    ),
};

export const ConfirmationCard: Story = {
    name: '5 · Confirmation (card)',
    render: () => (
        <PurchaseStepFrame>
            <Confirmation
                chosenTickets={chosenTickets}
                ticketTypes={ticketTypes}
                chosenPaymentMethod={PaymentMethodType.card}
                goBack={noop}
            >
                <Stripe clientSecret="pi_mock_secret_mock" next={noop} />
            </Confirmation>
        </PurchaseStepFrame>
    ),
};

export const ConfirmationPaymentLoading: Story = {
    name: '5 · Confirmation (payment not ready yet)',
    render: () => (
        <PurchaseStepFrame>
            <Confirmation
                chosenTickets={chosenTickets}
                ticketTypes={ticketTypes}
                chosenPaymentMethod={PaymentMethodType.vipps}
                goBack={noop}
            />
        </PurchaseStepFrame>
    ),
};
