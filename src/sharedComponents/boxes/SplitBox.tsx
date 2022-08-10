/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import React from 'react';
import styled from 'styled-components';

import { ShadowBox } from './ShadowBox';

const Container = styled.div`
    display: flex;
    flex-direction: column;

    @media (min-width: ${({ theme }) => theme.media.tablet}) {
        flex-direction: row;
    }
`;

const Divider = styled.div`
    border: 1px groove ${({ theme }) => theme.colors.Gray};
    margin: ${({ theme }) => theme.spacing.xxs} ${({ theme }) => theme.spacing.xs};
    order: 2;
`;

const Left = styled.div`
    flex: 1;
    order: 3;

    @media (min-width: ${({ theme }) => theme.media.tablet}) {
        order: 1;
    }
`;

const Right = styled.div`
    flex: 1;
    order: 1;

    @media (min-width: ${({ theme }) => theme.media.tablet}) {
        order: 3;
    }
`;

interface Props {
    left: React.ReactNode;
    right: React.ReactNode;
}

export const SplitBox: React.FC<Props> = ({ left, right }) => {
    return (
        <ShadowBox>
            <Container>
                <Left>{left}</Left>
                <Divider />
                <Right>{right}</Right>
            </Container>
        </ShadowBox>
    );
};
