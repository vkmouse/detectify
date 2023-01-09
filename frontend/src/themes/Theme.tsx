import React from 'react';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import lightTheme from './light';

const GlobalStyle = createGlobalStyle`
  * {
    font-family: Segoe UI;
    font-weight: 400;
  }

  body {
    margin: 0;
  }

  a {
    color: inherit;
    text-decoration: none;
  }
`;

const Theme = (props: { children: JSX.Element | JSX.Element[] }) => {
  const { children } = props;
  return (
    <ThemeProvider theme={lightTheme}>
      <GlobalStyle />
      {children}
    </ThemeProvider>
  );
};

export default Theme;
