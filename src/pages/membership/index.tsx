import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import { useMembershipStatus } from '../../hooks/api/useMembershipStatus';
import { useMembershipPersonalia } from '../../hooks/api/useMembershipPersonalia';

import { CenterBox } from '../../sharedComponents/boxes/CenterBox';
import { Header1 } from '../../sharedComponents/Header1';
import { Skeleton } from '../../sharedComponents/Skeleton';
import { ShadowBox } from '../../sharedComponents/boxes/ShadowBox';
import { WarningBox } from '../../sharedComponents/NoticeBox';
import { PositiveButton } from '../../sharedComponents/forms/Button';

import { MembershipInfo } from '../tickets/MembershipInfo';
import { useAuth } from '../../authentication/useAuth';
import { MembershipPersonaliaForm } from './MembershipPersonaliaForm';

const MembershipInfoBox = styled(ShadowBox)`
    padding: ${({ theme }) => theme.spacing.m};
`;

const StatusCard = styled(ShadowBox)`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.l};
    padding: ${({ theme }) => theme.spacing.l};
`;

const Badge = styled.div<{ small?: boolean }>`
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: ${({ small }) => (small ? '1.75rem' : '4.5rem')};
    height: ${({ small }) => (small ? '1.75rem' : '4.5rem')};
    border-radius: 50%;
    font-size: ${({ small, theme }) => (small ? theme.fontSize.m : theme.fontSize.xl)};
    font-weight: 600;
    color: ${({ theme }) => theme.colors.White};
    background: ${({ theme }) => theme.colors.positive};
`;

const StatusDetails = styled.div`
    min-width: 0;
    text-align: left;

    p {
        margin: 0;
    }
`;

const StatusLabel = styled.div`
    font-size: ${({ theme }) => theme.fontSize.s};
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.Black};
`;

const StatusTitle = styled.div`
    font-size: ${({ theme }) => theme.fontSize.l};
    font-weight: 600;
    letter-spacing: -0.01em;
    line-height: 1.3;
    margin-bottom: ${({ theme }) => theme.spacing.xs};
    color: ${({ theme }) => theme.colors.Black};
`;

const MemberName = styled.p`
    font-weight: 600;
`;

const NoMembershipButton = styled(PositiveButton)`
    margin-top: ${({ theme }) => theme.spacing.s};
`;

const NextYearMembershipBox = styled(ShadowBox)`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.s};
    padding: ${({ theme }) => theme.spacing.s} ${({ theme }) => theme.spacing.l};
`;

export const MembershipStatus = () => {
    const history = useHistory();
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    const { data: membershipStatus, isLoading: isMembershipStatusLoading } = useMembershipStatus();
    const { data: nextYearMembershipStatus, isLoading: isNextYearMembershipStatusLoading } =
        useMembershipStatus(nextYear);
    const { data: membershipPersonalia, isLoading: isMembershipPersonaliaLoading } = useMembershipPersonalia()
    const { client } = useAuth();

    const mustFillMembershipPersonalia = (membershipStatus || nextYearMembershipStatus) && !membershipPersonalia;

    return (
        <Skeleton
            loading={isMembershipStatusLoading || isNextYearMembershipStatusLoading || isMembershipPersonaliaLoading}
        >
            <CenterBox centerVertically={false}>
                <Header1>Radar Event-medlemskap</Header1>
                {mustFillMembershipPersonalia ? (
                    <WarningBox title="Medlemsinformasjon mangler">
                        <p>
                            Du har billett som gir medlemskap i Radar Event, men har ikke lagt inn medlemsinformasjon.
                            For å registrere medlemskapet trenger vi litt informasjon om deg. Informasjonen behandles i
                            henhold til våre bruksvilkår.
                        </p>
                        <MembershipPersonaliaForm submitText="Lagre og vis medlemskap" />
                    </WarningBox>
                ) : (
                    <>
                        {membershipStatus ? (
                            <StatusCard>
                                <Badge>✓</Badge>
                                <StatusDetails>
                                    <StatusLabel>Radar Event</StatusLabel>
                                    <StatusTitle>Medlem ut {currentYear}</StatusTitle>
                                    <MemberName>
                                        {client.user?.firstname} {client.user?.lastname}
                                    </MemberName>
                                    <p>Født {client.user?.birthdate}</p>
                                    <p>
                                        {membershipPersonalia?.address}, {membershipPersonalia?.postal_code}
                                    </p>
                                </StatusDetails>
                            </StatusCard>
                        ) : (
                            <StatusCard>
                                <StatusDetails>
                                    <StatusTitle>Ingen medlemskap for {currentYear}</StatusTitle>
                                    <p>Du blir medlem ved å kjøpe en billett som inkluderer medlemskap.</p>
                                    <NoMembershipButton size="small" onClick={() => history.push('/buy')}>
                                        Kjøp billett
                                    </NoMembershipButton>
                                </StatusDetails>
                            </StatusCard>
                        )}
                        {nextYearMembershipStatus && (
                            <NextYearMembershipBox>
                                <Badge small={true}>
                                    ✓
                                </Badge>
                                <span>Du har medlemskap for {nextYear}</span>
                            </NextYearMembershipBox>
                        )}
                    </>
                )}
                <MembershipInfoBox>
                    <MembershipInfo />
                </MembershipInfoBox>
            </CenterBox>
        </Skeleton>
    );
};
