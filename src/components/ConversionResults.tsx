
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Download, Clock, Target, Activity, FileText, CheckCircle, BookOpen, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LessonPlan } from '@/types/LessonPlan';

interface ConversionResultsProps {
  lessons: LessonPlan[];
  isLoading: boolean;
}

export const ConversionResults: React.FC<ConversionResultsProps> = ({ lessons, isLoading }) => {
  const { toast } = useToast();

  const handleDownload = (lesson: LessonPlan) => {
    const content = `
LESSON PLAN

SCHOOL: ${lesson.school || '_________________'}
LEVEL: ${lesson.level}
LEARNING AREA: ${lesson.learningArea}
DATE: ${lesson.date || '_________________'}
TIME: ${lesson.time || '_________________'}
ROLL: ${lesson.roll || '_________________'}

LESSON: ${lesson.week ? `2025 Rationalized Week ${lesson.week}:` : ''} Lesson ${lesson.lessonNumber}
TITLE: ${lesson.title}

STRAND: ${lesson.strand}
SUB-STRAND: ${lesson.subStrand}

SPECIFIC LEARNING OUTCOMES:
${lesson.specificLearningOutcomes.map(outcome => `• ${outcome}`).join('\n')}

KEY INQUIRY QUESTION:
${lesson.keyInquiryQuestion}

LEARNING RESOURCES:
${lesson.learningResources.map(resource => `• ${resource}`).join('\n')}

ORGANIZATION OF LEARNING:

INTRODUCTION (${lesson.introduction.duration}):
${lesson.introduction.activities.map(activity => `• ${activity}`).join('\n')}

LESSON DEVELOPMENT (${lesson.lessonDevelopment.duration}):
${lesson.lessonDevelopment.steps.map(step => 
  `Step ${step.stepNumber}: ${step.activity}${step.duration ? ` (${step.duration})` : ''}`
).join('\n')}

CONCLUSION (${lesson.conclusion.duration}):
${lesson.conclusion.activities.map(activity => `• ${activity}`).join('\n')}

${lesson.extendedActivities ? `EXTENDED ACTIVITIES:
${lesson.extendedActivities.map(activity => `• ${activity}`).join('\n')}` : ''}

ASSESSMENT:
${lesson.assessment}

TEACHER SELF-EVALUATION:
${lesson.teacherSelfEvaluation || '_________________'}

REFLECTION:
${lesson.reflection || '_________________'}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Week_${lesson.week}_Lesson_${lesson.lessonNumber}_${lesson.title.replace(/\s+/g, '_')}.txt`;
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
          <p className="text-sm text-gray-500 mt-2">Generating structured lesson plans</p>
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
          <Card key={lesson.id} className="hover:shadow-md transition-shadow backdrop-blur-sm bg-white/60 border border-white/30">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-gray-900">
                  Week {lesson.week}: {lesson.title}
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(lesson)}
                  className="backdrop-blur-sm bg-white/50"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <BookOpen className="h-4 w-4" />
                  <span>{lesson.learningArea}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{lesson.level}</span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Strand and Sub-strand */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <span className="font-medium text-blue-600 text-sm">Strand:</span>
                  <p className="text-gray-700 text-sm">{lesson.strand}</p>
                </div>
                <div>
                  <span className="font-medium text-blue-600 text-sm">Sub-strand:</span>
                  <p className="text-gray-700 text-sm">{lesson.subStrand}</p>
                </div>
              </div>

              <Separator />

              {/* Learning Outcomes */}
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Target className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-sm">Specific Learning Outcomes</span>
                </div>
                <div className="space-y-1">
                  {lesson.specificLearningOutcomes.slice(0, 2).map((outcome, index) => (
                    <p key={index} className="text-sm text-gray-700 flex items-start space-x-2">
                      <span className="text-gray-400 mt-0.5">•</span>
                      <span>{outcome}</span>
                    </p>
                  ))}
                  {lesson.specificLearningOutcomes.length > 2 && (
                    <p className="text-xs text-gray-500">
                      +{lesson.specificLearningOutcomes.length - 2} more outcomes
                    </p>
                  )}
                </div>
              </div>

              <Separator />

              {/* Key Inquiry Question */}
              <div>
                <span className="font-medium text-purple-600 text-sm">Key Inquiry Question:</span>
                <p className="text-gray-700 text-sm mt-1 italic">{lesson.keyInquiryQuestion}</p>
              </div>

              <Separator />

              {/* Learning Organization Summary */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center p-2 bg-blue-50 rounded">
                  <Clock className="h-3 w-3 mx-auto mb-1 text-blue-600" />
                  <p className="font-medium">Introduction</p>
                  <p className="text-gray-600">{lesson.introduction.duration}</p>
                </div>
                <div className="text-center p-2 bg-green-50 rounded">
                  <Activity className="h-3 w-3 mx-auto mb-1 text-green-600" />
                  <p className="font-medium">Development</p>
                  <p className="text-gray-600">{lesson.lessonDevelopment.duration}</p>
                </div>
                <div className="text-center p-2 bg-orange-50 rounded">
                  <CheckCircle className="h-3 w-3 mx-auto mb-1 text-orange-600" />
                  <p className="font-medium">Conclusion</p>
                  <p className="text-gray-600">{lesson.conclusion.duration}</p>
                </div>
              </div>

              {/* Assessment */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <span className="font-medium text-gray-900 text-sm">Assessment:</span>
                <p className="text-gray-700 text-sm mt-1">{lesson.assessment}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
