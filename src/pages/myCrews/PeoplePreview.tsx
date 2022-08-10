/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import React, { useState } from 'react';
import styled from 'styled-components';
import { User } from '@phoenixlan/phoenix.js';
import { getAvatar } from '../../utils';

const Pictures = styled.div``;

const Picture = styled.img`
    object-fit: cover;
    width: 50px;
    height: 50px;
    border-radius: 100%;

    &:not(:last-child) {
        margin-right: ${({ theme }) => theme.spacing.s};
    }
`;

interface Props {
    users: Array<User.BasicUser>;
}

export const PeoplePreview: React.FC<Props> = ({ users }) => {
    return (
        <Pictures>
            {users.map((user) => (
                <Picture key={user.uuid} src={getAvatar(user, 'sd')} />
            ))}
        </Pictures>
    );
};
