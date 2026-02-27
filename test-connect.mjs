import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env
config({ path: resolve('.env') });
config({ path: resolve('.env.local') });

import { Sandbox } from '@vercel/sandbox';

async function test() {
   console.log("Testing Sandbox.connect...");
   try {
     const sandboxConfig = {
         timeout: 300000,
         runtime: 'node22',
         ports: [5173]
     };
     
     if (process.env.VERCEL_TOKEN && process.env.VERCEL_TEAM_ID && process.env.VERCEL_PROJECT_ID) {
         sandboxConfig.teamId = process.env.VERCEL_TEAM_ID;
         sandboxConfig.projectId = process.env.VERCEL_PROJECT_ID;
         sandboxConfig.token = process.env.VERCEL_TOKEN;
     } else if (process.env.VERCEL_OIDC_TOKEN) {
         sandboxConfig.oidcToken = process.env.VERCEL_OIDC_TOKEN;
     }
     
     // Put your sandbox ID here to test:
     const id = 'sbx_ZZyzkTfVqKQEKGgZuKylLcf93pH6';
     
     if (typeof Sandbox.connect === 'function') {
        const s = await Sandbox.connect(id, sandboxConfig);
        console.log("Connected successfully!", s.sandboxId);
     } else if (typeof Sandbox.reconnect === 'function') {
        const s = await Sandbox.reconnect(id, sandboxConfig);
        console.log("Reconnected successfully!", s.sandboxId);
     } else {
        console.log("Sandbox methods available:", Object.keys(Sandbox));
     }
   } catch(e) {
     console.error("Test failed:", e);
   }
}

test();
