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
import { useDiscordMapping } from '../../hooks/api/useDiscordMapping';
import { useCurrentEvent } from '../../hooks';
import { Skeleton } from '../../sharedComponents/Skeleton';
import { dateOfBirthToAge } from '../../utils/age';
import { useAuth } from '../../authentication/useAuth';
import { WarningBox } from '../../sharedComponents/NoticeBox';
import { InfoBox } from '../../sharedComponents/NoticeBox';
import { Link, useHistory } from 'react-router-dom';
import { BaseButton } from '../../sharedComponents/forms/Button/BaseButton';
import { PositiveButton } from '../../sharedComponents/forms/Button';

const Container = styled.div`
    box-shadow: ${({ theme }) => theme.shadow.default};
    border: 1px solid ${({ theme }) => theme.colors.Gray};
    padding: ${({ theme }) => theme.spacing.m};
    margin-bottom: ${({ theme }) => theme.spacing.xxxl};

    &:first-child {
        margin-top: ${({ theme }) => theme.spacing.xxxl};
    }
`;

const Center = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
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

    const { client } = useAuth();

    const {
        data: discordMapping,
        isLoading: isLoadingDiscordMapping,
        isLoadingError: isLoadingDiscordMappingError,
    } = useDiscordMapping(client.user!.uuid);

    const history = useHistory();

    const isLoading = isLoadingApplications || isLoadingCurrentEvent || isLoadingDiscordMapping;
    const isLoadingError = isLoadingApplicationsError || isLoadingCurrentEventError || isLoadingDiscordMappingError;
    const currentApplications = applications?.filter((application) => application.event_uuid === currentEvent?.uuid);
    const oldApplications = applications?.filter((application) => application.event_uuid !== currentEvent?.uuid);

    const dob = client.user?.birthdate ?? '';
    const age = dateOfBirthToAge(dob);
    const ageLimit = currentEvent?.age_limit_inclusive ?? -1;

    return (
        <Skeleton loading={isLoadingDiscordMapping}>
            <CenterBox centerVertically={true}>
                {ageLimit > 0 && age > ageLimit ? (
                    <WarningBox title="Du er for gammel">
                        <p>
                            Aldersgrensen for neste arrangement er til og med {ageLimit} år(Du er {age} år i våre
                            systemer). Du kan søke, men du vil mest sannsynlig bli avslått. Spørsmål? Kontakt
                            info@phoenixlan.no
                        </p>
                    </WarningBox>
                ) : null}
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
                {!discordMapping ? (
                    <InfoBox title="Koble til Discord?">
                        <p>
                            Ved å koble til Discord-kontoen din kan vi automatisk gi deg tilgang til eksklusive
                            gruppe-kanaler på Discord-serveren våres dersom du blir tatt opp. Om du ikke vil, gjerne
                            fortell oss i søknaden hvilke andre steder vi kan nå deg.
                        </p>
                        <Center>
                            <PositiveButton
                                onClick={() => {
                                    history.push('/third_party_mapping');
                                }}
                            >
                                Koble til Discord
                            </PositiveButton>
                        </Center>
                    </InfoBox>
                ) : null}
                <Container>
                    <Header2>Ny søknad</Header2>
                    {client.user?.avatar_uuid ? (
                        <ApplicationForm />
                    ) : (
                        <>
                            <p>
                                Du må laste opp en avatar før du søker, slik at det er lettere for chief å kjenne deg
                                igjen. Avatarer blir også brukt for crewkort.
                            </p>
                            <Center>
                                <PositiveButton
                                    onClick={() => {
                                        history.push('/avatar');
                                    }}
                                >
                                    Last opp avatar
                                </PositiveButton>
                            </Center>
                        </>
                    )}
                </Container>
                <Container>
                    <Header2>Grupper</Header2>
                    <CrewList />
                </Container>
            </CenterBox>
        </Skeleton>
    );
};
