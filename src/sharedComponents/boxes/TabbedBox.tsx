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
    background-color: ${({ theme }) => theme.colors.Gray};
    border-radius: 0.5rem 0.5rem 0 0;
`;

const Tab = styled.div<{ selected: boolean }>`
    flex: 1;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    ${({ theme, selected }) => selected && `background-color: ${theme.colors.DarkGray};`}
    ${({ theme, selected }) => !selected && `border: 1px solid ${theme.colors.DarkGray};`}
    
    &:first-child {
        border-radius: 0.5rem 0 0 0;
    }

    &:last-child {
        border-radius: 0 0.5rem 0 0;
    }
`;

const TabContent = styled.div`
    border: 1px solid ${({ theme }) => theme.colors.DarkGray};
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
