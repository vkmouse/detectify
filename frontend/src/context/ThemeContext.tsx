import { createContext, ReactNode, useContext, useState } from 'react';
import {
  createGlobalStyle,
  DefaultTheme,
  ThemeProvider as StyledComponentThemeProvider,
} from 'styled-components';
import darkTheme from '../themes/dark';
import lightTheme from '../themes/light';

type State = {
  theme: DefaultTheme;
  setTheme: (theme: DefaultTheme) => void;
};

const initialState: State = {
  theme: lightTheme,
  setTheme: () => {
    throw 'Not Implement';
  },
};

const ThemeContext = createContext<State>(initialState);

const GlobalStyle = createGlobalStyle`
  * {
    font-family: "Poppins";
    font-weight: 400;
  }

  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${(props) => props.theme.colors.scollbarTrack};
  }

  ::-webkit-scrollbar-thumb {    
    background: ${(props) => props.theme.colors.scollbarThumb};
    border-radius: 8px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${(props) => props.theme.colors.scollbarHover};
  }

  body {
    margin: 0;
    background: ${(props) => props.theme.colors.bodyBackground};
    color: ${(props) => props.theme.colors.bodyColor};
  }

  button {
    font-size: 105%;
  }

  a {
    color: inherit;
    text-decoration: none;
  }
`;

const ThemeProvider = (props: { children: ReactNode }) => {
  const { children } = props;
  const initialTheme =
    localStorage.theme === lightTheme.name ? lightTheme : darkTheme;
  const [theme, setTheme] = useState(initialTheme);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme: (theme: DefaultTheme) => {
          setTheme(theme);
          localStorage.theme = theme.name;
        },
      }}
    >
      <StyledComponentThemeProvider theme={theme}>
        <GlobalStyle />
        {children}
      </StyledComponentThemeProvider>
    </ThemeContext.Provider>
  );
};

const useTheme = (): State => {
  return useContext(ThemeContext);
};

export { useTheme, ThemeProvider };
