import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { FlaskConical, Users, TrendingUp, Database, Clock, Trash2 } from "lucide-react";
import { useExperiments, Experiment } from "@/hooks/useExperiments";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export const Dashboard = () => {
  const { experiments, loading } = useExperiments();
  const { user } = useAuth();
  const [recentResults, setRecentResults] = useState<any[]>([]);
  const [sessionStats, setSessionStats] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      loadRecentResults();
      loadSessionStats();
    }
  }, [user]);

  const loadRecentResults = async () => {
    const { data } = await supabase
      .from('decoded_results')
      .select(`
        *,
        experiment_sessions (
          session_name,
          experiments (title)
        )
      `)
      .order('timestamp', { ascending: false })
      .limit(10);
    
    setRecentResults(data || []);
  };

  const loadSessionStats = async () => {
    const { data } = await supabase
      .from('experiment_sessions')
      .select('*')
      .order('start_time', { ascending: false })
      .limit(5);
    
    setSessionStats(data || []);
  };

  const deleteExperiment = async (experimentId: string) => {
    const { error } = await supabase
      .from('experiments')
      .delete()
      .eq('id', experimentId);
    
    if (!error) {
      window.location.reload();
    }
  };

  const overallAccuracy = sessionStats.length > 0 
    ? sessionStats.reduce((acc, session) => acc + (session.accuracy_rate || 0), 0) / sessionStats.length 
    : 0;

  const totalTrials = sessionStats.reduce((acc, session) => acc + (session.total_trials || 0), 0);

  if (!user) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Research Dashboard</h2>
          <p className="text-muted-foreground">Sign in to access your experiment data and analytics</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-neural bg-clip-text text-transparent">
            Research Dashboard
          </h2>
          <p className="text-xl text-muted-foreground">
            Monitor your BCI experiments and analyze results
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Experiments</p>
                  <p className="text-2xl font-bold">{experiments.length}</p>
                </div>
                <FlaskConical className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Sessions</p>
                  <p className="text-2xl font-bold">{sessionStats.filter(s => s.status === 'active').length}</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Overall Accuracy</p>
                  <p className="text-2xl font-bold">{overallAccuracy.toFixed(1)}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Trials</p>
                  <p className="text-2xl font-bold">{totalTrials}</p>
                </div>
                <Database className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Experiments List */}
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle>Your Experiments</CardTitle>
              <CardDescription>Manage and monitor your BCI experiments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {experiments.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No experiments created yet. Create your first experiment to get started.
                  </p>
                ) : (
                  experiments.map((experiment) => (
                    <div key={experiment.id} className="p-4 bg-background/50 rounded-lg border">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold">{experiment.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {experiment.description || "No description"}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline">
                              {experiment.vocabulary_words.length} words
                            </Badge>
                            <Badge variant={experiment.status === 'active' ? 'default' : 'secondary'}>
                              {experiment.status}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteExperiment(experiment.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle>Recent Decoded Results</CardTitle>
              <CardDescription>Latest thought-to-text conversions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentResults.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No decoded results yet. Start a session to see results here.
                  </p>
                ) : (
                  recentResults.map((result, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant={result.was_successful ? "default" : "secondary"}>
                          {result.detected_word}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {result.confidence_score.toFixed(1)}% confidence
                        </span>
                      </div>
                      <div className="text-right text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 inline mr-1" />
                        {new Date(result.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Session Performance Chart */}
        {sessionStats.length > 0 && (
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20 mt-8">
            <CardHeader>
              <CardTitle>Session Performance</CardTitle>
              <CardDescription>Accuracy trends across your recent sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sessionStats}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="session_name" 
                      className="text-xs fill-muted-foreground"
                    />
                    <YAxis className="text-xs fill-muted-foreground" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="accuracy_rate" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
};