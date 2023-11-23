import {LocalFile, QRMinifiedData} from '@root/state/types';
import {compareDesc} from 'date-fns';
import RNFS from 'react-native-fs';
// @ts-ignore
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import getHuntingHTML from './getHuntingHTML';
import {formatDateTimeLT} from './time';

const DEFAULT_PATH = RNFS.DocumentDirectoryPath;

export const generatePDF = async (qr: QRMinifiedData): Promise<LocalFile> => {
  const fileName = qr?.m?.t?.toString() || new Date().getTime().toString();
  const options = {
    html: getHuntingHTML(qr),
    fileName: fileName,
    directory: 'Documents',
  };
  const file = await RNHTMLtoPDF.convert(options);
  const destinationPath = DEFAULT_PATH + '/' + fileName + '.pdf';
  const timestamp = parseInt(fileName, 10);
  const title = formatDateTimeLT(timestamp);
  // copy to docs if not already there
  if (file.filePath !== destinationPath) {
    await RNFS.copyFile(file.filePath, destinationPath);
    await RNFS.unlink(file.filePath);
  }

  return {
    timestamp,
    title,
    name: fileName,
    path: destinationPath,
  };
};

export const readDirectory = async (): Promise<LocalFile[]> => {
  const files = await RNFS.readDir(DEFAULT_PATH);
  const docs = files.filter(file => file.path.endsWith('.pdf'));
  return docs
    .map(file => {
      const nameNumber = parseInt(file.name.split('.')[0], 10);
      const timestamp = isNaN(nameNumber)
        ? file?.ctime?.getTime() ||
          file?.mtime?.getTime() ||
          new Date().getTime()
        : nameNumber;
      return {
        timestamp,
        title: formatDateTimeLT(timestamp),
        name: file.name,
        path: file.path,
      };
    })
    .sort((a, b) => compareDesc(a.timestamp, b.timestamp));
};

export const removeFile = async (filePath: string) => {
  await RNFS.unlink(filePath);
};
