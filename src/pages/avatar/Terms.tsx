/*
 * @created 29/03/2021 - 11:39
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import React from 'react';
import styled from 'styled-components';
import { Header2 } from '../../sharedComponents/Header2';

const Container = styled.div`
    padding: ${({ theme }) => theme.spacing.m};
`;

const I = styled.i`
    color: ${({ theme }) => theme.colors.DarkGray};
`;

export const Terms: React.FC = () => {
    return (
        <Container>
            <Header2 center={false}>Krav og informasjon:</Header2>
            <ul>
                <li>Ansiktet skal være synlig og motivet i bildet — tenk slack passfoto</li>
                <li>
                    Svart-hvitt bilde burde unngås. Dette skal printes på crewkort, der kvaliteten er adskillig verre
                    enn på hjemmeprinteren din
                </li>
                <li>Minimumsstørrelse: 600x450, men helst større enn 1200x900</li>
                <li>Max filstørrelse: 16 MB</li>
                <li>Du kan søke selv om avataren din ikke har blitt godkjent enda</li>
                <li>
                    Din søknad beholdes selv om avataren din blir avslått, men det er forventet at du snarest laster opp
                    en ny avatar som bedre følger rettningslinjene
                </li>
            </ul>
            <I>
                Kontakt Phoenix på <a href="mailto:info@phoenixlan.no">info@phoenixlan.no</a> ved videre spørsmål
            </I>
        </Container>
    );
};
