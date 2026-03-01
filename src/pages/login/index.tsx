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
import { useSiteConfig } from '../../hooks/api/useSiteConfig';

const StyledLogoImg = styled.img`
    height: 20em;
`;
const StyledLogoContainer = styled.div`
    display: flex;
    justify-content: center;
`;

export const Login: React.FC = () => {
    const { data: siteConfig } = useSiteConfig();
    const logoUrl = siteConfig?.logo ? `${process.env.BASE_URL}/${siteConfig.logo}` : null;

    return (
        <CenterBox centerVertically={true}>
            {logoUrl && (
                <StyledLogoContainer>
                    <StyledLogoImg src={logoUrl} />
                </StyledLogoContainer>
            )}
            <SplitBox left={<NextLanInformation />} right={<LoginForm />} />
            <LoginDisclaimer />
        </CenterBox>
    );
};
