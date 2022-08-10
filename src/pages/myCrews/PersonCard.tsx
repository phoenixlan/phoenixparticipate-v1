/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import React from 'react';
import styled from 'styled-components';
import { User } from '@phoenixlan/phoenix.js';
import { getAvatar, getTitles } from '../../utils';

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

export const PersonCard: React.FC<User.BasicUserWithPositions> = (props) => {
    return (
        <Card>
            <Top>
                <CoverPicture src={getAvatar(props, 'hd')} />
                <Picture src={getAvatar(props, 'hd')} />
            </Top>
            <Bottom>
                <Name>{`${props.firstname} ${props.lastname}`}</Name>
                <Title>{getTitles(props)}</Title>
            </Bottom>
        </Card>
    );
};
