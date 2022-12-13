/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import React from 'react';
import styled from 'styled-components';
import { User, Crew } from '@phoenixlan/phoenix.js';
import { getAvatar, getTitles } from '../../utils';
import { useCrews } from '../../hooks/api/useCrews';
import { BasicUserWithExpandedPositionMappings } from '../../utils/types';

const Card = styled.div`
    width: 200px;
    margin: ${({ theme }) => theme.spacing.xs};
    border-radius: 0.5rem;
    box-shadow: ${({ theme }) => theme.shadow.lowKey};
`;

const Top = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    position: relative;
`;

const CoverPicture = styled.img`
    object-fit: cover;
    width: 100%;
    height: 100%;
`;

const Picture = styled.img`
    object-fit: cover;
    width: 50px;
    height: 50px;
    border-radius: 100%;
    position: absolute;
    bottom: -25px;
`;

const Bottom = styled.div`
    min-height: 50px;
    padding-top: 25px;
    display: flex;
    flex-direction: column;
`;

const Name = styled.h3`
    text-align: center;
    margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const Title = styled.h4`
    text-align: center;
    margin-top: 0;
    color: ${({ theme }) => theme.colors.DarkGray};
    font-size: ${({ theme }) => theme.fontSize.s};
`;

interface PersonCardProps {
    user: BasicUserWithExpandedPositionMappings;
}

export const PersonCard: React.FC<PersonCardProps> = ({ user }) => {
    return (
        <Card>
            <Top>
                <CoverPicture src={getAvatar(user, 'sd')} />
                <Picture src={getAvatar(user, 'sd')} />
            </Top>
            <Bottom>
                <Name>{`${user.firstname} ${user.lastname}`}</Name>
                <Title>{getTitles(user)}</Title>
            </Bottom>
        </Card>
    );
};
