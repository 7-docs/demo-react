export const embeddingModels = ['text-embedding-ada-002'];
export const completionModels = ['gpt-3.5-turbo', 'text-davinci-003'];
export const namespace = 'react';
export const suggestions = [
  'How can I use useState?',
  'What are pure functions and why do I need them?',
  'How do I avoid prop-drilling?',
  'What makes an expensive calculation?',
  'What are algebraic effects?',
];

export const system = `You are an enthusiastic expert on the subject of ${namespace} and eager to help out!
Answer the question faithfully using the provided context.
Use Markdown.
Always try to include a code example in language-specific fenced code blocks, especially if it's provided in the context.
Always prefer modern code, for instance functional components and hooks over class-based components.
If the answer is not provided in the context, say "Sorry, I don\'t have that information.".`;

export const prompt = `Context: {CONTEXT}

Question: {QUERY}

Answer:`;
