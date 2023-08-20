import React from 'react';
import styled from 'styled-components';
import { Link, useHistory } from 'react-router-dom';

import { CenterBox } from '../../../sharedComponents/boxes/CenterBox';
import { Header1 } from '../../../sharedComponents/Header1';
import { PositiveButton } from '../../../sharedComponents/forms/Button';

import { useAuth } from '../../../authentication/useAuth';
import { useCurrentEvent } from '../../../hooks';
import { useOwnedTickets } from '../../../hooks/api/useOwnedTickets';
import { useOwnedTicketVouchers } from '../../../hooks/api/useOwnedTicketVouchers';
import { useTicketTransfers } from '../../../hooks/api/useTicketTransfers';

import { Ticket, TicketVoucher } from '@phoenixlan/phoenix.js';
import { Skeleton } from '../../../sharedComponents/Skeleton';
import { Header2 } from '../../../sharedComponents/Header2';
import { ShadowBox } from '../../../sharedComponents/boxes/ShadowBox';
import { InfoBox } from '../../../sharedComponents/NoticeBox';

import { NavLink, NavLinkProps } from 'react-router-dom';
import { useBurnTicketVoucherMutation } from '../../../hooks/api/useBurnTicketVoucherMutation';

const BuyTicketPrompt = styled.div`
    text-align: center;
`;

const TutorialContainer = styled(ShadowBox)`
    padding: ${({ theme }) => theme.spacing.m};
`;

const TicketTransferContainer = styled.div`
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
`;

const VoucherContainer = styled.div`
    justify-content: space-around;
    display: flex;
    flex-direction: column;
    width: 100%;
`;

const VoucherOuter = styled.div`
    border-top: 1px solid ${({ theme }) => theme.colors.Gray};
    border-bottom: 1px solid ${({ theme }) => theme.colors.Gray};
`;

const VoucherLink = styled(NavLink)<NavLinkProps>`
    width: 100%;
`;

const Voucher = styled.div`
    display: flex;
    justify-content: space-between;

    padding: ${({ theme }) => theme.spacing.m} ${({ theme }) => theme.spacing.s} ${({ theme }) => theme.spacing.m}
        ${({ theme }) => theme.spacing.s};

    :hover {
        background-color: ${({ theme }) => theme.colors.Gray};
        cursor: pointer;
    }
`;

export const TicketVouchers: React.FC = () => {
    const history = useHistory();
    const { client } = useAuth();
    const { data: currentEvent, isLoading: isLoadingCurrentEvent } = useCurrentEvent();
    const { data: ticketVouchers, isLoading: isTicketVouchersLoading } = useOwnedTicketVouchers();

    const burnTicketVoucherMutation = useBurnTicketVoucherMutation();

    const isLoading = isLoadingCurrentEvent || isTicketVouchersLoading;

    const burnVoucher = async (voucher_uuid: string) => {
        if (confirm(`Er du sikker på at du vil bruke gavekortet for ${currentEvent?.name}?`)) {
            await burnTicketVoucherMutation.mutateAsync(voucher_uuid);
            //TODO fix
        }
    };

    const unusedVouchers = (ticketVouchers ?? []).filter((voucher) => !voucher.is_used && !voucher.is_expired);
    const usedVouchers = (ticketVouchers ?? []).filter((voucher) => voucher.is_used);
    const expiredVouchers = (ticketVouchers ?? []).filter((voucher) => voucher.is_expired && !voucher.is_used);

    return (
        <Skeleton loading={isLoading}>
            <CenterBox centerVertically={false}>
                {(ticketVouchers ?? []).filter(
                    (voucher: TicketVoucher.BasicTicketVoucher) => !voucher.is_used && !voucher.is_expired,
                ).length > 0 ? (
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
                        <VoucherContainer>
                            <VoucherOuter>
                                <Voucher>
                                    <span>Mottatt</span>
                                    <span>Gir deg en</span>
                                    <span>Sist arrangement det kan brukes</span>
                                    <span></span>
                                </Voucher>
                            </VoucherOuter>
                            {unusedVouchers.map((voucher) => (
                                <VoucherOuter key={voucher.uuid} onClick={() => burnVoucher(voucher.uuid)}>
                                    <Voucher>
                                        <span>
                                            {new Date(voucher.created * 1000).toLocaleString('no-NO', {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit',
                                            })}
                                        </span>
                                        <span>{voucher.ticket_type.name}</span>
                                        <span>{voucher.last_use_event.name}</span>
                                        <span>Klikk for å bruke for {currentEvent?.name}</span>
                                    </Voucher>
                                </VoucherOuter>
                            ))}
                        </VoucherContainer>
                    </>
                ) : null}
                {expiredVouchers.length > 0 ? (
                    <>
                        <Header1>Utløpte billett-gavekort</Header1>
                        <VoucherContainer>
                            <VoucherOuter>
                                <Voucher>
                                    <span>Mottatt</span>
                                    <span>Gir deg en</span>
                                    <span>Sist arrangement det kunne brukes</span>
                                </Voucher>
                            </VoucherOuter>
                            {expiredVouchers.map((voucher) => (
                                <VoucherOuter key={voucher.uuid}>
                                    <Voucher>
                                        <span>
                                            {new Date(voucher.created * 1000).toLocaleString('no-NO', {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit',
                                            })}
                                        </span>
                                        <span>{voucher.ticket_type.name}</span>
                                        <span>{voucher.last_use_event.name}</span>
                                    </Voucher>
                                </VoucherOuter>
                            ))}
                        </VoucherContainer>
                    </>
                ) : null}
                {usedVouchers.length > 0 ? (
                    <>
                        <Header1>Brukte billett-gavekort</Header1>
                        <VoucherContainer>
                            <VoucherOuter>
                                <Voucher>
                                    <span>Mottatt</span>
                                    <span>Billett-ID</span>
                                    <span>Sist arrangement det kunne brukes</span>
                                    <span>Billett-ID</span>
                                    <span></span>
                                </Voucher>
                            </VoucherOuter>
                            {usedVouchers.map((voucher) => (
                                <VoucherOuter key={voucher.uuid}>
                                    <VoucherLink to={`/ticket/${voucher.ticket?.ticket_id}`}>
                                        <Voucher>
                                            <span>
                                                {new Date(voucher.created * 1000).toLocaleString('no-NO', {
                                                    year: 'numeric',
                                                    month: '2-digit',
                                                    day: '2-digit',
                                                })}
                                            </span>
                                            <span>{voucher.ticket_type.name}</span>
                                            <span>#{voucher.ticket?.ticket_id}</span>
                                            <span>{voucher.last_use_event.name}</span>
                                            <span>Klikk for å se på billett</span>
                                        </Voucher>
                                    </VoucherLink>
                                </VoucherOuter>
                            ))}
                        </VoucherContainer>
                    </>
                ) : null}
            </CenterBox>
        </Skeleton>
    );
};
