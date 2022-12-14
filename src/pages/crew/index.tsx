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
    const currentApplications = applications?.filter((application) => application.event.uuid === currentEvent?.uuid);
    const oldApplications = applications?.filter((application) => application.event.uuid !== currentEvent?.uuid);

    const dob = client.user?.birthdate ?? '';
    const age = dateOfBirthToAge(dob);
    const ageLimit = currentEvent?.crew_age_limit_inclusive ?? -1;

    return (
        <Skeleton loading={isLoadingDiscordMapping}>
            <CenterBox centerVertically={true}>
                {ageLimit > 0 && age > ageLimit ? (
                    <WarningBox title="Du er for gammel">
                        <p>
                            Aldersgrensen for ?? delta som crew p?? neste arrangement er til og med {ageLimit} ??r (Du er{' '}
                            {age} ??r i v??re systemer). Det gj??res noen ganger unntak for s??regne situasjoner der
                            spesiell kompetanse trengs. Du kan s??ke, men du vil mest sannsynlig bli avsl??tt.
                            <br />
                            Sp??rsm??l? Kontakt info@phoenixlan.no
                        </p>
                    </WarningBox>
                ) : null}
                <Container>
                    <Header2>S??knader</Header2>
                    <TabbedBox titles={['Aktive s??knader', 'Tidligere s??knader']}>
                        <Skeleton loading={isLoading}>
                            <Applications applications={currentApplications ?? []} />
                        </Skeleton>
                        <Skeleton loading={isLoading}>
                            <Applications applications={oldApplications ?? []} showEvent={true} />
                        </Skeleton>
                    </TabbedBox>
                </Container>
                {!discordMapping ? (
                    <InfoBox title="Koble til Discord?">
                        <p>
                            Ved ?? koble til Discord-kontoen din kan vi automatisk gi deg tilgang til eksklusive
                            gruppe-kanaler p?? Discord-serveren v??res dersom du blir tatt opp. Om du ikke vil, gjerne
                            fortell oss i s??knaden hvilke andre steder vi kan n?? deg.
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
                    <Header2>Ny s??knad</Header2>
                    {client.user?.avatar_uuid ? (
                        <ApplicationForm />
                    ) : (
                        <>
                            <p>
                                Du m?? laste opp en avatar f??r du s??ker, slik at det er lettere for chief ?? kjenne deg
                                igjen. Avatarer blir ogs?? brukt for crewkort.
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
