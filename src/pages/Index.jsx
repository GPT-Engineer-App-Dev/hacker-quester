import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ExternalLink, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

const fetchTopStories = async () => {
  const response = await fetch('https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=100');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isClicking, setIsClicking] = useState(false);
  const searchInputRef = useRef(null);
  const { data, isLoading, error } = useQuery({
    queryKey: ['topStories'],
    queryFn: fetchTopStories,
  });

  const filteredStories = data?.hits.filter(story =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  useEffect(() => {
    const typingEffect = async () => {
      const text = "Search hacker stories...";
      for (let i = 0; i <= text.length; i++) {
        setSearchTerm(text.slice(0, i));
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSearchTerm('');
      searchInputRef.current?.focus();
    };

    typingEffect();
  }, []);

  if (error) return <div className="text-center text-red-500">An error occurred: {error.message}</div>;

  return (
    <div className="min-h-screen p-8 bg-background text-foreground matrix-bg">
      <div
        className={`custom-cursor ${isClicking ? 'clicking' : ''}`}
        style={{ left: `${cursorPosition.x}px`, top: `${cursorPosition.y}px` }}
      />
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-primary glow flicker">Top 100 Hacker News Stories</h1>
        <Link to="/about" className="text-primary hover:text-primary-foreground">
          <Info className="h-6 w-6" />
        </Link>
      </div>
      
      <div className="mb-6 flex justify-center">
        <Input
          ref={searchInputRef}
          type="text"
          placeholder="Search stories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md bg-card text-card-foreground border-primary typing-effect"
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
                </CardContent>
              </Card>
            ))}
      </div>
    </div>
  );
};

export default Index;
