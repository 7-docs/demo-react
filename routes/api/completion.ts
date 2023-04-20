import { load } from 'dotenv';
import { Handlers } from '$fresh/server.ts';
import { createClient } from '@supabase/supabase-js';
import { getCompletionHandler } from '@7-docs/edge';
import * as supabase from '@7-docs/edge/supabase';
import { namespace, prompt } from '../../config.ts';
import type { MetaData } from '@7-docs/edge';

type QueryFn = (vector: number[]) => Promise<MetaData[]>;

const env = await load();
const getEnvVar = (key: string) => Deno.env.get(key) ?? env[key];

const OPENAI_API_KEY = getEnvVar('OPENAI_API_KEY');
const SUPABASE_URL = getEnvVar('SUPABASE_URL');
const SUPABASE_API_KEY = getEnvVar('SUPABASE_API_KEY');

const client = createClient(SUPABASE_URL, SUPABASE_API_KEY);
const query: QueryFn = (vector: number[]) => supabase.query({ client, namespace, vector });

export const handler: Handlers = {
  GET: getCompletionHandler({ OPENAI_API_KEY, query, prompt }),
};
