import { load } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { getCompletionHandler, supabase } from '@7-docs/edge';
import { namespace, prompt, system } from '../../config.ts';
import type { MetaData } from '@7-docs/edge';

type QueryFn = (vector: number[]) => Promise<MetaData[]>;

const env = await load();
const getEnvVar = (key: string) => Deno.env.get(key) ?? env[key];

const OPENAI_API_KEY = getEnvVar('OPENAI_API_KEY');
const SUPABASE_URL = getEnvVar('SUPABASE_URL');
const SUPABASE_API_KEY = getEnvVar('SUPABASE_API_KEY');

const client = createClient(SUPABASE_URL, SUPABASE_API_KEY);
const query: QueryFn = (vector: number[]) => supabase.query({ client, namespace, vector });

const handler = getCompletionHandler({ OPENAI_API_KEY, query, system, prompt });

export function GET(req: Request) {
  return handler(req);
}
