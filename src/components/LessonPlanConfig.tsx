
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Settings, Info } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CBC_LEARNING_AREAS, ALL_GRADE_LEVELS, SENIOR_SECONDARY_PATHWAYS, COMPULSORY_SENIOR_SUBJECTS } from '@/types/CBCStructure';

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
  pathway?: string; // For senior secondary
}

interface LessonPlanConfigProps {
  onConfigurationComplete: (config: LessonPlanConfiguration) => void;
  isVisible: boolean;
}

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

  const isSeniorSecondary = config.level && ['Grade 10', 'Grade 11', 'Grade 12'].includes(config.level);
  const availableLearningAreas = config.level ? CBC_LEARNING_AREAS[config.level] || [] : [];

  const getGradeLevelCategory = (level: string) => {
    if (['PP1', 'PP2'].includes(level)) return 'Pre-Primary';
    if (['Grade 1', 'Grade 2', 'Grade 3'].includes(level)) return 'Lower Primary';
    if (['Grade 4', 'Grade 5', 'Grade 6'].includes(level)) return 'Upper Primary';
    if (['Grade 7', 'Grade 8', 'Grade 9'].includes(level)) return 'Junior Secondary';
    if (['Grade 10', 'Grade 11', 'Grade 12'].includes(level)) return 'Senior Secondary';
    return '';
  };

  if (!isVisible) return null;

  return (
    <Card className="backdrop-blur-md bg-white/40 border border-white/30 shadow-xl mb-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          <Settings className="h-5 w-5 text-blue-600" />
          <span>CBC Lesson Plan Configuration</span>
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
                placeholder="e.g., 9A, 8B, PP1A, etc."
                className="backdrop-blur-sm bg-white/30 border-white/30"
                required
              />
            </div>
          </div>

          {/* Academic Information */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="level">Grade Level</Label>
              <Select 
                value={config.level} 
                onValueChange={(value) => {
                  updateConfig('level', value);
                  updateConfig('learningArea', ''); // Reset learning area when level changes
                }}
              >
                <SelectTrigger className="backdrop-blur-sm bg-white/30 border-white/30">
                  <SelectValue placeholder="Select grade level" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {/* Pre-Primary */}
                  <div className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-50">Pre-Primary (Ages 4-5)</div>
                  {['PP1', 'PP2'].map(level => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                  
                  {/* Lower Primary */}
                  <div className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-50">Lower Primary (Ages 6-8)</div>
                  {['Grade 1', 'Grade 2', 'Grade 3'].map(level => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                  
                  {/* Upper Primary */}
                  <div className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-50">Upper Primary (Ages 9-11)</div>
                  {['Grade 4', 'Grade 5', 'Grade 6'].map(level => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                  
                  {/* Junior Secondary */}
                  <div className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-50">Junior Secondary (Ages 12-14)</div>
                  {['Grade 7', 'Grade 8', 'Grade 9'].map(level => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                  
                  {/* Senior Secondary */}
                  <div className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-50">Senior Secondary (Ages 15-17)</div>
                  {['Grade 10', 'Grade 11', 'Grade 12'].map(level => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {config.level && (
                <p className="text-xs text-gray-600 flex items-center space-x-1">
                  <Info className="h-3 w-3" />
                  <span>{getGradeLevelCategory(config.level)}</span>
                </p>
              )}
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

          {/* Senior Secondary Pathway Selection */}
          {isSeniorSecondary && (
            <div className="space-y-2">
              <Label htmlFor="pathway">Career Pathway (Senior Secondary)</Label>
              <Select value={config.pathway || ''} onValueChange={(value) => updateConfig('pathway', value)}>
                <SelectTrigger className="backdrop-blur-sm bg-white/30 border-white/30">
                  <SelectValue placeholder="Select career pathway" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="STEM">STEM (Science, Technology, Engineering & Mathematics)</SelectItem>
                  <SelectItem value="Social Sciences">Social Sciences</SelectItem>
                  <SelectItem value="Arts and Sports Sciences">Arts and Sports Sciences</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-blue-600">
                All students take compulsory subjects plus specialized pathway subjects
              </p>
            </div>
          )}

          {/* Learning Area Selection */}
          <div className="space-y-2">
            <Label htmlFor="learningArea">Learning Area/Subject</Label>
            <Select 
              value={config.learningArea} 
              onValueChange={(value) => updateConfig('learningArea', value)}
              disabled={!config.level}
            >
              <SelectTrigger className="backdrop-blur-sm bg-white/30 border-white/30">
                <SelectValue placeholder={config.level ? "Select learning area" : "Select grade level first"} />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {isSeniorSecondary && (
                  <>
                    <div className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-50">Compulsory Subjects</div>
                    {COMPULSORY_SENIOR_SUBJECTS.map(area => (
                      <SelectItem key={area} value={area}>{area}</SelectItem>
                    ))}
                    
                    {config.pathway && (
                      <>
                        <div className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-50">
                          {config.pathway} Pathway Subjects
                        </div>
                        {SENIOR_SECONDARY_PATHWAYS[config.pathway as keyof typeof SENIOR_SECONDARY_PATHWAYS]?.map(area => (
                          <SelectItem key={area} value={area}>{area}</SelectItem>
                        ))}
                      </>
                    )}
                  </>
                )}
                
                {!isSeniorSecondary && availableLearningAreas.map(area => (
                  <SelectItem key={area} value={area}>{area}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {config.level && availableLearningAreas.length > 0 && (
              <p className="text-xs text-gray-600">
                {availableLearningAreas.length} learning areas available for {config.level}
              </p>
            )}
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
                    {[2, 3, 4, 5, 6, 7, 8].map(num => (
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
            disabled={!config.school || !config.level || !config.learningArea || !config.roll}
          >
            Generate CBC Lesson Plans
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
