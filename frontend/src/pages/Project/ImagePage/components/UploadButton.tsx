import { useRef, useEffect } from 'react';
import { Button } from '../styles';

const UploadButton = (props: {
  children: string | JSX.Element | JSX.Element[];
  accept?: string;
  directory?: boolean;
  disabled?: boolean;
  multiple?: boolean;
  onChange?: (files: File[]) => void;
}) => {
  const inputFileRef = useRef<HTMLInputElement | null>(null);
  const { children, accept, directory, disabled, multiple, onChange } = props;

  useEffect(() => {
    if (directory && inputFileRef.current !== null) {
      inputFileRef.current.setAttribute('directory', '');
      inputFileRef.current.setAttribute('webkitdirectory', '');
    }
  }, [directory]);

  return (
    <Button disabled={disabled} onClick={() => inputFileRef.current?.click()}>
      {children}
      <input
        hidden
        ref={inputFileRef}
        type={'file'}
        accept={accept}
        multiple={multiple}
        onChange={(e) => {
          const results = [];
          const accpectExts = accept ? accept.match(/[^.,]+/g) : null; // '.jpg,.png' => ['jpg', 'png']
          if (e.target.files && accpectExts) {
            for (const file of Array.from(e.target.files)) {
              const ext = file.name.split('.').pop();
              if (ext && accpectExts.includes(ext)) {
                results.push(file);
              }
            }
          }
          onChange?.(results);
        }}
      />
    </Button>
  );
};

export default UploadButton;
