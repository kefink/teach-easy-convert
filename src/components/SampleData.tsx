import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BookOpen, FileText, ArrowRight, Clock, Target, Users } from 'lucide-react';

export const SampleData: React.FC = () => {
  const sampleScheme = `
SCHEME OF WORK: English - Grade 9 - Term 2
Subject: English Language
Year Group: Grade 9
Duration: 8 weeks

WK | LSN | STRAND | SUB-STRAND | LESSON LEARNING OUTCOME | LEARNING EXPERIENCES | KEY INQUIRY QUESTION | LEARNING RESOURCES | ASSESSMENT

1  | 1   | Writing | Creative Writing | Identify elements of narrative writing | Story analysis, group discussions | What makes a story engaging? | Short stories, charts | Formative assessment

1  | 2   | Writing | Creative Writing | Develop character profiles | Character mapping activities | How do authors create memorable characters? | Character templates | Peer assessment

2  | 1   | Reading | Comprehension | Analyze main themes in texts | Text analysis, discussions | What messages do authors convey? | Selected texts | Written responses

2  | 2   | Speaking | Oral Presentation | Present ideas clearly and confidently | Presentation practice | How can we communicate effectively? | Presentation guides | Oral assessment
  `;

  const sampleLessons = [
    {
      title: "Elements of Narrative Writing",
      week: 1,
      lesson: 1,
      level: "Grade 9",
      learningArea: "English",
      strand: "Writing",
      subStrand: "Creative Writing",
      outcomes: [
        "Identify the basic elements of a narrative story",
        "Demonstrate understanding of plot, character, and setting"
      ],
      keyQuestion: "What makes a story interesting and engaging to read?",
      introduction: "5 minutes",
      development: "30 minutes", 
      conclusion: "5 minutes",
      assessment: "Formative assessment through group participation"
    },
    {
      title: "Character Development Techniques",
      week: 1,
      lesson: 2,
      level: "Grade 9", 
      learningArea: "English",
      strand: "Writing",
      subStrand: "Creative Writing",
      outcomes: [
        "Describe different types of characters in stories",
        "Create well-developed characters with distinct traits"
      ],
      keyQuestion: "How do authors make characters come alive in their stories?",
      introduction: "5 minutes",
      development: "30 minutes",
      conclusion: "5 minutes", 
      assessment: "Peer assessment of character profiles"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Sample Conversion</h3>
        <p className="text-gray-600">
          See how a Kenyan curriculum scheme of work gets transformed into detailed lesson plans
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Sample Scheme of Work */}
        <Card className="h-fit backdrop-blur-md bg-white/40 border border-white/30">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-blue-600">
              <FileText className="h-5 w-5" />
              <span>Sample Scheme of Work</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-white/60 p-4 rounded-lg backdrop-blur-sm">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                {sampleScheme.trim()}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Arrow */}
        <div className="hidden lg:flex items-center justify-center">
          <div className="text-center">
            <ArrowRight className="h-12 w-12 text-green-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-600">AI Conversion</p>
          </div>
        </div>

        {/* Sample Lesson Plans */}
        <Card className="h-fit backdrop-blur-md bg-white/40 border border-white/30">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-600">
              <BookOpen className="h-5 w-5" />
              <span>Generated Lesson Plans</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {sampleLessons.map((lesson, index) => (
                <Card key={index} className="border border-gray-200 bg-white/60 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">
                        Week {lesson.week}: {lesson.title}
                      </h4>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          <Users className="h-3 w-3 mr-1" />
                          {lesson.level}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">{lesson.learningArea}</span> • 
                      <span className="ml-1">{lesson.strand} - {lesson.subStrand}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="text-sm space-y-3">
                    <div>
                      <span className="font-medium text-green-600">Learning Outcomes:</span>
                      <ul className="mt-1 space-y-1 text-gray-700">
                        {lesson.outcomes.map((outcome, i) => (
                          <li key={i} className="flex items-start space-x-2">
                            <span className="text-gray-400">•</span>
                            <span>{outcome}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <span className="font-medium text-purple-600">Key Inquiry Question:</span>
                      <p className="mt-1 text-gray-700 italic">{lesson.keyQuestion}</p>
                    </div>

                    <Separator />
                    
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center p-2 bg-blue-50 rounded">
                        <Clock className="h-3 w-3 mx-auto mb-1 text-blue-600" />
                        <p className="font-medium">Intro</p>
                        <p className="text-gray-600">{lesson.introduction}</p>
                      </div>
                      <div className="text-center p-2 bg-green-50 rounded">
                        <Target className="h-3 w-3 mx-auto mb-1 text-green-600" />
                        <p className="font-medium">Development</p>
                        <p className="text-gray-600">{lesson.development}</p>
                      </div>
                      <div className="text-center p-2 bg-orange-50 rounded">
                        <Clock className="h-3 w-3 mx-auto mb-1 text-orange-600" />
                        <p className="font-medium">Conclusion</p>
                        <p className="text-gray-600">{lesson.conclusion}</p>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                      <span className="font-medium">Assessment:</span> {lesson.assessment}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Benefits */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 backdrop-blur-md bg-white/40">
        <CardContent className="p-6">
          <h4 className="font-semibold text-gray-900 mb-4">What you get from the conversion:</h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start space-x-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Complete lesson structure following Kenyan curriculum format</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Specific learning outcomes aligned with curriculum standards</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Structured lesson organization with timed sections</span>
              </li>
            </ul>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start space-x-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Key inquiry questions for student engagement</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Assessment strategies integrated throughout</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Professional formatting ready for classroom use</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
