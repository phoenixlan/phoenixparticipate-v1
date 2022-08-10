/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import styled, { css } from 'styled-components';
import { BaseButton, ButtonProps } from './BaseButton';
import React from 'react';

export const NegativeButton: React.FC<ButtonProps> = styled(BaseButton)(
    (props) => css`
        background-color: ${props.theme.colors.negative};
        color: ${props.theme.colors.White};
    `,
);
