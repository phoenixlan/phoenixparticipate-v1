/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import React from 'react';
import styled from 'styled-components';
import { useFormContext } from 'react-hook-form';
import { ErrorMessage } from './ErrorMessage';
import { useCrews } from '../../hooks/api/useCrews';

const Wrapper = styled.div`
    width: 100%;
    margin-bottom: ${({ theme }) => theme.spacing.m};
`;

const Select = styled.select`
    width: 100%;
    height: 30px;

    @media (max-width: ${({ theme }) => theme.media.smallTablet}) {
        font-size: ${({ theme }) => theme.fontSize.M};
    }
`;

interface Props {
    onlyActive?: boolean;
    onlyApplyable?: boolean;
}

export const CrewSelect: React.FC<Props> = ({ onlyActive, onlyApplyable }) => {
    const { data, isLoading, isLoadingError } = useCrews();
    const crews = data
        ?.filter((crew) => (onlyActive ? crew.active : true))
        .filter((crew) => (onlyApplyable ? crew.is_applyable : true));

    const { register } = useFormContext();

    return (
        <Wrapper>
            <Select name="selectedCrew" ref={register} disabled={isLoading || isLoadingError} defaultValue="">
                <option value="" disabled>
                    {(isLoading && 'Loading...') || (isLoadingError && 'Failed to load crew') || 'Select Crew'}
                </option>
                {crews?.map((crew) => (
                    <option value={crew.uuid} key={crew.uuid}>
                        {crew.name}
                    </option>
                ))}
            </Select>
            <ErrorMessage name="selectedCrew" />
        </Wrapper>
    );
};
