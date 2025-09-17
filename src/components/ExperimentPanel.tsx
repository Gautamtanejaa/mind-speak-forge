import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Play, Square, Settings, Users, Clock, FlaskConical } from "lucide-react";
import { ExperimentSetup } from "./ExperimentSetup";
import { useExperiments } from "@/hooks/useExperiments";
import { useAuth } from "@/hooks/useAuth";

const ExperimentPanel = () => {
  const [sessionName, setSessionName] = useState("");
  const [selectedExperiment, setSelectedExperiment] = useState("");
  const { 
    experiments, 
    currentSession, 
    startExperimentSession, 
    endExperimentSession,
    loading 
  } = useExperiments();
  const { user } = useAuth();

  const handleStartSession = async () => {
    if (selectedExperiment && sessionName.trim()) {
      await startExperimentSession(selectedExperiment, sessionName.trim());
      setSessionName("");
    }
  };

  const handleEndSession = async () => {
    if (currentSession) {
      await endExperimentSession(currentSession.id);
    }
  };

  const selectedExperimentData = experiments.find(exp => exp.id === selectedExperiment);

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
                Create and manage your BCI experiment sessions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-4 mb-6">
                <ExperimentSetup />
              </div>

              {!user ? (
                <div className="text-center p-6 bg-muted/30 rounded-lg border border-dashed border-muted-foreground/30">
                  <p className="text-muted-foreground mb-2">Sign in to create and manage experiments</p>
                  <Button variant="outline" onClick={() => window.location.reload()}>
                    Sign In
                  </Button>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="experiment-select">Select Experiment</Label>
                      <Select value={selectedExperiment} onValueChange={setSelectedExperiment}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose an experiment" />
                        </SelectTrigger>
                        <SelectContent>
                          {experiments.map((exp) => (
                            <SelectItem key={exp.id} value={exp.id}>
                              {exp.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="session-name">Session Name</Label>
                      <Input
                        id="session-name"
                        placeholder="e.g., Session 1 - Participant A"
                        value={sessionName}
                        onChange={(e) => setSessionName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    {!currentSession ? (
                      <Button 
                        onClick={handleStartSession}
                        disabled={!selectedExperiment || !sessionName.trim() || loading}
                        className="bg-gradient-neural hover:opacity-90 flex-1"
                      >
                        <Play className="mr-2 h-4 w-4" />
                        Start Session
                      </Button>
                    ) : (
                      <div className="flex gap-2 w-full">
                        <div className="flex-1 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                          <p className="text-sm font-medium text-green-600">
                            Session Active: {currentSession.session_name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Started: {new Date(currentSession.start_time).toLocaleTimeString()}
                          </p>
                        </div>
                        <Button 
                          onClick={handleEndSession}
                          variant="destructive"
                          className="flex-shrink-0"
                        >
                          <Square className="mr-2 h-4 w-4" />
                          End Session
                        </Button>
                      </div>
                    )}
                  </div>
                </>
              )}
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
                  {selectedExperimentData ? (
                    selectedExperimentData.vocabulary_words.map((word, index) => (
                      <Badge key={index} variant="outline" className="border-primary/40 text-primary">
                        {word}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">Select an experiment to view vocabulary</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    Experiments
                  </p>
                  <p className="text-xl font-semibold">{experiments.length}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Trial Duration
                  </p>
                  <p className="text-xl font-semibold">3s</p>
                </div>
              </div>

              {currentSession && (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-muted-foreground">Session Stats</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Total Trials</span>
                      <Badge className="bg-primary/20 text-primary border-primary/30">
                        {currentSession.total_trials || 0}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Successful</span>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        {currentSession.successful_trials || 0}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Accuracy</span>
                      <Badge className="bg-primary/20 text-primary border-primary/30">
                        {currentSession.accuracy_rate ? `${currentSession.accuracy_rate.toFixed(1)}%` : '0%'}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground">Hardware Status</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Backend Connection</span>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Connected</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Database</span>
                    <Badge className="bg-primary/20 text-primary border-primary/30">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Authentication</span>
                    <Badge className={user ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"}>
                      {user ? "Signed In" : "Sign In Required"}
                    </Badge>
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