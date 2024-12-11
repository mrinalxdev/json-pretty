import JsonVis from "@/components/JsonVizualiser";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-center m-2">Json</h1>
      <p className="text-xl font-semibold text-center mb-5">Parse and beautify your JSON file</p>

      <JsonVis />
    </div>
  );
}
