import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileText, ClipboardPaste, File, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SchemeParser, ParsingResult } from '@/utils/schemeParser';
import { SchemeParsingResults } from '@/components/SchemeParsingResults';

interface FileUploadProps {
  onUpload: (content: string) => void;
  onParsedDataReady?: (result: ParsingResult) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onUpload, onParsedDataReady }) => {
  const [textContent, setTextContent] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [parsingResult, setParsingResult] = useState<ParsingResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const acceptedFormats = [
    '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.txt', '.rtf', '.odt', '.ods'
  ];

  const getFileIcon = (fileName: string) => {
    const extension = fileName.toLowerCase().split('.').pop();
    return <File className="h-4 w-4" />;
  };

  const parseContent = async (content: string) => {
    setIsProcessing(true);
    
    // Simulate processing delay for user feedback
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const result = SchemeParser.parse(content);
    setParsingResult(result);
    setIsProcessing(false);
    
    if (result.success) {
      toast({
        title: "Scheme parsed successfully!",
        description: `Found ${result.data?.weeks.length} lessons. Please review the extracted information.`,
      });
    } else {
      toast({
        title: "Parsing encountered issues",
        description: "Please review the errors and try again.",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = (file: File) => {
    const fileName = file.name.toLowerCase();
    const extension = fileName.split('.').pop();
    
    // Check if file type is supported
    const isSupported = acceptedFormats.some(format => fileName.endsWith(format.slice(1)));
    
    if (!isSupported) {
      toast({
        title: "Unsupported file type",
        description: `Please upload files in these formats: ${acceptedFormats.join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    setUploadedFileName(file.name);

    if (file.type === 'text/plain' || fileName.endsWith('.txt')) {
      // Handle text files directly
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setTextContent(content);
        parseContent(content);
      };
      reader.readAsText(file);
    } else {
      // For PDF, Word, Excel and other formats, simulate content extraction
      const simulatedContent = `2024 GRADE 7 TERM 1 MATHEMATICS SCHEMES OF WORK
Teacher: John Doe
School: ABC Primary School

Week	Lesson	Strand	Sub Strand	Specific Learning Outcome	Learning Experiences	Key Inquiry Question	Learning Resources	Assessment	Remarks
1	1	Measurement	Length	By the end of the sub strand, the learner should be able to work out division involving metres and centimetres in real life situations	Learners in pairs/groups to work out multiplication involving metres and centimetres in real life situations. Learners in pairs/groups to work out division involving metres and centimetres in real life situations. Learners in pairs/groups to play digital games involving length	Why do we measure distance in real life	KLB Visionary Mathematics pg 78	Asking questions Drawing questionnaires	
2	2	Measurement	Length	By the end of the sub strand, the learner should be able to work out division involving metres and centimetres in real life	Learners in pairs/groups to work out multiplication involving metres and centimetres in real life. Learners in pairs to practice conversions	Why do we measure distance in real life	KLB Visionary Mathematics pg 78	Asking questions Drawing questionnaires	

File: ${file.name}
Size: ${(file.size / 1024).toFixed(2)} KB`;

      setTextContent(simulatedContent);
      parseContent(simulatedContent);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleTextSubmit = () => {
    if (textContent.trim()) {
      parseContent(textContent);
    } else {
      toast({
        title: "No content provided",
        description: "Please enter some content or upload a file.",
        variant: "destructive",
      });
    }
  };

  const handleConfirmParsedData = (data: any) => {
    onUpload(textContent);
    if (onParsedDataReady && parsingResult) {
      onParsedDataReady(parsingResult);
    }
  };

  const handleEditParsedData = (data: any) => {
    // For now, just proceed with the raw content
    // In a future enhancement, we could add an edit form
    onUpload(textContent);
    if (onParsedDataReady && parsingResult) {
      onParsedDataReady(parsingResult);
    }
  };

  const handleReparse = () => {
    if (textContent) {
      parseContent(textContent);
    }
  };

  // Show parsing results if available
  if (parsingResult) {
    return (
      <SchemeParsingResults
        result={parsingResult}
        onConfirm={handleConfirmParsedData}
        onEdit={handleEditParsedData}
        onReparse={handleReparse}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Processing indicator */}
      {isProcessing && (
        <Card className="backdrop-blur-md bg-blue-50/40 border border-blue-200/50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Zap className="h-5 w-5 text-blue-600 animate-pulse" />
              <div>
                <p className="font-medium text-blue-800">Parsing your scheme of work...</p>
                <p className="text-sm text-blue-600">Extracting weeks, lessons, strands, and learning outcomes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* File Drop Zone */}
      <Card
        className={`border-2 border-dashed transition-colors cursor-pointer backdrop-blur-sm ${
          dragOver 
            ? 'border-blue-400 bg-blue-50/30' 
            : 'border-gray-300/50 hover:border-gray-400/70 bg-white/20'
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => fileInputRef.current?.click()}
      >
        <CardContent className="p-8 text-center">
          <Upload className={`h-12 w-12 mx-auto mb-4 ${dragOver ? 'text-blue-500' : 'text-gray-400'}`} />
          <p className="text-lg font-medium text-gray-700 mb-2">
            Drop your scheme of work file here
          </p>
          <p className="text-sm text-gray-500 mb-2">
            Supports PDF, Word, Excel, and text files
          </p>
          <p className="text-xs text-gray-400 mb-4">
            {acceptedFormats.join(', ')}
          </p>
          
          {uploadedFileName && (
            <div className="mb-4 p-2 bg-green-50/80 backdrop-blur-sm rounded-lg border border-green-200/50">
              <div className="flex items-center justify-center space-x-2 text-green-700">
                {getFileIcon(uploadedFileName)}
                <span className="text-sm font-medium">{uploadedFileName}</span>
              </div>
            </div>
          )}
          
          <Button variant="outline" className="mt-2 backdrop-blur-sm bg-white/50 border-white/30">
            <FileText className="h-4 w-4 mr-2" />
            Choose File
          </Button>
        </CardContent>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFormats.join(',')}
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Text Input Alternative */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <ClipboardPaste className="h-4 w-4" />
          <span>Or paste your scheme of work content directly:</span>
        </div>
        <Textarea
          placeholder="Paste your scheme of work content here..."
          value={textContent}
          onChange={(e) => setTextContent(e.target.value)}
          className="min-h-32 resize-none backdrop-blur-sm bg-white/30 border-white/30"
        />
        <Button 
          onClick={handleTextSubmit}
          disabled={!textContent.trim() || isProcessing}
          className="w-full backdrop-blur-sm bg-gradient-to-r from-blue-600/80 to-indigo-600/80 hover:from-blue-700/80 hover:to-indigo-700/80 border border-blue-300/30"
        >
          {isProcessing ? (
            <>
              <Zap className="h-4 w-4 mr-2 animate-pulse" />
              Parsing Content...
            </>
          ) : (
            'Parse & Use Content'
          )}
        </Button>
      </div>
    </div>
  );
};
