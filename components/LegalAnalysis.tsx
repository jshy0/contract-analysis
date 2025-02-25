"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Inter } from "next/font/google";

const inter = Inter({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const LegalAnalysis = () => {
  const [contractText, setContractText] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!contractText.trim()) {
      setError("Please paste the contract text.");
      return;
    }

    setIsLoading(true);
    setError("");
    setAnalysis("");

    try {
      const response = await fetch("/api/analyse-contract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contractText,
          additionalInfo,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setAnalysis(data.analysis);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occured"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center h-screen ${inter.className} gap-2 text-slate-900`}
    >
      <h1 className="text-xl font-semibold uppercase text-center ">
        Contract analysis
      </h1>
      <div className="flex flex-col gap-6 p-6 w-1/4 border-2 bg-slate-100 rounded-lg shadow-sm shadow-slate-100">
        <div>
          <Label className="text-md">Contract text:</Label>
          <Textarea
            className="bg-white min-h-40"
            value={contractText}
            onChange={(e) => setContractText(e.target.value)}
            placeholder="Paste the contract text here..."
          />
        </div>
        <div>
          <div className="flex justify-between items-center">
            <Label className="text-md">Additional information:</Label>
            <Label className="text-xs font-light text-slate-400">
              (optional)
            </Label>
          </div>

          <Textarea
            className="bg-white"
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            placeholder="Any additional information you would like to provide..."
          />
        </div>
        <Button
          className={`${inter.className}`}
          disabled={isLoading}
          onClick={handleSubmit}
        >
          {isLoading ? "Analysing..." : "Submit"}
        </Button>
      </div>
      {error && <div className="text-red-500 text-sm ">{error}</div>}
    </div>
  );
};

export default LegalAnalysis;
