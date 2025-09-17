import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, X, FlaskConical } from "lucide-react";
import { useExperiments } from "@/hooks/useExperiments";

export const ExperimentSetup = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [vocabularyWords, setVocabularyWords] = useState<string[]>(["yes", "no", "water", "help", "stop", "go", "left", "right"]);
  const [newWord, setNewWord] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { createExperiment, loading } = useExperiments();

  const addWord = () => {
    if (newWord.trim() && !vocabularyWords.includes(newWord.trim().toLowerCase())) {
      setVocabularyWords([...vocabularyWords, newWord.trim().toLowerCase()]);
      setNewWord("");
    }
  };

  const removeWord = (wordToRemove: string) => {
    setVocabularyWords(vocabularyWords.filter(word => word !== wordToRemove));
  };

  const handleCreateExperiment = async () => {
    if (title.trim() && vocabularyWords.length > 0) {
      const experiment = await createExperiment(title.trim(), description.trim(), vocabularyWords);
      if (experiment) {
        setTitle("");
        setDescription("");
        setVocabularyWords(["yes", "no", "water", "help", "stop", "go", "left", "right"]);
        setDialogOpen(false);
      }
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-neural hover:opacity-90">
          <FlaskConical className="mr-2 h-4 w-4" />
          Create New Experiment
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FlaskConical className="h-5 w-5 text-primary" />
            Create New Experiment
          </DialogTitle>
          <DialogDescription>
            Set up a new BCI thought-to-text experiment with custom vocabulary
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="experiment-title">Experiment Title</Label>
            <Input
              id="experiment-title"
              placeholder="e.g., Basic Word Recognition Study"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="experiment-description">Description (Optional)</Label>
            <Textarea
              id="experiment-description"
              placeholder="Describe the purpose and methodology of this experiment..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="space-y-4">
            <Label>Vocabulary Words</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add new word..."
                value={newWord}
                onChange={(e) => setNewWord(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addWord()}
              />
              <Button 
                onClick={addWord}
                size="sm"
                variant="outline"
                disabled={!newWord.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2 min-h-12 p-3 bg-muted/30 rounded-lg border">
              {vocabularyWords.length === 0 ? (
                <p className="text-muted-foreground text-sm">No vocabulary words added yet</p>
              ) : (
                vocabularyWords.map((word, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-1 hover:bg-muted"
                  >
                    {word}
                    <button
                      onClick={() => removeWord(word)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))
              )}
            </div>
            
            <p className="text-sm text-muted-foreground">
              Total words: {vocabularyWords.length}
            </p>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleCreateExperiment}
              disabled={!title.trim() || vocabularyWords.length === 0 || loading}
              className="bg-gradient-neural hover:opacity-90 flex-1"
            >
              {loading ? "Creating..." : "Create Experiment"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};