/*
 * @created 31/03/2021 - 23:30
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import React from 'react';
import styled from 'styled-components';
import { Form } from './Form';
import { CenterBox } from '../../../sharedComponents/boxes/CenterBox';
import { ShadowBox } from '../../../sharedComponents/boxes/ShadowBox';
import { Header1 } from '../../../sharedComponents/Header1';
import { Tutorial } from './Tutorial';
import { useAuth } from '../../../authentication/useAuth';
import { useCurrentEvent } from '../../../hooks';
import { Skeleton } from '../../../sharedComponents/Skeleton';
import { WarningBox } from '../../../sharedComponents/NoticeBox';
import { dateOfBirthToAge } from '../../../utils/age';
import { useSiteConfig } from '../../../hooks/api/useSiteConfig';
import { TextSkeleton } from '../../../sharedComponents/TextSkeleton';

const StyledShadowBox = styled(ShadowBox)`
    margin-bottom: ${({ theme }) => theme.spacing.xxl};
`;

export const TicketPurchase: React.FC = () => {
    const { client } = useAuth();
    const { data: siteConfig } = useSiteConfig();
    const { data: currentEvent, isLoading } = useCurrentEvent();
    const dob = client.user?.birthdate ?? '';
    const age = dateOfBirthToAge(dob);
    const ageLimit = currentEvent?.participant_age_limit_inclusive ?? -1;
    const crewAgeLimit = currentEvent?.crew_age_limit_inclusive ?? -1;

    return (
        <Skeleton loading={isLoading}>
            <CenterBox>
                <Header1>Kjøp Billetter</Header1>
                {ageLimit !== -1 && age > ageLimit ? (
                    <WarningBox title="Du er for gammel">
                        <p>
                            Aldersgrensen for å delta på neste arrangement er til og med {ageLimit} år. Du er eldre enn
                            dette({age} år i våre systemer), og kan derfor ikke delta. Du har enda muligheten til å
                            kjøpe og overføre billetter til andre, da vi ofte ser at foreldre kjøper på vegne av
                            vennegjenger o.l. Du kan ikke bruke billetten selv.
                            {crewAgeLimit != -1
                                ? ` Aldersgrensen for å søke crew er ${crewAgeLimit}. `
                                : ' Det er ikke en aldersgrense på å søke crew - prøve det i stedet? '}
                            <br />
                            Spørsmål? Kontakt {siteConfig?.contact ?? <TextSkeleton />}
                        </p>
                    </WarningBox>
                ) : null}
                <StyledShadowBox>
                    <Tutorial />
                </StyledShadowBox>
                <Form />
            </CenterBox>
        </Skeleton>
    );
};
