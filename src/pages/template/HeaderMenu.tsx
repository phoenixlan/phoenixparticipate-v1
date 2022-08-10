/*
 * @created 28/03/2021 - 23:57
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import React, { useState } from 'react';
import { DropdownMenu } from '../../sharedComponents/dropdownMenu';
import { useAuth } from '../../authentication/useAuth';
import styled, { keyframes } from 'styled-components';
import { PersonSquare } from '@styled-icons/bootstrap/PersonSquare';
import { LogOut } from '@styled-icons/boxicons-solid/LogOut';
import { RightArrow } from '@styled-icons/boxicons-solid/RightArrow';
import { LeftArrow } from '@styled-icons/boxicons-solid/LeftArrow';
import { ImageAdd } from '@styled-icons/boxicons-solid/ImageAdd';
import { HideImage } from '@styled-icons/material-sharp/HideImage';
import { Cog } from '@styled-icons/boxicons-solid/Cog';
import { Avatar } from '@phoenixlan/phoenix.js';
import { getAvatar } from '../../utils';
import { toast } from 'react-toastify';

const Icon = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    max-height: ${({ theme }) => theme.fontSize.l};
    height: ${({ theme }) => theme.fontSize.l};
`;

const ProfilePic = styled.img`
    border-radius: 0.5rem;
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
    cursor: pointer;
`;

const Blink = keyframes`
    0% {
        opacity: 0.8;
    }
    100% {
        opacity: 0;
    }
`;

const StyledCog = styled(Cog)`
    position: absolute;
    height: 1.5rem;
    cursor: pointer;
    animation: ${Blink} 5000ms alternate infinite ease;
`;

export const HeaderMenu: React.FC = () => {
    const { client } = useAuth();
    const [showDropdown, setShowDropdown] = useState(false);

    const onShowDropdown = (e: React.MouseEvent) => {
        setShowDropdown(!showDropdown);
    };

    const onFinalClick = () => {
        setShowDropdown(false);
    };

    return (
        <Icon>
            <ProfilePic src={client.user && getAvatar(client.user, 'hd')} onClick={onShowDropdown} />
            <StyledCog onClick={onShowDropdown} />
            {showDropdown && (
                <DropdownMenu
                    onFinalClick={onFinalClick}
                    main={{
                        name: 'main',
                        items: [
                            {
                                name: 'Logout',
                                icon: { left: <LogOut /> },
                                onClick: () => {
                                    client.logout();
                                },
                            },
                            {
                                name: 'Avatar',
                                icon: { left: <PersonSquare />, right: <RightArrow /> },
                                subMenu: 'avatar',
                            },
                        ],
                    }}
                    secondaries={[
                        {
                            name: 'avatar',
                            items: [
                                { name: 'back', subMenu: 'main', icon: { left: <LeftArrow /> } },
                                { name: 'Edit', icon: { left: <ImageAdd /> }, to: '/avatar' },
                                {
                                    name: 'Remove',
                                    icon: { left: <HideImage /> },
                                    onClick: async () => {
                                        try {
                                            await Avatar.deleteAvatar(client.user?.avatar_uuid ?? '');
                                            client.updateUser && (await client.updateUser());
                                        } catch {
                                            toast.error('Failed to delete avatar');
                                        }
                                    },
                                },
                            ],
                        },
                    ]}
                />
            )}
        </Icon>
    );
};
