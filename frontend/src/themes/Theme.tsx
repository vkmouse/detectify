import React, { createContext, useContext, useState } from 'react';
import {
  createGlobalStyle,
  DefaultTheme,
  ThemeProvider,
} from 'styled-components';
import darkTheme from './dark';
import lightTheme from './light';

type State = {
  setTheme: (theme: DefaultTheme) => void;
};

const initialState: State = {
  setTheme: () => {
    throw 'Not Implement';
  },
};

const ThemeToggleContext = createContext<State>(initialState);

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

const Theme = (props: { children: JSX.Element | JSX.Element[] }) => {
  const { children } = props;
  const initialTheme =
    localStorage.theme === lightTheme.name ? lightTheme : darkTheme;
  const [theme, setTheme] = useState(initialTheme);

  return (
    <ThemeToggleContext.Provider
      value={{
        setTheme: (theme: DefaultTheme) => {
          setTheme(theme);
          localStorage.theme = theme.name;
        },
      }}
    >
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        {children}
      </ThemeProvider>
    </ThemeToggleContext.Provider>
  );
};

const useThemeToggleContext = (): State => {
  return useContext(ThemeToggleContext);
};

export { useThemeToggleContext };
export default Theme;
