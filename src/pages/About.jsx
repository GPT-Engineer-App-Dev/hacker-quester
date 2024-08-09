import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Github, Twitter } from "lucide-react"

const About = () => {
  return (
    <div className="min-h-screen p-8 bg-background text-foreground matrix-bg">
      <h1 className="text-4xl font-bold mb-8 text-center text-primary glow flicker">About Hacker News Reader</h1>
      
      <Card className="max-w-2xl mx-auto bg-card border-primary">
        <CardHeader>
          <CardTitle className="text-2xl text-primary glow">Welcome to our Hacker-themed HN Reader!</CardTitle>
        </CardHeader>
        <CardContent className="text-card-foreground">
          <p className="mb-4">
            This app provides a unique, hacker-inspired interface to browse the top stories from Hacker News. 
            Built with React and powered by the Algolia Hacker News API, it offers a seamless experience for 
            tech enthusiasts and cyberpunk aficionados alike.
          </p>
          <p className="mb-4">
            Features:
          </p>
          <ul className="list-disc list-inside mb-4">
            <li>Real-time top 100 stories from Hacker News</li>
            <li>Search functionality to filter stories</li>
            <li>Upvote counts and direct links to original articles</li>
            <li>Responsive design with a cool, hacker-inspired theme</li>
            <li>Custom cursor and interactive UI elements</li>
          </ul>
          <p>
            Created with ❤️ by a passionate developer. For more projects and information, check out our links below:
          </p>
          <div className="flex justify-center space-x-4 mt-4">
            <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-foreground">
              <Github className="h-6 w-6" />
            </a>
            <a href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-foreground">
              <Twitter className="h-6 w-6" />
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default About
