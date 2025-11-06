import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, BookOpen, Volume2, VolumeX, Play, Pause } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

interface BookPage {
  id: string;
  page_number: number;
  chapter_number: string;
  chapter_title: string;
  content: string;
}

interface BookReaderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  book: {
    title: string;
    author?: string;
    pages?: BookPage[];
  };
}

const BookReader = ({ open, onOpenChange, book }: BookReaderProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [isReading, setIsReading] = useState(false);
  const totalPages = book.pages?.length || 1;
  const { toast } = useToast();
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  const currentPageData = book.pages?.[currentPage - 1];

  // Play page turn sound
  const playPageTurnSound = () => {
    if (!isSoundEnabled) return;
    
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      playPageTurnSound();
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      playPageTurnSound();
    }
  };

  // Text-to-speech functionality
  const toggleTextToSpeech = () => {
    if (isReading) {
      window.speechSynthesis.cancel();
      setIsReading(false);
    } else {
      const text = currentPageData?.content || "No content available to read.";
      
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.9;
        utterance.pitch = 1;
        
        utterance.onend = () => {
          setIsReading(false);
        };
        
        utterance.onerror = () => {
          setIsReading(false);
          toast({
            title: "Error",
            description: "Failed to read the content",
            variant: "destructive",
          });
        };
        
        speechSynthesisRef.current = utterance;
        window.speechSynthesis.speak(utterance);
        setIsReading(true);
      } else {
        toast({
          title: "Not Supported",
          description: "Text-to-speech is not supported in your browser",
          variant: "destructive",
        });
      }
    }
  };

  // Clean up speech synthesis when dialog closes
  useEffect(() => {
    if (!open) {
      window.speechSynthesis.cancel();
      setIsReading(false);
      setCurrentPage(1);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between w-full">
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              {book.title}
              {book.author && <span className="text-sm text-muted-foreground">by {book.author}</span>}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTextToSpeech}
                title={isReading ? "Stop reading" : "Read aloud"}
              >
                {isReading ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSoundEnabled(!isSoundEnabled)}
                title={isSoundEnabled ? "Disable page turn sound" : "Enable page turn sound"}
              >
                {isSoundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto bg-muted/30 rounded-lg p-8">
          <div className="max-w-3xl mx-auto bg-background p-8 rounded-lg shadow-sm min-h-full">
            {currentPageData ? (
              <div className="space-y-6">
                {/* Chapter badge */}
                <div className="inline-flex items-center justify-center px-4 py-2 bg-primary/10 border-2 border-primary/30 rounded-lg">
                  <span className="text-2xl font-bold text-primary">{currentPageData.chapter_number}</span>
                </div>
                
                {/* Chapter title */}
                <h2 className="text-2xl font-bold text-foreground border-b-2 pb-2">
                  {currentPageData.chapter_title}
                </h2>
                
                {/* Page content */}
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap leading-relaxed text-foreground/90">
                    {currentPageData.content}
                  </div>
                </div>
                
                {/* Page number at bottom */}
                <p className="text-center text-muted-foreground italic mt-8 pt-4 border-t">
                  {currentPage}
                </p>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-12">
                <p className="text-lg">No content available for this page.</p>
                <p className="text-sm mt-2">Please check back later.</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={previousPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          
          <Button
            variant="outline"
            onClick={nextPage}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookReader;
