/*
 * @created 06/04/2021 - 16:37
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import React from 'react';
import { Header2 } from '../../../sharedComponents/Header2';
import styled from 'styled-components';
import { useSiteConfig } from '../../../hooks/api/useSiteConfig';
import { TextSkeleton } from '../../../sharedComponents/TextSkeleton';
import { Ticket } from '@styled-icons/entypo/Ticket';
import { Checklist } from '@styled-icons/octicons/Checklist';
import { Payments } from '@styled-icons/material-rounded/Payments';
import { CheckAll } from '@styled-icons/bootstrap/CheckAll';

const Container = styled.div`
    padding: ${({ theme }) => theme.spacing.m};
`;

const Steps = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    @media only screen and (min-width: 50em) {
        flex-direction: row;
        align-items: center;
    }
    justify-content: space-between;
`;

const Step = styled.div`
    display: flex;
    @media only screen and (min-width: 50em) {
        flex-direction: column;
        align-items: center;
    }

    @media only screen and (max-width: 50em) {
        padding: ${({ theme }) => theme.spacing.xs} 0 ${({ theme }) => theme.spacing.xs} 0;
    }
`;

const StepTextWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    @media only screen and (max-width: 50em) {
        margin-left: ${({ theme }) => theme.spacing.s};
    }
`;

const StepCounter = styled.div`
    margin-right: ${({ theme }) => theme.spacing.xxs};
`;

const StepText = styled.div`
    margin-bottom: ${({ theme }) => theme.spacing.m};
    text-align: center;
`;

const Step1 = styled(Step)``;

const Step2 = styled(Step)``;

const Step3 = styled(Step)``;

const Step4 = styled(Step)``;

const StyledTicket = styled(Ticket)`
    height: 4rem;

    @media screen and (max-width: ${({ theme }) => theme.media.smallTablet}) {
        height: 2.5rem;
    }
`;

const StyledCheckList = styled(Checklist)`
    height: 4rem;

    @media screen and (max-width: ${({ theme }) => theme.media.smallTablet}) {
        height: 2.5rem;
    }
`;

const StyledPayments = styled(Payments)`
    height: 4rem;

    @media screen and (max-width: ${({ theme }) => theme.media.smallTablet}) {
        height: 2.5rem;
    }
`;

const StyledCheckAll = styled(CheckAll)`
    height: 4rem;

    @media screen and (max-width: ${({ theme }) => theme.media.smallTablet}) {
        height: 2.5rem;
    }
`;

export const Tutorial: React.FC = () => {
    const { data: siteConfig } = useSiteConfig();
    const name = siteConfig?.name;
    const features = siteConfig?.features ?? [];
    return (
        <Container>
            <Header2>Slik kjøper du billett</Header2>
            <Steps>
                <Step1>
                    <StyledTicket />
                    <StepTextWrapper>
                        <StepCounter>1.</StepCounter>
                        <StepText>Velg antall</StepText>
                    </StepTextWrapper>
                </Step1>
                <Step2>
                    <StyledCheckList />
                    <StepTextWrapper>
                        <StepCounter>2.</StepCounter>
                        <StepText>Godkjenn regler og retningslinjer</StepText>
                    </StepTextWrapper>
                </Step2>
                <Step3>
                    <StyledPayments />
                    <StepTextWrapper>
                        <StepCounter>3.</StepCounter>
                        <StepText>Velg betalingsmetode</StepText>
                    </StepTextWrapper>
                </Step3>
                <Step4>
                    <StyledCheckAll />
                    <StepTextWrapper>
                        <StepCounter>4.</StepCounter>
                        <StepText>Bekreft / Betal</StepText>
                    </StepTextWrapper>
                </Step4>
            </Steps>
            <p>
                Når du har kjøpt billett får du den/de opp på siden &quot;Mine Billetter&quot;.{' '}
                {features.includes('seatmap')
                    ? 'Du velger plass etter at du har kjøpt billetten på "Plassreservering". '
                    : null}{' '}
                Alle som skal på {name ?? <TextSkeleton />} må ha en bruker med en tilknyttet billett.
            </p>
            <p>
                Det er mulig å kjøpe billetter på vegne av andre. Kjøp billetten(e) og overfør eierskap på siden
                &quot;Mine billetter&quot;.
            </p>
            <p>Det er kun mulig å kjøpe 10 billetter om gangen.</p>
        </Container>
    );
};
