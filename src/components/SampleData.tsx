
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BookOpen, FileText, ArrowRight } from 'lucide-react';

export const SampleData: React.FC = () => {
  const sampleScheme = `
SCHEME OF WORK: Mathematics - Year 7 - Term 1
Subject: Mathematics
Year Group: 7
Duration: 6 weeks

OVERVIEW:
Students will develop understanding of basic algebraic concepts including variables, expressions, and simple equations.

LEARNING OUTCOMES:
- Understand what variables represent in mathematical contexts
- Create and simplify algebraic expressions
- Solve simple linear equations
- Apply algebraic thinking to real-world problems

WEEKLY BREAKDOWN:
Week 1-2: Introduction to variables and expressions
Week 3-4: Simplifying expressions and like terms
Week 5-6: Solving simple equations and applications

RESOURCES:
- Mathematics textbook chapters 4-6
- Interactive algebra software
- Practical problem worksheets
- Assessment materials

ASSESSMENT:
- Weekly formative assessments
- Mid-term practical application task
- End of unit summative test
  `;

  const sampleLessons = [
    {
      title: "Introduction to Variables",
      duration: "60 minutes",
      objectives: [
        "Define what a variable is in mathematics",
        "Identify variables in given expressions",
        "Use letters to represent unknown quantities"
      ],
      activities: [
        "Warm-up: Number patterns activity",
        "Teacher demonstration of variable concepts",
        "Guided practice with simple expressions",
        "Independent work on variable identification",
        "Plenary discussion and reflection"
      ],
      resources: ["Textbook p.45-48", "Whiteboard", "Variable cards", "Practice worksheets"],
      assessment: "Exit ticket with 3 variable identification questions"
    },
    {
      title: "Creating Algebraic Expressions",
      duration: "60 minutes",
      objectives: [
        "Write algebraic expressions from word problems",
        "Translate between words and symbols",
        "Recognize equivalent expressions"
      ],
      activities: [
        "Recap previous lesson with quick quiz",
        "Word problem translation practice",
        "Pair work on expression creation",
        "Gallery walk of student solutions",
        "Consolidation and homework setting"
      ],
      resources: ["Word problem cards", "Mini whiteboards", "Textbook exercises"],
      assessment: "Peer assessment of expression creation"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Sample Conversion</h3>
        <p className="text-gray-600">
          See how a scheme of work gets transformed into detailed lesson plans
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Sample Scheme of Work */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-blue-600">
              <FileText className="h-5 w-5" />
              <span>Sample Scheme of Work</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg">
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
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-600">
              <BookOpen className="h-5 w-5" />
              <span>Generated Lesson Plans</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {sampleLessons.map((lesson, index) => (
                <Card key={index} className="border border-gray-200">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                      <Badge variant="outline">{lesson.duration}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="text-sm space-y-3">
                    <div>
                      <span className="font-medium text-blue-600">Objectives:</span>
                      <ul className="mt-1 space-y-1 text-gray-700">
                        {lesson.objectives.map((obj, i) => (
                          <li key={i} className="flex items-start space-x-2">
                            <span className="text-gray-400">•</span>
                            <span>{obj}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <span className="font-medium text-green-600">Key Activities:</span>
                      <p className="mt-1 text-gray-700">
                        {lesson.activities.slice(0, 3).join(', ')}...
                      </p>
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      <span className="font-medium">Resources:</span> {lesson.resources.join(', ')}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Benefits */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <h4 className="font-semibold text-gray-900 mb-4">What you get from the conversion:</h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start space-x-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Detailed learning objectives broken down by lesson</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Structured activities with timing considerations</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Resource lists for easy preparation</span>
              </li>
            </ul>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start space-x-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Assessment strategies integrated throughout</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Professional formatting ready for use</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Downloadable formats for easy sharing</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
