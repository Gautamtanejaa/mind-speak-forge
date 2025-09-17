import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, Zap, Activity } from "lucide-react";
import heroImage from "@/assets/brain-hero.jpg";

const HeroSection = () => {
  return (
    <section id="overview" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Neural network visualization" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-neural bg-clip-text text-transparent brain-wave">
              Thought → Text
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Revolutionary Brain-Computer Interface for decoding imagined speech from EEG signals
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-neural hover:opacity-90 neural-pulse">
              <Activity className="mr-2 h-5 w-5" />
              Start Experiment
            </Button>
            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
              <Brain className="mr-2 h-5 w-5" />
              View Research
            </Button>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300">
              <div className="space-y-4">
                <div className="p-3 bg-gradient-neural rounded-full w-fit mx-auto">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-center">Imagined Speech</h3>
                <p className="text-muted-foreground text-center">
                  Decode 5-10 words from imagined speech using non-invasive EEG
                </p>
              </div>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300">
              <div className="space-y-4">
                <div className="p-3 bg-gradient-synaptic rounded-full w-fit mx-auto">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-center">Real-time Processing</h3>
                <p className="text-muted-foreground text-center">
                  Live EEG signal processing with advanced neural networks
                </p>
              </div>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300">
              <div className="space-y-4">
                <div className="p-3 bg-gradient-electric rounded-full w-fit mx-auto">
                  <Activity className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-center">OpenBCI Compatible</h3>
                <p className="text-muted-foreground text-center">
                  Works with OpenBCI Cyton and research-grade EEG systems
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;