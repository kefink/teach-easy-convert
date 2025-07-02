"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertTriangle, Info } from "lucide-react";

export const SchemeUploadGuidance: React.FC = () => {
  return (
    <div className="space-y-4">
      <Alert className="bg-blue-500/10 border-blue-500/20">
        <Info className="h-4 w-4 text-blue-400" />
        <AlertDescription className="text-blue-300">
          <strong>Tip:</strong> For best results, ensure your scheme of work
          follows standard CBC format with clear table structure.
        </AlertDescription>
      </Alert>

      <Card className="backdrop-blur-md bg-secondary-dark/40 border border-secondary-dark/30">
        <CardHeader>
          <CardTitle className="text-accent-gold flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            Supported Scheme Formats
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-text-white mb-2">
                ✅ Well-Structured Schemes Include:
              </h4>
              <ul className="text-sm text-text-gray space-y-1">
                <li>• Clear week and lesson numbers</li>
                <li>• Defined strands and sub-strands</li>
                <li>• Specific learning outcomes</li>
                <li>• Learning experiences/activities</li>
                <li>• Key inquiry questions</li>
                <li>• Learning resources</li>
                <li>• Assessment methods</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-text-white mb-2">
                📋 Table Format Examples:
              </h4>
              <ul className="text-sm text-text-gray space-y-1">
                <li>• Week | Lesson | Strand | Sub-strand...</li>
                <li>• Organized in columns or clear sections</li>
                <li>• Consistent formatting throughout</li>
                <li>• Readable fonts and spacing</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="backdrop-blur-md bg-secondary-dark/40 border border-secondary-dark/30">
        <CardHeader>
          <CardTitle className="text-orange-400 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Common Issues & Solutions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <p className="text-sm text-text-white font-medium">
              ❌ Parsing may fail if:
            </p>
            <ul className="text-sm text-text-gray space-y-1 ml-4">
              <li>• Scheme is in image format or scanned PDF</li>
              <li>• Table structure is unclear or inconsistent</li>
              <li>• Text is in multiple columns without clear separation</li>
              <li>• Week/lesson numbers are missing or unclear</li>
            </ul>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-text-white font-medium">✅ Solutions:</p>
            <ul className="text-sm text-text-gray space-y-1 ml-4">
              <li>• Use text-based PDFs or Word documents</li>
              <li>• Ensure clear table formatting</li>
              <li>• Include week numbers (Week 1, Week 2, etc.)</li>
              <li>• You can always proceed with manual configuration</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Alert className="bg-green-500/10 border-green-500/20">
        <CheckCircle className="h-4 w-4 text-green-400" />
        <AlertDescription className="text-green-300">
          <strong>Don&apos;t worry!</strong> Even if automatic parsing fails,
          you can still configure and generate lesson plans manually using our
          guided process.
        </AlertDescription>
      </Alert>
    </div>
  );
};
