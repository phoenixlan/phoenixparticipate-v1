/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import * as React from 'react';
import styled from 'styled-components';
import { ErrorMessage as HookformErrorMessage } from '@hookform/error-message';

const StyledError = styled.span`
    color: ${(props) => props.theme.colors.negative};
    display: flex;
    flex-wrap: wrap;
    font-size: ${({ theme }) => theme.spacing.s};
    max-width: fit-content;
`;

export const ErrorMessage: React.FC<React.ComponentPropsWithoutRef<typeof HookformErrorMessage>> = ({
    name,
    ...rest
}) => <HookformErrorMessage name={name} as={StyledError} {...rest} />;
