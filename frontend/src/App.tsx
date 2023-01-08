import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Theme from './themes/Theme';

const App = () => {
  const [selectedTopic, setSelectedTopic] = useState('overview');
  return (
    <Theme>
      <Sidebar
        selected={selectedTopic}
        onSelectedChange={(value) => {
          setSelectedTopic(value);
        }}
      />
    </Theme>
  );
};

export default App;
