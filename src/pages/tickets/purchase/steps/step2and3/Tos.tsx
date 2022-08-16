/*
 * @created 05/04/2021 - 14:20
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { useTos } from '../../../../../hooks/api/useTos';
import styled from 'styled-components';
import { PrimaryButton } from '../../../../../sharedComponents/forms/Button';
import { Header2 } from '../../../../../sharedComponents/Header2';
import { LoadingSpinner } from '../../../../../sharedComponents/LoadingSpinner';

const Container = styled.form`
    overflow: auto;
    height: 100%;
    position: relative;
`;

const Markdown = styled.div`
    overflow: auto;
    margin-bottom: ${({ theme }) => theme.spacing.m};
`;

const Status = styled.div`
    text-align: center;
`;

interface Props {
    onAccept: () => void;
    showRules: boolean;
}

export const Tos: React.FC<Props> = ({ onAccept, showRules }) => {
    const { data, isLoading, isLoadingError } = useTos(showRules);
    const t = (e: React.FormEvent) => {
        e.preventDefault();
        onAccept();
    };
    return (
        <Container onSubmit={t}>
            {isLoading && (
                <Status>
                    <LoadingSpinner />
                </Status>
            )}
            {!isLoading && isLoadingError && (
                <Status>
                    <b>Noe gikk feil med innlasting av TOS.</b>
                </Status>
            )}
            {!isLoading && !isLoadingError && (
                <>
                    <Markdown>
                        <Header2>{showRules ? 'Arrangementsregler' : 'Betalingsvilkår'}</Header2>
                        <ReactMarkdown>{data ?? ''}</ReactMarkdown>
                    </Markdown>
                    <PrimaryButton fluid={true} disabled={isLoadingError || isLoading}>
                        Godta vilkår
                    </PrimaryButton>
                </>
            )}
        </Container>
    );
};
