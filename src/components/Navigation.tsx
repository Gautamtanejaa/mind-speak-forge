import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Brain, Menu, Activity, Database, Zap, BarChart, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { AuthDialog } from "./AuthDialog";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const { user, signOut, loading } = useAuth();

  const navItems = [
    { name: "Overview", href: "#overview", icon: Brain },
    { name: "Experiment", href: "#experiment", icon: Activity },
    { name: "Data Collection", href: "#data", icon: Database },
    { name: "Real-time Decode", href: "#decode", icon: Zap },
    { name: "Results", href: "#results", icon: BarChart },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-primary neural-pulse" />
            <span className="text-xl font-bold bg-gradient-neural bg-clip-text text-transparent">
              NeuroLink BCI
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </a>
            ))}
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-4">
            {loading ? (
              <div className="w-20 h-8 bg-muted animate-pulse rounded" />
            ) : user ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  {user.email}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={signOut}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </Button>
              </div>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setAuthDialogOpen(true)}
                >
                  Sign In
                </Button>
                <Button 
                  size="sm" 
                  className="bg-gradient-neural hover:opacity-90"
                  onClick={() => setAuthDialogOpen(true)}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col space-y-4 mt-8">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors p-2"
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </a>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      <AuthDialog 
        open={authDialogOpen} 
        onOpenChange={setAuthDialogOpen} 
      />
    </nav>
  );
};

export default Navigation;