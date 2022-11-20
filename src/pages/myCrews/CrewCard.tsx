/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import React, { useState } from 'react';
import styled from 'styled-components';
import { DownArrow } from '@styled-icons/boxicons-solid/DownArrow';
import { UpArrow } from '@styled-icons/boxicons-solid/UpArrow';
import { User, Position } from '@phoenixlan/phoenix.js';

import { ShadowBox } from '../../sharedComponents/boxes/ShadowBox';
import { useCrew } from '../../hooks/api/useCrew';
import { Header2 } from '../../sharedComponents/Header2';
import { PeoplePreview } from './PeoplePreview';
import { People } from './People';
import { useCrews } from '../../hooks/api/useCrews';
import { Skeleton } from '../../sharedComponents/Skeleton';
import { BasicUserWithExpandedPositions } from '../../utils/types';

const StyledShadowBox = styled(ShadowBox)`
    margin-bottom: ${({ theme }) => theme.spacing.xxxl};
`;

const Padding = styled.div`
    padding: ${({ theme }) => theme.spacing.s};
`;

const Header = styled.div`
    position: relative;
`;

const StyledHeader2 = styled(Header2)`
    margin-right: 2rem;
`;

const PreviewSelector = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 100%;
    width: 1.5rem;
    height: 1.5rem;
    background-color: ${({ theme }) => theme.colors.secondary};
    position: absolute;
    top: 0;
    right: 0;
    cursor: pointer;
`;

const StyledDownArrow = styled(DownArrow)`
    fill: ${({ theme }) => theme.colors.primary};
`;

const StyledUpArrow = styled(UpArrow)`
    fill: ${({ theme }) => theme.colors.primary};
`;

interface Props {
    crewUuid: string;
    _expand?: boolean;
}

export const CrewCard: React.FC<Props> = ({ crewUuid, _expand = false }) => {
    const { data: crew, isLoading: isLoadingCrew, isLoadingError: isLoadingErrorCrew } = useCrew(crewUuid);
    const { data: crews, isLoading: isLoadingCrews, isLoadingError: isLoadingErrorCrews } = useCrews();
    const isLoading = isLoadingCrew || isLoadingCrews;
    const isLoadingError = isLoadingErrorCrew || isLoadingErrorCrews;
    const [expand, setExpand] = useState(_expand);
    const userMap: Map<string, User.BasicUserWithPositions> = new Map();

    crew?.positions.forEach((position) => {
        position.users.forEach((user) => {
            const basicPosition = {
                ...position,
                crew: crews?.find((crew) => crew.uuid === position.crew_uuid)?.name,
                team: crew.teams.find((team) => team.uuid === position.team_uuid)?.name,
                users: position.users.map((user) => user.uuid),
            };

            if (userMap.has(user.uuid)) {
                userMap.get(user.uuid)!.positions.push(basicPosition);
            } else {
                user.positions = [basicPosition];
                userMap.set(user.uuid, user);
            }
        });
    });

    // Re-add crew information for getTitles
    const users = Array.from(userMap.values()).map((user: BasicUserWithExpandedPositions) => {
        user.positions = user.positions.map((position) => {
            if (position.crew_uuid == crew?.uuid) {
                position.crew = crew;
            }
            if (position.team_uuid) {
                const team = crew?.teams.filter((team) => team.uuid == position.team_uuid);
                if (team) {
                    position.team = team[0];
                }
            }
            return position;
        });
        return user;
    });

    const onPreviewClick = () => {
        setExpand(!expand);
    };

    return (
        <StyledShadowBox>
            <Padding>
                <Header>
                    <Skeleton loading={isLoading}>
                        <StyledHeader2 center={false}>{isLoading ? 'placeholder' : crew?.name}</StyledHeader2>
                    </Skeleton>
                    <PreviewSelector onClick={onPreviewClick}>
                        {expand ? <StyledUpArrow size="1rem" /> : <StyledDownArrow size="1rem" />}
                    </PreviewSelector>
                </Header>
                <Skeleton loading={isLoading}>
                    {expand ? <People people={users} /> : <PeoplePreview users={users} />}
                </Skeleton>
            </Padding>
        </StyledShadowBox>
    );
};
