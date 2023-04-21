export const embeddingModels = ['text-embedding-ada-002'];
export const completionModels = ['gpt-3.5-turbo', 'text-davinci-003'];
export const namespace = 'react';
export const suggestions = [
  'How can I use useState?',
  'What are pure functions and why do I need them?',
  'How do I avoid prop-drilling?',
];
export const prompt = `Answer the question using the provided context.
  Use Markdown and always try to include an example in language-specific fenced code blocks.
  If the answer is not contained within the text below, say "Sorry, I don\'t have that information.".

  Context: {CONTEXT}

  Question: {QUERY}

  Answer:`;
