import { useEffect } from 'react';
import styled from 'styled-components';

const ModalContainer = styled.div<{ open: boolean }>`
  display: ${(props) => (props.open ? 'block' : 'none')};
  position: absolute;
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
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 2rem 0 rgb(41 48 66 / 10%);
`;

const Image = styled.img`
  width: 100%;
`;

const ImageModal = ({
  src,
  open,
  onClose,
}: {
  src: string;
  open: boolean;
  onClose: () => void;
}) => {
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

  return (
    <ModalContainer open={open}>
      <ModalOverlay>
        <ModalBackground onClick={onClose} />
        <ModalWrapper>
          <Image src={src} alt="" />
        </ModalWrapper>
      </ModalOverlay>
    </ModalContainer>
  );
};

export default ImageModal;
