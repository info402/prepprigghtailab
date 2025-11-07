import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, BookOpen, Volume2, VolumeX, Play, Pause, Sparkles } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import corporateHero from "@/assets/book-corporate-hero.jpg";
import professionalImg from "@/assets/book-professional.jpg";
import networkingImg from "@/assets/book-networking.jpg";
import timeImg from "@/assets/book-time.jpg";

interface BookPage {
  page_number: number;
  chapter_number: string;
  chapter_title: string;
  content: string;
}

interface BookReaderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  book: {
    id: string;
    title: string;
    author?: string;
    pages?: number;
  };
}

const BookReader = ({ open, onOpenChange, book }: BookReaderProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [isReading, setIsReading] = useState(false);
  const [pages, setPages] = useState<BookPage[]>([]);
  const [loading, setLoading] = useState(true);
  const totalPages = pages.length || book.pages || 1;
  const { toast } = useToast();
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Fetch book pages
  useEffect(() => {
    const fetchPages = async () => {
      if (!book.id || !open) return;
      
      setLoading(true);
      const { data, error } = await supabase
        .from('book_pages')
        .select('*')
        .eq('book_id', book.id)
        .order('page_number');

      if (error) {
        console.error('Error fetching pages:', error);
        setLoading(false);
        return;
      }

      setPages(data || []);
      setLoading(false);
    };

    fetchPages();
  }, [book.id, open]);

  const currentPageData = pages.find(p => p.page_number === currentPage);

  // Map chapter numbers to images
  const getChapterImage = (chapterNum: string) => {
    switch (chapterNum) {
      case "1":
        return professionalImg;
      case "2":
      case "3":
        return corporateHero;
      case "4":
        return timeImg;
      case "5":
        return networkingImg;
      default:
        return null;
    }
  };

  const chapterImage = currentPageData ? getChapterImage(currentPageData.chapter_number) : null;

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
        
        <div className="flex-1 overflow-auto bg-gradient-to-br from-primary/5 via-muted/30 to-accent/5 rounded-lg p-4 md:p-8">
          <div className="max-w-4xl mx-auto bg-background/95 backdrop-blur-sm p-8 md:p-12 rounded-xl shadow-2xl min-h-full border border-primary/10 relative overflow-hidden">
            {/* Decorative corner elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-accent/10 to-transparent rounded-tr-full" />
            
            {loading ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                  <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                  <p className="text-muted-foreground">Loading pages...</p>
                </div>
              </div>
            ) : currentPageData ? (
              <div className="space-y-8 relative z-10">
                {/* Chapter Header with Image */}
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-bold text-2xl w-16 h-16 rounded-xl flex items-center justify-center shadow-lg border-2 border-primary/20 relative">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-xl" />
                      <span className="relative">{currentPageData.chapter_number}</span>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                        {currentPageData.chapter_title}
                      </h2>
                    </div>
                  </div>

                  {/* Chapter Image */}
                  {chapterImage && (
                    <div className="relative rounded-xl overflow-hidden shadow-xl border-2 border-primary/10 group">
                      <img 
                        src={chapterImage} 
                        alt={currentPageData.chapter_title}
                        className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <div className="flex items-center gap-2 text-foreground">
                          <Sparkles className="w-4 h-4" />
                          <span className="text-sm font-medium">Chapter {currentPageData.chapter_number}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Decorative divider */}
                  <div className="flex items-center gap-4 my-8">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                    <div className="w-2 h-2 rounded-full bg-primary/50" />
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                  </div>
                </div>

                {/* Page Content */}
                <div className="prose prose-lg max-w-none">
                  <div className="text-foreground leading-relaxed whitespace-pre-wrap text-base md:text-lg space-y-4 relative">
                    {/* Quote-style left border */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-accent to-primary rounded-full opacity-20" />
                    <div className="pl-6">
                      {currentPageData.content}
                    </div>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="flex justify-center gap-2 my-8">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-2 h-2 rounded-full bg-primary/20" />
                  ))}
                </div>

                {/* Page Number Footer */}
                <div className="mt-12 pt-6 border-t border-border/50 text-center relative">
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
                  <p className="text-sm text-muted-foreground font-medium flex items-center justify-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    <span>Page {currentPage}</span>
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-muted-foreground">No content available for this page.</p>
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
