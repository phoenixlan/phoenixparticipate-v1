import type {
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
import type { MockApiState } from './mockApi';

// Sample data served by the mocked API. Stories override pieces of it through `parameters.api`

const now = Math.floor(Date.now() / 1000);
const DAY = 24 * 60 * 60;

const avatarUrls = {
    hd: 'mock-assets/male.png',
    sd: 'mock-assets/male.png',
    thumb: 'mock-assets/male.png',
};

export const ALL_FEATURES = ['crew', 'membership', 'discord', 'avatar', 'seatmap', 'vipps', 'stripe'];

export const siteConfig: SiteConfig = {
    name: 'Phoenix LAN',
    logo: 'mock-assets/logo.svg',
    contact: 'info@phoenix.no',
    features: ALL_FEATURES,
};

export const currentEvent: Event = {
    uuid: 'event-current',
    name: 'Phoenix Høst 2026',
    event_brand_uuid: 'storybook-brand',
    participant_age_limit_inclusive: 20,
    crew_age_limit_inclusive: 25,
    booking_time: now - 7 * DAY,
    cancellation_reason: null,
    start_time: now + 30 * DAY,
    end_time: now + 32 * DAY,
    ticket_sales_caps: {},
    priority_seating_time_delta: 0,
    seating_time_delta: 0,
    seatmap_uuid: 'seatmap-1',
    theme: null,
    announced: true,
};

export const previousEvent: Event = {
    ...currentEvent,
    uuid: 'event-previous',
    name: 'Phoenix Vår 2026',
    booking_time: now - 200 * DAY,
    start_time: now - 150 * DAY,
    end_time: now - 148 * DAY,
};

export const user: User.FullUser = {
    uuid: 'user-me',
    firstname: 'Ola',
    lastname: 'Nordmann',
    gender: 'male',
    birthdate: '2009-05-17',
    phone: '+4712345678',
    tos_level: 1,
    position_mappings: [],
    avatar_uuid: 'avatar-me',
    consents: [],
    avatar_urls: avatarUrls,
};

const friend: User.BasicUser = {
    uuid: 'user-friend',
    firstname: 'Kari',
    lastname: 'Hansen',
    gender: 'female',
    avatar_urls: { hd: 'mock-assets/female.png', sd: 'mock-assets/female.png', thumb: 'mock-assets/female.png' },
};

const crewMate: User.BasicUser = {
    uuid: 'user-crewmate',
    firstname: 'Per',
    lastname: 'Olsen',
    gender: 'male',
    avatar_urls: avatarUrls,
};

// ************** Ticket types **************
const ticketTypeBase = {
    event_brand_uuid: 'storybook-brand',
    refundable: true,
    transferable: true,
    disclaimer: null,
    requires_membership: false,
    grants_membership: false,
};

export const ticketTypeWithMembership: TicketType.TicketType = {
    ...ticketTypeBase,
    uuid: 'tt-membership',
    name: 'Deltakerbillett med medlemskap',
    description: 'Inngang og sitteplass, inkludert medlemskap i Radar Event for resten av året.',
    price: 350,
    seatable: true,
    grants_admission: true,
    grants_membership: true,
};

export const ticketTypeMember: TicketType.TicketType = {
    ...ticketTypeBase,
    uuid: 'tt-member',
    name: 'Deltakerbillett for medlemmer',
    description: 'For deg som allerede er medlem av Radar Event i år.',
    price: 300,
    seatable: true,
    grants_admission: true,
    requires_membership: true,
};

export const ticketTypeNonMember: TicketType.TicketType = {
    ...ticketTypeBase,
    uuid: 'tt-non-member',
    name: 'Deltakerbillett uten medlemskap',
    description: 'Inngang og sitteplass uten medlemskap.',
    price: 450,
    seatable: true,
    grants_admission: true,
    disclaimer:
        'Denne billetten gir ikke medlemskap i Radar Event.\nDu går derfor glipp av medlemsfordeler som gratis mat på lørdag.',
};

export const ticketTypeHoodie: TicketType.TicketType = {
    ...ticketTypeBase,
    uuid: 'tt-hoodie',
    name: 'Phoenix-hoodie',
    description: 'Hettegenser med årets motiv. Hentes i infoskranken.',
    price: 400,
    seatable: false,
    grants_admission: false,
    refundable: false,
    disclaimer: 'Hoodien må hentes i løpet av arrangementet. Den sendes ikke i posten, og kan ikke refunderes.',
};

export const ticketTypeFree: TicketType.TicketType = {
    ...ticketTypeBase,
    uuid: 'tt-free',
    name: 'Besøkspass',
    description: 'Gratis pass for foreldre som vil ta en titt.',
    price: 0,
    seatable: false,
    grants_admission: false,
};

export const ticketTypes: Array<TicketType.TicketType> = [
    ticketTypeWithMembership,
    ticketTypeMember,
    ticketTypeNonMember,
    ticketTypeHoodie,
    ticketTypeFree,
];

// Builds an availability response where every admission ticket type has `remaining` tickets left
export const availabilityWithRemaining = (remaining: number | null): TicketAvailability => ({
    ticket_types: ticketTypes.map((ticketType) => ({
        ticket_type_mapping_uuid: `mapping-${ticketType.uuid}`,
        ticket_type: ticketType,
        groups: ticketType.grants_admission ? ['participants'] : [],
        remaining: ticketType.grants_admission ? remaining : null,
    })),
    groups: remaining === null ? [] : [{ group: 'participants', remaining }],
});

// ************** Tickets **************
const seat = (row: number, number: number) => ({
    uuid: `seat-${row}-${number}`,
    number,
    is_reserved: false,
    row: { uuid: `row-${row}`, row_number: row, entrance: { uuid: 'entrance-a', name: 'Inngang A' } },
});

const ticket = (
    ticket_id: number,
    ticketType: TicketType.TicketType,
    overrides: Partial<Ticket.FullTicket> = {},
): Ticket.FullTicket => ({
    ticket_id,
    created: now - 3 * DAY,
    ticket_type: ticketType,
    checked_in: null,
    seat: null,
    payment_uuid: 'payment-1',
    event: currentEvent,
    buyer: user,
    owner: user,
    seater: user,
    ...overrides,
});

export const ownedTickets: Array<Ticket.FullTicket> = [
    ticket(1042, ticketTypeWithMembership, { seat: seat(3, 2) }),
    ticket(1043, ticketTypeNonMember, { seater: friend }),
    ticket(1044, ticketTypeHoodie),
    ticket(512, ticketTypeMember, { event: previousEvent, seat: seat(1, 4) }),
];

export const ticketTransfers: Array<Ticket.FullTicketTransfer> = [
    {
        uuid: 'transfer-out',
        reverted: false,
        created: now - 4 * 60 * 60,
        expires: now + 20 * 60 * 60,
        expired: false,
        from_user: user,
        to_user: friend,
        ticket: ticket(1045, ticketTypeWithMembership, { owner: friend }),
    },
    {
        uuid: 'transfer-in',
        reverted: false,
        created: now - 2 * DAY,
        expires: now - DAY,
        expired: true,
        from_user: crewMate,
        to_user: user,
        ticket: ticket(1030, ticketTypeMember, { seat: seat(2, 7), buyer: crewMate }),
    },
];

export const ticketVouchers: Array<TicketVoucher.BasicTicketVoucher> = [
    {
        uuid: 'voucher-unused',
        created: now - 60 * DAY,
        is_expired: false,
        is_used: false,
        recipient_user: user,
        ticket_type: ticketTypeWithMembership,
        last_use_event: currentEvent,
    },
    {
        uuid: 'voucher-used',
        created: now - 300 * DAY,
        used: now - 200 * DAY,
        is_expired: false,
        is_used: true,
        recipient_user: user,
        ticket_type: ticketTypeMember,
        last_use_event: previousEvent,
        ticket: {
            ...ticket(512, ticketTypeMember),
            buyer_uuid: user.uuid,
            owner_uuid: user.uuid,
            seater_uuid: user.uuid,
        },
    },
    {
        uuid: 'voucher-expired',
        created: now - 400 * DAY,
        is_expired: true,
        is_used: false,
        recipient_user: user,
        ticket_type: ticketTypeNonMember,
        last_use_event: previousEvent,
    },
];

// ************** Crew **************
export const crews: Array<Crew.BaseCrew> = [
    {
        uuid: 'crew-tech',
        name: 'Tech',
        description: 'Setter opp nettverk, strøm og servere, og sørger for at alt fungerer hele helgen.',
        application_prompt: null,
        active: true,
        is_applyable: true,
        hex_color: '#3b82f6',
    },
    {
        uuid: 'crew-info',
        name: 'Info',
        description: 'Ansiktet utad - tar imot deltakere, svarer på spørsmål og håndterer innsjekk.',
        application_prompt: null,
        active: true,
        is_applyable: true,
        hex_color: '#f59e0b',
    },
    {
        uuid: 'crew-kafe',
        name: 'Kafé',
        description: 'Holder deltakerne mette med toast, pizza og energidrikk.',
        application_prompt: null,
        active: true,
        is_applyable: true,
        hex_color: '#10b981',
    },
    {
        uuid: 'crew-core',
        name: 'Core',
        description: 'Planlegger og leder arrangementet.',
        application_prompt: null,
        active: true,
        is_applyable: false,
        hex_color: '#ef4444',
    },
];

const techChief = {
    uuid: 'position-tech-chief',
    crew_uuid: 'crew-tech',
    chief: true,
    permissions: [],
};
const techMember = {
    uuid: 'position-tech-member',
    crew_uuid: 'crew-tech',
    chief: false,
    permissions: [],
};
const infoMember = {
    uuid: 'position-info-member',
    crew_uuid: 'crew-info',
    chief: false,
    permissions: [],
};

const userFacingMapping = (uuid: string, position_uuid: string, mappedUser: User.BaseUser) => ({
    uuid,
    created: now - 30 * DAY,
    position_uuid,
    user: mappedUser,
    event_uuid: currentEvent.uuid,
});

export const fullCrews: Record<string, Crew.FullCrew> = {
    'crew-tech': {
        ...crews[0],
        teams: [],
        positions: [
            { ...techChief, position_mappings: [userFacingMapping('pm-1', techChief.uuid, crewMate)] },
            {
                ...techMember,
                position_mappings: [
                    userFacingMapping('pm-2', techMember.uuid, user),
                    userFacingMapping('pm-3', techMember.uuid, friend),
                ],
            },
        ],
    },
    'crew-info': {
        ...crews[1],
        teams: [],
        positions: [{ ...infoMember, position_mappings: [userFacingMapping('pm-4', infoMember.uuid, user)] }],
    },
};

// The current user's own position mappings, used by "Mine verv"
export const userCrewPositions: User.FullUser['position_mappings'] = [
    {
        uuid: 'pm-2',
        created: now - 30 * DAY,
        position: techMember,
        user_uuid: user.uuid,
        event_uuid: currentEvent.uuid,
    },
    {
        uuid: 'pm-4',
        created: now - 30 * DAY,
        position: infoMember,
        user_uuid: user.uuid,
        event_uuid: currentEvent.uuid,
    },
];

const applicationCrew = (crew: Crew.BaseCrew, list_order: number, accepted = false) => ({
    uuid: `acm-${crew.uuid}-${list_order}`,
    application_uuid: 'application',
    list_order,
    crew,
    created: now - 10 * DAY,
    accepted,
});

export const userApplications: Array<Crew.Applications.BasicApplication> = [
    {
        uuid: 'application-current',
        crews: [applicationCrew(crews[0], 0), applicationCrew(crews[1], 1)],
        event: currentEvent,
        contents: 'Hei! Jeg har vært deltaker tre ganger og vil gjerne hjelpe til med nettverket i år.',
        created: now - 10 * DAY,
        state: 'ApplicationState.created',
        hidden: false,
        user,
    },
    {
        uuid: 'application-old',
        crews: [applicationCrew(crews[2], 0, true)],
        event: previousEvent,
        contents: 'Jeg liker å lage mat og vil gjerne jobbe i kaféen.',
        created: now - 180 * DAY,
        state: 'ApplicationState.accepted',
        hidden: false,
        user,
    },
];

// ************** Seatmap **************
const SEATS_PER_ROW = 10;

// Rows are vertical columns of seats, placed in pairs with an aisle between each pair
const seatmapRow = (row_number: number) => {
    const i = row_number - 1;
    const row = {
        uuid: `row-${row_number}`,
        row_number,
        x: 120 + i * 40 + Math.floor(i / 2) * 60,
        y: 40,
        is_horizontal: true,
        ticket_type_uuid: null,
    };
    return {
        ...row,
        seats: Array.from({ length: SEATS_PER_ROW }, (_, i) => {
            const number = i + 1;
            const isMine = row_number === 3 && number === 2;
            return {
                uuid: `seat-${row_number}-${number}`,
                number,
                is_reserved: row_number === 1 && number <= 3,
                taken: isMine || (row_number + number) % 3 === 0,
                row,
                ticket_id: isMine ? 1042 : null,
            };
        }),
    };
};

export const seatmap: Seatmap.SeatmapAvailability = {
    uuid: 'seatmap-1',
    width: 800,
    height: 420,
    background_url: null,
    rows: [1, 2, 3, 4, 5, 6, 7, 8].map(seatmapRow),
};

// ************** Texts **************
export const tosRules = `## Generelt
- Alle deltakere må ha gyldig billett knyttet til sin egen bruker.
- Det er ikke tillatt med alkohol eller andre rusmidler på arrangementet.
- Deltakere under 15 år må ha med signert foreldreskjema.

## Sikkerhet
Følg alltid instrukser fra crew. Rømningsveier skal holdes frie.

## Utstyr
Du er selv ansvarlig for ditt eget utstyr. Merk gjerne kabler og utstyr med navn.`;

export const tosPayment = `## Betalingsvilkår
Billetter betales ved kjøp. Kjøpet er bindende når betalingen er gjennomført.

## Angrerett
Billetter kan refunderes frem til 14 dager før arrangementet starter, med mindre annet er oppgitt på billettypen.

## Overføring
Billetter kan overføres til en annen bruker frem til arrangementet starter.`;

export const membershipInfo = `## Hvorfor medlemskap?
Phoenix arrangeres av Radar Event, en frivillig organisasjon. Medlemskapet koster ingenting ekstra når det er inkludert i billetten, men gir oss støtte fra kommune og fylke.`;

export const createDefaultApi = (): MockApiState => ({
    siteConfig,
    currentEvent,
    ticketTypes,
    ticketAvailability: availabilityWithRemaining(150),
    tosRules,
    tosPayment,
    membershipInfo,
    currentUser: { ...user, position_mappings: userCrewPositions },
    ownedTickets,
    ticketVouchers: [],
    ticketTransfers: [],
    seatableTickets: ownedTickets.filter((t) => t.event.uuid === currentEvent.uuid && t.ticket_type.seatable),
    membershipStatus: false,
    otherYearMembershipStatus: false,
    membershipPersonalia: { address: 'Storgata 1', postal_code: '1383', country_code: 'NO' },
    discordMapping: { discord_id: '1234', username: 'olanordmann', avatar: '' },
    crews,
    fullCrews,
    userApplications,
    seatmap,
    avatar: {
        uuid: 'avatar-me',
        user_uuid: user.uuid,
        state: 'AvatarState.accepted',
        urls: avatarUrls,
    },
    unlockCodeValid: true,
    paymentStates: ['PaymentState.created', 'PaymentState.paid', 'PaymentState.tickets_minted'],
    latencyMs: 0,
});
