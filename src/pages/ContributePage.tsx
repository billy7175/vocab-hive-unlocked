
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MOCK_TAGS } from "@/data/mockVocabularyData";
import { v4 as uuidv4 } from "uuid";

const ContributePage = () => {
  const navigate = useNavigate();
  const [word, setWord] = useState("");
  const [meaning, setMeaning] = useState("");
  const [translation, setTranslation] = useState("");
  const [example, setExample] = useState("");
  const [pronunciation, setPronunciation] = useState("");
  const [notes, setNotes] = useState("");
  const [tagSearch, setTagSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<string>("intermediate");
  const [submitting, setSubmitting] = useState(false);

  const filteredTags = MOCK_TAGS.filter(tag => 
    tag.name.toLowerCase().includes(tagSearch.toLowerCase())
  );

  const handleTagToggle = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter(id => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // In a real app, this would send data to a backend API
    // Here we just simulate a successful submission
    setTimeout(() => {
      setSubmitting(false);
      // Go back to homepage
      navigate("/");
      // In a real app, this would display a success toast message
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={() => {}} />
      
      <main className="container py-6 px-4 md:py-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Contribute a New Word</h1>
          <p className="text-muted-foreground mb-6">
            Share your vocabulary knowledge with the community. All submissions will be reviewed before being published.
          </p>
          
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Word Information</CardTitle>
                <CardDescription>
                  Please provide as much detail as possible
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="word">Word or Phrase *</Label>
                    <Input 
                      id="word" 
                      value={word}
                      onChange={(e) => setWord(e.target.value)}
                      placeholder="Enter the word or phrase"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="pronunciation">Pronunciation (optional)</Label>
                    <Input 
                      id="pronunciation" 
                      value={pronunciation}
                      onChange={(e) => setPronunciation(e.target.value)}
                      placeholder="e.g., /həˈloʊ/"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="meaning">Meaning *</Label>
                  <Textarea 
                    id="meaning" 
                    value={meaning}
                    onChange={(e) => setMeaning(e.target.value)}
                    placeholder="Define the word or phrase"
                    required
                    className="min-h-24"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="translation">Translation (optional)</Label>
                  <Input 
                    id="translation" 
                    value={translation}
                    onChange={(e) => setTranslation(e.target.value)}
                    placeholder="Translation in another language (specify language)"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="example">Example Usage *</Label>
                  <Textarea 
                    id="example" 
                    value={example}
                    onChange={(e) => setExample(e.target.value)}
                    placeholder="Provide an example sentence using this word"
                    required
                    className="min-h-20"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes (optional)</Label>
                  <Textarea 
                    id="notes" 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any additional information about usage, context, etc."
                    className="min-h-20"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Difficulty Level *</Label>
                  <div className="flex flex-wrap gap-2">
                    {['beginner', 'intermediate', 'advanced'].map(level => (
                      <Button
                        key={level}
                        type="button"
                        variant={difficulty === level ? "default" : "outline"}
                        onClick={() => setDifficulty(level)}
                        className="capitalize"
                      >
                        {level}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Tags *</Label>
                  <Input 
                    placeholder="Search tags..."
                    value={tagSearch}
                    onChange={(e) => setTagSearch(e.target.value)}
                    className="mb-2"
                  />
                  <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-1">
                    {filteredTags.length > 0 ? (
                      filteredTags.map((tag) => {
                        const isSelected = selectedTags.includes(tag.id);
                        return (
                          <Badge 
                            key={tag.id}
                            variant={isSelected ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => handleTagToggle(tag.id)}
                          >
                            {tag.name}
                          </Badge>
                        );
                      })
                    ) : (
                      <p className="text-sm text-muted-foreground">No tags found</p>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col md:flex-row gap-2 md:justify-end">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate("/")}
                  className="w-full md:w-auto"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={!word || !meaning || !example || selectedTags.length === 0 || submitting}
                  className="w-full md:w-auto"
                >
                  {submitting ? "Submitting..." : "Submit Word"}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ContributePage;
