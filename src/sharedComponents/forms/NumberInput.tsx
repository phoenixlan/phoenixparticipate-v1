/*
 * @created 31/03/2021 - 23:51
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import React, { useRef, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import styled from 'styled-components';

const InputContainer = styled.div<{ inFocus: boolean }>`
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    width: fit-content;
    border: 1px solid ${({ theme }) => theme.colors.SemiDarkGray};
    border-radius: ${({ theme }) => theme.borderRadius.m};
    transition: border-color 150ms ease, box-shadow 150ms ease;
    ${({ inFocus, theme }) =>
        inFocus &&
        `
        border-color: ${theme.colors.primary};
        box-shadow: 0 0 0 3px ${theme.colors.primary}22;
    `}
`;

const Input = styled.input`
    appearance: textfield;
    outline: 0;

    max-width: 5rem;
    padding: 0.5rem;
    border: none;
    font-size: ${({ theme }) => theme.fontSize.l};
    height: 3rem;
    font-weight: 600;
    text-align: center;
    background: transparent;

    &::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }
`;

const Button = styled.button`
    outline: none;
    -webkit-appearance: none;
    background-color: ${({ theme }) => theme.colors.LightGray};
    border: none;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    cursor: pointer;
    margin: ${({ theme }) => theme.spacing.xxs};
    position: relative;
    border-radius: ${({ theme }) => theme.borderRadius.s};
    transition: background-color 150ms ease;

    &:hover {
        background-color: ${({ theme }) => theme.colors.Gray};
    }

    &:before {
        display: inline-block;
        position: absolute;
        content: '';
        width: 0.75rem;
        height: 2px;
        background-color: ${({ theme }) => theme.colors.primary};
        transform: translate(-50%, -50%);
    }

    &:after {
        display: inline-block;
        position: absolute;
        content: '';
        width: 0.75rem;
        height: 2px;
        background-color: ${({ theme }) => theme.colors.primary};
        transform: translate(-50%, -50%);
    }
`;

const PlusButton = styled(Button)`
    &:after {
        transform: translate(-50%, -50%) rotate(90deg);
    }
`;

interface _Props {
    min: number;
    max: number;
    tabindex: number;
    value: number | string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const _NumberInput: React.FC<_Props> = ({ min, max, tabindex, value, onChange }) => {
    const [isFocused, setIsFocused] = useState(false);
    const ref = useRef<HTMLInputElement>(null);

    const setNativeValue = (element: HTMLInputElement, newValue: number) => {
        const descriptor = Object.getOwnPropertyDescriptor(element, 'value');
        const valueSetter = descriptor?.set;
        const prototype = Object.getPrototypeOf(element);
        const prototypeDescriptor = Object.getOwnPropertyDescriptor(prototype, 'value');
        const prototypeValueSetter = prototypeDescriptor?.set;

        if (valueSetter && prototypeValueSetter && valueSetter !== prototypeValueSetter) {
            prototypeValueSetter.call(element, newValue);
        } else if (valueSetter) {
            valueSetter.call(element, newValue);
        }
    };

    const createSyntheticEvent = (newValue: number) => {
        if (ref && ref.current) {
            setNativeValue(ref.current, newValue);
            ref.current.dispatchEvent(new Event('input', { bubbles: true }));
        }
    };

    const onPlusButtonClick = () => {
        let val = value;
        if (typeof val === 'string') {
            val = parseInt(val);
        }
        if (val < max) {
            createSyntheticEvent(val + 1);
        }
    };

    const onMinusButtonClick = () => {
        let val = value;
        if (typeof val === 'string') {
            val = parseInt(val);
        }
        if (val > min) {
            createSyntheticEvent(val - 1);
        }
    };

    const focus = () => {
        setIsFocused(true);
    };

    const blur = () => {
        setIsFocused(false);
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const code = e.key || e.keyCode;

        if (code === 8 || code === 'Backspace' || code === 45 || code === 'Del') {
            onMinusButtonClick();
        }
    };

    return (
        <InputContainer inFocus={isFocused} tabIndex={tabindex}>
            <PlusButton type="button" onFocus={focus} onBlur={blur} onClick={onPlusButtonClick} />
            <Input
                type="number"
                readOnly
                ref={ref}
                min={min}
                name="quantity"
                value={value}
                onFocus={focus}
                onBlur={blur}
                disabled={false}
                onChange={onChange}
                onKeyDown={onKeyDown}
                tabIndex={-1}
            />
            <Button type="button" onFocus={focus} onBlur={blur} onClick={onMinusButtonClick} />
        </InputContainer>
    );
};

interface Props {
    min?: number;
    max?: number;
    name: string;
    tabindex?: number;
}

export const NumberInput: React.FC<Props> = ({ min = 0, max = 10, tabindex = 1, name }) => {
    const { control } = useFormContext();

    return (
        <Controller
            control={control}
            name={name}
            render={({ onChange, value }) => (
                <_NumberInput min={min} max={max} value={value} onChange={onChange} tabindex={tabindex} />
            )}
        />
    );
};
