import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env
config({ path: resolve('.env') });
config({ path: resolve('.env.local') });

async function check() {
  console.log("Fetching sandboxes...");
  
  try {
     const token = process.env.VERCEL_OIDC_TOKEN || process.env.VERCEL_TOKEN;
     const res = await fetch('https://api.vercel.com/v1/sandboxes', {
       headers: { 'Authorization': `Bearer ${token}` }
     });
     
     if (!res.ok) {
        console.error("Failed to fetch sandboxes", await res.text());
        return;
     }
     
     const data = await res.json();
     if (data.sandboxes && data.sandboxes.length > 0) {
        const active = data.sandboxes[0];
        console.log("Latest sandbox:", active.id);
        
        const execRes = await fetch(`https://api.vercel.com/v1/sandboxes/${active.id}/exec`, {
           method: 'POST',
           headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
           body: JSON.stringify({ cmd: 'cat', args: ['/vercel/sandbox/src/App.jsx'] })
        });
        
        if (execRes.ok) {
           const execData = await execRes.json();
           console.log("App.jsx content:");
           console.log(execData.stdout || execData.stderr);
        } else {
           const err = await execRes.text();
           console.log("Exec read failed:", err);
        }
     } else {
        console.log("No active sandboxes found.");
     }
  } catch (err) {
     console.error(err);
  }
}

check();
