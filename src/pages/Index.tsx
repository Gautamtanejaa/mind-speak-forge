import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import ExperimentPanel from "@/components/ExperimentPanel";
import DataVisualization from "@/components/DataVisualization";
import RealtimeDecoder from "@/components/RealtimeDecoder";
import ResultsSection from "@/components/ResultsSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <ExperimentPanel />
        <DataVisualization />
        <RealtimeDecoder />
        <ResultsSection />
      </main>
    </div>
  );
};

export default Index;
