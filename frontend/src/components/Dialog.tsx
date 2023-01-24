import styled from 'styled-components';

const DialogContainer = styled.div<{ open: boolean }>`
  display: ${(props) => (props.open ? 'block' : 'none')};
  position: absolute;
  width: 100vw;
  height: 100vh;
  top: 0;
  z-index: 1000;
`;

const DialogOverlay = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const DialogBackground = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  background: rgba(0, 0, 0, 0.4);
`;

const DialogWrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  max-width: calc(100vw - 40px);
  background: ${(props) => props.theme.colors.cardBackground};
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 2rem 0 rgb(41 48 66 / 10%);
`;

const DialogInnerContainer = styled.div`
  width: 100%;
`;

const DialogTitle = styled.div`
  font-size: 125%;
  font-weight: bold;
  padding-bottom: 5px;
`;

const Dialog = (props: {
  children?: string | JSX.Element | JSX.Element[];
  open: boolean;
  onClose: () => void;
}) => {
  const { children, open, onClose } = props;
  return (
    <DialogContainer open={open}>
      <DialogOverlay>
        <DialogBackground onClick={onClose} />
        <DialogWrapper>
          <DialogInnerContainer>{children}</DialogInnerContainer>
        </DialogWrapper>
      </DialogOverlay>
    </DialogContainer>
  );
};

export default Dialog;
export { DialogTitle };
