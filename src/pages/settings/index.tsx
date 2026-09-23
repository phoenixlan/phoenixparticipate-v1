import React, { useState } from 'react';
import styled from 'styled-components';

import { useAuth } from '../../authentication/useAuth';
import { useMembershipPersonalia } from '../../hooks/api/useMembershipPersonalia';
import { useSiteConfig } from '../../hooks/api/useSiteConfig';

import { CenterBox } from '../../sharedComponents/boxes/CenterBox';
import { ShadowBox } from '../../sharedComponents/boxes/ShadowBox';
import { Header1 } from '../../sharedComponents/Header1';
import { Header2 } from '../../sharedComponents/Header2';
import { Skeleton } from '../../sharedComponents/Skeleton';
import { SecondaryButton, TertiaryButton } from '../../sharedComponents/forms/Button';
import { FormLabel } from '../../sharedComponents/forms/FormLabel';

import { MembershipPersonaliaForm } from '../membership/MembershipPersonaliaForm';

const Card = styled(ShadowBox)`
    padding: ${({ theme }) => theme.spacing.m};
    margin-bottom: ${({ theme }) => theme.spacing.m};
`;

const CardHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const Settings: React.FC = () => {
    const { client } = useAuth();
    const { data: siteConfig } = useSiteConfig();
    const features = siteConfig?.features ?? [];
    const { data: membershipPersonalia, isLoading: isMembershipPersonaliaLoading } = useMembershipPersonalia();

    const [isEditingPersonalia, setIsEditingPersonalia] = useState(false);

    return (
        <CenterBox centerVertically={false}>
            <Header1>Innstillinger</Header1>
            <Card>
                <Header2>Brukerinformasjon</Header2>
                <FormLabel>Navn</FormLabel>
                <p>
                    {client.user?.firstname} {client.user?.lastname}
                </p>
                <FormLabel>Fødselsdato</FormLabel>
                <p>{client.user?.birthdate}</p>
                <FormLabel>Telefon</FormLabel>
                <p>{client.user?.phone}</p>
            </Card>
            {features.includes('membership') && (
                <Card>
                    <CardHeader>
                        <Header2>Medlemsinformasjon</Header2>
                        {isEditingPersonalia ? (
                            <TertiaryButton size="small" onClick={() => setIsEditingPersonalia(false)}>
                                Avbryt
                            </TertiaryButton>
                        ) : (
                            <SecondaryButton size="small" onClick={() => setIsEditingPersonalia(true)}>
                                Rediger
                            </SecondaryButton>
                        )}
                    </CardHeader>
                    <Skeleton loading={isMembershipPersonaliaLoading}>
                        {isEditingPersonalia ? (
                            <MembershipPersonaliaForm
                                defaultValues={membershipPersonalia}
                                onDone={() => setIsEditingPersonalia(false)}
                            />
                        ) : membershipPersonalia ? (
                            <>
                                <FormLabel>Adresse</FormLabel>
                                <p>{membershipPersonalia.address}</p>
                                <FormLabel>Postnummer</FormLabel>
                                <p>{membershipPersonalia.postal_code}</p>
                            </>
                        ) : (
                            <p>Ingen medlemsinformasjon er registrert.</p>
                        )}
                    </Skeleton>
                </Card>
            )}
        </CenterBox>
    );
};
