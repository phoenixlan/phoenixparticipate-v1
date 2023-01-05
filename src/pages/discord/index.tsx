import React from 'react';
import styled from 'styled-components';

import { useMembershipStatus } from '../../hooks/api/useMembershipStatus';

import { CenterBox } from '../../sharedComponents/boxes/CenterBox';
import { Header1 } from '../../sharedComponents/Header1';
import { Skeleton } from '../../sharedComponents/Skeleton';
import { ShadowBox } from '../../sharedComponents/boxes/ShadowBox';

import { RadarEventInfo } from '../tickets/RadarEventInfo';
import { Header2 } from '../../sharedComponents/Header2';
import { useAuth } from '../../authentication/useAuth';
import { useDiscordMapping } from '../../hooks/api/useDiscordMapping';
import { dateOfBirthToAge } from '../../utils/age';
import { NegativeButton, PositiveButton } from '../../sharedComponents/forms/Button';

import { User } from '@phoenixlan/phoenix.js';
import { useRevertTransferMutation } from '../../hooks/api/useRevertTransferMutation';
import { useRevokeDiscordMappingMutation } from '../../hooks/api/useRevokeDiscordMappingMutation';

const PaddedBox = styled(ShadowBox)`
    padding: ${({ theme }) => theme.spacing.m};
`;

const Center = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

export const DiscordMappingManagement = () => {
    const { client } = useAuth();
    const { data: discordMapping, isLoading: isLoadingDiscordMapping } = useDiscordMapping(client.user!.uuid);

    const revokeDiscordMappingMutation = useRevokeDiscordMappingMutation();

    const dob = client.user?.birthdate ?? '';
    const age = dateOfBirthToAge(dob);

    const connect = async () => {
        const { url } = await User.createDiscordMappingOauthUrl(client.user!.uuid);
        location.href = url;
    };
    const disconnect = async () => {
        await revokeDiscordMappingMutation.mutateAsync({
            uuid: client.user!.uuid,
        });
    };

    return (
        <Skeleton loading={isLoadingDiscordMapping}>
            <CenterBox centerVertically={false}>
                <Header1>Eksterne tjenester</Header1>
                <PaddedBox>
                    {discordMapping ? (
                        <>
                            <Header2>Du har koblet til Discord</Header2>
                            <p>
                                Vi har registrert at du er koblet til Discord-kontoen <b>{discordMapping.username}</b> (
                                <code>{discordMapping.discord_id}</code>)
                            </p>
                            <p>
                                Dette betyr at vi har lagret informasjon om Discord-brukeren din. Botten vår vil derfor
                                kunne automatisk gi deg riktige roller.
                            </p>
                            <p>Vil du fjerne tilkoblingen?</p>
                            <Center>
                                <NegativeButton
                                    onClick={() => {
                                        disconnect();
                                    }}
                                >
                                    Fjern tilkobling
                                </NegativeButton>
                            </Center>
                        </>
                    ) : (
                        <>
                            <Header2>Du har ikke koblet til Discord</Header2>
                            <p>
                                Trykk på knappen under for å koble Discord-kontoen din til Phoenix. Les gjerne under om
                                hva det innebærer å koble Discord-kontoen din til Phoenix først.
                            </p>
                            <p>
                                Vi trenger kun tilgang til grunnleggende informasjon om kontoen. Vi lagrer bruker id-en
                                din, samt en <i>token</i>. Denne gjør at vi kan bruke tilgangen du har gitt oss ved et
                                senere tidspunkt, f.eks for å hente ut grunnleggende informasjon om kontoen
                                din(brukernavn) når det er nødvendig. Dette gjør at vi kan holde oss oppdatert selv om
                                du endrer brukernavn. Vi får ikke tilgang til chatter eller lignende. Vi ber også om
                                tillatelse til å legge deg til i Discord-servere, slik at vi kan legge deg til i
                                Phoenix-serveren om du ikke allerede er det.
                            </p>
                            <Center>
                                <PositiveButton
                                    onClick={() => {
                                        connect();
                                    }}
                                >
                                    Koble til Discord
                                </PositiveButton>
                            </Center>
                        </>
                    )}
                </PaddedBox>
                <PaddedBox>
                    <Header2>Discord? Tilkobling?</Header2>
                    <p>
                        Phoenix LAN har en Discord-server, mest aktiv under selve LANet. For å slippe at gruppeledere
                        skal måtte finne og legge riktige rettigheter på alle som har blitt tatt opp, tilbyr vi en måte
                        å automatisk få tilgang til gruppechatter når du blir tatt opp.{' '}
                    </p>
                    <p>
                        En annen fordel er tilgjengelighet - vi ønsker noen ganger å snakke med søkere, og det er av
                        erfaring lettere for oss å få tak i folk som er tilgjengelig på Discord.
                    </p>
                    <p>
                        Å &quot;koble til&quot; Discord er en prosess der du kan gi samtykke til Discord for at vi kan
                        motta grunnleggende informasjon om Discord-kontoen din(Bruker-ID, etc). Av denne informasjonen
                        lagrer vi kun din Bruker-ID, som vi bruker for at vår bot kan gi kontoen din riktige rettigheter
                        automatisk. Dette fungerer likt som når du bruker Discord for å logge inn på andre nettsider.
                    </p>
                    <p>
                        Å koble til Discord-kontoen din er frivillig, og er ikke nødvendig for å delta hverken som
                        deltaker eller gruppemedlem. Du kan når som helst fjerne tilkoblingen.
                    </p>
                    <Header2>Jeg har ikke Discord - burde jeg ha det?</Header2>
                    <p>
                        Discord er svært populært blant folk som spiller dataspill, og de fleste vil ende opp med en
                        konto etterhvert som de blir kjent med folk som spiller. Det er likevel ikke nødvendig, ei
                        trengs det for å delta på Phoenix LAN.
                    </p>
                    {age <= 14 ? (
                        <p>
                            <b>
                                Siden du er ung anbefaler vi deg å ta en prat med dine foreldre om det før du lager en
                                konto.
                            </b>
                        </p>
                    ) : null}
                </PaddedBox>
            </CenterBox>
        </Skeleton>
    );
};
