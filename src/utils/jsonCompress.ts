import {compress, decompress} from 'compress-json';
import LZString from './LZString';

export const compressJSON = (data: Object): string => {
  const c = JSON.stringify(compress(data));
  const lz = LZString.compressToBase64(c);
  return lz;
};

export const decompressJSON = (data: string): Object => {
  const a = LZString.decompressFromBase64(data);
  if (a === null) {
    throw new Error('Duomenų išpakavimas nepavyko');
  }
  const b = JSON.parse(a);
  return decompress(b);
};
