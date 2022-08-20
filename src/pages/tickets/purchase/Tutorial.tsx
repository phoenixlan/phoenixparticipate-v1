/*
 * @created 06/04/2021 - 16:37
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import React from 'react';
import { Header2 } from '../../../sharedComponents/Header2';
import styled from 'styled-components';
import { Ticket } from '@styled-icons/entypo/Ticket';
import { Checklist } from '@styled-icons/octicons/Checklist';
import { Payments } from '@styled-icons/material-rounded/Payments';
import { CheckAll } from '@styled-icons/bootstrap/CheckAll';

const Container = styled.div`
    padding: ${({ theme }) => theme.spacing.m};
`;

const Steps = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`;

const Step = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const StepTextWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
`;

const StepCounter = styled.span`
    margin-right: ${({ theme }) => theme.spacing.xxs};
`;

const StepText = styled.span`
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
    return (
        <Container>
            <Header2>Slik kjøper du billett</Header2>
            <Steps>
                <Step1>
                    <StepTextWrapper>
                        <StepCounter>1.</StepCounter>
                        <StepText>Velg antall</StepText>
                    </StepTextWrapper>
                    <StyledTicket />
                </Step1>
                <Step2>
                    <StepTextWrapper>
                        <StepCounter>2.</StepCounter>
                        <StepText>Godkjenn regler og rettningslinjer</StepText>
                    </StepTextWrapper>
                    <StyledCheckList />
                </Step2>
                <Step3>
                    <StepTextWrapper>
                        <StepCounter>3.</StepCounter>
                        <StepText>Velg betalingsmetode</StepText>
                    </StepTextWrapper>
                    <StyledPayments />
                </Step3>
                <Step4>
                    <StepTextWrapper>
                        <StepCounter>4.</StepCounter>
                        <StepText>Bekreft / Betal</StepText>
                    </StepTextWrapper>
                    <StyledCheckAll />
                </Step4>
            </Steps>
            <p>
                Når du har kjøpt billett får du den/de opp på siden &quot;Mine Billetter&quot;. Du velger plass etter at
                du har kjøpt billetten på &quot;Plassreservering&quot;. Alle som skal på Phoenix LAN må ha en bruker med
                en tilknyttet billett.
            </p>
            <p>
                Det er mulig å kjøpe billetter på vegne av andre. Kjøp billetten(e) og overfør eierskap på siden
                &quot;Mine billetter&quot;.
            </p>
            <p>Det er kun mulig å kjøpe 10 billetter om gangen.</p>
        </Container>
    );
};
