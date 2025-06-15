
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Settings } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export interface LessonPlanConfiguration {
  school: string;
  level: string;
  learningArea: string;
  date: Date;
  roll: string;
  term: number;
  lessonsPerWeek: number;
  singleLessonDuration: number;
  doubleLessonDuration: number;
  hasDoubleLessons: boolean;
}

interface LessonPlanConfigProps {
  onConfigurationComplete: (config: LessonPlanConfiguration) => void;
  isVisible: boolean;
}

const learningAreas = [
  'English',
  'Kiswahili', 
  'Mathematics',
  'Integrated Science',
  'Health Education',
  'Pre-Technical Studies',
  'Agriculture',
  'Life Skills Education',
  'Sports and Physical Education',
  'Creative Arts',
  'Social Studies',
  'Christian Religious Education',
  'Islamic Religious Education',
  'Hindu Religious Education'
];

const gradeLevels = [
  'Grade 7', 'Grade 8', 'Grade 9'
];

export const LessonPlanConfig: React.FC<LessonPlanConfigProps> = ({ 
  onConfigurationComplete, 
  isVisible 
}) => {
  const [config, setConfig] = useState<LessonPlanConfiguration>({
    school: '',
    level: '',
    learningArea: '',
    date: new Date(),
    roll: '',
    term: 1,
    lessonsPerWeek: 4,
    singleLessonDuration: 40,
    doubleLessonDuration: 80,
    hasDoubleLessons: true
  });

  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfigurationComplete(config);
  };

  const updateConfig = (field: keyof LessonPlanConfiguration, value: any) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  if (!isVisible) return null;

  return (
    <Card className="backdrop-blur-md bg-white/40 border border-white/30 shadow-xl mb-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          <Settings className="h-5 w-5 text-blue-600" />
          <span>Lesson Plan Configuration</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* School Information */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="school">School Name</Label>
              <Input
                id="school"
                value={config.school}
                onChange={(e) => updateConfig('school', e.target.value)}
                placeholder="Enter school name"
                className="backdrop-blur-sm bg-white/30 border-white/30"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="roll">Roll/Class</Label>
              <Input
                id="roll"
                value={config.roll}
                onChange={(e) => updateConfig('roll', e.target.value)}
                placeholder="e.g., 9A, 8B, etc."
                className="backdrop-blur-sm bg-white/30 border-white/30"
                required
              />
            </div>
          </div>

          {/* Academic Information */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="level">Grade Level</Label>
              <Select value={config.level} onValueChange={(value) => updateConfig('level', value)}>
                <SelectTrigger className="backdrop-blur-sm bg-white/30 border-white/30">
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  {gradeLevels.map(level => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="learningArea">Learning Area</Label>
              <Select value={config.learningArea} onValueChange={(value) => updateConfig('learningArea', value)}>
                <SelectTrigger className="backdrop-blur-sm bg-white/30 border-white/30">
                  <SelectValue placeholder="Select learning area" />
                </SelectTrigger>
                <SelectContent>
                  {learningAreas.map(area => (
                    <SelectItem key={area} value={area}>{area}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="term">Term</Label>
              <Select value={config.term.toString()} onValueChange={(value) => updateConfig('term', parseInt(value))}>
                <SelectTrigger className="backdrop-blur-sm bg-white/30 border-white/30">
                  <SelectValue placeholder="Select term" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Term 1</SelectItem>
                  <SelectItem value="2">Term 2</SelectItem>
                  <SelectItem value="3">Term 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date Selection */}
          <div className="space-y-2">
            <Label>Start Date</Label>
            <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal backdrop-blur-sm bg-white/30 border-white/30",
                    !config.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {config.date ? format(config.date, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={config.date}
                  onSelect={(date) => {
                    updateConfig('date', date || new Date());
                    setDatePickerOpen(false);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Lesson Configuration */}
          <div className="space-y-4 p-4 rounded-lg backdrop-blur-sm bg-white/20 border border-white/30">
            <h4 className="font-medium text-gray-900">Lesson Schedule Configuration</h4>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lessonsPerWeek">Lessons per Week</Label>
                <Select 
                  value={config.lessonsPerWeek.toString()} 
                  onValueChange={(value) => updateConfig('lessonsPerWeek', parseInt(value))}
                >
                  <SelectTrigger className="backdrop-blur-sm bg-white/30 border-white/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[3, 4, 5, 6, 7, 8].map(num => (
                      <SelectItem key={num} value={num.toString()}>{num} lessons</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="singleLessonDuration">Single Lesson Duration (minutes)</Label>
                <Select 
                  value={config.singleLessonDuration.toString()} 
                  onValueChange={(value) => updateConfig('singleLessonDuration', parseInt(value))}
                >
                  <SelectTrigger className="backdrop-blur-sm bg-white/30 border-white/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[30, 35, 40, 45, 50, 60].map(duration => (
                      <SelectItem key={duration} value={duration.toString()}>{duration} minutes</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="hasDoubleLessons"
                  checked={config.hasDoubleLessons}
                  onChange={(e) => updateConfig('hasDoubleLessons', e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="hasDoubleLessons" className="text-sm">Include double lessons</Label>
              </div>
              
              {config.hasDoubleLessons && (
                <div className="space-y-2">
                  <Label htmlFor="doubleLessonDuration">Double Lesson Duration (minutes)</Label>
                  <Select 
                    value={config.doubleLessonDuration.toString()} 
                    onValueChange={(value) => updateConfig('doubleLessonDuration', parseInt(value))}
                  >
                    <SelectTrigger className="backdrop-blur-sm bg-white/30 border-white/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[60, 70, 80, 90, 100, 120].map(duration => (
                        <SelectItem key={duration} value={duration.toString()}>{duration} minutes</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            Configure Lesson Plans
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
