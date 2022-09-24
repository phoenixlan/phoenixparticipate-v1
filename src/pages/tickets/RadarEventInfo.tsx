import React from 'react';
import styled from 'styled-components';
import { Header2 } from '../../sharedComponents/Header2';

export const RadarEventInfo = () => {
    return (
        <div>
            <Header2>Hva er &quot;Radar event medlemskap&quot;</Header2>
            <p>
                LANet er eid av Radar Event. Radar Event er en organisasjon av ungdom for ungdom tilknyttet Radar på
                Asker Kulturhus, som er ansvarlig for arrangering av ungdoms-arrangement i Asker-omerådet. For at
                arrangementene skal være billige er vi avhengige av hodestøtte fra Hyperion(som får pengene fra staten).{' '}
            </p>
            <p>
                Vi selger derfor billetter med medlemskap inkludert i prisen, som da brukes for å finansiere
                arrangementet. Dette gjør billetten billigere enn den hadde vært dersom medlemskap ikke var med i
                bildet.{' '}
                <b>
                    Billetten uten medlemskap i Radar Event koster mer fordi vi må kompansere for tap av hodestøtte. De
                    fleste vil ikke trenge denne billetten.
                </b>
            </p>
            <p>
                Et medlemskap i Radar Event koster 50kr varer ut kalenderåret, og fornyes ikke automatisk. Disse 50
                kronene er inkludert i billettprisen dersom du kjøper billett med medlemskap inkludert. Den vanligste
                måten å bli medlem på er å kjøpe billett med medfølgende medlemskap til et av våre arrangementer.
                Fordelen med medlemskap er lavere priser på arrangement hos Radar Event ut kalenderåret.
            </p>
        </div>
    );
};
