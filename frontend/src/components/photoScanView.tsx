/* eslint-disable */
import { useCallback, useRef, useState } from "react";
import { Button } from "@heroui/react";
import { usePhotoScan } from "@/hooks/usePhotoScan";

export function PhotoScanView({ onCode }: { onCode: (code: string) => void }) {
  const { isScanning, error, scanFile } = usePhotoScan();
  const [dragOver, setDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File | undefined) => {
      if (!file) return;
      try {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } catch {}
      const code = await scanFile(file);
      if (code) onCode(code);
    },
    [scanFile, onCode, previewUrl]
  );

  return (
    <div className="space-y-3">
      <div
        className={
          "rounded-medium border border-dashed p-6 text-center " +
          (dragOver ? "bg-default-100" : "")
        }
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const file = e.dataTransfer.files?.[0];
          handleFile(file);
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        <div className="mb-2">Drop a barcode photo here, or</div>
        <Button
          onPress={() => inputRef.current?.click()}
          isLoading={isScanning}
        >
          {isScanning ? "Scanning…" : "Upload / Capture"}
        </Button>
        {error && <div className="text-danger text-sm mt-2">{error}</div>}
      </div>
      {previewUrl && (
        <div className="rounded-medium border p-2">
          <div className="text-xs text-default-500 mb-1">
            Uploaded image preview
          </div>
          <img
            src={previewUrl}
            alt="Uploaded barcode"
            className="max-h-64 w-auto object-contain mx-auto"
          />
        </div>
      )}
    </div>
  );
}
