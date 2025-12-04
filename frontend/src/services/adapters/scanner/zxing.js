/* eslint-disable */
import { BrowserMultiFormatReader } from "@zxing/browser";

let reader = null;

function getReader() {
  if (!reader) {
    reader = new BrowserMultiFormatReader();
  }
  return reader;
}

export const zxingImageScanner = {
  async decode(file) {
    const url = URL.createObjectURL(file);

    try {
      const result = await getReader().decodeFromImageUrl(url);

      if (!result) return null;

      if (typeof result.getText === "function") {
        return result.getText() || null;
      }

      return result.text || null;
    } catch (e) {
      return null;
    } finally {
      URL.revokeObjectURL(url);
    }
  },
};
