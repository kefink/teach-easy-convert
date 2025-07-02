"use client";

import React, { useState, useRef } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, ClipboardPaste, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SchemeParsingResults } from "@/components/SchemeParsingResults";
import { SchemeUploadGuidance } from "@/components/SchemeUploadGuidance";
import { ParsingResult } from "@/utils/schemeParser";

// API Configuration
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

// Dynamically import File icon to disable SSR
const FileIcon = dynamic(() => import("lucide-react").then((mod) => mod.File), {
  ssr: false,
});

interface FileUploadProps {
  onUpload: (content: string) => void;
  onParsedDataReady?: (result: ParsingResult) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUpload,
  onParsedDataReady,
}) => {
  const [textContent, setTextContent] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [parsingResult, setParsingResult] = useState<ParsingResult | null>(
    null
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const acceptedFormats = [
    ".pdf",
    ".doc",
    ".docx",
    ".xls",
    ".xlsx",
    ".txt",
    ".rtf",
    ".odt",
    ".ods",
  ];

  const getFileIcon = (fileName: string | null) => {
    return <FileIcon className="h-4 w-4" />;
  };

  const parseFile = async (file: File) => {
    setIsProcessing(true);
    setParsingResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      console.log(`Making request to: ${API_BASE_URL}/parse-scheme/`);

      const response = await fetch(`${API_BASE_URL}/parse-scheme/`, {
        method: "POST",
        body: formData,
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);

        // Try to parse as JSON, fallback to text
        let errorMessage;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.detail || "Failed to parse file on backend.";
        } catch {
          errorMessage = `Server error: ${response.status} - ${errorText}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("Parsed data:", data);

      const result: ParsingResult = {
        success: data.success,
        data: data.success
          ? {
              title: "Parsed Scheme of Work",
              weeks: data.lesson_plans.map((lp: any) => ({
                week: lp.week,
                lesson: lp.lessonNumber || 1,
                strand: lp.strand,
                subStrand: lp.sub_strand,
                lessonLearningOutcome: lp.specific_learning_outcomes.join("\n"),
                learningExperiences: lp.activities.join("\n"),
                keyInquiryQuestion: lp.key_inquiry_question,
                learningResources: lp.learning_resources.join("\n"),
                assessment: lp.assessment,
                reflection: lp.reflection,
              })),
              term: data.lesson_plans[0]?.term?.toString() || undefined,
            }
          : null,
        errors: data.success ? [] : [data.message],
        warnings: [],
      };

      setParsingResult(result);
      if (onParsedDataReady) {
        onParsedDataReady(result);
      }

      if (result.success) {
        toast({
          title: "Scheme parsed successfully!",
          description: `Found ${result.data?.weeks.length} lessons. Please review the extracted information.`,
        });
      } else {
        // For parsing failures, show helpful guidance
        const errorMessage =
          result.errors[0] || "Could not parse the scheme format.";
        let guidance = "";

        if (
          errorMessage.includes("structure") ||
          errorMessage.includes("format")
        ) {
          guidance =
            " Try uploading a different format or check if your scheme follows CBC standards.";
        } else if (
          errorMessage.includes("week") ||
          errorMessage.includes("lesson")
        ) {
          guidance =
            " Make sure your scheme has clear week and lesson indicators.";
        } else if (
          errorMessage.includes("server") ||
          errorMessage.includes("connect")
        ) {
          guidance = " Please check your internet connection and try again.";
        }

        toast({
          title: "Parsing encountered issues",
          description: errorMessage + guidance,
          variant: "destructive",
        });

        // Still allow user to proceed to manual configuration
        if (onParsedDataReady) {
          const fallbackResult: ParsingResult = {
            success: false,
            data: {
              title: "Manual Configuration Required",
              weeks: [],
              term: undefined,
            },
            errors: [errorMessage],
            warnings: [
              "You can still proceed with manual lesson plan configuration.",
            ],
          };
          onParsedDataReady(fallbackResult);
        }
      }
    } catch (error: any) {
      console.error("File upload and parsing error:", error);

      let errorMessage = "An unexpected error occurred during file processing.";

      if (error.message.includes("fetch")) {
        errorMessage = `Cannot connect to backend server at ${API_BASE_URL}. Make sure the backend is running.`;
      } else {
        errorMessage = error.message;
      }

      toast({
        title: "Error processing file",
        description: errorMessage,
        variant: "destructive",
      });

      setParsingResult({
        success: false,
        data: null,
        errors: [errorMessage],
        warnings: [],
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTextSubmit = async () => {
    if (!textContent.trim()) {
      toast({
        title: "No content provided",
        description: "Please enter some content or upload a file.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setParsingResult(null);

    try {
      console.log(`Making request to: ${API_BASE_URL}/parse-text/`);

      const response = await fetch(`${API_BASE_URL}/parse-text/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text_content: textContent }),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);

        let errorMessage;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.detail || "Failed to parse text on backend.";
        } catch {
          errorMessage = `Server error: ${response.status} - ${errorText}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("Parsed data:", data);

      const result: ParsingResult = {
        success: data.success,
        data: data.success
          ? {
              title: "Parsed Scheme of Work (Text Input)",
              weeks: data.lesson_plans.map((lp: any) => ({
                week: lp.week,
                lesson: lp.lessonNumber || 1,
                strand: lp.strand,
                subStrand: lp.sub_strand,
                lessonLearningOutcome: lp.specific_learning_outcomes.join("\n"),
                learningExperiences: lp.activities.join("\n"),
                keyInquiryQuestion: lp.key_inquiry_question,
                learningResources: lp.learning_resources.join("\n"),
                assessment: lp.assessment,
                reflection: lp.reflection,
              })),
              term: data.lesson_plans[0]?.term?.toString() || undefined,
            }
          : null,
        errors: data.success ? [] : [data.message],
        warnings: [],
      };

      setParsingResult(result);
      if (onParsedDataReady) {
        onParsedDataReady(result);
      }

      if (result.success) {
        toast({
          title: "Scheme parsed successfully!",
          description: `Found ${result.data?.weeks.length} lessons from text.`,
        });
      } else {
        // For parsing failures, show helpful guidance
        const errorMessage =
          result.errors[0] || "Could not parse the text content.";
        let guidance = "";

        if (
          errorMessage.includes("structure") ||
          errorMessage.includes("format")
        ) {
          guidance =
            " Try formatting your text with clear sections for each week/lesson.";
        } else if (
          errorMessage.includes("week") ||
          errorMessage.includes("lesson")
        ) {
          guidance =
            " Make sure your text includes week numbers and lesson details.";
        }

        toast({
          title: "Parsing encountered issues",
          description: errorMessage + guidance,
          variant: "destructive",
        });

        // Still allow user to proceed to manual configuration
        if (onParsedDataReady) {
          const fallbackResult: ParsingResult = {
            success: false,
            data: {
              title: "Manual Configuration Required",
              weeks: [],
              term: undefined,
            },
            errors: [errorMessage],
            warnings: [
              "You can still proceed with manual lesson plan configuration.",
            ],
          };
          onParsedDataReady(fallbackResult);
        }
      }
    } catch (error: any) {
      console.error("Text parsing error:", error);

      let errorMessage = "An unexpected error occurred during text processing.";

      if (error.message.includes("fetch")) {
        errorMessage = `Cannot connect to backend server at ${API_BASE_URL}. Make sure the backend is running.`;
      } else {
        errorMessage = error.message;
      }

      toast({
        title: "Error processing text",
        description: errorMessage,
        variant: "destructive",
      });

      setParsingResult({
        success: false,
        data: null,
        errors: [errorMessage],
        warnings: [],
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileSelect = (file: File) => {
    const fileName = file.name.toLowerCase();
    const isSupported = acceptedFormats.some((format) =>
      fileName.endsWith(format.slice(1))
    );

    if (!isSupported) {
      toast({
        title: "Unsupported file type",
        description: `Please upload files in these formats: ${acceptedFormats.join(
          ", "
        )}`,
        variant: "destructive",
      });
      return;
    }

    setUploadedFileName(file.name);
    parseFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleConfirmParsedData = () => {
    if (parsingResult && parsingResult.success && parsingResult.data) {
      // Only call onParsedDataReady, not onUpload to avoid double processing
      if (onParsedDataReady) {
        onParsedDataReady(parsingResult);
      }
    } else {
      toast({
        title: "Cannot confirm",
        description: "No valid parsed data to confirm.",
        variant: "destructive",
      });
    }
  };

  const handleEditParsedData = () => {
    if (parsingResult && parsingResult.success && parsingResult.data) {
      // Only call onParsedDataReady, not onUpload to avoid double processing
      if (onParsedDataReady) {
        onParsedDataReady(parsingResult);
      }
    } else {
      toast({
        title: "Cannot edit",
        description: "No valid parsed data to edit.",
        variant: "destructive",
      });
    }
  };

  const handleReparse = () => {
    if (textContent) {
      handleTextSubmit();
    } else if (uploadedFileName && fileInputRef.current?.files?.[0]) {
      parseFile(fileInputRef.current.files[0]);
    } else {
      toast({
        title: "Nothing to re-parse",
        description: "No content or file available to re-parse.",
        variant: "info",
      });
    }
  };

  if (parsingResult) {
    return (
      <SchemeParsingResults
        result={parsingResult}
        onConfirm={handleConfirmParsedData}
        onEdit={handleEditParsedData}
        onReparse={handleReparse}
      />
    );
  }

  return (
    <div className="space-y-4">
      {isProcessing && (
        <Card className="backdrop-blur-md bg-secondary-dark/40 border border-secondary-dark/50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Zap className="h-5 w-5 text-accent-gold animate-pulse" />
              <div>
                <p className="font-medium text-text-white">
                  Parsing your scheme of work...
                </p>
                <p className="text-sm text-text-gray">
                  Extracting weeks, lessons, strands, and learning outcomes
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card
        className={`border-2 border-dashed transition-colors cursor-pointer backdrop-blur-sm ${
          dragOver
            ? "border-accent-gold bg-secondary-dark/30"
            : "border-secondary-dark/50 hover:border-secondary-dark/70 bg-secondary-dark/20"
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => fileInputRef.current?.click()}
      >
        <CardContent className="p-8 text-center">
          <Upload
            className={`h-12 w-12 mx-auto mb-4 ${
              dragOver ? "text-accent-gold" : "text-text-gray"
            }`}
          />
          <p className="text-lg font-medium text-text-white mb-2">
            Drop your scheme of work file here
          </p>
          <p className="text-sm text-text-gray mb-2">
            Supports PDF, Word, Excel, and text files
          </p>
          <p className="text-xs text-text-gray mb-4">
            {acceptedFormats.join(", ")}
          </p>

          {uploadedFileName && (
            <div className="mb-4 p-2 bg-secondary-dark/80 backdrop-blur-sm rounded-lg border border-secondary-dark/50">
              <div className="flex items-center justify-center space-x-2 text-accent-gold">
                {getFileIcon(uploadedFileName)}
                <span className="text-sm font-medium text-text-white">
                  {uploadedFileName}
                </span>
              </div>
            </div>
          )}

          <Button
            variant="outline"
            className="mt-2 backdrop-blur-sm bg-secondary-dark/50 border-secondary-dark/30 text-text-white"
            onClick={() => fileInputRef.current?.click()}
          >
            <FileText className="h-4 w-4 mr-2" />
            Choose File
          </Button>
        </CardContent>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFormats.join(",")}
        onChange={handleFileInputChange}
        className="hidden"
      />

      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-sm text-text-gray">
          <ClipboardPaste className="h-4 w-4" />
          <span>Or paste your scheme of work content directly:</span>
        </div>
        <Textarea
          placeholder="Paste your scheme of work content here..."
          value={textContent}
          onChange={(e) => setTextContent(e.target.value)}
          className="min-h-32 resize-none backdrop-blur-sm bg-secondary-dark/30 border-secondary-dark/30 text-text-white placeholder:text-text-gray"
        />
        <Button
          onClick={handleTextSubmit}
          disabled={!textContent.trim() || isProcessing}
          className="w-full backdrop-blur-sm bg-gradient-to-r from-accent-gold to-accent-gold hover:from-accent-gold/90 hover:to-accent-gold/90 border border-accent-gold/30 text-primary-dark"
        >
          {isProcessing ? (
            <>
              <Zap className="h-4 w-4 mr-2 animate-pulse" />
              Parsing Content...
            </>
          ) : (
            "Parse & Use Content"
          )}
        </Button>
      </div>

      <SchemeUploadGuidance />
    </div>
  );
};
