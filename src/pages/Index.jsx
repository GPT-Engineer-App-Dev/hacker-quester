import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ExternalLink, Info, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import Comments from '../components/Comments';

const fetchTopStories = async () => {
  const response = await fetch('https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=100');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data, isLoading, error } = useQuery({
    queryKey: ['topStories'],
    queryFn: fetchTopStories,
  });

  const filteredStories = data?.hits.filter(story =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (error) return <div className="text-center text-red-500">An error occurred: {error.message}</div>;

  return (
    <div className="min-h-screen p-8 bg-background text-foreground matrix-bg">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-primary glow flicker">Top 100 Hacker News Stories</h1>
        <Link to="/about" className="text-primary hover:text-primary-foreground">
          <Info className="h-6 w-6" />
        </Link>
      </div>
      
      <div className="mb-6 flex justify-center">
        <Input
          type="text"
          placeholder="Search stories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md bg-card text-card-foreground border-primary"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array(12).fill().map((_, index) => (
              <Card key={index} className="w-full bg-card border-primary card-hover">
                <CardHeader>
                  <Skeleton className="h-4 w-3/4 bg-secondary" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-1/4 mb-2 bg-secondary" />
                  <Skeleton className="h-4 w-1/2 bg-secondary" />
                </CardContent>
              </Card>
            ))
          : filteredStories.map((story) => (
              <Card key={story.objectID} className="w-full bg-card border-primary card-hover">
                <CardHeader>
                  <CardTitle className="text-lg text-primary glow">{story.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">Upvotes: {story.points}</p>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      <a href={story.url} target="_blank" rel="noopener noreferrer">
                        Read More <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                    <Comments storyId={story.objectID} />
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>
    </div>
  );
};

export default Index;
