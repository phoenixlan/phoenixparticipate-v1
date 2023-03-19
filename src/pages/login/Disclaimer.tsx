import React from 'react';
import styled from 'styled-components';

const DisclaimerContainer = styled.div`
    text-align: center;
`;
const Link = styled.a`
    color: blue;
    :visited {
        color: purple;
    }
`;

export const LoginDisclaimer = () => {
    return (
        <DisclaimerContainer>
            <p>
                Bruk av nettsiden forbeholder at du godtar våre{' '}
                <Link href={`${process.env.BASE_URL}/static/tos.html`}>Bruksvilkår</Link>. Billettkjøp er regulert av
                vår <Link href={`${process.env.REACT_APP_MAIN_SITE}/salgsbetingelser`}>kjøpsavtale</Link>.
            </p>
        </DisclaimerContainer>
    );
};
