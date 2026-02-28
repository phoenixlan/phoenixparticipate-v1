import React from 'react';
import styled from 'styled-components';

export const FormLabel = styled.p`
    width: 100%;
    font-size: 0.875rem;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.Black};
    margin: ${({ theme }) => theme.spacing.s} 0 ${({ theme }) => theme.spacing.xxs} 0;
`;
