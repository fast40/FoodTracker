import { useCallback, useState } from "react";
import { zxingImageScanner } from "../services/adapters/scanner/zxing";

export function usePhotoScan(scanner = zxingImageScanner) {
  const [upc, setUpc] = useState(null);
  const [error, setError] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  const scanFile = useCallback(
    async (file) => {
      setError(null);
      setIsScanning(true);

      try {
        // Basic validation
        if (!file.type.startsWith("image/")) {
          throw new Error("Please select an image file.");
        }

        const code = await scanner.decode(file);

        setUpc(code);

        if (!code) {
          setError("No barcode found. Try a clearer photo or manual entry.");
        }

        return code;
      } catch (e) {
        setError((e && e.message) || "Failed to scan image.");
        setUpc(null);
        return null;
      } finally {
        setIsScanning(false);
      }
    },
    [scanner]
  );

  return { upc, error, isScanning, scanFile };
}
