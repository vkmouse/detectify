import styled from 'styled-components';
import createSpaceIcon from '../../assets/CreateSpace.png';
import checkStatusIcon from '../../assets/CheckStatus.png';
import openColabIcon from '../../assets/OpenColab.png';
import enableGPUIcon from '../../assets/EnableGPU.png';
import installPackagesIcon from '../../assets/InstallPackages.png';
import startServerIcon from '../../assets/StartServer.png';

const Bold = styled.span`
  font-weight: bold;
`;

const CreateSpaceInfo = {
  name: 'Create Space',
  img: createSpaceIcon,
  title: 'Creating Server Environment Space',
  description: (
    <>
      To enable server connectivity, click on the <Bold>+ button</Bold> located
      at the bottom of the default server and create a server environment.
    </>
  ),
};

const OpenColabInfo = {
  name: 'Open Colab',
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
  name: 'Enable GPU',
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
  name: 'Install packages',
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
  name: 'Start server',
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
  name: 'Check server',
  img: checkStatusIcon,
  title: 'Check the server status in Detectify',
  description: (
    <>
      After successfully starting the server, you will see the status of your
      server on the website as <Bold>On</Bold>.
    </>
  ),
};

const TutorialInfo = {
  title: 'Prepare your own server on Colab',
  description: (
    <>
      While using default servers on Detectify, limited computing resources may
      not always be available when needed. To overcome this limitation, it is
      recommended to set up your own server. We provide the ability to set up
      your own server on Colab with GPU computing resources.
    </>
  ),
  cards: [
    CreateSpaceInfo,
    OpenColabInfo,
    EnableGPUInfo,
    InstallPackagesInfo,
    StartServerInfo,
    CheckServerStatusInfo,
  ],
};

export default TutorialInfo;
