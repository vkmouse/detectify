import { BatchUploadData } from '../types/api';

function convertFilenames(filenames: string[]): BatchUploadData[] {
  const results: BatchUploadData[] = [];
  const fileNameMap = new Map<string, BatchUploadData>();
  for (const fileName of filenames) {
    const fileNameArray = fileName.split('.');
    const fileExtension = '.' + fileNameArray.pop();
    const fileNameOnly = fileNameArray.join('.');
    const existingData = fileNameMap.get(fileNameOnly);
    const isImage = checkImageExtenstion(fileExtension);
    const isAnnotation = checkAnnotationExtenstion(fileExtension);

    if (existingData) {
      existingData.imageExt = isImage ? fileExtension : existingData.imageExt;
      existingData.annotationExt = isAnnotation
        ? fileExtension
        : existingData.annotationExt;
    } else {
      fileNameMap.set(fileNameOnly, {
        filename: fileNameOnly,
        imageExt: isImage ? fileExtension : '',
        annotationExt: isAnnotation ? fileExtension : '',
      });
    }
  }
  fileNameMap.forEach((data) => results.push(data));
  return results;
}

function getFilenameWithoutExtension(filename: string): string {
  const filenameArray = filename.split('.');
  filenameArray.pop();
  return filenameArray.join('.');
}

function getFilenameExtension(filename: string): string {
  const filenameArray = filename.split('.');
  return '.' + filenameArray.pop();
}

function checkImageExtenstion(ext?: string) {
  return ext === '.png' || ext === '.jpg' || ext === '.jpeg';
}

function checkAnnotationExtenstion(ext?: string) {
  return ext === '.xml';
}

export {
  checkImageExtenstion,
  checkAnnotationExtenstion,
  convertFilenames,
  getFilenameExtension,
  getFilenameWithoutExtension,
};
