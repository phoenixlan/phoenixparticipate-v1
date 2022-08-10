/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { PrimaryButton } from '../../sharedComponents/forms/Button';
import { User } from '@phoenixlan/phoenix.js';
import { useAuth } from '../../authentication/useAuth';

const Container = styled.form`
    width: 100%;
    height: 100%;
    padding: ${({ theme }) => theme.spacing.m};
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const LoginForm: React.FC = () => {
    const { client } = useAuth();

    const onSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        client.login();
    };

    return (
        <Container onSubmit={onSubmit}>
            <PrimaryButton type="submit">Login</PrimaryButton>
        </Container>
    );
};
