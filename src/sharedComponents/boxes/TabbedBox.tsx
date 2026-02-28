/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import React, { useState } from 'react';
import styled from 'styled-components';

const Box = styled.div``;

const Tabs = styled.div`
    display: flex;
    align-items: center;
    height: 50px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.Gray};
    gap: ${({ theme }) => theme.spacing.xxs};
    padding: 0 ${({ theme }) => theme.spacing.xs};
`;

const Tab = styled.div<{ selected: boolean }>`
    flex: 1;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-weight: ${({ selected }) => (selected ? '600' : '400')};
    color: ${({ theme, selected }) => (selected ? theme.colors.Black : theme.colors.DarkGray)};
    border-bottom: 2px solid ${({ theme, selected }) => (selected ? theme.colors.primary : 'transparent')};
    transition: color 150ms ease, border-color 150ms ease;

    &:hover {
        color: ${({ theme }) => theme.colors.Black};
    }
`;

const TabContent = styled.div`
    padding: ${({ theme }) => theme.spacing.xs};
`;

interface Props {
    titles: Array<string>;
}

export const TabbedBox: React.FC<Props> = ({ children, titles }) => {
    const [selectedTab, setSelectedTab] = useState(0);

    const childArray = React.Children.toArray(children);
    if (titles.length !== childArray.length) {
        throw new Error('TabbedBox needs as many children as titles');
    }

    return (
        <Box>
            <Tabs>
                {titles.map((title, i) => (
                    <Tab key={`title: ${title}`} selected={i == selectedTab} onClick={() => setSelectedTab(i)}>
                        {title}
                    </Tab>
                ))}
            </Tabs>
            <TabContent>{childArray[selectedTab]}</TabContent>
        </Box>
    );
};
