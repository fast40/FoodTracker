/* eslint-disable */
import { BrowserMultiFormatReader } from "@zxing/browser";

let reader: BrowserMultiFormatReader | null = null;

function getReader() {
  if (!reader) {
    reader = new BrowserMultiFormatReader();
  }
  return reader;
}

export const zxingImageScanner = {
  async decode(file: File) {
    const url = URL.createObjectURL(file);

    try {
      const result = await getReader().decodeFromImageUrl(url);

      if (!result) return null;

      return result.getText() || null;
    } catch (e) {
      return null;
    } finally {
      URL.revokeObjectURL(url);
    }
  },
};
