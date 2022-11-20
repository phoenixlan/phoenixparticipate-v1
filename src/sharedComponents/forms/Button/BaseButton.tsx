/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import * as React from 'react';
import { ButtonHTMLAttributes } from 'react';
import styled, { css, SimpleInterpolation } from 'styled-components';

import { LoadingSpinner } from '../../LoadingSpinner';

type ButtonSize = 'large' | 'medium' | 'small';

const BUTTON_SIZES: Record<ButtonSize, SimpleInterpolation> = {
    large: css`
        height: 3.75rem;
        min-width: 11.75rem;
    `,
    medium: css`
        height: 3rem;
        min-width: 9.5rem;
    `,
    small: css`
        height: 2.5rem;
        min-width: 7rem;
    `,
};

interface StyledButtonProps {
    size: ButtonSize;
    fluid?: boolean;
}

const Button = styled.button<StyledButtonProps>`
    position: relative;
    cursor: pointer;
    border: none;
    font-weight: normal;
    font-size: ${({ theme }) => theme.fontSize.m};
    padding: ${({ theme }) => theme.spacing.nil} ${({ theme }) => theme.spacing.m};
    border-radius: ${({ theme }) => theme.spacing.xxs};
    ${(props) => BUTTON_SIZES[props.size]}
    ${(props) => props.fluid && 'width: 100%; flex-grow: 1;'}
    
    &:disabled span {
        opacity: 0.6;
    }
`;

const Content = styled.span<{ isHidden: boolean }>`
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;

    ${({ isHidden }) => isHidden && '&&& { opacity: 0; }'}
`;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    size?: ButtonSize;
    fluid?: boolean;
    isLoading?: boolean;
}

export const BaseButton: React.FC<ButtonProps> = ({ size = 'medium', isLoading = false, children, ...rest }) => (
    <Button size={size} disabled={isLoading} {...rest}>
        <Content isHidden={isLoading}>{children}</Content>
        {isLoading ? <LoadingSpinner /> : null}
    </Button>
);
