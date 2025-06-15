
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Download, Clock, Target, Activity, FileText, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LessonPlan {
  id: number;
  title: string;
  duration: string;
  objectives: string[];
  activities: string[];
  resources: string[];
  assessment: string;
}

interface ConversionResultsProps {
  lessons: LessonPlan[];
  isLoading: boolean;
}

export const ConversionResults: React.FC<ConversionResultsProps> = ({ lessons, isLoading }) => {
  const { toast } = useToast();

  const handleDownload = (lesson: LessonPlan) => {
    // Create a formatted lesson plan document
    const content = `
LESSON PLAN: ${lesson.title}
Duration: ${lesson.duration}

LEARNING OBJECTIVES:
${lesson.objectives.map(obj => `• ${obj}`).join('\n')}

ACTIVITIES:
${lesson.activities.map((activity, index) => `${index + 1}. ${activity}`).join('\n')}

RESOURCES NEEDED:
${lesson.resources.map(resource => `• ${resource}`).join('\n')}

ASSESSMENT:
${lesson.assessment}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${lesson.title.replace(/\s+/g, '_')}_Lesson_Plan.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download started",
      description: `Lesson plan "${lesson.title}" has been downloaded.`,
    });
  };

  const handleDownloadAll = () => {
    lessons.forEach((lesson, index) => {
      setTimeout(() => handleDownload(lesson), index * 500);
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Converting your scheme of work...</p>
          <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
        </div>
      </div>
    );
  }

  if (lessons.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
        <p className="text-lg">No lesson plans generated yet</p>
        <p className="text-sm">Upload a scheme of work to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with download all button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <span className="font-medium text-gray-900">
            {lessons.length} lesson plan{lessons.length > 1 ? 's' : ''} generated
          </span>
        </div>
        <Button onClick={handleDownloadAll} className="bg-green-600 hover:bg-green-700">
          <Download className="h-4 w-4 mr-2" />
          Download All
        </Button>
      </div>

      {/* Lesson Plans */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {lessons.map((lesson) => (
          <Card key={lesson.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-gray-900">{lesson.title}</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(lesson)}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>{lesson.duration}</span>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Learning Objectives */}
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Target className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-sm">Learning Objectives</span>
                </div>
                <div className="space-y-1">
                  {lesson.objectives.map((objective, index) => (
                    <Badge key={index} variant="secondary" className="mr-2 mb-1">
                      {objective}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Activities */}
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Activity className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-sm">Activities</span>
                </div>
                <ul className="text-sm text-gray-700 space-y-1">
                  {lesson.activities.map((activity, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-gray-400 mt-0.5">•</span>
                      <span>{activity}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Separator />

              {/* Resources & Assessment */}
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-900">Resources:</span>
                  <p className="text-gray-700 mt-1">{lesson.resources.join(', ')}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Assessment:</span>
                  <p className="text-gray-700 mt-1">{lesson.assessment}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
