import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Download, Star, Users, TrendingUp } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Book = Database["public"]["Tables"]["books"]["Row"];

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

  const freeBooks = books.filter((book) => book.is_free);
  const featuredBooks = books.filter((book) => book.is_featured);
  const categories = Array.from(new Set(books.map((book) => book.category)));

  const BookCard = ({ book }: { book: Book }) => (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden border-border/50 hover:border-primary/50">
      <div className="aspect-[3/4] overflow-hidden bg-muted">
        <img
          src={book.cover_image_url || "/placeholder.svg"}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardHeader className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <CardTitle className="text-base line-clamp-2 group-hover:text-primary transition-colors">
            {book.title}
          </CardTitle>
          {book.is_free && (
            <Badge variant="secondary" className="shrink-0">
              Free
            </Badge>
          )}
        </div>
        <CardDescription className="text-xs line-clamp-2">
          {book.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-2">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            {book.pages} pages
          </span>
          {book.author && (
            <span className="truncate">{book.author}</span>
          )}
        </div>
        <Button className="w-full" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-16 px-4 mb-12">
          <div className="max-w-7xl mx-auto text-center space-y-6">
            <Badge variant="outline" className="mb-4">
              <Star className="w-3 h-3 mr-1" />
              Free Learning Resources
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Learn. Build. Succeed.
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Access our comprehensive collection of free books designed to help you master technical skills and advance your career
            </p>
            <div className="flex items-center justify-center gap-8 pt-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                <div className="text-left">
                  <div className="text-2xl font-bold">{books.length}+</div>
                  <div className="text-xs text-muted-foreground">Books</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <div className="text-left">
                  <div className="text-2xl font-bold">10k+</div>
                  <div className="text-xs text-muted-foreground">Readers</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <div className="text-left">
                  <div className="text-2xl font-bold">100%</div>
                  <div className="text-xs text-muted-foreground">Free</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 space-y-16 pb-16">
          {/* Featured Books Section */}
          {featuredBooks.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Featured Books</h2>
                  <p className="text-muted-foreground">
                    Handpicked by our experts to help you excel
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {featuredBooks.slice(0, 5).map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            </section>
          )}

          {/* All Free Books Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold mb-2">All Free Books</h2>
                <p className="text-muted-foreground">
                  Explore our complete collection of free learning resources
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {freeBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </section>

          {/* Categories Section */}
          <section>
            <div className="mb-6">
              <h2 className="text-3xl font-bold mb-2">Explore by Category</h2>
              <p className="text-muted-foreground">
                Find books tailored to your learning goals
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant="outline"
                  size="lg"
                  className="hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {category}
                  <Badge variant="secondary" className="ml-2">
                    {books.filter((b) => b.category === category).length}
                  </Badge>
                </Button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Books;