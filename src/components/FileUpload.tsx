import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileText, ClipboardPaste } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProps {
  onUpload: (content: string) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onUpload }) => {
  const [textContent, setTextContent] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (file: File) => {
    if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
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
      toast({
        title: "Unsupported file type",
        description: "Please upload a .txt file or paste your content directly.",
        variant: "destructive",
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
        className={`border-2 border-dashed transition-colors cursor-pointer ${
          dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
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
          <p className="text-sm text-gray-500 mb-4">
            or click to browse for files (.txt format)
          </p>
          <Button variant="outline" className="mt-2">
            <FileText className="h-4 w-4 mr-2" />
            Choose File
          </Button>
        </CardContent>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        accept=".txt"
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
          className="min-h-32 resize-none"
        />
        <Button 
          onClick={handleTextSubmit}
          disabled={!textContent.trim()}
          className="w-full"
        >
          Use This Content
        </Button>
      </div>
    </div>
  );
};
