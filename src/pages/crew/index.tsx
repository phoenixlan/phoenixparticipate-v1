/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import React from 'react';
import styled from 'styled-components';
import { Header2 } from '../../sharedComponents/Header2';
import { ApplicationForm } from './ApplicationForm';
import { CrewList } from './CrewList';
import { CenterBox } from '../../sharedComponents/boxes/CenterBox';
import { TabbedBox } from '../../sharedComponents/boxes/TabbedBox';
import { Applications } from './Applications';
import { useUserApplications } from '../../hooks/api/useUserApplications';
import { useCurrentEvent } from '../../hooks';
import { Skeleton } from '../../sharedComponents/Skeleton';

const Container = styled.div`
    box-shadow: ${({ theme }) => theme.shadow.default};
    border: 1px solid ${({ theme }) => theme.colors.Gray};
    padding: ${({ theme }) => theme.spacing.m};
    margin-bottom: ${({ theme }) => theme.spacing.xxxl};

    &:first-child {
        margin-top: ${({ theme }) => theme.spacing.xxxl};
    }
`;

export const Crew: React.FC = () => {
    const {
        data: applications,
        isLoading: isLoadingApplications,
        isLoadingError: isLoadingApplicationsError,
    } = useUserApplications();
    const {
        data: currentEvent,
        isLoading: isLoadingCurrentEvent,
        isLoadingError: isLoadingCurrentEventError,
    } = useCurrentEvent();
    const isLoading = isLoadingApplications || isLoadingCurrentEvent;
    const isLoadingError = isLoadingApplicationsError || isLoadingCurrentEventError;
    const currentApplications = applications?.filter((application) => application.event_uuid === currentEvent?.uuid);
    const oldApplications = applications?.filter((application) => application.event_uuid !== currentEvent?.uuid);

    return (
        <CenterBox centerVertically={true}>
            <Container>
                <Header2>Søknader</Header2>
                <TabbedBox titles={['Aktive søknader', 'Tidligere søknader']}>
                    <Skeleton loading={isLoading}>
                        <Applications applications={currentApplications ?? []} />
                    </Skeleton>
                    <Skeleton loading={isLoading}>
                        <Applications applications={oldApplications ?? []} />
                    </Skeleton>
                </TabbedBox>
            </Container>
            <Container>
                <Header2>Ny søknad</Header2>
                <ApplicationForm />
            </Container>
            <Container>
                <Header2>Crew</Header2>
                <CrewList />
            </Container>
        </CenterBox>
    );
};
