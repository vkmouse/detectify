import { useState } from 'react';
import { H3 } from '../../components/Typography';
import { RadioButton, RadioButtonGroup } from './RadioButtonGroup';
import TutorialCard from './TutorialCard';
import checkServerStatus from '../../assets/CheckServerStatus.png';
import openColabIcon from '../../assets/OpenColab.png';
import enableGPUIcon from '../../assets/EnableGPU.png';
import installPackagesIcon from '../../assets/InstallPackages.png';
import startServerIcon from '../../assets/StartServer.png';
import styled from 'styled-components';

const Bold = styled.span`
  font-weight: bold;
`;

const OpenColabInfo = {
  img: openColabIcon,
  title: 'Open Colab Notebook and sign in with Google',
  description: (
    <>
      Click the&nbsp;
      <a
        style={{
          textDecoration: 'underline',
          fontSize: '100%',
        }}
        href="https://colab.research.google.com/drive/1NydDcMrS6YsbNRDxZDfzxTR17in_gb-h"
        target="_blank"
        rel="noreferrer"
      >
        <Bold>link to open the Colab Notebook</Bold>
      </a>
      &nbsp;and sign in with your Google account.
    </>
  ),
};

const EnableGPUInfo = {
  img: enableGPUIcon,
  title:
    'Configure the runtime settings to use a GPU as the hardware accelerator',
  description: (
    <>
      {
        'Go to Runtime > Change runtime type > Select GPU as hardware accelerator > Save'
      }
    </>
  ),
};

const InstallPackagesInfo = {
  img: installPackagesIcon,
  title: 'Install the necessary packages by running cell',
  description: (
    <>
      Execute the installation code cell by typing <Bold>Cmd/Ctrl+Enter</Bold>
      &nbsp;and wait for a few minutes.
    </>
  ),
};

const StartServerInfo = {
  img: startServerIcon,
  title: 'Start the server by running cell',
  description: (
    <>
      Execute the start server code cell by typing <Bold>Cmd/Ctrl+Enter</Bold>.
      Copy the token from Detectify and paste it into the input field in Colab.
    </>
  ),
};

const CheckServerStatusInfo = {
  img: checkServerStatus,
  title: 'Check the server status in Detectify',
  description: (
    <>
      After successfully starting the server, you will see the status of your
      server on the website as <Bold>Idle</Bold>.
    </>
  ),
};

const Tutorial = () => {
  const [info, setInfo] = useState(OpenColabInfo);
  const [selected, setSelected] = useState(0);
  const infoArray = [
    OpenColabInfo,
    EnableGPUInfo,
    InstallPackagesInfo,
    StartServerInfo,
    CheckServerStatusInfo,
  ];

  const handleClick = (index: number) => {
    if (selected !== index) {
      setSelected(index);
      setInfo(infoArray[index]);
    }
  };

  return (
    <>
      <H3>Prepare your own server</H3>
      <RadioButtonGroup>
        <RadioButton selected={selected === 0} onClick={() => handleClick(0)}>
          Open Colab
        </RadioButton>
        <RadioButton selected={selected === 1} onClick={() => handleClick(1)}>
          Enable GPU
        </RadioButton>
        <RadioButton selected={selected === 2} onClick={() => handleClick(2)}>
          Install packages
        </RadioButton>
        <RadioButton selected={selected === 3} onClick={() => handleClick(3)}>
          Start server
        </RadioButton>
        <RadioButton selected={selected === 4} onClick={() => handleClick(4)}>
          Check server status
        </RadioButton>
      </RadioButtonGroup>
      <TutorialCard
        {...info}
        onPrevStepClick={
          selected !== 0 ? () => handleClick(selected - 1) : undefined
        }
        onNextStepClick={
          selected !== 4 ? () => handleClick(selected + 1) : undefined
        }
      />
    </>
  );
};
export default Tutorial;
