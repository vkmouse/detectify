import {
  useRef,
  useEffect,
  InputHTMLAttributes,
  DetailedHTMLProps,
} from 'react';
import { PrimaryButton } from './Button';

interface Props
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  directory?: boolean;
  onUploadChange?: (files: File[]) => void;
}

const UploadButton = (props: Props) => {
  const inputFileRef = useRef<HTMLInputElement | null>(null);
  const {
    className,
    children,
    accept,
    directory,
    disabled,
    multiple,
    onUploadChange,
  } = props;

  useEffect(() => {
    if (directory && inputFileRef.current !== null) {
      inputFileRef.current.setAttribute('directory', '');
      inputFileRef.current.setAttribute('webkitdirectory', '');
    }
  }, [directory]);

  return (
    <PrimaryButton
      className={className}
      disabled={disabled}
      onClick={() => inputFileRef.current?.click()}
    >
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
          onUploadChange?.(results);
        }}
      />
    </PrimaryButton>
  );
};

export default UploadButton;
