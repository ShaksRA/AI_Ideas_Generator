import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { PromptForm } from './components/PromptForm';
import { ResponseList } from './components/ResponseList';
import { generateResponse } from './lib/openai';
import { supabase } from './lib/supabase';

interface Response {
  id: string;
  prompt: string;
  response: string;
  created_at: string;
}

function App() {
  const [responses, setResponses] = useState<Response[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchResponses();
  }, []);

  const fetchResponses = async () => {
    try {
      const { data, error } = await supabase
        .from('responses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResponses(data || []);
    } catch (error) {
      console.error('Error fetching responses:', error);
      setError('Failed to load previous responses. Please refresh the page.');
    }
  };

  const handleSubmit = async (prompt: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const aiResponse = await generateResponse(prompt);
      
      const { error: dbError } = await supabase
        .from('responses')
        .insert([{ prompt, response: aiResponse }]);

      if (dbError) throw dbError;
      
      await fetchResponses();
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-full mb-4 shadow-lg shadow-blue-200">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Prompt Assistant</h1>
          <p className="text-gray-600">Ask anything and get AI-powered responses instantly</p>
        </div>

        <div className="mb-12">
          <PromptForm onSubmit={handleSubmit} isLoading={isLoading} />
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 animate-fade-in">
              {error}
            </div>
          )}
        </div>

        {isLoading && (
          <div className="flex justify-center mb-12">
            <div className="animate-spin rounded-full h-10 w-10 border-[3px] border-blue-500 border-t-transparent"></div>
          </div>
        )}

        <ResponseList responses={responses} />
      </div>
    </div>
  );
}

export default App;