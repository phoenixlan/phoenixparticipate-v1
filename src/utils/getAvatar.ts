/*
 * @created 27/03/2021 - 21:47
 * @project phoenixparticipate-v1
 * @author andreasjj
 */

import { User } from '@phoenixlan/phoenix.js';
import male from '../assets/male.png';
import female from '../assets/female.png';

export const getAvatar = (user: User.BaseUser, quality: 'hd' | 'sd' | 'thumb') => {
    if (user.avatar_urls) {
        switch (quality) {
            case 'hd':
                return user.avatar_urls.hd;
            case 'sd':
                return user.avatar_urls.sd;
            case 'thumb':
                return user.avatar_urls.thumb;
            default:
                return '';
        }
    }
};
