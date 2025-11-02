import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Download, Star, TrendingUp } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Book {
  id: string;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  author: string | null;
  category: string;
  is_free: boolean;
  price: number;
  pages: number | null;
  language: string | null;
  published_date: string | null;
  pdf_url: string | null;
  is_featured: boolean;
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
        .from("books")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBooks(data || []);
    } catch (error) {
      console.error("Error fetching books:", error);
      toast({
        title: "Error",
        description: "Failed to load books",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (book: Book) => {
    if (book.pdf_url) {
      window.open(book.pdf_url, "_blank");
    } else {
      toast({
        title: "Coming Soon",
        description: "This book will be available for download soon!",
      });
    }
  };

  const freeBooks = books.filter(book => book.is_free);
  const featuredBooks = books.filter(book => book.is_featured);
  const categories = [...new Set(books.map(book => book.category))];

  const BookCard = ({ book, showRank }: { book: Book; showRank?: number }) => (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      {showRank && (
        <div className="absolute top-4 left-4 z-10 bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">
          #{showRank}
        </div>
      )}
      <div className="relative h-64 bg-muted overflow-hidden">
        {book.cover_image_url ? (
          <img
            src={book.cover_image_url}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="w-16 h-16 text-muted-foreground" />
          </div>
        )}
      </div>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg line-clamp-2">{book.title}</CardTitle>
          {book.is_free && (
            <Badge variant="secondary" className="shrink-0">Free</Badge>
          )}
        </div>
        {book.author && (
          <CardDescription>by {book.author}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {book.description || "Enhance your career with this comprehensive guide."}
        </p>
        <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            {book.pages || "N/A"} pages
          </span>
          <Badge variant="outline">{book.category}</Badge>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={() => handleDownload(book)} 
          className="w-full"
          variant={book.is_free ? "default" : "secondary"}
        >
          <Download className="w-4 h-4 mr-2" />
          {book.is_free ? "Download Free" : `Get for ₹${book.price}`}
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="relative rounded-lg overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-background p-8 md:p-12">
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Level Up Your Career with Free Resources
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Access comprehensive guides, tutorials, and career development books curated for ambitious professionals
            </p>
            <Button size="lg">
              <TrendingUp className="w-4 h-4 mr-2" />
              Explore All Books
            </Button>
          </div>
        </div>

        <Tabs defaultValue="free" className="w-full">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl">
            <TabsTrigger value="free">Free Books</TabsTrigger>
            <TabsTrigger value="featured">Top 10</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="all">All Books</TabsTrigger>
          </TabsList>

          {/* Free Books Tab */}
          <TabsContent value="free" className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Star className="w-6 h-6 text-primary" />
                    Free Books for You
                  </h2>
                  <p className="text-muted-foreground">
                    Start learning today with our free collection
                  </p>
                </div>
              </div>
              {loading ? (
                <div className="text-center py-12">Loading books...</div>
              ) : freeBooks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {freeBooks.map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>
              ) : (
                <Card className="p-12 text-center">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg text-muted-foreground">
                    No free books available yet. Check back soon!
                  </p>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Featured/Top 10 Tab */}
          <TabsContent value="featured" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Top 10 Books of All Time</h2>
              <p className="text-muted-foreground mb-6">
                Our most popular books loved by thousands of learners
              </p>
              {loading ? (
                <div className="text-center py-12">Loading books...</div>
              ) : featuredBooks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {featuredBooks.slice(0, 10).map((book, index) => (
                    <BookCard key={book.id} book={book} showRank={index + 1} />
                  ))}
                </div>
              ) : (
                <Card className="p-12 text-center">
                  <TrendingUp className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg text-muted-foreground">
                    Featured books will appear here soon!
                  </p>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Explore by Categories</h2>
              <p className="text-muted-foreground mb-6">
                Find books tailored to your interests
              </p>
              {categories.length > 0 ? (
                <div className="space-y-8">
                  {categories.map((category) => {
                    const categoryBooks = books.filter(b => b.category === category).slice(0, 4);
                    return (
                      <div key={category}>
                        <h3 className="text-xl font-semibold mb-4 capitalize">{category}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                          {categoryBooks.map((book) => (
                            <BookCard key={book.id} book={book} />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <Card className="p-12 text-center">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg text-muted-foreground">
                    No categories available yet.
                  </p>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* All Books Tab */}
          <TabsContent value="all" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-6">All Books</h2>
              {loading ? (
                <div className="text-center py-12">Loading books...</div>
              ) : books.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {books.map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>
              ) : (
                <Card className="p-12 text-center">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg text-muted-foreground">
                    No books available yet. Check back soon!
                  </p>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Books;
