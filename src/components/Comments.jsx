import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageSquare } from 'lucide-react';

const fetchComments = async (storyId) => {
  const response = await fetch(`https://hn.algolia.com/api/v1/items/${storyId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch comments');
  }
  return response.json();
};

const Comment = ({ comment }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!comment) return null;

  return (
    <div className="mb-4 border-l-2 border-primary pl-4">
      <div className="text-sm text-muted-foreground mb-2" dangerouslySetInnerHTML={{ __html: comment.text }} />
      <div className="text-xs text-muted-foreground mb-2">By: {comment.author}</div>
      {comment.children && comment.children.length > 0 && (
        <Button 
          variant="link" 
          size="sm" 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-primary p-0 h-auto"
        >
          {isExpanded ? 'Hide Replies' : `Show ${comment.children.length} Replies`}
        </Button>
      )}
      {isExpanded && (
        <div className="ml-4 mt-2">
          {comment.children.map((childComment) => (
            <Comment key={childComment.id} comment={childComment} />
          ))}
        </div>
      )}
    </div>
  );
};

const Comments = ({ storyId }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['comments', storyId],
    queryFn: () => fetchComments(storyId),
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
          <MessageSquare className="h-4 w-4 mr-2" /> Comments
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card text-card-foreground border-primary">
        <DialogHeader>
          <DialogTitle className="text-primary">Comments</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] w-full pr-4">
          {isLoading && <p>Loading comments...</p>}
          {error && <p>Error loading comments: {error.message}</p>}
          {data && data.children && data.children.map((comment) => (
            <Comment key={comment.id} comment={comment} />
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default Comments;
