import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Zap, Brain, Mic, MicOff } from "lucide-react";

const RealtimeDecoder = () => {
  const [isDecoding, setIsDecoding] = useState(false);
  const [currentWord, setCurrentWord] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [decodedText, setDecodedText] = useState("");

  const vocabularyWords = ["yes", "no", "water", "help", "stop", "go", "left", "right"];

  // Simulate real-time decoding
  useEffect(() => {
    if (isDecoding) {
      const interval = setInterval(() => {
        const randomWord = vocabularyWords[Math.floor(Math.random() * vocabularyWords.length)];
        const randomConfidence = Math.random() * 40 + 60; // 60-100% confidence
        
        setCurrentWord(randomWord);
        setConfidence(randomConfidence);
        
        // Add to decoded text if confidence is high enough
        if (randomConfidence > 80) {
          setDecodedText(prev => prev + (prev ? " " : "") + randomWord);
        }
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isDecoding]);

  const handleToggleDecoding = () => {
    setIsDecoding(!isDecoding);
    if (!isDecoding) {
      setDecodedText("");
      setCurrentWord("");
      setConfidence(0);
    }
  };

  const clearText = () => {
    setDecodedText("");
  };

  return (
    <section id="decode" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-neural bg-clip-text text-transparent">
            Real-time Decoder
          </h2>
          <p className="text-xl text-muted-foreground">
            Live imagined speech to text conversion
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Decoder Control */}
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Decoder Control
              </CardTitle>
              <CardDescription>
                Start/stop real-time thought decoding
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="mb-4">
                  <div className={`inline-flex p-4 rounded-full ${isDecoding ? 'bg-gradient-neural' : 'bg-muted'} neural-pulse`}>
                    <Brain className="h-12 w-12 text-white" />
                  </div>
                </div>
                <Button 
                  onClick={handleToggleDecoding}
                  size="lg"
                  className={isDecoding ? "bg-red-500 hover:bg-red-600" : "bg-gradient-neural hover:opacity-90"}
                >
                  {isDecoding ? (
                    <>
                      <MicOff className="mr-2 h-5 w-5" />
                      Stop Decoding
                    </>
                  ) : (
                    <>
                      <Mic className="mr-2 h-5 w-5" />
                      Start Decoding
                    </>
                  )}
                </Button>
              </div>

              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Current Detection</p>
                  <div className="text-3xl font-bold text-primary mb-2">
                    {currentWord || "—"}
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Confidence</span>
                      <span>{confidence.toFixed(1)}%</span>
                    </div>
                    <Progress value={confidence} className="h-2" />
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Status Indicators</p>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">EEG Stream</span>
                      <Badge className={isDecoding ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-muted"}>
                        {isDecoding ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Model State</span>
                      <Badge className={isDecoding ? "bg-primary/20 text-primary border-primary/30" : "bg-muted"}>
                        {isDecoding ? "Processing" : "Standby"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Decoded Output */}
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                Decoded Text Output
              </CardTitle>
              <CardDescription>
                Your thoughts converted to text in real-time
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="min-h-32 p-4 bg-background/50 rounded-lg border border-border">
                <p className="text-lg leading-relaxed">
                  {decodedText || (
                    <span className="text-muted-foreground italic">
                      Decoded text will appear here...
                    </span>
                  )}
                </p>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={clearText}
                  disabled={!decodedText}
                >
                  Clear Text
                </Button>
                <Button 
                  variant="outline"
                  disabled={!decodedText}
                >
                  Copy Text
                </Button>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground">Vocabulary Reference</p>
                <div className="flex flex-wrap gap-2">
                  {vocabularyWords.map((word, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className={`border-primary/40 ${word === currentWord ? 'bg-primary/20 text-primary' : 'text-muted-foreground'}`}
                    >
                      {word}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default RealtimeDecoder;