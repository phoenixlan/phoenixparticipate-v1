/*
 * @created 27/03/2021 - 21:47
 * @project phoenixparticipate-v1
 * @author andreasjj
 */

import { User } from '@phoenixlan/phoenix.js';
import { BasicPosition } from '@phoenixlan/phoenix.js/build/crew';

export const getTitles = (user: User.BasicUserWithPositions): string => {
    return user.positions.reduce((prev: string, cur: BasicPosition, i, arr) => {
        let title = prev;
        if (!cur.team && cur.chief) {
            title += `Leder`;
        } else if (cur.name) {
            title += `${cur.name}`;
        } else if (cur.team && cur.chief) {
            title += `Leder av ${cur.team}}`;
        } else if (cur.team) {
            title += `Medlem av ${cur.team}`;
        } else {
            title += `Medlem`;
        }

        if (i !== arr.length - 1) {
            title += ', ';
        }

        return title;
    }, '');
};
