/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
export enum Colors {
    Black = '#2C2C2C',
    LightGray = '#f8f8f8',
    LinkColor = '#0000EE',
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

    LightBlue = '#a2eef6',

    SnackbarRed = '#ec6c61',
    SnackbarGreen = '#68c957',
    SnackbarYellow = '#f5c152',
}

const theme = {
    colors: {
        LinkColor: Colors.LinkColor,
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
        accentHighlight: Colors.PhoenixLightPink,
        accent: Colors.PhoenixPink,
        accentDark: Colors.PhoenixDarkPink,
        accent2: Colors.PhoenixCyan,
        accent2Dark: Colors.PhoenixDarkCyan,
        infoBlue: Colors.LightBlue,
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
        default: '0px 1px 3px rgb(0 0 0 / 8%), 0px 1px 2px rgb(0 0 0 / 6%)',
        blueStrong: '0px 4px 12px rgb(0 0 255 / 10%)',
        lowKey: '0px 1px 2px rgb(0 0 0 / 5%)',
        levelEffect: '0px 0px 0px 1px rgb(0 0 0 / 5%), 0px 1px 3px rgb(0 0 0 / 8%)',
        modal: '0px 8px 30px rgb(0 0 0 / 12%), 0px 0px 1px rgb(0 0 0 / 8%)',
    },
    borderRadius: {
        s: '6px',
        m: '8px',
        l: '12px',
        xl: '16px',
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
    transition: {
        default: '150ms ease',
        slow: '300ms ease',
    },
} as const;

export type ThemeType = typeof theme;
export default theme;
