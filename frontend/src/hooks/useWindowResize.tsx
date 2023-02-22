import { useEffect, useState } from 'react';

const useWindowSize = ({ onWindowResize }: { onWindowResize?: () => void }) => {
  const [windowWidth, setWindowWidth] = useState(-1);
  const [windowHeight, setWindowHeight] = useState(-1);

  const handleResize = () => {
    let hasResize = false;
    if (windowWidth !== window.innerWidth) {
      setWindowWidth(window.innerWidth);
      hasResize = true;
    }
    if (windowHeight !== window.innerHeight) {
      setWindowHeight(window.innerHeight);
      hasResize = true;
    }
    if (hasResize) {
      onWindowResize?.();
    }
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [windowWidth, windowHeight]);

  return { windowWidth, windowHeight };
};

export default useWindowSize;
