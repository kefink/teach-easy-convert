import React, { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { ConversionResults } from '@/components/ConversionResults';
import { LessonPlanConfig, LessonPlanConfiguration } from '@/components/LessonPlanConfig';
import { SampleData } from '@/components/SampleData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, FileText, Zap, Download, Settings, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

const Index = () => {
  const [uploadedScheme, setUploadedScheme] = useState<string | null>(null);
  const [lessonConfig, setLessonConfig] = useState<LessonPlanConfiguration | null>(null);
  const [generatedLessons, setGeneratedLessons] = useState<any[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [currentStep, setCurrentStep] = useState<'upload' | 'config' | 'convert'>('upload');

  const handleSchemeUpload = (content: string) => {
    setUploadedScheme(content);
    setCurrentStep('config');
    console.log("Scheme uploaded:", content.substring(0, 100) + "...");
  };

  const handleConfigurationComplete = (config: LessonPlanConfiguration) => {
    setLessonConfig(config);
    setCurrentStep('convert');
    console.log("Configuration completed:", config);
  };

  const handleConvert = async () => {
    if (!uploadedScheme || !lessonConfig) return;
    
    setIsConverting(true);
    console.log("Starting conversion process with config:", lessonConfig);
    
    // Enhanced mock lesson generation based on configuration
    setTimeout(() => {
      const mockLessons = [];
      const totalLessons = lessonConfig.lessonsPerWeek * 13; // Assuming 13 weeks per term
      
      // Generate lessons based on configuration
      for (let week = 1; week <= 13; week++) {
        for (let lessonNum = 1; lessonNum <= lessonConfig.lessonsPerWeek; lessonNum++) {
          const isDoubleLession = lessonConfig.hasDoubleLessons && lessonNum === lessonConfig.lessonsPerWeek;
          const lessonDuration = isDoubleLession ? lessonConfig.doubleLessonDuration : lessonConfig.singleLessonDuration;
          
          mockLessons.push({
            id: (week - 1) * lessonConfig.lessonsPerWeek + lessonNum,
            school: lessonConfig.school,
            level: lessonConfig.level,
            learningArea: lessonConfig.learningArea,
            date: format(lessonConfig.date, 'dd/MM/yyyy'),
            time: isDoubleLession ? '40 min' : `${lessonConfig.singleLessonDuration} min`,
            roll: lessonConfig.roll,
            term: lessonConfig.term,
            week: week,
            lessonNumber: lessonNum,
            title: `${lessonConfig.learningArea} Lesson ${lessonNum} - Week ${week}`,
            strand: getStrandForLearningArea(lessonConfig.learningArea),
            subStrand: getSubStrandForLearningArea(lessonConfig.learningArea, week),
            specificLearningOutcomes: [
              `By the end of the lesson, the learner should be able to demonstrate understanding of ${lessonConfig.learningArea} concepts`,
              `Apply knowledge gained in practical situations`,
              `Collaborate effectively with peers in learning activities`
            ],
            keyInquiryQuestion: `How can we effectively apply ${lessonConfig.learningArea} concepts in our daily lives?`,
            learningResources: [
              "Course textbook",
              "Blackboard/whiteboard", 
              "Learning materials",
              "Reference books"
            ],
            introduction: {
              duration: "5 minutes",
              activities: [
                "Greet learners and take attendance",
                "Review previous lesson",
                "Introduce today's topic"
              ]
            },
            lessonDevelopment: {
              duration: `${Math.floor(lessonDuration * 0.75)} minutes`,
              steps: [
                {
                  stepNumber: 1,
                  activity: "Introduce key concepts and terminology",
                  duration: `${Math.floor(lessonDuration * 0.25)} minutes`
                },
                {
                  stepNumber: 2,
                  activity: "Demonstrate practical applications",
                  duration: `${Math.floor(lessonDuration * 0.25)} minutes`
                },
                {
                  stepNumber: 3,
                  activity: "Guided practice activities",
                  duration: `${Math.floor(lessonDuration * 0.25)} minutes`
                }
              ]
            },
            conclusion: {
              duration: "5 minutes",
              activities: [
                "Summarize key learning points",
                "Assign homework or practice activities",
                "Preview next lesson"
              ]
            },
            extendedActivities: [
              "Research related topics at home",
              "Practice skills with family members"
            ],
            assessment: "Formative assessment through observation and questioning",
            teacherSelfEvaluation: "",
            reflection: ""
          });
          
          // Limit to first few lessons for demo
          if (mockLessons.length >= 6) break;
        }
        if (mockLessons.length >= 6) break;
      }
      
      setGeneratedLessons(mockLessons);
      setIsConverting(false);
      console.log("Conversion completed:", mockLessons);
    }, 3000);
  };

  const getStrandForLearningArea = (area: string): string => {
    const strands: { [key: string]: string } = {
      'English': 'Writing',
      'Mathematics': 'Numbers',
      'Pre-Technical Studies': 'Design and Technology',
      'Integrated Science': 'Biology',
      'Social Studies': 'History and Government'
    };
    return strands[area] || 'General Studies';
  };

  const getSubStrandForLearningArea = (area: string, week: number): string => {
    const subStrands: { [key: string]: string[] } = {
      'English': ['Creative Writing', 'Narrative Writing', 'Poetry', 'Grammar'],
      'Mathematics': ['Whole Numbers', 'Fractions', 'Decimals', 'Algebra'],
      'Pre-Technical Studies': ['Materials', 'Tools and Equipment', 'Safety', 'Design Process']
    };
    const areaSubStrands = subStrands[area] || ['General Concepts'];
    return areaSubStrands[(week - 1) % areaSubStrands.length];
  };

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Header */}
      <div className="relative backdrop-blur-md bg-white/30 border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg backdrop-blur-sm">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                STEM-ED ARCHITECTS
              </h1>
              <p className="text-blue-600 font-medium">engineering learning solutions</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-4">
            Intelligent Scheme to <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Lesson Conversion</span>
          </h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Transform your schemes of work into comprehensive, structured lesson plans 
            with our intelligent educational technology solutions.
          </p>
        </div>

        {/* Progress Steps */}
        {(currentStep !== 'upload' || uploadedScheme) && (
          <div className="flex items-center justify-center mb-8 space-x-4">
            <div className={`flex items-center space-x-2 ${uploadedScheme ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`rounded-full p-2 ${uploadedScheme ? 'bg-green-100' : 'bg-gray-100'}`}>
                <FileText className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium">Upload Scheme</span>
            </div>
            <div className={`w-12 h-0.5 ${lessonConfig ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center space-x-2 ${lessonConfig ? 'text-green-600' : currentStep === 'config' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`rounded-full p-2 ${lessonConfig ? 'bg-green-100' : currentStep === 'config' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                <Settings className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium">Configure</span>
            </div>
            <div className={`w-12 h-0.5 ${generatedLessons.length > 0 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center space-x-2 ${generatedLessons.length > 0 ? 'text-green-600' : currentStep === 'convert' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`rounded-full p-2 ${generatedLessons.length > 0 ? 'bg-green-100' : currentStep === 'convert' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                <CheckCircle className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium">Generate</span>
            </div>
          </div>
        )}

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="backdrop-blur-md bg-white/40 border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-white/50">
            <CardHeader className="text-center">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-xl w-fit mx-auto mb-4 shadow-lg">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Smart Upload</CardTitle>
              <CardDescription className="text-gray-600">
                Upload schemes of work in multiple formats with intelligent content parsing
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="backdrop-blur-md bg-white/40 border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-white/50">
            <CardHeader className="text-center">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-xl w-fit mx-auto mb-4 shadow-lg">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">AI-Powered Conversion</CardTitle>
              <CardDescription className="text-gray-600">
                Advanced algorithms transform schemes into pedagogically sound lesson structures
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="backdrop-blur-md bg-white/40 border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-white/50">
            <CardHeader className="text-center">
              <div className="bg-gradient-to-r from-purple-500 to-violet-600 p-3 rounded-xl w-fit mx-auto mb-4 shadow-lg">
                <Download className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Professional Output</CardTitle>
              <CardDescription className="text-gray-600">
                Generate classroom-ready lesson plans with comprehensive teaching resources
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="convert" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto backdrop-blur-md bg-white/30 border border-white/30 shadow-lg">
            <TabsTrigger 
              value="convert" 
              className="data-[state=active]:bg-white/80 data-[state=active]:shadow-md transition-all duration-200"
            >
              Convert Schemes
            </TabsTrigger>
            <TabsTrigger 
              value="samples"
              className="data-[state=active]:bg-white/80 data-[state=active]:shadow-md transition-all duration-200"
            >
              View Samples
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="convert" className="space-y-6">
            {/* Configuration Form */}
            <LessonPlanConfig 
              onConfigurationComplete={handleConfigurationComplete}
              isVisible={currentStep === 'config'}
            />

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Upload Section */}
              <Card className="backdrop-blur-md bg-white/40 border border-white/30 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <span>Upload Scheme of Work</span>
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Upload your scheme of work document or paste the content directly
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FileUpload onUpload={handleSchemeUpload} />
                  
                  {uploadedScheme && (
                    <div className="mt-6">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">Uploaded Content Preview</h4>
                        {currentStep === 'convert' && (
                          <Button 
                            onClick={handleConvert}
                            disabled={isConverting}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg backdrop-blur-sm border border-blue-300/30"
                          >
                            {isConverting ? "Converting..." : "Convert to Lessons"}
                          </Button>
                        )}
                      </div>
                      <div className="backdrop-blur-sm bg-white/60 p-4 rounded-lg max-h-40 overflow-y-auto border border-white/30 shadow-inner">
                        <p className="text-sm text-gray-700">
                          {uploadedScheme.substring(0, 300)}...
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Results Section */}
              <Card className="backdrop-blur-md bg-white/40 border border-white/30 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    <BookOpen className="h-5 w-5 text-green-600" />
                    <span>Generated Lesson Plans</span>
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Your converted lesson plans will appear here
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ConversionResults 
                    lessons={generatedLessons} 
                    isLoading={isConverting}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="samples">
            <div className="backdrop-blur-md bg-white/30 border border-white/30 shadow-xl rounded-lg p-6">
              <SampleData />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
