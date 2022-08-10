/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import React from 'react';
import styled from 'styled-components';
import { CenterBox } from '../../sharedComponents/boxes/CenterBox';
import { FileSearch } from '@styled-icons/remix-line/FileSearch';

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`;

const ErrorIcon = styled(FileSearch)`
    color: ${({ theme }) => theme.colors.Gray};
`;

const ErrorMessage = styled.h1`
    color: ${({ theme }) => theme.colors.Gray};
    font-size: ${({ theme }) => theme.fontSize.xl};
`;

export const Error404: React.FC = () => {
    return (
        <CenterBox>
            <Container>
                <ErrorIcon size="10rem" />
                <ErrorMessage>Page Not Found</ErrorMessage>
            </Container>
        </CenterBox>
    );
};
