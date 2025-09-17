import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart, LineChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { BarChart as BarChartIcon, TrendingUp, Award, Download } from "lucide-react";

const ResultsSection = () => {
  // Sample research results data
  const subjectAccuracy = [
    { subject: "S1", accuracy: 89, trials: 200 },
    { subject: "S2", accuracy: 84, trials: 200 },
    { subject: "S3", accuracy: 92, trials: 200 },
    { subject: "S4", accuracy: 78, trials: 200 },
    { subject: "S5", accuracy: 87, trials: 200 },
  ];

  const learningCurve = [
    { session: 1, accuracy: 65 },
    { session: 2, accuracy: 71 },
    { session: 3, accuracy: 76 },
    { session: 4, accuracy: 82 },
    { session: 5, accuracy: 86 },
    { session: 6, accuracy: 89 },
    { session: 7, accuracy: 87 },
    { session: 8, accuracy: 91 },
  ];

  const confusionMatrix = [
    { word: "yes", correct: 85, incorrect: 15 },
    { word: "no", correct: 92, incorrect: 8 },
    { word: "water", correct: 78, incorrect: 22 },
    { word: "help", correct: 85, incorrect: 15 },
    { word: "stop", correct: 89, incorrect: 11 },
  ];

  const COLORS = ['hsl(var(--neural-blue))', 'hsl(var(--neural-purple))', 'hsl(var(--neural-cyan))', 'hsl(var(--neural-electric))', 'hsl(var(--synaptic-glow))'];

  return (
    <section id="results" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-neural bg-clip-text text-transparent">
            Research Results
          </h2>
          <p className="text-xl text-muted-foreground">
            Performance metrics and analysis from BCI experiments
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20 text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-primary mb-2">86.0%</div>
              <p className="text-sm text-muted-foreground">Average Accuracy</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20 text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-primary mb-2">1000</div>
              <p className="text-sm text-muted-foreground">Total Trials</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20 text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-primary mb-2">5</div>
              <p className="text-sm text-muted-foreground">Subjects</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20 text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-primary mb-2">14.2</div>
              <p className="text-sm text-muted-foreground">ITR (bits/min)</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8">
          {/* Subject Performance */}
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChartIcon className="h-5 w-5 text-primary" />
                Subject Performance Analysis
              </CardTitle>
              <CardDescription>
                Individual accuracy scores across all subjects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={subjectAccuracy}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="subject" stroke="hsl(var(--muted-foreground))" />
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
                      fill="url(#subjectGradient)"
                      radius={[4, 4, 0, 0]}
                    />
                    <defs>
                      <linearGradient id="subjectGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--neural-purple))" />
                        <stop offset="100%" stopColor="hsl(var(--neural-blue))" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Learning Curve */}
            <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Learning Curve
                </CardTitle>
                <CardDescription>
                  Accuracy improvement over training sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={learningCurve}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="session" 
                        stroke="hsl(var(--muted-foreground))"
                        label={{ value: 'Session', position: 'insideBottom', offset: -10 }}
                      />
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
                      <Line 
                        type="monotone" 
                        dataKey="accuracy" 
                        stroke="hsl(var(--neural-purple))" 
                        strokeWidth={3}
                        dot={{ fill: 'hsl(var(--neural-purple))', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, fill: 'hsl(var(--neural-electric))' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Word-level Performance */}
            <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Word-level Performance
                </CardTitle>
                <CardDescription>
                  Accuracy breakdown by vocabulary word
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={confusionMatrix}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="correct"
                        label={({ word, correct }) => `${word}: ${correct}%`}
                      >
                        {confusionMatrix.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Research Summary */}
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle>Research Summary & Conclusions</CardTitle>
              <CardDescription>
                Key findings from the BCI thought-to-text experiment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-primary">Key Achievements</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Successfully decoded 8-word vocabulary from imagined speech</li>
                    <li>• Achieved 86% average accuracy across 5 subjects</li>
                    <li>• Information transfer rate of 14.2 bits/minute</li>
                    <li>• Demonstrated learning effect over 8 sessions</li>
                    <li>• Non-invasive EEG-based approach</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-primary">Technical Details</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• OpenBCI Cyton 8-channel EEG system</li>
                    <li>• EEGNet deep learning architecture</li>
                    <li>• 0.5-40 Hz bandpass filtering</li>
                    <li>• 200 trials per word per subject</li>
                    <li>• Real-time Lab Streaming Layer integration</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-4">
                <Button className="bg-gradient-neural hover:opacity-90">
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
                </Button>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export Data
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Published</Badge>
                <Badge className="bg-primary/20 text-primary border-primary/30">Peer Reviewed</Badge>
                <Badge className="bg-neural-cyan/20 text-neural-cyan border-neural-cyan/30">Open Source</Badge>
                <Badge className="bg-synaptic-glow/20 text-synaptic-glow border-synaptic-glow/30">Reproducible</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ResultsSection;