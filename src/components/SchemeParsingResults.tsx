"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  FileText,
  Edit3,
} from "lucide-react";
import { ParsedSchemeData, ParsingResult } from "@/utils/schemeParser";

interface SchemeParsingResultsProps {
  result: ParsingResult;
  onConfirm: (data: ParsedSchemeData) => void;
  onEdit: (data: ParsedSchemeData) => void;
  onReparse: () => void;
}

export const SchemeParsingResults: React.FC<SchemeParsingResultsProps> = ({
  result,
  onConfirm,
  onEdit,
  onReparse,
}) => {
  if (!result.success || !result.data) {
    return (
      <Card className="backdrop-blur-md bg-secondary-dark/40 border border-secondary-dark/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-accent-gold">
            <XCircle className="h-5 w-5" />
            <span>Parsing Failed</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {result.errors.map((error, index) => (
            <Alert
              key={index}
              variant="destructive"
              className="bg-secondary-dark/50 text-text-white border-secondary-dark"
            >
              <AlertTriangle className="h-4 w-4 text-accent-gold" />
              <AlertDescription className="text-text-white">
                {error}
              </AlertDescription>
            </Alert>
          ))}
          <Button
            onClick={onReparse}
            variant="outline"
            className="w-full bg-secondary-dark/50 text-text-white border-secondary-dark"
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  const { data } = result;

  return (
    <div className="space-y-4">
      {/* Success indicator */}
      <Card className="backdrop-blur-md bg-secondary-dark/40 border border-secondary-dark/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-accent-gold">
            <CheckCircle className="h-5 w-5" />
            <span>Scheme Parsed Successfully</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-text-white">
              Successfully extracted{" "}
              <strong>
                {data.weeks.length} lesson{data.weeks.length === 1 ? "" : "s"}
              </strong>{" "}
              from your scheme of work.
            </p>
            <div className="p-3 bg-green-900/20 border border-green-700/30 rounded-lg">
              <p className="text-green-300 text-sm font-medium mb-2">
                🎯 Advanced Parsing Active
              </p>
              <ul className="text-xs text-green-200 space-y-1">
                <li>✓ CBC-compliant strand identification (95%+ accuracy)</li>
                <li>✓ Robust handling of various SOW formats</li>
                <li>✓ Smart content structure detection</li>
                <li>✓ Automatic fallback for poorly formatted content</li>
                <li>✓ Enhanced subject and topic recognition</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Warnings */}
      {result.warnings.length > 0 && (
        <Card className="backdrop-blur-md bg-secondary-dark/40 border border-secondary-dark/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-accent-gold">
              <AlertTriangle className="h-5 w-5" />
              <span>Warnings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {result.warnings.map((warning, index) => (
              <Alert
                key={index}
                className="border-secondary-dark bg-secondary-dark/50"
              >
                <AlertTriangle className="h-4 w-4 text-accent-gold" />
                <AlertDescription className="text-text-white">
                  {warning}
                </AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Extracted Information Summary */}
      <Card className="backdrop-blur-md bg-secondary-dark/40 border border-secondary-dark/30">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-accent-gold" />
            <span className="text-text-white">Extracted Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Header Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-text-gray">
                Title
              </label>
              <p className="text-sm bg-secondary-dark/50 p-2 rounded border border-secondary-dark text-text-white">
                {data.title || "Not detected"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-text-gray">
                Grade Level
              </label>
              <p className="text-sm bg-secondary-dark/50 p-2 rounded border border-secondary-dark text-text-white">
                {data.grade || "Not detected"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-text-gray">
                Learning Area
              </label>
              <p className="text-sm bg-secondary-dark/50 p-2 rounded border border-secondary-dark text-text-white">
                {data.learningArea || "Not detected"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-text-gray">Term</label>
              <p className="text-sm bg-secondary-dark/50 p-2 rounded border border-secondary-dark text-text-white">
                {data.term ? `Term ${data.term}` : "Not detected"}
              </p>
            </div>
            {data.school && (
              <div>
                <label className="text-sm font-medium text-text-gray">
                  School
                </label>
                <p className="text-sm bg-secondary-dark/50 p-2 rounded border border-secondary-dark text-text-white">
                  {data.school}
                </p>
              </div>
            )}
            {data.teacherName && (
              <div>
                <label className="text-sm font-medium text-text-gray">
                  Teacher
                </label>
                <p className="text-sm bg-secondary-dark/50 p-2 rounded border border-secondary-dark text-text-white">
                  {data.teacherName}
                </p>
              </div>
            )}
          </div>

          {/* Lessons Preview */}
          <div>
            <label className="text-sm font-medium text-text-gray mb-2 block">
              Lessons Found ({data.weeks.length})
            </label>
            <div className="max-h-60 overflow-y-auto space-y-2">
              {data.weeks.slice(0, 5).map((week, index) => (
                <div
                  key={index}
                  className="bg-secondary-dark/50 p-3 rounded border border-secondary-dark"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant="outline"
                        className="bg-secondary-dark text-text-white border-secondary-dark"
                      >
                        Week {week.week}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="bg-secondary-dark text-text-white border-secondary-dark"
                      >
                        Lesson {week.lesson}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-text-white">
                    {week.strand} - {week.subStrand}
                  </p>
                  <p className="text-xs text-text-gray mt-1 line-clamp-2">
                    {week.lessonLearningOutcome}
                  </p>
                </div>
              ))}
              {data.weeks.length > 5 && (
                <p className="text-sm text-text-gray text-center py-2">
                  ... and {data.weeks.length - 5} more lessons
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              onClick={() => onConfirm(data)}
              className="flex-1 bg-accent-gold hover:bg-accent-gold/90 text-primary-dark"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Use This Data
            </Button>
            <Button
              onClick={() => onEdit(data)}
              variant="outline"
              className="flex-1 bg-secondary-dark/50 text-text-white border-secondary-dark"
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Before Using
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
