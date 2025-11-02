-- Create books table
CREATE TABLE public.books (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  author TEXT,
  category TEXT NOT NULL,
  is_free BOOLEAN DEFAULT true,
  price INTEGER DEFAULT 0,
  pages INTEGER,
  language TEXT DEFAULT 'English',
  published_date DATE,
  pdf_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

-- Anyone can view books
CREATE POLICY "Anyone can view books"
ON public.books
FOR SELECT
USING (true);

-- Admins can manage books
CREATE POLICY "Admins can manage books"
ON public.books
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_books_updated_at
BEFORE UPDATE ON public.books
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();