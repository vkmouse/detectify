import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';
import darkTheme from '../themes/dark';
import lightTheme from '../themes/light';
import SunIcon from '../assets/sun.svg';
import MoonIcon from '../assets/moon.svg';

const ThemeControl = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 10px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
`;

const LightThemeControl = styled(ThemeControl)`
  background: rgba(255, 204, 133, 0.18);
  color: #ffcc85;
  &:hover {
    background: rgba(229, 120, 11, 0.7);
    color: #fff6e0;
  }
`;

const DarkThemeControl = styled(ThemeControl)`
  background: rgba(56, 116, 255, 0.24);
  color: #f5f8ff;
  &:hover {
    background: rgba(56, 116, 255, 0.7);
    color: #85a9ff;
  }
`;

const ThemeToggler = () => {
  const { theme, setTheme } = useTheme();
  const isDarkTheme = theme.name === 'dark';

  const handleThemeSwitch = (isDarkTheme: boolean) => {
    if (isDarkTheme) {
      setTheme(lightTheme);
    } else {
      setTheme(darkTheme);
    }
  };

  if (isDarkTheme) {
    return (
      <DarkThemeControl onClick={() => handleThemeSwitch(isDarkTheme)}>
        <MoonIcon />
      </DarkThemeControl>
    );
  }

  return (
    <LightThemeControl onClick={() => handleThemeSwitch(isDarkTheme)}>
      <SunIcon />
    </LightThemeControl>
  );
};

export default ThemeToggler;
