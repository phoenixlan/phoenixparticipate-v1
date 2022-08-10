/*
 * @created 29/03/2021 - 00:51
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import React, { useState } from 'react';
import styled from 'styled-components';
import { CenterBox } from '../../sharedComponents/boxes/CenterBox';
import { ShadowBox } from '../../sharedComponents/boxes/ShadowBox';
import { UploadArea } from '../../sharedComponents/UploadArea';
import { Terms } from './Terms';
import { EditImage } from './EditImage';
import { useAuth } from '../../authentication/useAuth';
import { Status } from './Status';
import { Header1 } from '../../sharedComponents/Header1';
import { Avatar as pekotar } from '@phoenixlan/phoenix.js';
import { toast } from 'react-toastify';
import { useAvatar } from '../../hooks/api/useAvatar';

const StyledShadowBox = styled(ShadowBox)`
    margin-bottom: ${({ theme }) => theme.spacing.xxxl};
`;

export const Avatar: React.FC = () => {
    const { client } = useAuth();
    const avatar_uuid = client.user?.avatar_uuid;
    const { data: avatar } = useAvatar(avatar_uuid);

    const [file, setFile] = useState<File | null>(null);
    const onFileDrop = (_file: File) => {
        setFile(_file);
    };

    const upload = async (x: number, y: number, w: number, h: number) => {
        if (!file) {
            return toast.error('No image selected');
        } else if (!client.user) {
            return toast.error('User not signed in');
        }
        try {
            await pekotar.createAvatar(file, x, y, w, h, client.user.uuid);
            setFile(null);
            client.updateUser && (await client.updateUser());
        } catch {
            toast.error('Failed to create avatar');
        }
    };

    const cancel = () => {
        setFile(null);
    };

    return (
        <CenterBox>
            <Header1>Avatar</Header1>
            <StyledShadowBox>
                {avatar ? (
                    <Status avatar={avatar} />
                ) : (
                    <>
                        {file ? (
                            <EditImage file={file} cancel={cancel} upload={upload} />
                        ) : (
                            <UploadArea onFileDrop={onFileDrop} />
                        )}
                    </>
                )}
            </StyledShadowBox>
            <StyledShadowBox>
                <Terms />
            </StyledShadowBox>
        </CenterBox>
    );
};
