import React from 'react';
import styled from 'styled-components';
import { useFormContext } from 'react-hook-form';
import { ErrorMessage } from './ErrorMessage';

const Wrapper = styled.div`
    width: 100%;
    margin-bottom: ${({ theme }) => theme.spacing.m};
`;

const StyledInput = styled.input`
    width: 100%;
    padding: ${({ theme }) => theme.spacing.s};
    border: 1px solid ${({ theme }) => theme.colors.SemiDarkGray};
    border-radius: ${({ theme }) => theme.borderRadius.m};
    font-size: ${({ theme }) => theme.fontSize.m};
    font-family: inherit;
    transition: border-color ${({ theme }) => theme.transition.default},
        box-shadow ${({ theme }) => theme.transition.default};

    &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.colors.primary};
        box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}22;
    }

    @media (max-width: ${({ theme }) => theme.media.smallTablet}) {
        font-size: ${({ theme }) => theme.fontSize.M};
    }
`;

interface Props {
    name: string;
    type?: string;
    autoComplete?: string;
}

export const TextInput: React.FC<Props> = ({ name, type = 'text', autoComplete }) => {
    const { register } = useFormContext();

    return (
        <Wrapper>
            <StyledInput ref={register} name={name} type={type} autoComplete={autoComplete} />
            <ErrorMessage name={name} />
        </Wrapper>
    );
};
