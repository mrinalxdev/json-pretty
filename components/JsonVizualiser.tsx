"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Folder, File, ChevronRight, ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type JsonNode = {
  key: string;
  value: any;
  type: "object" | "array" | "string" | "number" | "boolean" | "null";
};

export default function JsonVisualizer() {
  const [jsonData, setJsonData] = useState<JsonNode | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [rawData, setRawData] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string);
          setJsonData(parseJson("root", json));
          setError(null);
        } catch (err) {
          setError("Invalid JSON file. Please check your file and try again.");
          setJsonData(null);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleRawDataSubmit = () => {
    try {
      const json = JSON.parse(rawData);
      setJsonData(parseJson("root", json));
      setError(null);
      setIsDialogOpen(false);
    } catch (err) {
      setError("Invalid JSON data. Please check your input and try again.");
      setJsonData(null);
    }
  };

  const parseJson = (key: string, value: any): JsonNode => {
    const type = Array.isArray(value) ? "array" : typeof value;
    return { key, value, type: type as JsonNode["type"] };
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] gap-4">
      <div className="flex gap-4">
        <Card className="w-1/3 p-4">
          <CardContent>
            <Label
              htmlFor="json-file"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              Upload JSON File
            </Label>
            <Input
              id="json-file"
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="mb-4"
            />

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  Enter Raw Data
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Enter Raw Data</DialogTitle>
                  <DialogDescription>
                    Paste your raw data here. We'll convert it to JSON for
                    visualization.
                  </DialogDescription>
                </DialogHeader>
                <Textarea
                  value={rawData}
                  onChange={(e) => setRawData(e.target.value)}
                  placeholder="Paste your raw data here..."
                  className="min-h-[200px]"
                />
                <Button onClick={handleRawDataSubmit}>Visualize</Button>
              </DialogContent>
            </Dialog>

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card className="w-2/3 p-4 overflow-y-auto bg-gray-50">
          <CardContent>
            {jsonData && <JsonTreeView node={jsonData} />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function JsonTreeView({ node }: { node: JsonNode }) {
  const [isOpen, setIsOpen] = useState(true);

  const toggleOpen = () => setIsOpen(!isOpen);

  const renderValue = () => {
    switch (node.type) {
      case "object":
        return (
          <div>
            {Object.entries(node.value).map(([key, value]) => (
              <JsonTreeView key={key} node={parseJson(key, value)} />
            ))}
          </div>
        );
      case "array":
        return (
          <div>
            {node.value.map((item: any, index: number) => (
              <JsonTreeView key={index} node={parseJson(`[${index}]`, item)} />
            ))}
          </div>
        );
      default:
        return (
          <span className="text-blue-600">{JSON.stringify(node.value)}</span>
        );
    }
  };

  const isExpandable = node.type === "object" || node.type === "array";

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="ml-4"
    >
      <div className="flex items-center">
        {isExpandable && (
          <button onClick={toggleOpen} className="mr-1 focus:outline-none">
            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
        )}
        {isExpandable ? (
          node.type === "object" ? (
            <Folder size={16} className="mr-2 text-yellow-500" />
          ) : (
            <File size={16} className="mr-2 text-green-500" />
          )
        ) : (
          <div className="w-4 h-4 mr-2" /> // Spacer
        )}
        <span className="font-medium">{node.key}:</span>
        {!isExpandable && renderValue()}
      </div>
      {isExpandable && isOpen && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {renderValue()}
          </motion.div>
        </AnimatePresence>
      )}
    </motion.div>
  );
}

function parseJson(key: string, value: any): JsonNode {
  const type = Array.isArray(value) ? "array" : typeof value;
  return { key, value, type: type as JsonNode["type"] };
}
