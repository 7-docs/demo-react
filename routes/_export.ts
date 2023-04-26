// Exports router modules for serverless env that doesn't support the dynamic import.
// This module will be updated automaticlly in develoment mode, do NOT edit it manually.

import * as $0 from './index.tsx';
import * as $1 from './api/completion.ts';
import * as $2 from './_app.tsx';

export default {
  '/': $0,
  '/api/completion': $1,
  '/_app': $2,
};
