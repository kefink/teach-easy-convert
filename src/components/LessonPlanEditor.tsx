"use client";

import { useState, useEffect } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

interface LessonPlanEditorProps {
  lessonPlan: any;
  onExport: (format: 'pdf' | 'word') => void;
}

export function LessonPlanEditor({ lessonPlan, onExport }: LessonPlanEditorProps) {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const { toast } = useToast();

  useEffect(() => {
    if (lessonPlan) {
      const content = convertLessonPlanToText(lessonPlan);
      setEditorState(EditorState.createWithContent(
        ContentState.createFromText(content)
      ));
    }
  }, [lessonPlan]);

  const convertLessonPlanToText = (plan: any): string => {
    let text = `${plan.title || 'Lesson Plan'}\n\n`;
    text += `School: ${plan.school || ''}\n`;
    text += `Level: ${plan.level || ''}\n`;
    text += `Learning Area: ${plan.learningArea || ''}\n`;
    text += `Date: ${plan.date || ''}\n`;
    text += `Week: ${plan.week || ''}\n`;
    text += `Lesson: ${plan.lessonNumber || ''}\n\n`;
    
    if (plan.specificLearningOutcomes?.length) {
      text += "Learning Outcomes:\n";
      plan.specificLearningOutcomes.forEach((outcome: string) => {
        text += `• ${outcome}\n`;
      });
    }
    
    return text;
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button onClick={() => onExport('pdf')}>Export as PDF</Button>
        <Button variant="outline" onClick={() => onExport('word')}>
          Export as Word
        </Button>
      </div>
      
      <div className="border rounded-md">
        <Editor
          editorState={editorState}
          onEditorStateChange={setEditorState}
          toolbarClassName="border-b border-gray-200"
          wrapperClassName="border-t border-gray-200"
          editorClassName="p-4 min-h-[500px]"
        />
      </div>
    </div>
  );
}