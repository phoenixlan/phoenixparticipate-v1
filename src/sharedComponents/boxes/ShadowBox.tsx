/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import React from 'react';
import styled from 'styled-components';

const Box = styled.div`
    box-shadow: ${({ theme }) => theme.shadow.default};
    border-radius: ${({ theme }) => theme.spacing.xxs};
`;

interface Props {
    className?: string;
}

export const ShadowBox: React.FC<Props> = ({ children, className }) => {
    return <Box className={className}>{children}</Box>;
};
