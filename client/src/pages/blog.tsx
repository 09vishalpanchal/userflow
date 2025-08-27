import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Calendar, User, Clock, Search, Tag } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishDate: string;
  readTime: string;
  category: string;
  tags: string[];
  featured: boolean;
}

export default function Blog() {
  const [, setLocation] = useLocation();
  const [user] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const blogPosts: BlogPost[] = [
    {
      id: "1",
      title: "10 Tips for Hiring the Right Home Cleaning Service",
      excerpt: "Finding a reliable cleaning service can be challenging. Here are our top tips to help you make the right choice for your home.",
      content: "Complete guide content would be here...",
      author: "Priya Sharma",
      publishDate: "2024-01-15",
      readTime: "5 min read",
      category: "Home Services",
      tags: ["cleaning", "tips", "home"],
      featured: true
    },
    {
      id: "2",
      title: "How to Build a Successful Service Business on ServiceConnect",
      excerpt: "Learn the strategies that top-rated providers use to grow their business and increase their earnings on our platform.",
      content: "Complete guide content would be here...",
      author: "Rajesh Kumar",
      publishDate: "2024-01-12",
      readTime: "7 min read",
      category: "Business Growth",
      tags: ["business", "providers", "growth"],
      featured: true
    },
    {
      id: "3",
      title: "The Future of Local Services: Technology and Trust",
      excerpt: "Exploring how technology is revolutionizing the local services industry while maintaining the human touch that customers value.",
      content: "Complete guide content would be here...",
      author: "Arjun Patel",
      publishDate: "2024-01-10",
      readTime: "6 min read",
      category: "Industry Insights",
      tags: ["technology", "future", "trends"],
      featured: false
    },
    {
      id: "4",
      title: "Essential Plumbing Maintenance Tips for Homeowners",
      excerpt: "Prevent costly repairs with these simple maintenance tips that every homeowner should know about their plumbing system.",
      content: "Complete guide content would be here...",
      author: "Mohammed Ali",
      publishDate: "2024-01-08",
      readTime: "4 min read", 
      category: "Home Services",
      tags: ["plumbing", "maintenance", "diy"],
      featured: false
    },
    {
      id: "5",
      title: "Seasonal Home Maintenance Checklist",
      excerpt: "Stay ahead of seasonal maintenance needs with our comprehensive checklist for spring, summer, fall, and winter.",
      content: "Complete guide content would be here...",
      author: "Sunita Gupta",
      publishDate: "2024-01-05",
      readTime: "8 min read",
      category: "Home Services", 
      tags: ["maintenance", "seasonal", "checklist"],
      featured: false
    },
    {
      id: "6",
      title: "Customer Safety Guide: Vetting Service Providers",
      excerpt: "Important safety considerations and red flags to watch out for when hiring service providers for your home.",
      content: "Complete guide content would be here...",
      author: "Security Team",
      publishDate: "2024-01-03",
      readTime: "5 min read",
      category: "Safety & Security",
      tags: ["safety", "vetting", "security"],
      featured: false
    }
  ];

  const categories = ["All", "Home Services", "Business Growth", "Industry Insights", "Safety & Security"];
  const featuredPosts = blogPosts.filter(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const BlogCard = ({ post, featured = false }: { post: BlogPost, featured?: boolean }) => (
    <Card 
      className={`hover:shadow-lg transition-shadow cursor-pointer ${featured ? 'md:col-span-2' : ''}`}
      onClick={() => setLocation(`/blog/${post.id}`)}
      data-testid={`blog-post-${post.id}`}
    >
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <Badge variant="secondary" data-testid={`post-category-${post.id}`}>
            {post.category}
          </Badge>
          {featured && (
            <Badge className="bg-yellow-100 text-yellow-800" data-testid={`featured-badge-${post.id}`}>
              Featured
            </Badge>
          )}
        </div>
        <CardTitle className={`${featured ? 'text-xl' : 'text-lg'} line-clamp-2`} data-testid={`post-title-${post.id}`}>
          {post.title}
        </CardTitle>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <User size={14} />
            <span>{post.author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>{new Date(post.publishDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{post.readTime}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className={`text-muted-foreground ${featured ? 'line-clamp-3' : 'line-clamp-2'} mb-4`} data-testid={`post-excerpt-${post.id}`}>
          {post.excerpt}
        </p>
        <div className="flex flex-wrap gap-1">
          {post.tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs" data-testid={`post-tag-${post.id}-${index}`}>
              <Tag size={10} className="mr-1" />
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background" data-testid="blog-page">
      <Navbar user={user} onSignIn={() => setLocation("/auth/login")} onGetStarted={() => setLocation("/auth/register")} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" data-testid="page-title">
            ServiceConnect Blog
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="page-description">
            Tips, insights, and guides to help you make the most of local services
          </p>
        </div>

        {/* Search and Filters */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-3 text-muted-foreground" />
              <Input 
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="search-input"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="whitespace-nowrap"
                  data-testid={`category-filter-${category}`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && searchQuery === "" && selectedCategory === "All" && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6" data-testid="featured-title">Featured Articles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {featuredPosts.map(post => (
                <BlogCard key={post.id} post={post} featured />
              ))}
            </div>
          </section>
        )}

        {/* All Posts */}
        <section>
          <h2 className="text-2xl font-bold mb-6" data-testid="all-posts-title">
            {searchQuery || selectedCategory !== "All" ? "Search Results" : "Latest Articles"}
          </h2>
          
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12" data-testid="no-results">
              <div className="text-muted-foreground mb-4">
                <h3 className="text-lg font-semibold">No articles found</h3>
                <p>Try adjusting your search terms or filters</p>
              </div>
              <Button onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }} data-testid="clear-filters">
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="blog-grid">
              {filteredPosts.map(post => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </section>

        {/* Newsletter Signup */}
        <section className="mt-16">
          <Card className="text-center" data-testid="newsletter-section">
            <CardHeader>
              <CardTitle>Stay Updated</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Get the latest tips, insights, and updates delivered to your inbox
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input placeholder="Enter your email" type="email" data-testid="newsletter-email" />
                <Button data-testid="newsletter-subscribe">Subscribe</Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Popular Tags */}
        <section className="mt-12">
          <h2 className="text-xl font-bold mb-4" data-testid="popular-tags-title">Popular Tags</h2>
          <div className="flex flex-wrap gap-2">
            {Array.from(new Set(blogPosts.flatMap(post => post.tags))).map(tag => (
              <Button 
                key={tag} 
                variant="outline" 
                size="sm"
                onClick={() => setSearchQuery(tag)}
                data-testid={`popular-tag-${tag}`}
              >
                <Tag size={12} className="mr-1" />
                {tag}
              </Button>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}