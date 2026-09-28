/*
 * Storybook stand-in for @phoenixlan/phoenix.js (wired up as a webpack alias in .storybook/main.ts).
 * Everything is re-exported from the real library, except the calls that hit the network, which are served from the
 * story-controlled mock state in ./mockApi instead.
 */
import * as real from '@phoenixlan/phoenix.js/build/index.es.js';
import type { Cart, PaymentInfo, StoreSession } from '@phoenixlan/phoenix.js';
import { ERROR, getMockApi, respond } from './mockApi';

export * from '@phoenixlan/phoenix.js/build/index.es.js';

const api = getMockApi;
const ok = <T>(value: T): Promise<T> => respond<T>(value);

// ************** Meta / events **************
export const getSiteConfig = () => respond(api().siteConfig);
export const getApiServer = () => '.';
export const getCurrentEvent = () => respond(api().currentEvent);
export const getEventTicketTypes = () => respond(api().ticketTypes);
export const getEventTicketAvailability = () => respond(api().ticketAvailability);
export const unlockEventTicketType = () => ok(api().unlockCodeValid);
export const getTosRules = () => respond(api().tosRules);
export const getTosPayment = () => respond(api().tosPayment);

// ************** Purchase flow **************
let pollCount = 0;
export const resetPolling = (): void => {
    pollCount = 0;
};

const paymentInfo = (uuid: string, state: string): PaymentInfo => ({
    uuid,
    created: Math.floor(Date.now() / 1000),
    price: 0,
    provider: 'mock',
    state,
    store_session_uuid: 'store-session',
    user_uuid: 'user-me',
    tickets: [],
});

export const createStoreSession = (event_uuid: string, data: Cart): Promise<StoreSession> => {
    const ticketTypes = api().ticketTypes;
    const priceOf = (uuid: string) =>
        (Array.isArray(ticketTypes) ? ticketTypes.find((t) => t.uuid === uuid)?.price : undefined) ?? 0;
    const total = data.cart.reduce((sum, entry) => sum + priceOf(entry.uuid) * Number(entry.qty), 0);
    return ok({
        uuid: 'store-session',
        created: Math.floor(Date.now() / 1000),
        expires: Math.floor(Date.now() / 1000) + 30 * 60,
        entries: [],
        total,
        user_uuid: 'user-me',
        event_uuid,
    });
};
export const createPayment = (store_session: string, provider: string) =>
    ok({ ...paymentInfo('payment-mock', 'PaymentState.created'), provider, store_session_uuid: store_session });
export const initiateVippsPayment = () => ok({ slug: 'mock', url: '#vipps-mock' });
export const initiateStripePayment = () => ok({ client_secret: 'pi_mock_secret_mock' });
export const initiateFreePayment = (uuid: string) => ok(paymentInfo(uuid, 'PaymentState.paid'));
export const poll = (uuid: string) => {
    const states = api().paymentStates;
    const state = states[Math.min(pollCount, states.length - 1)];
    pollCount++;
    return ok(paymentInfo(uuid, state));
};

// ************** Namespaces **************
export const User = {
    ...real.User,
    getUser: () => respond(api().currentUser),
    getAuthenticatedUser: () => respond(api().currentUser),
    getOwnedTickets: () => respond(api().ownedTickets),
    getTicketVouchers: () => respond(api().ticketVouchers),
    getTicketTransfers: () => respond(api().ticketTransfers),
    getSeatableTickets: () => respond(api().seatableTickets),
    getUserMembershipStatus: () => respond(api().membershipStatus),
    getDiscordMapping: () => respond(api().discordMapping),
    revokeDiscordMapping: () => ok(undefined),
    createDiscordMappingOauthUrl: () => ok({ url: '#discord-mock' }),
    MembershipPersonalia: {
        ...real.User.MembershipPersonalia,
        getMembershipPersonalia: () => respond(api().membershipPersonalia),
        upsertMembershipPersonalia: (_user_uuid: string, address: string, postal_code: string) =>
            ok({ address, postal_code, country_code: 'NO' }),
    },
};

export const Crew = {
    ...real.Crew,
    getCrews: () => respond(api().crews),
    getCrew: (uuid: string) => respond(api().fullCrews[uuid] ?? ERROR),
    Applications: {
        ...real.Crew.Applications,
        getUserApplications: () => respond(api().userApplications),
        createApplication: () => ok(undefined),
    },
};

export const Ticket = {
    ...real.Ticket,
    transferTicket: () => ok(undefined),
    revertTransfer: () => ok(undefined),
    seatTicket: () => ok(undefined),
    setTicketSeater: () => ok(undefined),
};

export const TicketVoucher = {
    ...real.TicketVoucher,
    burnTicketVoucher: () => ok(true),
};

export const Seatmap = {
    ...real.Seatmap,
    getSeatmapAvailability: () => respond(api().seatmap),
};

export const Avatar = {
    ...real.Avatar,
    getAvatar: () => respond(api().avatar),
    deleteAvatar: () => ok(undefined),
    createAvatar: () => ok(undefined),
};
