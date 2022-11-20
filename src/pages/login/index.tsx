/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import React from 'react';
import styled from 'styled-components';

import { CenterBox } from '../../sharedComponents/boxes/CenterBox';
import { SplitBox } from '../../sharedComponents/boxes/SplitBox';
import { NextLanInformation } from './NextLanInformation';
import { LoginForm } from './LoginForm';
import { LoginDisclaimer } from './Disclaimer';
import { Header1 } from '../../sharedComponents/Header1';
import Logo from '../../assets/logo.svg';

const StyledLogo = styled(Logo)`
    height: 20em;
`;
const StyledLogoContainer = styled.div`
    display: flex;
    justify-content: center;
`;

export const Login: React.FC = () => {
    return (
        <CenterBox centerVertically={true}>
            <StyledLogoContainer>
                <StyledLogo />
            </StyledLogoContainer>
            <SplitBox left={<NextLanInformation />} right={<LoginForm />} />
            <LoginDisclaimer />
        </CenterBox>
    );
};
