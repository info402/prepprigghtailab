import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import { useState } from "react";

interface BookReaderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  book: {
    title: string;
    author?: string;
    content?: string;
    pages?: number;
  };
}

const BookReader = ({ open, onOpenChange, book }: BookReaderProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = book.pages || 1;

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            {book.title}
            {book.author && <span className="text-sm text-muted-foreground">by {book.author}</span>}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto bg-muted/30 rounded-lg p-8">
          <div className="max-w-3xl mx-auto bg-background p-8 rounded-lg shadow-sm min-h-full">
            <div className="prose prose-sm max-w-none">
              <p className="text-muted-foreground italic mb-4">Page {currentPage} of {totalPages}</p>
              <div className="whitespace-pre-wrap leading-relaxed">
                {book.content || "Book content will be displayed here. Connect to a content source or upload book content to enable reading."}
              </div>
            </div>
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
