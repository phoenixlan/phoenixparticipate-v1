/*
 * @created 05/04/2021 - 20:54
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
export enum Step {
    TicketSelection = 1,
    TOSrules = 2,
    TOSpayment = 3,
    PaymentMethod = 4,
    Confirmation = 5,
    TicketMinting = 6,
}
export enum PaymentMethodType {
    None = 'undefined',
    card = 'stripe',
    vipps = 'vipps',
}
export type ChosenTicketType = { [index: string]: number };
