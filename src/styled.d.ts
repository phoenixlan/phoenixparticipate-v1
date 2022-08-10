/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import 'styled-components';
import { ThemeType } from './theme';

declare module 'styled-components' {
    // eslint-disable-next-line
    export interface DefaultTheme extends ThemeType {}
}
