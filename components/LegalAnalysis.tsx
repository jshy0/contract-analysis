"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Inter } from "next/font/google";
import { Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

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
      className={`flex flex-col items-center justify-center min-h-screen ${inter.className} p-4`}
    >
      <div className="max-w-4xl w-full">
        <h1 className="text-2xl font-semibold uppercase text-center mb-6">
          AI Contract Analysis
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-6 p-6 bg-slate-100 rounded-lg shadow-sm">
            <div>
              <Label className="text-md mb-2 block">Paste document text:</Label>
              <Textarea
                className="bg-white min-h-40"
                value={contractText}
                onChange={(e) => setContractText(e.target.value)}
              />
            </div>

            <div>
              <Label className="text-md mb-2 block">
                Additional information:
              </Label>
              <Textarea
                className="bg-white"
                placeholder="Provide context or specific questions about the contract"
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
              />
            </div>

            <Button
              className={`w-full ${inter.className}`}
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analysing...
                </>
              ) : (
                "Analyse Contract"
              )}
            </Button>

            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-slate-200">
            <h2 className="text-md font-medium mb-4">Result:</h2>

            {isLoading ? (
              <div className="flex items-center justify-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
              </div>
            ) : analysis ? (
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap">
                  <ReactMarkdown>{analysis}</ReactMarkdown>
                </div>
              </div>
            ) : (
              <div className="text-slate-500 text-center p-8">
                Submit your contract to see the analysis here
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalAnalysis;
