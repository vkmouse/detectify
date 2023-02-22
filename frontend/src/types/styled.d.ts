import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    name: string;
    colors: {
      authTitleColor: string;
      primary: string;
      backgroundColor: string;
      gray: string;
      gray200: string;
      gray400: string;
      gray500: string;
      gray600: string;
      gray700: string;
      bodyBackground: string;
      bodyColor: string;
      cardBackground: string;
      cardBackgroundPrimary: string;
      progressBackground: string;
      progressBackgroundPrimary: string;
      scollbarTrack: string;
      scollbarThumb: string;
      scollbarHover: string;
      danger: string;
      navBackground: string;
      dropdownHover: string;
      dropdownBorderColor: string;
      dropdownActiveBackground: string;
      dropdownActiveColor: string;
    };
    buttonDisabledOpacity: number;
  }
}
