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

const StyledShadowBox = styled(ShadowBox)`
    margin-bottom: ${({ theme }) => theme.spacing.xxl};
`;

export const TicketPurchase: React.FC = () => {
    return (
        <CenterBox>
            <Header1>Kjøp Billetter</Header1>
            <StyledShadowBox>
                <Tutorial />
            </StyledShadowBox>
            <Form />
        </CenterBox>
    );
};
