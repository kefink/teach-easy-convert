
import React, { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { LessonPlanConfig, LessonPlanConfiguration } from '@/components/LessonPlanConfig';
import { ConversionResults } from '@/components/ConversionResults';
import { SampleData } from '@/components/SampleData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Zap, Users, CheckCircle } from 'lucide-react';
import { LessonPlan } from '@/types/LessonPlan';

const Index = () => {
  const [uploadedContent, setUploadedContent] = useState<string>('');
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [configuration, setConfiguration] = useState<LessonPlanConfiguration | null>(null);

  const handleUpload = (content: string) => {
    setUploadedContent(content);
    setShowConfig(true);
  };

  const handleConfigurationComplete = (config: LessonPlanConfiguration) => {
    setConfiguration(config);
    setShowConfig(false);
    convertToLessonPlans(uploadedContent, config);
  };

  const convertToLessonPlans = (content: string, config: LessonPlanConfiguration) => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const mockLessonPlans: LessonPlan[] = [
        {
          id: 1,
          school: config.school,
          level: config.level,
          learningArea: config.learningArea,
          date: config.date.toISOString().split('T')[0],
          time: '8:00 AM - 8:40 AM',
          roll: config.roll,
          week: 1,
          lessonNumber: 1,
          title: 'Introduction to Technology',
          strand: 'BASIC TECHNOLOGY',
          subStrand: 'Technology around us',
          specificLearningOutcomes: [
            'Define technology and explain its importance in daily life',
            'Identify various technologies used at home, school and community',
            'Appreciate the role of technology in improving quality of life'
          ],
          keyInquiryQuestion: 'How does technology improve our daily lives?',
          learningResources: [
            'Pictures of various technologies',
            'Real objects (phones, computers, etc.)',
            'Chart paper and markers',
            'Digital projector'
          ],
          introduction: {
            duration: '5 minutes',
            activities: [
              'Greet learners and take attendance',
              'Review previous lesson briefly',
              'Introduce today\'s topic'
            ]
          },
          lessonDevelopment: {
            duration: '30 minutes',
            steps: [
              {
                stepNumber: 1,
                activity: 'Brainstorming session on what technology means',
                duration: '10 minutes'
              },
              {
                stepNumber: 2,
                activity: 'Group discussion on technologies found at home',
                duration: '10 minutes'
              },
              {
                stepNumber: 3,
                activity: 'Creating a technology map of their community',
                duration: '10 minutes'
              }
            ]
          },
          conclusion: {
            duration: '5 minutes',
            activities: [
              'Summarize key points learned',
              'Ask learners to share one technology they find most useful',
              'Preview next lesson'
            ]
          },
          assessment: 'Oral questions during discussions, observation during group work, technology identification worksheet',
          reflection: 'Did learners successfully identify and categorize different technologies?'
        },
        {
          id: 2,
          school: config.school,
          level: config.level,
          learningArea: config.learningArea,
          date: new Date(config.date.getTime() + (7 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
          time: '8:00 AM - 9:20 AM',
          roll: config.roll,
          week: 1,
          lessonNumber: 2,
          title: 'Classification of Technologies',
          strand: 'BASIC TECHNOLOGY',
          subStrand: 'Technology around us',
          specificLearningOutcomes: [
            'Classify technologies into categories (communication, transport, etc.)',
            'Explain how different technologies work',
            'Demonstrate safe use of simple technologies'
          ],
          keyInquiryQuestion: 'How can we classify and safely use different technologies?',
          learningResources: [
            'Various technological devices',
            'Safety guidelines charts',
            'Classification worksheets',
            'Video clips on technology safety'
          ],
          introduction: {
            duration: '10 minutes',
            activities: [
              'Greet learners and take attendance',
              'Quick recap of previous lesson on technology definition',
              'Introduce classification concept'
            ]
          },
          lessonDevelopment: {
            duration: '60 minutes',
            steps: [
              {
                stepNumber: 1,
                activity: 'Technology classification activity in groups',
                duration: '20 minutes'
              },
              {
                stepNumber: 2,
                activity: 'Hands-on exploration of safe technology use',
                duration: '20 minutes'
              },
              {
                stepNumber: 3,
                activity: 'Role-playing proper technology handling',
                duration: '20 minutes'
              }
            ]
          },
          conclusion: {
            duration: '10 minutes',
            activities: [
              'Groups present their classification results',
              'Discuss safety rules created',
              'Assign homework on technology categories at home'
            ]
          },
          assessment: 'Peer assessment during classification activity, safety demonstration and technology classification test',
          reflection: 'Were learners able to classify technologies correctly and demonstrate safe usage?'
        }
      ];

      setLessonPlans(mockLessonPlans);
      setIsLoading(false);
    }, 2000);
  };

  const resetProcess = () => {
    setUploadedContent('');
    setLessonPlans([]);
    setShowConfig(false);
    setConfiguration(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  STEM-ED ARCHITECTS
                </h1>
                <p className="text-sm text-gray-600">Scheme to Lesson Converter</p>
              </div>
            </div>
            {(uploadedContent || lessonPlans.length > 0) && (
              <Button onClick={resetProcess} variant="outline" className="backdrop-blur-sm bg-white/50">
                Start Over
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!uploadedContent && !showConfig && (
          <>
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-800 to-indigo-800 bg-clip-text text-transparent">
                Transform Your Schemes of Work into Professional Lesson Plans
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Upload your scheme of work and let our AI convert it into detailed, curriculum-aligned lesson plans 
                ready for classroom use.
              </p>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {[
                {
                  icon: <Zap className="h-8 w-8 text-blue-600" />,
                  title: "Instant Conversion",
                  description: "Transform your schemes into detailed lesson plans in seconds"
                },
                {
                  icon: <Users className="h-8 w-8 text-indigo-600" />,
                  title: "Curriculum Aligned",
                  description: "All plans follow the 2017 Kenyan Curriculum standards"
                },
                {
                  icon: <CheckCircle className="h-8 w-8 text-purple-600" />,
                  title: "Ready to Use",
                  description: "Professional format ready for classroom implementation"
                }
              ].map((feature, index) => (
                <Card key={index} className="backdrop-blur-md bg-white/40 border border-white/30 hover:bg-white/50 transition-all">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-3">
                      {feature.icon}
                      <span>{feature.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Upload Section */}
            <Card className="backdrop-blur-md bg-white/40 border border-white/30 shadow-xl mb-8">
              <CardHeader>
                <CardTitle className="text-center bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Upload Your Scheme of Work
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FileUpload onUpload={handleUpload} />
              </CardContent>
            </Card>

            {/* Sample Data Section */}
            <SampleData />
          </>
        )}

        {/* Configuration Step */}
        {showConfig && (
          <LessonPlanConfig 
            onConfigurationComplete={handleConfigurationComplete}
            isVisible={showConfig}
          />
        )}

        {/* Results */}
        {lessonPlans.length > 0 && (
          <ConversionResults 
            lessons={lessonPlans} 
            isLoading={isLoading}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
