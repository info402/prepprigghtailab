-- Create table for user highlights and notes
CREATE TABLE public.user_highlights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  book_id UUID NOT NULL,
  page_number INTEGER NOT NULL,
  selected_text TEXT NOT NULL,
  highlight_color TEXT NOT NULL DEFAULT 'yellow',
  note_text TEXT,
  start_offset INTEGER NOT NULL,
  end_offset INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_highlights ENABLE ROW LEVEL SECURITY;

-- Create policies for user highlights
CREATE POLICY "Users can view own highlights"
ON public.user_highlights
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own highlights"
ON public.user_highlights
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own highlights"
ON public.user_highlights
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own highlights"
ON public.user_highlights
FOR DELETE
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_user_highlights_user_book ON public.user_highlights(user_id, book_id);
CREATE INDEX idx_user_highlights_page ON public.user_highlights(book_id, page_number);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_user_highlights_updated_at
BEFORE UPDATE ON public.user_highlights
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();