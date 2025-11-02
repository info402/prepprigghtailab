import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen, Download, Star, TrendingUp, Tag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Book {
  id: string;
  title: string;
  description: string;
  author: string;
  category: string;
  cover_image_url: string;
  is_free: boolean;
  is_featured: boolean;
  pages: number;
  published_date: string;
  pdf_url?: string;
}

const Books = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBooks(data || []);
    } catch (error) {
      console.error('Error fetching books:', error);
      toast({
        title: "Error",
        description: "Failed to load books",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const freeBooks = books.filter(book => book.is_free);
  const featuredBooks = books.filter(book => book.is_featured).slice(0, 10);
  const categories = [...new Set(books.map(book => book.category))];

  const BookCard = ({ book }: { book: Book }) => (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <img
          src={book.cover_image_url}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {book.is_free && (
          <Badge className="absolute top-2 right-2 bg-primary">FREE</Badge>
        )}
        {book.is_featured && (
          <div className="absolute top-2 left-2 bg-accent text-accent-foreground p-1 rounded-full">
            <Star className="h-4 w-4" />
          </div>
        )}
      </div>
      <CardHeader className="pb-3">
        <CardTitle className="line-clamp-2 text-lg">{book.title}</CardTitle>
        <CardDescription className="line-clamp-2">{book.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <span className="flex items-center gap-1">
            <BookOpen className="h-3 w-3" />
            {book.pages} pages
          </span>
          <Badge variant="secondary" className="text-xs">{book.category}</Badge>
        </div>
        <Button className="w-full" variant={book.pdf_url ? "default" : "secondary"}>
          <Download className="h-4 w-4 mr-2" />
          {book.pdf_url ? "Download" : "Coming Soon"}
        </Button>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-pulse text-muted-foreground">Loading books...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-12">
        {/* Hero Section */}
        <section className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-background p-8 md:p-12">
          <div className="relative z-10 max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Free Learning Resources
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Access our comprehensive collection of books designed to help you ace interviews, build projects, and advance your tech career. All completely free.
            </p>
            <Button size="lg" className="gap-2">
              <BookOpen className="h-5 w-5" />
              Explore All Books
            </Button>
          </div>
          <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
            <BookOpen className="w-full h-full" />
          </div>
        </section>

        {/* Free Books Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold flex items-center gap-2">
                <BookOpen className="h-8 w-8 text-primary" />
                Free Books for You
              </h2>
              <p className="text-muted-foreground mt-1">
                Complete learning resources at zero cost
              </p>
            </div>
            <Button variant="outline">Explore All</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {freeBooks.slice(0, 15).map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </section>

        {/* Top Featured Books */}
        {featuredBooks.length > 0 && (
          <section>
            <div className="mb-6">
              <h2 className="text-3xl font-bold flex items-center gap-2">
                <TrendingUp className="h-8 w-8 text-primary" />
                Top 10 Books of All Time
              </h2>
              <p className="text-muted-foreground mt-1">
                Our most popular and highly-rated books
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {featuredBooks.map((book, index) => (
                <div key={book.id} className="relative">
                  <div className="absolute -top-3 -left-3 z-10 bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center font-bold shadow-lg">
                    #{index + 1}
                  </div>
                  <BookCard book={book} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Categories Section */}
        <section>
          <div className="mb-6">
            <h2 className="text-3xl font-bold flex items-center gap-2">
              <Tag className="h-8 w-8 text-primary" />
              Explore by Categories
            </h2>
            <p className="text-muted-foreground mt-1">
              Find books by your area of interest
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {categories.map(category => {
              const count = books.filter(book => book.category === category).length;
              return (
                <Button
                  key={category}
                  variant="outline"
                  size="lg"
                  className="hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {category}
                  <Badge variant="secondary" className="ml-2">{count}</Badge>
                </Button>
              );
            })}
          </div>
        </section>

        {/* Stats Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-4xl font-bold text-primary">{books.length}+</CardTitle>
              <CardDescription>Free Books Available</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-4xl font-bold text-primary">{categories.length}+</CardTitle>
              <CardDescription>Different Categories</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-4xl font-bold text-primary">100%</CardTitle>
              <CardDescription>Free Forever</CardDescription>
            </CardHeader>
          </Card>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default Books;