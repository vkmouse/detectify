import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    name: string;
    colors: {
      primary: string;
      backgroundColor: string;
      gray500: string;
      gray600: string;
      gray700: string;
      bodyBackground: string;
      bodyColor: string;
      cardBackground: string;
      progressBackground: string;
      progressBackgroundPrimary: string;
      scollbarTrack: string;
      scollbarThumb: string;
      scollbarHover: string;
    };
  }
}
