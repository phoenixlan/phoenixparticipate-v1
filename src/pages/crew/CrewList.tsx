import React, { useState } from 'react';
import { useCrews } from '../../hooks/api/useCrews';
import styled from 'styled-components';

interface CrewEntryProps {
    marginColor: string;
}
const CrewEntry = styled.div<CrewEntryProps>`
    border-left: 0.25em solid ${(props) => props.marginColor};
    padding-left: 1em;
`;

export const CrewList: React.FC = () => {
    const { data: crews } = useCrews();
    return (
        <>
            {crews?.map((crew) => (
                <CrewEntry marginColor={crew.hex_color} key={crew.uuid}>
                    <h2>{crew.name}</h2>
                    <p>{crew.description}</p>
                    {!crew.is_applyable ? (
                        <p>
                            <b>Kan ikke søkes til - du må ofte ha erfaring med LANet for å bli invitert hit</b>
                        </p>
                    ) : null}
                </CrewEntry>
            ))}
        </>
    );
};
