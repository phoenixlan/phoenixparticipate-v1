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
import { WarningBox } from '../../../sharedComponents/WarningBox';
import { dateOfBirthToAge } from '../../../utils/age';

const StyledShadowBox = styled(ShadowBox)`
    margin-bottom: ${({ theme }) => theme.spacing.xxl};
`;

export const TicketPurchase: React.FC = () => {
    const { client } = useAuth();
    const { data: currentEvent, isLoading } = useCurrentEvent();
    const dob = client.user?.birthdate ?? '';
    const age = dateOfBirthToAge(dob);
    const ageLimit = currentEvent?.age_limit_inclusive ?? -1;
    return (
        <Skeleton loading={isLoading}>
            <CenterBox>
                <Header1>Kjøp Billetter</Header1>
                {ageLimit !== -1 && age > ageLimit ? (
                    <WarningBox title="Du er for gammel">
                        <p>
                            Aldersgrensen for neste arrangement er til og med {ageLimit} år(Du er {age} år i våre
                            systemer). Du er eldre enn dette, og kan derfor ikke delta. Du har enda muligheten til å
                            kjøpe og overføre billetter til andre, da vi ofte ser at foreldre kjøper på vegne av
                            vennegjenger o.l. Spørsmål? Kontakt info@phoenixlan.no
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
