import React, { useState } from 'react';
import styled from 'styled-components';
import { NavLink, NavLinkProps } from 'react-router-dom';
import { ArrowRightSquare } from '@styled-icons/bootstrap/ArrowRightSquare';

import { CenterBox } from '../../../sharedComponents/boxes/CenterBox';
import { Header1 } from '../../../sharedComponents/Header1';
import { PositiveButton } from '../../../sharedComponents/forms/Button';

import { useCurrentEvent } from '../../../hooks';
import { useOwnedTicketVouchers } from '../../../hooks/api/useOwnedTicketVouchers';

import { TicketVoucher } from '@phoenixlan/phoenix.js';
import { Skeleton } from '../../../sharedComponents/Skeleton';
import { InfoBox } from '../../../sharedComponents/NoticeBox';

import { useBurnTicketVoucherMutation } from '../../../hooks/api/useBurnTicketVoucherMutation';

const VoucherOuter = styled.div`
    border-top: 1px solid ${({ theme }) => theme.colors.Gray};
    border-bottom: 1px solid ${({ theme }) => theme.colors.Gray};
`;

const VoucherLink = styled(NavLink)<NavLinkProps>`
    width: 100%;
`;

// Proportional columns so the rows line up, like the ticket list, while long text wraps
const Voucher = styled.div<{ isLink?: boolean }>`
    display: grid;
    grid-template-columns: minmax(0, 2fr) minmax(0, 1.2fr) minmax(0, 1.5fr) 9rem;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.s};
    text-align: left;
    overflow-wrap: anywhere;
    padding: ${({ theme }) => theme.spacing.m} ${({ theme }) => theme.spacing.s};

    @media screen and (max-width: ${({ theme }) => theme.media.smallTablet}) {
        grid-template-columns: minmax(0, 2fr) minmax(0, 1.2fr) 9rem;
    }

    ${({ isLink, theme }) =>
        isLink &&
        `
        :hover {
            background-color: ${theme.colors.Gray};
            cursor: pointer;
        }
    `}
`;

const Cell = styled.div`
    min-width: 0;
`;

// Hidden on phones, where there is no room for it
const WideOnlyCell = styled(Cell)`
    @media screen and (max-width: ${({ theme }) => theme.media.smallTablet}) {
        display: none;
    }
`;

const Action = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
`;

const Arrow = styled(ArrowRightSquare)`
    height: 1.5em;
`;

const formatDate = (timestamp: number) =>
    new Date(timestamp * 1000).toLocaleString('no-NO', { year: 'numeric', month: '2-digit', day: '2-digit' });

interface VoucherCellsProps {
    voucher: TicketVoucher.BasicTicketVoucher;
    lastUseLabel: string;
}

// The columns every voucher row has, before the action column
const VoucherCells: React.FC<VoucherCellsProps> = ({ voucher, lastUseLabel }) => (
    <>
        <Cell>{voucher.ticket_type.name}</Cell>
        <Cell>Mottatt {formatDate(voucher.created)}</Cell>
        <WideOnlyCell>
            {lastUseLabel} {voucher.last_use_event.name}
        </WideOnlyCell>
    </>
);

export const TicketVouchers: React.FC = () => {
    const { data: currentEvent, isLoading: isLoadingCurrentEvent } = useCurrentEvent();
    const { data: ticketVouchers, isLoading: isTicketVouchersLoading } = useOwnedTicketVouchers();
    const [burningVoucher, setBurningVoucher] = useState<string | null>(null);

    const burnTicketVoucherMutation = useBurnTicketVoucherMutation();

    const isLoading = isLoadingCurrentEvent || isTicketVouchersLoading;

    const burnVoucher = async (voucher_uuid: string) => {
        if (!currentEvent || !confirm(`Er du sikker på at du vil bruke gavekortet for ${currentEvent.name}?`)) {
            return;
        }
        setBurningVoucher(voucher_uuid);
        try {
            await burnTicketVoucherMutation.mutateAsync(voucher_uuid);
        } catch {
            // Error is reported by the mutation
        }
        setBurningVoucher(null);
    };

    const unusedVouchers = (ticketVouchers ?? []).filter((voucher) => !voucher.is_used && !voucher.is_expired);
    const usedVouchers = (ticketVouchers ?? []).filter((voucher) => voucher.is_used);
    const expiredVouchers = (ticketVouchers ?? []).filter((voucher) => voucher.is_expired && !voucher.is_used);

    return (
        <Skeleton loading={isLoading}>
            <CenterBox centerVertically={false}>
                {unusedVouchers.length > 0 ? (
                    <InfoBox title="Du har ubrukte billett-gavekort">
                        <p>Disse kan konverteres til billetter for kommende arrangement</p>
                    </InfoBox>
                ) : (
                    <InfoBox title="Du har ingen ubrukte billett-gavekort">
                        <p>Dersom du har billett-gavekort vil denne siden vise deg de</p>
                    </InfoBox>
                )}
                {unusedVouchers.length > 0 ? (
                    <>
                        <Header1>Billett-gavekort</Header1>
                        {unusedVouchers.map((voucher) => (
                            <VoucherOuter key={voucher.uuid}>
                                <Voucher>
                                    <VoucherCells voucher={voucher} lastUseLabel="Kan brukes til og med" />
                                    <Action>
                                        {currentEvent ? (
                                            <PositiveButton
                                                size="small"
                                                isLoading={burningVoucher === voucher.uuid}
                                                disabled={burningVoucher !== null}
                                                onClick={() => burnVoucher(voucher.uuid)}
                                            >
                                                Bruk
                                            </PositiveButton>
                                        ) : (
                                            <span>Ingen kommende arrangement</span>
                                        )}
                                    </Action>
                                </Voucher>
                            </VoucherOuter>
                        ))}
                    </>
                ) : null}
                {expiredVouchers.length > 0 ? (
                    <>
                        <Header1>Utløpte billett-gavekort</Header1>
                        {expiredVouchers.map((voucher) => (
                            <VoucherOuter key={voucher.uuid}>
                                <Voucher>
                                    <VoucherCells voucher={voucher} lastUseLabel="Kunne brukes til og med" />
                                    <Action>Utløpt</Action>
                                </Voucher>
                            </VoucherOuter>
                        ))}
                    </>
                ) : null}
                {usedVouchers.length > 0 ? (
                    <>
                        <Header1>Brukte billett-gavekort</Header1>
                        {usedVouchers.map((voucher) => (
                            <VoucherOuter key={voucher.uuid}>
                                <VoucherLink to={`/ticket/${voucher.ticket?.ticket_id}`}>
                                    <Voucher isLink={true}>
                                        <VoucherCells voucher={voucher} lastUseLabel="Kunne brukes til og med" />
                                        <Action>
                                            <span>
                                                Billett <code>#{voucher.ticket?.ticket_id}</code>
                                            </span>
                                            <Arrow />
                                        </Action>
                                    </Voucher>
                                </VoucherLink>
                            </VoucherOuter>
                        ))}
                    </>
                ) : null}
            </CenterBox>
        </Skeleton>
    );
};
