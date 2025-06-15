
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileText, ClipboardPaste, File } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProps {
  onUpload: (content: string) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onUpload }) => {
  const [textContent, setTextContent] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const acceptedFormats = [
    '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.txt', '.rtf', '.odt', '.ods'
  ];

  const getFileIcon = (fileName: string) => {
    const extension = fileName.toLowerCase().split('.').pop();
    return <File className="h-4 w-4" />;
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
        onUpload(content);
        toast({
          title: "File uploaded successfully",
          description: "Your scheme of work has been loaded and is ready for conversion.",
        });
      };
      reader.readAsText(file);
    } else {
      // For PDF, Word, Excel and other formats, simulate content extraction
      // In a real application, you would use libraries like pdf-parse, mammoth, xlsx, etc.
      const simulatedContent = `[Content extracted from ${file.name}]

This is a placeholder for the extracted content from your ${extension?.toUpperCase()} file.
In a production environment, this would contain the actual text content extracted from:
- PDF files using libraries like pdf-parse
- Word documents using libraries like mammoth
- Excel files using libraries like xlsx
- Other document formats using appropriate parsers

File: ${file.name}
Size: ${(file.size / 1024).toFixed(2)} KB
Type: ${file.type || 'Unknown'}

Your scheme of work content would appear here after proper extraction.`;

      setTextContent(simulatedContent);
      onUpload(simulatedContent);
      
      toast({
        title: "File uploaded successfully",
        description: `${file.name} has been processed and is ready for conversion.`,
      });
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
      onUpload(textContent);
      toast({
        title: "Content added successfully",
        description: "Your scheme of work is ready for conversion.",
      });
    } else {
      toast({
        title: "No content provided",
        description: "Please enter some content or upload a file.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
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
          disabled={!textContent.trim()}
          className="w-full backdrop-blur-sm bg-gradient-to-r from-blue-600/80 to-indigo-600/80 hover:from-blue-700/80 hover:to-indigo-700/80 border border-blue-300/30"
        >
          Use This Content
        </Button>
      </div>
    </div>
  );
};
