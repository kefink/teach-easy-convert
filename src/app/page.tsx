"use client";

import React, { useState, useEffect } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { LessonPlanConfig, LessonPlanConfiguration } from '@/components/LessonPlanConfig';
import { ConversionResults } from '@/components/ConversionResults';
import { SampleData } from '@/components/SampleData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Zap, Users, CheckCircle, Moon, Sun } from 'lucide-react';
import { useTheme } from "next-themes";
import { LessonPlan, getCoreCompetencies } from '@/types/LessonPlan';
import { ParsedSchemeData, ParsingResult } from '@/utils/schemeParser';

const Index = () => {
  const [uploadedContent, setUploadedContent] = useState<string>('');
  const [parsedData, setParsedData] = useState<ParsedSchemeData | null>(null);
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [configuration, setConfiguration] = useState<LessonPlanConfiguration | null>(null);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [parsingError, setParsingError] = useState<string | null>(null);

  const handleUpload = (content: string) => {
    setUploadedContent(content);
    setShowConfig(true);
    setParsingError(null); // Reset error on new upload
  };

  const handleParsedDataReady = (result: ParsingResult) => {
    if (result.success && result.data) {
      setParsedData(result.data);
      setShowConfig(true);
      setParsingError(null);
    } else {
      setParsingError(result.message || 'An unknown error occurred during parsing.');
      setShowConfig(false);
    }
  };

  const handleConfigurationComplete = (config: LessonPlanConfiguration) => {
    setConfiguration(config);
    setShowConfig(false);
    convertToLessonPlans(uploadedContent, config, parsedData);
  };

  const convertToLessonPlans = (content: string, config: LessonPlanConfiguration, parsed?: ParsedSchemeData | null) => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const mockLessonPlans: LessonPlan[] = [];
      
      // If we have parsed data, use it to generate more accurate lesson plans
      if (parsed && parsed.weeks.length > 0) {
        parsed.weeks.forEach((week, index) => {
          const coreCompetencies = getCoreCompetencies(config.learningArea);
          
          const lessonPlan: LessonPlan = {
            id: index + 1,
            school: config.school,
            level: config.level,
            learningArea: config.learningArea,
            date: new Date(config.date.getTime() + (week.week - 1) * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            time: `${8 + (week.lesson - 1) * 1}:00 AM - ${8 + week.lesson * 1}:00 AM`,
            roll: config.roll,
            term: parsed.term?.toString() || '1',
            week: week.week,
            lessonNumber: week.lesson,
            title: `${week.strand}: ${week.subStrand}`,
            strand: week.strand,
            subStrand: week.subStrand,
            specificLearningOutcomes: [
              `By the end of the lesson, the learner should be able to ${week.lessonLearningOutcome.toLowerCase()}`
            ],
            coreCompetencies: coreCompetencies.slice(0, 3), // Use first 3 relevant competencies
            keyInquiryQuestion: week.keyInquiryQuestion || `How can we apply knowledge of ${week.subStrand} in real life situations?`,
            learningResources: week.learningResources ? week.learningResources.split(',').map(r => r.trim()) : [
              'Textbooks and reference materials',
              'Learning aids and manipulatives',
              'Digital learning resources'
            ],
            introduction: {
              duration: '5 minutes',
              activities: [
                'Greet learners and take attendance',
                'Review previous lesson concepts through oral questions',
                `Introduce today's topic: ${week.subStrand}`,
                'Share the learning outcomes with learners'
              ]
            },
            lessonDevelopment: {
              duration: `${config.singleLessonDuration - 10} minutes`,
              steps: [
                {
                  stepNumber: 1,
                  activity: week.learningExperiences || `Interactive exploration of ${week.subStrand} concepts`,
                  duration: '15 minutes'
                },
                {
                  stepNumber: 2,
                  activity: 'Guided practice with teacher support and peer collaboration',
                  duration: '15 minutes'
                },
                {
                  stepNumber: 3,
                  activity: 'Independent application and problem-solving activities',
                  duration: '10 minutes'
                }
              ]
            },
            conclusion: {
              duration: '5 minutes',
              activities: [
                'Summarize key learning points with learners',
                'Address any questions and clarify misconceptions',
                'Connect learning to real-life applications',
                'Preview next lesson content'
              ]
            },
            extendedActivities: [
              `Research more examples of ${week.subStrand} in the community`,
              'Create a presentation or project related to the topic',
              'Practice additional exercises for reinforcement',
              'Teach a family member about what was learned'
            ],
            assessment: week.assessment || 'Observation during activities, oral questions and answers, written exercises, peer assessment',
            teacherSelfEvaluation: 'Reflect on lesson effectiveness and learner engagement',
            reflection: week.reflection || 'Did learners achieve the learning outcomes? What needs reinforcement in the next lesson?'
          };
          
          mockLessonPlans.push(lessonPlan);
        });
      } else {
        // Fall back to enhanced mock data generation
        const coreCompetencies = getCoreCompetencies(config.learningArea);
        
        const sampleLessonPlan: LessonPlan = {
          id: 1,
          school: config.school,
          level: config.level,
          learningArea: config.learningArea,
          date: config.date.toISOString().split('T')[0],
          time: '8:00 AM - 8:40 AM',
          roll: config.roll,
          term: '1',
          week: 1,
          lessonNumber: 1,
          title: 'Introduction to Technology',
          strand: 'BASIC TECHNOLOGY',
          subStrand: 'Technology around us',
          specificLearningOutcomes: [
            'By the end of the lesson, the learner should be able to define technology and explain its importance in daily life',
            'By the end of the lesson, the learner should be able to identify various technologies used at home, school and community',
            'By the end of the lesson, the learner should be able to appreciate the role of technology in improving quality of life'
          ],
          coreCompetencies: coreCompetencies.slice(0, 4),
          keyInquiryQuestion: 'How does technology improve our daily lives and what would life be like without it?',
          learningResources: [
            'Pictures of various technologies',
            'Real objects (phones, computers, etc.)',
            'Chart paper and markers',
            'Digital projector',
            'Learner textbooks'
          ],
          introduction: {
            duration: '5 minutes',
            activities: [
              'Greet learners and take attendance',
              'Review previous lesson briefly through questions',
              'Introduce today\'s topic and share learning outcomes',
              'Create interest through a technology quiz'
            ]
          },
          lessonDevelopment: {
            duration: '30 minutes',
            steps: [
              {
                stepNumber: 1,
                activity: 'Brainstorming session on what technology means to learners',
                duration: '10 minutes'
              },
              {
                stepNumber: 2,
                activity: 'Group discussion and identification of technologies found at home and school',
                duration: '10 minutes'
              },
              {
                stepNumber: 3,
                activity: 'Creating a technology map of their community in groups',
                duration: '10 minutes'
              }
            ]
          },
          conclusion: {
            duration: '5 minutes',
            activities: [
              'Groups present their technology maps',
              'Summarize key points learned about technology',
              'Ask learners to share one technology they find most useful and why',
              'Preview next lesson on classification of technologies'
            ]
          },
          extendedActivities: [
            'Interview family members about technologies they use daily',
            'Create a scrapbook of different technologies found in the community',
            'Research the history of one technology they find interesting',
            'Draw and label five technologies found at home'
          ],
          assessment: 'Observation during group discussions, oral questions and answers, technology identification worksheet, peer assessment during presentations',
          teacherSelfEvaluation: 'Reflect on learner participation and understanding',
          reflection: 'Did learners successfully identify and categorize different technologies? What misconceptions need to be addressed?'
        };
        
        mockLessonPlans.push(sampleLessonPlan);
      }

      setLessonPlans(mockLessonPlans);
      setIsLoading(false);
    }, 2000);
  };

  const resetProcess = () => {
    setUploadedContent('');
    setParsedData(null);
    setLessonPlans([]);
    setShowConfig(false);
    setConfiguration(null);
    setParsingError(null);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-secondary-dark/80 backdrop-blur-sm border-b border-secondary-dark/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-accent-gold p-2 rounded-lg">
                <BookOpen className="h-6 w-6 text-primary-dark" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-text-white to-text-white bg-clip-text text-transparent">
                  STEM-ED ARCHITECTS
                </h1>
                <p className="text-sm text-text-gray">CBC-Compliant Lesson Plan Generator</p>
              </div>
            </div>
            {(uploadedContent || lessonPlans.length > 0) && (
              <Button onClick={resetProcess} variant="outline" className="backdrop-blur-sm bg-secondary-dark/50 text-text-white border-secondary-dark">
                Start Over
              </Button>
            )}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="backdrop-blur-sm bg-secondary-dark/50 text-text-white border-secondary-dark"
            >
              {mounted && (theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              ))}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!uploadedContent && !showConfig && (
          <>
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-accent-gold to-accent-gold bg-clip-text text-transparent">
                AI-Powered CBC Lesson Plan Generation
              </h2>
              <p className="text-xl text-text-gray max-w-3xl mx-auto">
                Upload your scheme of work and generate comprehensive CBC-compliant lesson plans with core competencies, 
                extended activities, and proper assessment methods automatically mapped to your learning area.
              </p>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {[
                {
                  icon: <Zap className="h-8 w-8 text-accent-gold" />,
                  title: "Smart CBC Parsing",
                  description: "Automatically extracts and maps CBC elements including core competencies and extended activities"
                },
                {
                  icon: <Users className="h-8 w-8 text-accent-gold" />,
                  title: "Competency Based",
                  description: "Auto-generates relevant core competencies based on learning area and activities"
                },
                {
                  icon: <CheckCircle className="h-8 w-8 text-accent-gold" />,
                  title: "Assessment Ready",
                  description: "Includes formative and summative assessment methods with extended activities"
                }
              ].map((feature, index) => (
                <Card key={index} className="backdrop-blur-md bg-secondary-dark/40 border border-secondary-dark/30 hover:bg-secondary-dark/50 transition-all">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-3 text-text-white">
                      {feature.icon}
                      <span>{feature.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-text-gray">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Upload Section */}
            <Card className="backdrop-blur-md bg-secondary-dark/40 border border-secondary-dark/30 shadow-xl mb-8">
              <CardHeader>
                <CardTitle className="text-center bg-gradient-to-r from-text-white to-text-white bg-clip-text text-transparent">
                  Upload Your Scheme of Work
                </CardTitle>
              </CardHeader>
              <CardContent>
                {parsingError && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-300 text-sm rounded-md p-4 mb-4">
                    <h4 className="font-bold mb-2">Parsing Error</h4>
                    <p>{parsingError}</p>
                  </div>
                )}
                <FileUpload onUpload={handleUpload} onParsedDataReady={handleParsedDataReady} />
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
