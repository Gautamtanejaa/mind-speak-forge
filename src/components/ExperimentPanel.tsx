import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Square, Settings, Users, Clock } from "lucide-react";

const ExperimentPanel = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [currentTrial, setCurrentTrial] = useState(0);
  const [progress, setProgress] = useState(0);

  const vocabularyWords = ["yes", "no", "water", "help", "stop", "go", "left", "right"];
  const totalTrials = 100;

  const handleStartStop = () => {
    if (isRecording) {
      setIsRecording(false);
    } else {
      setIsRecording(true);
      // Simulate progress
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsRecording(false);
            return 100;
          }
          return prev + 1;
        });
      }, 100);
    }
  };

  return (
    <section id="experiment" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-neural bg-clip-text text-transparent">
            Experiment Control
          </h2>
          <p className="text-xl text-muted-foreground">
            Manage your EEG data collection sessions
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Session Control */}
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5 text-primary" />
                Session Control
              </CardTitle>
              <CardDescription>
                Control your EEG recording session and monitor progress
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Current Status</p>
                  <div className="flex items-center gap-2">
                    <Badge variant={isRecording ? "default" : "secondary"}>
                      {isRecording ? "Recording" : "Idle"}
                    </Badge>
                    {isRecording && <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Trial</p>
                  <p className="text-2xl font-bold">{currentTrial}/{totalTrials}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Session Progress</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={handleStartStop}
                  className={isRecording ? "bg-red-500 hover:bg-red-600" : "bg-gradient-neural hover:opacity-90"}
                  size="lg"
                >
                  {isRecording ? (
                    <>
                      <Square className="mr-2 h-4 w-4" />
                      Stop Recording
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Start Recording
                    </>
                  )}
                </Button>
                <Button variant="outline" size="lg">
                  <Pause className="mr-2 h-4 w-4" />
                  Pause
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Vocabulary & Settings */}
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                Experiment Settings
              </CardTitle>
              <CardDescription>
                Configure your imagined speech vocabulary and parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground">Target Vocabulary</p>
                <div className="flex flex-wrap gap-2">
                  {vocabularyWords.map((word, index) => (
                    <Badge key={index} variant="outline" className="border-primary/40 text-primary">
                      {word}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    Subjects
                  </p>
                  <p className="text-xl font-semibold">5</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Trial Duration
                  </p>
                  <p className="text-xl font-semibold">3s</p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground">Hardware Status</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">OpenBCI Connection</span>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Connected</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Signal Quality</span>
                    <Badge className="bg-primary/20 text-primary border-primary/30">Good</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">LSL Stream</span>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Active</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ExperimentPanel;