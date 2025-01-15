import OpenAI from 'openai';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

if (!apiKey) {
  console.warn('OpenAI API key is not set. AI responses will not work.');
}

const openai = apiKey ? new OpenAI({
  apiKey,
  dangerouslyAllowBrowser: true
}) : null;

export const generateResponse = async (prompt: string) => {
  if (!openai) {
    throw new Error('OpenAI API key is not configured. Please add VITE_OPENAI_API_KEY to your environment variables.');
  }

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
    });

    if (!completion.choices[0].message.content) {
      throw new Error('No response received from OpenAI');
    }

    return completion.choices[0].message.content;
  } catch (error: any) {
    if (error?.error?.code === 'insufficient_quota') {
      throw new Error('The OpenAI API quota has been exceeded. Please check your billing details or try again later.');
    }
    
    // Handle network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error. Please check your internet connection and try again.');
    }

    // Handle rate limiting
    if (error?.error?.code === 'rate_limit_exceeded') {
      throw new Error('Too many requests. Please wait a moment and try again.');
    }

    // Handle invalid API key
    if (error?.error?.code === 'invalid_api_key') {
      throw new Error('Invalid API key. Please check your OpenAI API key configuration.');
    }

    // If we get here, it's an unknown error
    throw new Error('An unexpected error occurred. Please try again later.');
  }
};