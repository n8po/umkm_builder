import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env
config({ path: resolve('.env') });
config({ path: resolve('.env.local') });

import { Sandbox } from '@vercel/sandbox';

async function test() {
   console.log("Testing Sandbox status...");
   try {
     const sandboxConfig = {
         sandboxId: 'sbx_ZZyzkTfVqKQEKGgZuKylLcf93pH6'
     };
     
     if (process.env.VERCEL_TOKEN && process.env.VERCEL_TEAM_ID && process.env.VERCEL_PROJECT_ID) {
         sandboxConfig.teamId = process.env.VERCEL_TEAM_ID;
         sandboxConfig.projectId = process.env.VERCEL_PROJECT_ID;
         sandboxConfig.token = process.env.VERCEL_TOKEN;
     } else if (process.env.VERCEL_OIDC_TOKEN) {
         sandboxConfig.oidcToken = process.env.VERCEL_OIDC_TOKEN;
     }
     
     const s = await Sandbox.get(sandboxConfig);
     console.log("Sandbox status:", s.status);

   } catch(e) {
     console.error("Test failed:", e);
   }
}

test();
