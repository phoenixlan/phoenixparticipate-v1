/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
    * {
        box-sizing: border-box;
        font-family: 'Inter', 'Roboto', sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
    html {
        font-size: 16px;
        margin: 0;
        padding: 0;
        /* PWA ios fix */
        @supports (-webkit-overflow-scrolling: touch) {
          /* default ios styles */
        
          @media (display-mode: standalone) {
            /* ios web app styles (opened from home screen) */
            padding-top: env(safe-area-inset-top);
            background-color: ${({ theme }) => theme.colors.LightGray};
          }
        }
    }

    body {
        font-size: 16px;
        margin: 0;
        padding: 0;
        
        min-height: 100vh;
        height: 100vh;
        
        display: flex;
        flex-direction: column;
        
        @media (max-width: 481px) {
            /* Mobile fix as 100vh doesnt count in the top and bottom bar, adding a scroll bar.  */
            min-height: -webkit-fill-available;
            height: -webkit-fill-available;
            /* PWA ios fix */
            @supports (-webkit-overflow-scrolling: touch) {
              /* default ios styles */
            
              @media (display-mode: standalone) {
                /* ios web app styles (opened from home screen) */
                min-height: calc(100% + env(safe-area-inset-bottom));
                height: calc(100% + env(safe-area-inset-bottom));
                background-color: ${({ theme }) => theme.colors.White};
              }
            }
        }
    }
    a {
        text-decoration: none;
        color: inherit;
    }
    
    #root {
        height: inherit;
        min-height: inherit;
        overflow: hidden;
    }
`;

export { GlobalStyle };
