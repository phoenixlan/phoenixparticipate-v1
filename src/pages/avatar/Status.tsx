/*
 * @created 29/03/2021 - 13:02
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import React from 'react';
import { useAuth } from '../../authentication/useAuth';
import styled from 'styled-components';
import { getAvatar } from '../../utils';
import { Avatar } from '@phoenixlan/phoenix.js';

const Container = styled.div`
    padding: ${({ theme }) => theme.spacing.m};
    display: flex;
    flex-direction: column;
`;

const B = styled.b`
    margin-bottom: ${({ theme }) => theme.spacing.m};
`;

const Img = styled.img`
    max-width: 100%;
`;

interface StatusProps {
    avatar: Avatar.Avatar;
}

export const Status: React.FC<StatusProps> = ({ avatar }) => {
    const { client } = useAuth();

    const getAvatarStatus = (avatarState: Avatar.AvatarState) => {
        let status = 'Status: ';
        switch (avatarState) {
            case 'AvatarState.accepted':
                status += 'Godkjent';
                break;
            case 'AvatarState.rejected':
                status += 'Avvist';
                break;
            case 'AvatarState.uploaded':
                status += 'Venter på godkjenning';
                break;
        }
        return status;
    };

    return (
        <Container>
            <B>{avatar?.state && getAvatarStatus(avatar?.state)}</B>
            <Img src={client.user && getAvatar(client.user, 'hd')} />
        </Container>
    );
};
