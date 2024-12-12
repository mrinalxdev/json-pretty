import JsonVis from "@/components/JsonVizualiser";

export default function Home() {
  return (
    <div className="m-6">
      <h1 className="text-3xl font-bold text-center m-2 font-mono">Json</h1>
      <p className="text-xl font-semibold text-center mb-5 font-mono">
        Parse and beautify your JSON file
      </p>

      <JsonVis />
    </div>
  );
}
