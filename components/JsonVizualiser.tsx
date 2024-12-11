"use client";

import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

type JsonNode = {
  key: string;
  value: any;
  type: "object" | "array" | "string" | "number" | "boolean" | "null";
};

export default function JsonVis() {
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
      setError("Invalid JSON data. Please check your input");
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
              Upload JSON file
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
                <Button variant="outline" className="w-full">Enter Raw Data</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Enter Raw Data</DialogTitle>
                  <DialogDescription>
                    Paste your raw data here. Converted into beautiful JSON
                  </DialogDescription>
                </DialogHeader>
                <Textarea
                  value={rawData}
                  onChange={(e) => setRawData(e.target.value)}
                />
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
