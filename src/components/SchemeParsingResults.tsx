
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertTriangle, XCircle, FileText, Edit3 } from 'lucide-react';
import { ParsedSchemeData, ParsingResult } from '@/utils/schemeParser';

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
  onReparse
}) => {
  if (!result.success || !result.data) {
    return (
      <Card className="backdrop-blur-md bg-red-50/40 border border-red-200/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-800">
            <XCircle className="h-5 w-5" />
            <span>Parsing Failed</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {result.errors.map((error, index) => (
            <Alert key={index} variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ))}
          <Button onClick={onReparse} variant="outline" className="w-full">
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
      <Card className="backdrop-blur-md bg-green-50/40 border border-green-200/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-green-800">
            <CheckCircle className="h-5 w-5" />
            <span>Scheme Parsed Successfully</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-green-700">
            Found {data.weeks.length} lesson{data.weeks.length === 1 ? '' : 's'} in your scheme of work.
          </p>
        </CardContent>
      </Card>

      {/* Warnings */}
      {result.warnings.length > 0 && (
        <Card className="backdrop-blur-md bg-yellow-50/40 border border-yellow-200/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-yellow-800">
              <AlertTriangle className="h-5 w-5" />
              <span>Warnings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {result.warnings.map((warning, index) => (
              <Alert key={index} className="border-yellow-200">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-yellow-800">{warning}</AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Extracted Information Summary */}
      <Card className="backdrop-blur-md bg-white/40 border border-white/30">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <span>Extracted Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Header Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Title</label>
              <p className="text-sm bg-gray-50/50 p-2 rounded border">
                {data.title || 'Not detected'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Grade Level</label>
              <p className="text-sm bg-gray-50/50 p-2 rounded border">
                {data.grade || 'Not detected'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Learning Area</label>
              <p className="text-sm bg-gray-50/50 p-2 rounded border">
                {data.learningArea || 'Not detected'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Term</label>
              <p className="text-sm bg-gray-50/50 p-2 rounded border">
                {data.term ? `Term ${data.term}` : 'Not detected'}
              </p>
            </div>
            {data.school && (
              <div>
                <label className="text-sm font-medium text-gray-600">School</label>
                <p className="text-sm bg-gray-50/50 p-2 rounded border">{data.school}</p>
              </div>
            )}
            {data.teacherName && (
              <div>
                <label className="text-sm font-medium text-gray-600">Teacher</label>
                <p className="text-sm bg-gray-50/50 p-2 rounded border">{data.teacherName}</p>
              </div>
            )}
          </div>

          {/* Lessons Preview */}
          <div>
            <label className="text-sm font-medium text-gray-600 mb-2 block">
              Lessons Found ({data.weeks.length})
            </label>
            <div className="max-h-60 overflow-y-auto space-y-2">
              {data.weeks.slice(0, 5).map((week, index) => (
                <div key={index} className="bg-gray-50/50 p-3 rounded border">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">Week {week.week}</Badge>
                      <Badge variant="outline">Lesson {week.lesson}</Badge>
                    </div>
                  </div>
                  <p className="text-sm font-medium">{week.strand} - {week.subStrand}</p>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                    {week.lessonLearningOutcome}
                  </p>
                </div>
              ))}
              {data.weeks.length > 5 && (
                <p className="text-sm text-gray-500 text-center py-2">
                  ... and {data.weeks.length - 5} more lessons
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button 
              onClick={() => onConfirm(data)}
              className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Use This Data
            </Button>
            <Button 
              onClick={() => onEdit(data)}
              variant="outline"
              className="flex-1"
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
