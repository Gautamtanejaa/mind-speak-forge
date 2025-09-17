import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Experiment {
  id: string;
  title: string;
  description?: string;
  vocabulary_words: string[];
  status: 'draft' | 'active' | 'completed' | 'paused';
  created_at: string;
  updated_at: string;
}

export interface ExperimentSession {
  id: string;
  experiment_id: string;
  session_name: string;
  start_time: string;
  end_time?: string;
  total_trials: number;
  successful_trials: number;
  accuracy_rate?: number;
  status: 'active' | 'completed' | 'stopped';
}

export interface DecodedResult {
  id: string;
  session_id: string;
  detected_word: string;
  confidence_score: number;
  was_successful: boolean;
  timestamp: string;
}

export const useExperiments = () => {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [currentSession, setCurrentSession] = useState<ExperimentSession | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchExperiments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('experiments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error fetching experiments",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setExperiments((data || []) as Experiment[]);
    }
    setLoading(false);
  };

  const createExperiment = async (
    title: string,
    description: string,
    vocabularyWords: string[]
  ) => {
    const { data, error } = await supabase
      .from('experiments')
      .insert({
        title,
        description,
        vocabulary_words: vocabularyWords,
        user_id: (await supabase.auth.getUser()).data.user?.id,
      })
      .select()
      .single();

    if (error) {
      toast({
        title: "Error creating experiment",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }

    toast({
      title: "Experiment created",
      description: `${title} has been created successfully`,
    });

    await fetchExperiments();
    return data;
  };

  const startExperimentSession = async (
    experimentId: string,
    sessionName: string
  ) => {
    const { data, error } = await supabase
      .from('experiment_sessions')
      .insert({
        experiment_id: experimentId,
        session_name: sessionName,
        user_id: (await supabase.auth.getUser()).data.user?.id,
      })
      .select()
      .single();

    if (error) {
      toast({
        title: "Error starting session",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }

    setCurrentSession(data as ExperimentSession);
    toast({
      title: "Session started",
      description: `${sessionName} is now active`,
    });

    return data;
  };

  const endExperimentSession = async (sessionId: string) => {
    const { error } = await supabase
      .from('experiment_sessions')
      .update({
        end_time: new Date().toISOString(),
        status: 'completed',
      })
      .eq('id', sessionId);

    if (error) {
      toast({
        title: "Error ending session",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }

    setCurrentSession(null);
    toast({
      title: "Session completed",
      description: "Experiment session has been completed",
    });

    return true;
  };

  const saveDecodedResult = async (
    sessionId: string,
    detectedWord: string,
    confidenceScore: number,
    wasSuccessful: boolean
  ) => {
    const { error } = await supabase
      .from('decoded_results')
      .insert({
        session_id: sessionId,
        detected_word: detectedWord,
        confidence_score: confidenceScore,
        was_successful: wasSuccessful,
        user_id: (await supabase.auth.getUser()).data.user?.id,
      });

    if (error) {
      console.error('Error saving decoded result:', error);
      return false;
    }

    // Update session statistics
    const { data: sessionData } = await supabase
      .from('experiment_sessions')
      .select('total_trials, successful_trials')
      .eq('id', sessionId)
      .single();

    if (sessionData) {
      const newTotalTrials = (sessionData.total_trials || 0) + 1;
      const newSuccessfulTrials = (sessionData.successful_trials || 0) + (wasSuccessful ? 1 : 0);
      const newAccuracyRate = (newSuccessfulTrials / newTotalTrials) * 100;

      await supabase
        .from('experiment_sessions')
        .update({
          total_trials: newTotalTrials,
          successful_trials: newSuccessfulTrials,
          accuracy_rate: newAccuracyRate,
        })
        .eq('id', sessionId);
    }

    return true;
  };

  const getSessionResults = async (sessionId: string) => {
    const { data, error } = await supabase
      .from('decoded_results')
      .select('*')
      .eq('session_id', sessionId)
      .order('timestamp', { ascending: true });

    if (error) {
      console.error('Error fetching session results:', error);
      return [];
    }

    return data || [];
  };

  useEffect(() => {
    fetchExperiments();
  }, []);

  return {
    experiments,
    currentSession,
    loading,
    fetchExperiments,
    createExperiment,
    startExperimentSession,
    endExperimentSession,
    saveDecodedResult,
    getSessionResults,
  };
};