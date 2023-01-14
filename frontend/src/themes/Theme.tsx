import React, { createContext, useContext, useState } from 'react';
import {
  createGlobalStyle,
  DefaultTheme,
  ThemeProvider,
} from 'styled-components';
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
    font-family: Segoe UI;
    font-weight: 400;
  }

  body {
    margin: 0;
    background: ${(props) => props.theme.colors.bodyBackground};
  }

  a {
    color: inherit;
    text-decoration: none;
  }
`;

const Theme = (props: { children: JSX.Element | JSX.Element[] }) => {
  const { children } = props;
  const [theme, setTheme] = useState(lightTheme);

  return (
    <ThemeToggleContext.Provider value={{ setTheme }}>
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
