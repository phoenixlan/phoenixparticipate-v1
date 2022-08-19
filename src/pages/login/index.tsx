/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import React from 'react';

import { CenterBox } from '../../sharedComponents/boxes/CenterBox';
import { SplitBox } from '../../sharedComponents/boxes/SplitBox';
import { NextLanInformation } from './NextLanInformation';
import { LoginForm } from './LoginForm';
import { LoginDisclaimer } from './Disclaimer';
import { Header1 } from '../../sharedComponents/Header1';

export const Login: React.FC = () => {
    return (
        <CenterBox centerVertically={true}>
            <Header1>Login - Tickets</Header1>
            <SplitBox left={<NextLanInformation />} right={<LoginForm />} />
            <LoginDisclaimer />
        </CenterBox>
    );
};
