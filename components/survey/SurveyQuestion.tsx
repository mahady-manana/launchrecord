import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, ArrowRight, CheckCircle, Search, X, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { ImageUpload } from "@/components/ImageUpload";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Question {
  title: string;
  key: string;
  type: "text" | "textarea" | "radio" | "url" | "image" | "multiselect";
  description?: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
}

interface Topic {
  _id: string;
  name: string;
}

interface SurveyQuestionProps {
  question: Question;
  answer: string | string[];
  onAnswer: (value: string | string[]) => void;
  onNext: () => void;
  onPrev: () => void;
  step: number;
  totalSteps: number;
  isLoading: boolean;
  isLastQuestion: boolean;
}

export function SurveyQuestion({
  question,
  answer,
  onAnswer,
  onNext,
  onPrev,
  step,
  totalSteps,
  isLoading,
  isLastQuestion,
}: SurveyQuestionProps) {
  const progress = ((step + 1) / totalSteps) * 100;
  // answer can be string[] (IDs from saved data) or Topic[] (objects)
  const initialTopics: Topic[] = Array.isArray(answer) 
    ? answer.map((a: any) => typeof a === 'string' ? { _id: a, name: a } : a)
    : [];
  const [selectedTopics, setSelectedTopics] = useState<Topic[]>(initialTopics);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Topic[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Local state for text/image inputs - only committed on Next click
  const [localValue, setLocalValue] = useState<string>(
    typeof answer === 'string' ? answer : ''
  );
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

  // Determine if we can continue based on local state
  const canContinue = question.type === "multiselect"
    ? selectedTopics.length > 0
    : question.key === 'tagline'
      ? localValue.trim().length > 0 && localValue.length <= 80
      : localValue.trim().length > 0;

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current && (question.type === 'text' || question.type === 'textarea' || question.type === 'url')) {
      inputRef.current.focus();
    }
  }, [question.type]);

  // Fetch topics when multiselect question is shown
  useEffect(() => {
    if (question.type === "multiselect" && searchQuery === "") {
      fetchSuggestedTopics();
    }
  }, [question.type]);

  const fetchSuggestedTopics = async () => {
    try {
      const response = await fetch("/api/topics?limit=20");
      if (response.ok) {
        const data = await response.json();
        const filtered = data.topics.filter(
          (t: Topic) => !selectedTopics.some((st) => st._id === t._id),
        );
        setSearchResults(filtered);
      }
    } catch (error) {
      console.error("Error fetching topics:", error);
    }
  };

  const searchTopics = async (query: string) => {
    // Only search if query is 3+ characters
    if (!query.trim() || query.trim().length < 3) {
      fetchSuggestedTopics();
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `/api/topics?search=${encodeURIComponent(query)}&limit=10`,
      );
      if (response.ok) {
        const data = await response.json();
        const filtered = data.topics.filter(
          (t: Topic) => !selectedTopics.some((st) => st._id === t._id),
        );
        setSearchResults(filtered);
      }
    } catch (error) {
      console.error("Error searching topics:", error);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (question.type === "multiselect") {
      const debounce = setTimeout(() => {
        searchTopics(searchQuery);
      }, 500);
      return () => clearTimeout(debounce);
    }
  }, [searchQuery]);

  // Reset local state when question changes
  useEffect(() => {
    if (typeof answer === 'string') {
      setLocalValue(answer);
    } else {
      setLocalValue('');
    }
    // Reset search state for multiselect
    setSearchQuery('');
    setSearchResults([]);
  }, [question.key]);

  // Sync local value when navigating back to answered question
  useEffect(() => {
    if (typeof answer === 'string') {
      setLocalValue(answer);
    }
  }, [answer]);

  // Sync selected topics when navigating back
  useEffect(() => {
    if (Array.isArray(answer) && answer.length > 0) {
      const topics: Topic[] = answer.map((a: any) =>
        typeof a === 'string' ? { _id: a, name: a } : a
      );
      setSelectedTopics(topics);
    } else if (Array.isArray(answer) && answer.length === 0) {
      setSelectedTopics([]);
    }
  }, [answer]);

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const value = e.target.value;
    
    // Enforce 80 character limit for tagline
    if (question.key === 'tagline' && value.length > 80) {
      setLocalValue(value.slice(0, 80));
      return;
    }
    
    setLocalValue(value);
  };

  const handleImageChange = (url: string) => {
    setLocalValue(url);
  };

  const handleTopicToggle = (topic: Topic) => {
    const newSelected = selectedTopics.some((t) => t._id === topic._id)
      ? selectedTopics.filter((t) => t._id !== topic._id)
      : [...selectedTopics, topic].slice(0, 3);
    
    setSelectedTopics(newSelected);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && question.type !== "textarea") {
      e.preventDefault();
      handleNext();
    }
  };

  // Commit answer and go next
  const handleNext = () => {
    if (question.type === "multiselect") {
      onAnswer(selectedTopics.map(t => t._id));
    } else {
      onAnswer(localValue);
    }
    onNext();
  };

  const renderContent = () => {
    if (question.type === "textarea") {
      return (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          placeholder={question.placeholder || "Enter your answer"}
          value={localValue}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 text-base"
          rows={5}
        />
      );
    }

    if (question.type === "image") {
      return (
        <div className="flex items-center gap-4">
          {localValue ? (
            <img
              src={localValue}
              alt="Logo preview"
              className="h-20 w-20 rounded-lg object-cover border-2"
            />
          ) : (
            <div className="h-20 w-20 rounded-lg bg-slate-100 flex items-center justify-center">
              <span className="text-2xl">🏢</span>
            </div>
          )}
          <div className="flex-1">
            <ImageUpload
              value={localValue}
              onChange={handleImageChange}
            />
          </div>
        </div>
      );
    }

    if (question.type === "multiselect") {
      return (
        <div className="space-y-4">
          {/* Selected Topics */}
          {selectedTopics.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedTopics.map((topic) => (
                <Badge
                  key={topic._id}
                  variant="secondary"
                  className="gap-1 px-3 py-1.5 text-sm"
                >
                  {topic.name}
                  <button
                    onClick={() => handleTopicToggle(topic)}
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            {isSearching && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </div>

          {/* Search Results / Suggested Topics */}
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
              {searchResults.map((topic) => {
                const isSelected = selectedTopics.some(
                  (t) => t._id === topic._id,
                );
                const isDisabled = !isSelected && selectedTopics.length >= 3;

                return (
                  <button
                    key={topic._id}
                    onClick={() => !isDisabled && handleTopicToggle(topic)}
                    className={cn(
                      "p-3 rounded-lg border text-left transition-all",
                      isSelected
                        ? "bg-orange-50 border-orange-300 text-orange-900"
                        : isDisabled
                          ? "bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed"
                          : "hover:bg-slate-50 border-slate-200",
                    )}
                  >
                    {topic.name}
                  </button>
                );
              })}
            </div>
          ) : searchQuery && !isSearching && searchQuery.trim().length >= 3 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No topics found for &quot;{searchQuery}&quot;
            </p>
          ) : searchQuery && searchQuery.trim().length < 3 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Type at least 3 characters to search
            </p>
          ) : null}
        </div>
      );
    }

    if (question.type === "radio" && question.options) {
      return (
        <RadioGroup value={answer as string} onValueChange={(v) => onAnswer(v)}>
          <div className="space-y-3">
            {question.options.map((option) => (
              <div key={option.value} className="flex items-center gap-3">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label
                  htmlFor={option.value}
                  className="text-base cursor-pointer flex-1"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      );
    }

    // text, url, or default
    return (
      <div className="space-y-2">
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type={question.type === "url" ? "url" : "text"}
          placeholder={question.placeholder || "Enter your answer"}
          value={localValue}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          maxLength={question.key === 'tagline' ? 80 : undefined}
          className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 text-base"
        />
        {question.key === 'tagline' && (
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>Max 80 characters</span>
            <span className={localValue.length > 80 ? 'text-red-600 font-medium' : ''}>
              {localValue.length}/80
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-foreground">
              Question {step + 1} of {totalSteps}
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full h-2 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <Card className="border border-border shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl text-foreground">
              {question.title}
            </CardTitle>
            {question.description && (
              <CardDescription className="text-base mt-2">
                {question.description}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {renderContent()}

            {/* Navigation Buttons */}
            <div className="flex gap-4 pt-6 border-t border-border">
              <Button
                onClick={onPrev}
                variant="outline"
                className="flex-1 h-12"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={!canContinue || isLoading}
                className="flex-1 h-12 bg-orange-600 hover:bg-orange-700"
              >
                {isLastQuestion ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Review & Continue
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Friendly message */}
        <div className="mt-8 text-center text-muted-foreground">
          <p className="text-sm">
            Your answers are private and used to personalize your War Briefing.
          </p>
        </div>
      </div>
    </div>
  );
}
