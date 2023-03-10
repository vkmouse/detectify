import { ReactNode, useEffect } from 'react';
import styled from 'styled-components';

const ModalContainer = styled.div<{ open: boolean }>`
  display: ${(props) => (props.open ? 'block' : 'none')};
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  z-index: 1000;
`;

const ModalOverlay = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const ModalBackground = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  background: rgba(0, 0, 0, 0.4);
`;

const ModalWrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: calc(100vw - 40px);
  background: ${(props) => props.theme.colors.cardBackground};
  border-radius: 10px;
  box-shadow: 0 0 2rem 0 rgb(41 48 66 / 10%);
`;

const ModalInnerContainer = styled.div`
  width: 100%;
  padding: 20px;
`;

const ModalTitle = styled.div`
  font-size: 125%;
  font-weight: bold;
  padding-bottom: 5px;
`;

const ModalImage = styled.img`
  max-width: 80vw;
  max-height: 80vh;
`;

const Modal = ({
  children,
  className,
  open,
  onClose,
}: {
  className?: string;
  children?: ReactNode;
  open: boolean;
  onClose: () => void;
}) => {
  const handleStopWheel = (e: WheelEvent) => e.preventDefault();
  const handleStopTouchMove = (e: TouchEvent) => e.preventDefault();

  useEffect(() => {
    if (open) {
      const callback = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      window.addEventListener('keydown', callback);
      return () => window.removeEventListener('keydown', callback);
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      window.addEventListener('wheel', handleStopWheel, {
        passive: false,
      });
      window.addEventListener('touchmove', handleStopTouchMove, {
        passive: false,
      });
      return () => {
        window.removeEventListener('wheel', handleStopWheel);
        window.removeEventListener('touchmove', handleStopTouchMove);
      };
    }
  }, [open]);

  return (
    <ModalContainer open={open}>
      <ModalOverlay>
        <ModalBackground onClick={onClose} />
        <ModalWrapper>
          <ModalInnerContainer className={className}>
            {children}
          </ModalInnerContainer>
        </ModalWrapper>
      </ModalOverlay>
    </ModalContainer>
  );
};

export default Modal;
export { ModalTitle, ModalImage };
