import type {
    Avatar,
    Crew,
    Event,
    Seatmap,
    SiteConfig,
    Ticket,
    TicketAvailability,
    TicketType,
    TicketVoucher,
    User,
} from '@phoenixlan/phoenix.js';
import { createDefaultApi } from './fixtures';

// Sentinels a story can use in place of data to put a request in a loading or failed state
export const LOADING = '__mock_loading__';
export const ERROR = '__mock_error__';
export type Mocked<T> = T | typeof LOADING | typeof ERROR;

export interface MockApiState {
    siteConfig: Mocked<SiteConfig>;
    currentEvent: Mocked<Event | null>;
    ticketTypes: Mocked<Array<TicketType.TicketType>>;
    ticketAvailability: Mocked<TicketAvailability>;
    tosRules: Mocked<string>;
    tosPayment: Mocked<string>;
    membershipInfo: Mocked<string>;
    currentUser: Mocked<User.FullUser | null>;
    ownedTickets: Mocked<Array<Ticket.FullTicket>>;
    ticketVouchers: Mocked<Array<TicketVoucher.BasicTicketVoucher>>;
    ticketTransfers: Mocked<Array<Ticket.FullTicketTransfer>>;
    seatableTickets: Mocked<Array<Ticket.FullTicket>>;
    membershipStatus: Mocked<boolean>;
    // Membership status when asked about a year other than the current one
    otherYearMembershipStatus: Mocked<boolean>;
    membershipPersonalia: Mocked<User.MembershipPersonalia.MembershipPersonalia | null>;
    discordMapping: Mocked<User.DiscordMapping | null>;
    crews: Mocked<Array<Crew.BaseCrew>>;
    // Full crew info, by crew uuid
    fullCrews: Record<string, Mocked<Crew.FullCrew>>;
    userApplications: Mocked<Array<Crew.Applications.BasicApplication>>;
    seatmap: Mocked<Seatmap.SeatmapAvailability | null>;
    avatar: Mocked<Avatar.Avatar | undefined>;
    // Whether a ticket code entered in the purchase flow is accepted
    unlockCodeValid: boolean;
    // States returned by successive payment polls. The last one repeats forever
    paymentStates: Array<string>;
    // Delay before every mocked request resolves
    latencyMs: number;
}

export type MockApiOverrides = Partial<MockApiState>;

let state: MockApiState = createDefaultApi();

export const getMockApi = (): MockApiState => state;

export const setMockApi = (overrides: MockApiOverrides = {}): void => {
    state = { ...createDefaultApi(), ...overrides };
};

// Resolves a mocked value like a request would, honoring the loading/error sentinels
export const respond = <T>(value: Mocked<T>): Promise<T> => {
    if (value === LOADING) {
        return new Promise<T>(() => undefined);
    }
    if (value === ERROR) {
        return new Promise<T>((_, reject) => setTimeout(() => reject(new Error('Mocked API error')), state.latencyMs));
    }
    return new Promise<T>((resolve) => setTimeout(() => resolve(value as T), state.latencyMs));
};
