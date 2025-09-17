-- Create experiments table to track research sessions
CREATE TABLE public.experiments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  vocabulary_words TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'paused')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create experiment_sessions table to track individual experiment runs
CREATE TABLE public.experiment_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  experiment_id UUID NOT NULL REFERENCES public.experiments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  session_name TEXT NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  end_time TIMESTAMP WITH TIME ZONE,
  total_trials INTEGER DEFAULT 0,
  successful_trials INTEGER DEFAULT 0,
  accuracy_rate DECIMAL(5,2),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'stopped')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create decoded_results table to store real-time decoding results
CREATE TABLE public.decoded_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.experiment_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  detected_word TEXT NOT NULL,
  confidence_score DECIMAL(5,2) NOT NULL,
  was_successful BOOLEAN DEFAULT false,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  display_name TEXT,
  role TEXT NOT NULL DEFAULT 'researcher' CHECK (role IN ('researcher', 'admin', 'participant')),
  institution TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiment_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.decoded_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for experiments
CREATE POLICY "Users can view their own experiments" 
ON public.experiments 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own experiments" 
ON public.experiments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own experiments" 
ON public.experiments 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own experiments" 
ON public.experiments 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create policies for experiment_sessions
CREATE POLICY "Users can view their own experiment sessions" 
ON public.experiment_sessions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own experiment sessions" 
ON public.experiment_sessions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own experiment sessions" 
ON public.experiment_sessions 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create policies for decoded_results
CREATE POLICY "Users can view their own decoded results" 
ON public.decoded_results 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own decoded results" 
ON public.decoded_results 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create policies for profiles
CREATE POLICY "Profiles are viewable by everyone" 
ON public.profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_experiments_updated_at
  BEFORE UPDATE ON public.experiments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, role)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'display_name', 'researcher');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for new user profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX idx_experiments_user_id ON public.experiments(user_id);
CREATE INDEX idx_experiment_sessions_experiment_id ON public.experiment_sessions(experiment_id);
CREATE INDEX idx_experiment_sessions_user_id ON public.experiment_sessions(user_id);
CREATE INDEX idx_decoded_results_session_id ON public.decoded_results(session_id);
CREATE INDEX idx_decoded_results_timestamp ON public.decoded_results(timestamp);
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);