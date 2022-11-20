/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { CenterBox } from '../../sharedComponents/boxes/CenterBox';
import { useAuth } from '../../authentication/useAuth';
import { CrewCard } from './CrewCard';
import { Header2 } from '../../sharedComponents/Header2';
import { notEmpty } from '../../utils';
import { Header1 } from '../../sharedComponents/Header1';
import { useCurrentUser } from '../../hooks/api/useCurrentUser';

const Empty = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const MyCrew: React.FC = () => {
    const { client } = useAuth();
    const { data: currentUser, isLoading } = useCurrentUser();

    const crews: Array<string> = currentUser?.positions.map((position) => position.crew_uuid).filter(notEmpty) ?? [];

    return (
        <CenterBox size="large" centerVertically={false}>
            <Header1>My Crews</Header1>
            {crews.length === 0 && (
                <Empty>
                    <Header2>No crews found - You are not part of a crew</Header2>
                    <Link to="/crew">Apply here</Link>
                </Empty>
            )}
            {crews.map((crew, i) => (
                <CrewCard key={crew} crewUuid={crew} _expand={i === 0} />
            ))}
        </CenterBox>
    );
};
