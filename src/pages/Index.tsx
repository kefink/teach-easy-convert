
import React, { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { ConversionResults } from '@/components/ConversionResults';
import { SampleData } from '@/components/SampleData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, FileText, Zap, Download } from 'lucide-react';

const Index = () => {
  const [uploadedScheme, setUploadedScheme] = useState<string | null>(null);
  const [generatedLessons, setGeneratedLessons] = useState<any[]>([]);
  const [isConverting, setIsConverting] = useState(false);

  const handleSchemeUpload = (content: string) => {
    setUploadedScheme(content);
    console.log("Scheme uploaded:", content.substring(0, 100) + "...");
  };

  const handleConvert = async () => {
    if (!uploadedScheme) return;
    
    setIsConverting(true);
    console.log("Starting conversion process...");
    
    // Simulate AI conversion process
    setTimeout(() => {
      const mockLessons = [
        {
          id: 1,
          title: "Introduction to Topic",
          duration: "60 minutes",
          objectives: ["Understand basic concepts", "Identify key principles"],
          activities: ["Warm-up discussion", "Main teaching", "Group work", "Plenary"],
          resources: ["Textbook", "Whiteboard", "Worksheets"],
          assessment: "Formative questioning throughout"
        },
        {
          id: 2,
          title: "Practical Application",
          duration: "60 minutes",
          objectives: ["Apply learned concepts", "Demonstrate understanding"],
          activities: ["Recap previous lesson", "Practical tasks", "Peer assessment"],
          resources: ["Practical materials", "Assessment rubric"],
          assessment: "Practical demonstration"
        }
      ];
      
      setGeneratedLessons(mockLessons);
      setIsConverting(false);
      console.log("Conversion completed:", mockLessons);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">STEM-ED ARCHITECTS</h1>
              <p className="text-blue-600 font-medium">engineering learning solutions</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Intelligent Scheme to <span className="text-blue-600">Lesson Conversion</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform your schemes of work into comprehensive, structured lesson plans 
            with our intelligent educational technology solutions.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <FileText className="h-12 w-12 text-blue-600 mx-auto mb-2" />
              <CardTitle>Smart Upload</CardTitle>
              <CardDescription>
                Upload schemes of work in multiple formats with intelligent content parsing
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Zap className="h-12 w-12 text-green-600 mx-auto mb-2" />
              <CardTitle>AI-Powered Conversion</CardTitle>
              <CardDescription>
                Advanced algorithms transform schemes into pedagogically sound lesson structures
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Download className="h-12 w-12 text-purple-600 mx-auto mb-2" />
              <CardTitle>Professional Output</CardTitle>
              <CardDescription>
                Generate classroom-ready lesson plans with comprehensive teaching resources
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="convert" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="convert">Convert Schemes</TabsTrigger>
            <TabsTrigger value="samples">View Samples</TabsTrigger>
          </TabsList>
          
          <TabsContent value="convert" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Upload Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>Upload Scheme of Work</span>
                  </CardTitle>
                  <CardDescription>
                    Upload your scheme of work document or paste the content directly
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FileUpload onUpload={handleSchemeUpload} />
                  
                  {uploadedScheme && (
                    <div className="mt-6">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">Uploaded Content Preview</h4>
                        <Button 
                          onClick={handleConvert}
                          disabled={isConverting}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          {isConverting ? "Converting..." : "Convert to Lessons"}
                        </Button>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg max-h-40 overflow-y-auto">
                        <p className="text-sm text-gray-700">
                          {uploadedScheme.substring(0, 300)}...
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Results Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5" />
                    <span>Generated Lesson Plans</span>
                  </CardTitle>
                  <CardDescription>
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
            <SampleData />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
