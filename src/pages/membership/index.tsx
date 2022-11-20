import React from 'react';
import styled from 'styled-components';

import { useMembershipStatus } from '../../hooks/api/useMembershipStatus';

import { CenterBox } from '../../sharedComponents/boxes/CenterBox';
import { Header1 } from '../../sharedComponents/Header1';
import { Skeleton } from '../../sharedComponents/Skeleton';
import { ShadowBox } from '../../sharedComponents/boxes/ShadowBox';

import { RadarEventInfo } from '../tickets/RadarEventInfo';
import { Header2 } from '../../sharedComponents/Header2';
import { useAuth } from '../../authentication/useAuth';

const RadarEventInfoBox = styled(ShadowBox)`
    padding: ${({ theme }) => theme.spacing.m};
`;

const MembershipCard = styled.div`
    display: flex;
`;

const MembershipCardUserInfo = styled.div`
    text-align: left;
`;

const MembershipCheckmark = styled.div`
    font-size: 8em;
    color: #30dd30;
    display: flex;
    align-items: center;
`;

const NoMembershipContainer = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
`;

const Container = styled.div`
    display: flex;
    justify-content: center;
`;

export const MembershipStatus = () => {
    const { data: membershipStatus, isLoading: isMembershipStatusLoading } = useMembershipStatus();
    const { client } = useAuth();

    return (
        <Skeleton loading={isMembershipStatusLoading}>
            <CenterBox centerVertically={false}>
                <Header1>Radar Event-medlemskap</Header1>
                <Container>
                    {membershipStatus ? (
                        <RadarEventInfoBox>
                            <MembershipCard>
                                <MembershipCheckmark>✓</MembershipCheckmark>
                                <MembershipCardUserInfo>
                                    <Header2>Medlem ut {new Date().getFullYear()}</Header2>
                                    <p>
                                        {client.user?.firstname} {client.user?.lastname}
                                    </p>
                                    <p>{client.user?.birthdate}</p>
                                    <p>{client.user?.address}</p>
                                    <p>{client.user?.postal_code}</p>
                                </MembershipCardUserInfo>
                            </MembershipCard>
                        </RadarEventInfoBox>
                    ) : (
                        <NoMembershipContainer>
                            <p>Ingen medlemskap ble funnet</p>
                        </NoMembershipContainer>
                    )}
                </Container>
                <RadarEventInfoBox>
                    <RadarEventInfo />
                </RadarEventInfoBox>
            </CenterBox>
        </Skeleton>
    );
};
