import DefaultLayout from "@/layouts/default";
import { PhotoScanView } from "@/components/photoScanView";

function Scan() {
  const handleCode = async (upc: string) => {
    console.log("Scanned UPC:", upc);
    let gtin = upc;
    try {
      const params = new URLSearchParams({
        gtin,
      });
      const response = await fetch(
        `http://localhost:8080/food-tracker/api/food-lookup?${params.toString()}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok) throw new Error("Request failed");

      const json = await response.json();
      console.log(json);
    } catch (err: any) {
      console.log("ERROR fetching from /api/food-lookup: " + err.message);
    }
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
