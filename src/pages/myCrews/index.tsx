/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { User, PositionMapping } from '@phoenixlan/phoenix.js';

import { CenterBox } from '../../sharedComponents/boxes/CenterBox';
import { useAuth } from '../../authentication/useAuth';
import { CrewCard } from './CrewCard';
import { Header2 } from '../../sharedComponents/Header2';
import { notEmpty } from '../../utils';
import { Header1 } from '../../sharedComponents/Header1';
import { useCurrentUser } from '../../hooks/api/useCurrentUser';
import { useCurrentEvent } from '../../hooks';
import { Skeleton } from '../../sharedComponents/Skeleton';

const Empty = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const positionMappingsToCrewUuidList = (mappings: Array<PositionMapping.PositionFacingPositionMapping>) => {
    const mappings_tmp = mappings
        .map((mapping) => mapping.position)
        .map((position) => position.crew_uuid)
        .filter(notEmpty);

    return mappings_tmp.filter((uuid, index) => mappings_tmp.indexOf(uuid) === index);
};

export const MyCrew: React.FC = () => {
    const { client } = useAuth();
    const { data: currentUser, isLoading: isLoadingCurrentUser } = useCurrentUser();
    const { data: currentEvent, isLoading: isLoadingCurrentEvents } = useCurrentEvent();

    const isLoading = isLoadingCurrentEvents || isLoadingCurrentUser;

    const current_mappings = currentEvent
        ? (currentUser?.position_mappings ?? []).filter(
              (mapping: PositionMapping.PositionFacingPositionMapping) =>
                  mapping.event_uuid == null || mapping.event_uuid == currentEvent.uuid,
          )
        : [];

    const current_crews: Array<string> = positionMappingsToCrewUuidList(current_mappings);

    return (
        <Skeleton loading={isLoading}>
            <CenterBox size="large" centerVertically={false}>
                <Header1>Mine verv</Header1>
                {current_crews.length === 0 && (
                    <Empty>
                        <Header2>Du har ingen verv/tilhørighet til en gruppe hos Phoenix LAN for øyeblikket.</Header2>
                        <Link to="/crew">Søk her!</Link>
                    </Empty>
                )}
                {current_crews.map((crew, i) => (
                    <CrewCard key={crew} crewUuid={crew} _expand={i === 0} />
                ))}
            </CenterBox>
        </Skeleton>
    );
};
