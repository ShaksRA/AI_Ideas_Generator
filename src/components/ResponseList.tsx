import React from 'react';

interface Response {
  id: string;
  prompt: string;
  response: string;
  created_at: string;
}

interface ResponseListProps {
  responses: Response[];
}

export function ResponseList({ responses }: ResponseListProps) {
  if (responses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No responses yet. Start by asking a question!</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {responses.map((item) => (
        <div 
          key={item.id} 
          className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border border-gray-100"
        >
          <div className="mb-4">
            <h3 className="text-sm font-medium text-blue-600 mb-2">Prompt</h3>
            <p className="text-gray-900 font-medium">{item.prompt}</p>
          </div>
          <div className="border-t border-gray-100 pt-4">
            <h3 className="text-sm font-medium text-blue-600 mb-2">Response</h3>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{item.response}</p>
          </div>
          <div className="mt-4 text-xs text-gray-400 font-medium">
            {new Date(item.created_at).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}