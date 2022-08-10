/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
export enum Colors {
    Black = '#2C2C2C',
    LightGray = '#f8f8f8',
    Gray = '#e9e9e9',
    SemiDarkGray = '#e7e9eb',
    DarkGray = '#808080',
    White = '#FFFFFF',
    Green = '#5ac39a',
    Red = '#d31b1b',

    PhoenixLightPink = '#FF7AB9',
    PhoenixPink = '#FF4B9D',
    PhoenixDarkPink = '#561E80',
    PhoenixCyan = '#14C2D7',
    PhoenixDarkCyan = '#808CBE',

    SnackbarRed = '#ec6c61',
    SnackbarGreen = '#68c957',
    SnackbarYellow = '#f5c152',
}

const theme = {
    colors: {
        Black: Colors.Black,
        LightGray: Colors.LightGray,
        Gray: Colors.Gray,
        SemiDarkGray: Colors.SemiDarkGray,
        DarkGray: Colors.DarkGray,
        White: Colors.White,
        primary: Colors.PhoenixPink,
        secondary: Colors.PhoenixCyan,
        tertiary: Colors.Black,
        positive: Colors.Green,
        negative: Colors.Red,
        SnackbarRed: Colors.SnackbarRed,
        SnackbarGreen: Colors.SnackbarGreen,
        SnackbarYellow: Colors.SnackbarYellow,
    },
    spacing: {
        nil: '0rem',
        xxxs: '0.10rem',
        xxs: '0.25rem',
        xs: '0.5rem',
        s: '0.75rem',
        m: '1.0rem',
        l: '1.5rem',
        xl: '2rem',
        xxl: '2.5rem',
        xxxl: '3rem',
    },
    fontSize: {
        xs: '0.5rem',
        s: '0.75rem',
        m: '1.0rem',
        M: '1.25rem',
        l: '1.5rem',
        xl: '2rem',
        xxl: '2.5rem',
    },
    shadow: {
        default: 'rgb(0 0 0 / 15%) 0px 2px 4px 0px',
        blueStrong: 'rgb(0 0 255 / 15%) 0px 4px 8px 0px',
        lowKey: 'rgb(0 0 0 / 15%) 0px 1px 2px 0px',
        levelEffect: 'rgb(0 0 0 / 15%) 0px 0px 4px 0px',
        modal: 'rgb(0 0 0 / 15%) 0px 0px 5px 1px',
    },
    media: {
        phone: '320px',
        smallTablet: '481px',
        tablet: '641px',
        lowResLaptop: '961px',
        laptop: '1025px',
        highResLaptop: '1281px',
    },
    headerHeight: '50px',
    animation: {
        speed: 300,
    },
} as const;

export type ThemeType = typeof theme;
export default theme;
