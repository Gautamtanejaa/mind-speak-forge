import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Database, Zap, TrendingUp, Brain } from "lucide-react";

const DataVisualization = () => {
  // Sample EEG data
  const eegData = Array.from({ length: 50 }, (_, i) => ({
    time: i * 20,
    channel1: Math.sin(i * 0.3) * 50 + Math.random() * 20,
    channel2: Math.cos(i * 0.2) * 40 + Math.random() * 15,
    channel3: Math.sin(i * 0.4) * 30 + Math.random() * 25,
  }));

  // Sample classification accuracy data
  const accuracyData = [
    { word: "yes", accuracy: 87 },
    { word: "no", accuracy: 92 },
    { word: "water", accuracy: 78 },
    { word: "help", accuracy: 85 },
    { word: "stop", accuracy: 89 },
  ];

  return (
    <section id="data" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-neural bg-clip-text text-transparent">
            Real-time Data Analysis
          </h2>
          <p className="text-xl text-muted-foreground">
            Monitor EEG signals and classification performance
          </p>
        </div>

        <div className="grid gap-8">
          {/* Real-time EEG Signals */}
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Live EEG Signals
              </CardTitle>
              <CardDescription>
                Real-time EEG data from multiple channels (filtered 0.5-40 Hz)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={eegData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="time" 
                      stroke="hsl(var(--muted-foreground))"
                      label={{ value: 'Time (ms)', position: 'insideBottom', offset: -10 }}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      label={{ value: 'Amplitude (μV)', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="channel1" 
                      stroke="hsl(var(--neural-blue))" 
                      strokeWidth={2}
                      dot={false}
                      name="Channel 1 (Fp1)"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="channel2" 
                      stroke="hsl(var(--neural-purple))" 
                      strokeWidth={2}
                      dot={false}
                      name="Channel 2 (Fp2)"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="channel3" 
                      stroke="hsl(var(--neural-cyan))" 
                      strokeWidth={2}
                      dot={false}
                      name="Channel 3 (C3)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Classification Accuracy */}
            <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Classification Accuracy
                </CardTitle>
                <CardDescription>
                  Word-level accuracy for imagined speech decoding
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={accuracyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="word" stroke="hsl(var(--muted-foreground))" />
                      <YAxis 
                        stroke="hsl(var(--muted-foreground))"
                        label={{ value: 'Accuracy (%)', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar 
                        dataKey="accuracy" 
                        fill="url(#neuralGradient)"
                        radius={[4, 4, 0, 0]}
                      />
                      <defs>
                        <linearGradient id="neuralGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(var(--neural-purple))" />
                          <stop offset="100%" stopColor="hsl(var(--neural-blue))" />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Session Statistics */}
            <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  Session Statistics
                </CardTitle>
                <CardDescription>
                  Current session performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Overall Accuracy</p>
                    <p className="text-3xl font-bold text-primary">86.2%</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Trials Completed</p>
                    <p className="text-3xl font-bold text-primary">247</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">ITR (bits/min)</p>
                    <p className="text-3xl font-bold text-primary">12.4</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Session Time</p>
                    <p className="text-3xl font-bold text-primary">24m</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-medium text-muted-foreground">Model Status</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">EEGNet Training</span>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Complete</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Feature Extraction</span>
                      <Badge className="bg-primary/20 text-primary border-primary/30">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Real-time Decode</span>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Running</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DataVisualization;