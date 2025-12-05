import React from "react";
import DefaultLayout from "@/layouts/default";
import { PhotoScanView } from "@/components/photoScanView";

function Scan() {
  const handleCode = (upc) => {
    console.log("Scanned UPC:", upc);
    // call backend, look up food item, etc.
  };

  return (
    <DefaultLayout>
      <div className="flex flex-col gap-6 max-w-2xl mx-auto py-6">
        <h1 className="text-2xl font-semibold">Scan a Food Item</h1>
        <p className="text-sm text-default-500">
          Upload or capture a barcode photo to quickly look up a food item by
          its UPC.
        </p>

        <div className="border border-default-200 rounded-xl p-4 bg-content1">
          <PhotoScanView onCode={handleCode} />
        </div>
      </div>
    </DefaultLayout>
  );
}

export default Scan;
