/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import React, { useState } from 'react';
import styled from 'styled-components';
import { DownArrow } from '@styled-icons/boxicons-solid/DownArrow';
import { UpArrow } from '@styled-icons/boxicons-solid/UpArrow';
import { User, Position, PositionMapping } from '@phoenixlan/phoenix.js';

import { ShadowBox } from '../../sharedComponents/boxes/ShadowBox';
import { useCrew } from '../../hooks/api/useCrew';
import { Header2 } from '../../sharedComponents/Header2';
import { PeoplePreview } from './PeoplePreview';
import { People } from './People';
import { useCrews } from '../../hooks/api/useCrews';
import { Skeleton } from '../../sharedComponents/Skeleton';
import { BasicUserWithExpandedPositionMappings, ExpandedPosition } from '../../utils/types';
import { useCurrentEvent } from '../../hooks';

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
    const {
        data: currentEvent,
        isLoading: isLoadingCurrentEvent,
        isLoadingError: isLoadingErrorEvent,
    } = useCurrentEvent();
    const isLoading = isLoadingCrew || isLoadingCrews || isLoadingCurrentEvent;
    const isLoadingError = isLoadingErrorCrew || isLoadingErrorCrews || isLoadingErrorEvent;
    const [expand, setExpand] = useState(_expand);
    const userMap: Map<string, User.BasicUserWithPositionMappings> = new Map();

    crew?.positions.forEach((position) => {
        position.position_mappings
            .filter(
                (position_mapping) =>
                    currentEvent &&
                    (position_mapping.event_uuid == null || position_mapping.event_uuid == currentEvent.uuid),
            )
            .forEach((positionMapping) => {
                const positionMappingWithPosition = {
                    position,
                    uuid: positionMapping.uuid,
                    user_uuid: positionMapping.user.uuid,
                    event_uuid: positionMapping.event_uuid,
                    created: positionMapping.created,
                };
                const user = positionMapping.user as User.BasicUserWithPositionMappings;
                if (userMap.has(user.uuid)) {
                    userMap.get(user.uuid)!.position_mappings.push(positionMappingWithPosition);
                } else {
                    user.position_mappings = [positionMappingWithPosition];
                    userMap.set(user.uuid, user);
                }
            });
    });

    // Re-add crew information for getTitles
    const users = Array.from(userMap.values()).map((user: User.BasicUserWithPositionMappings) => {
        const expandedUser = (user as unknown) as BasicUserWithExpandedPositionMappings;
        expandedUser.position_mappings = user.position_mappings.map((position_mapping) => {
            const position = position_mapping.position as ExpandedPosition;
            if (position.crew_uuid == crew?.uuid) {
                position.crew = crew;
            }
            if (position.team_uuid) {
                const team = crew?.teams.filter((team) => team.uuid == position.team_uuid);
                if (team) {
                    position.team = team[0];
                }
            }
            return position_mapping;
        });
        return user as BasicUserWithExpandedPositionMappings;
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
