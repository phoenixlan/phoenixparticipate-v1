/*
 * @created 02/06/2021 - 21:44
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
/*
 * @created 09/04/2021 - 22:35
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import React from 'react';
import { PositiveButton } from '../../../../../sharedComponents/forms/Button';

interface Props {
    slug: string;
    url: string;
    next: () => void;
}

export const Vipps: React.FC<Props> = ({ url, next }) => {
    const handleSubmit = () => {
        window.open(url, '_self');
        next();
    };

    return (
        <form onSubmit={handleSubmit}>
            <PositiveButton fluid={true}>Betal med Vipps</PositiveButton>
        </form>
    );
};
