const http = require('https');

const API_BASE = "https://api.alpariportal.com";
const PRIVATE_TOKEN = "03764376-ec54-4a11-94aa-7c63d39d1f2f";
const PARTNER_ID = 417398;

const params = {
  RegistrationFromDate: "01/01/2000",
  RegistrationToDate: "27/06/2026",
  DirectPartner: PARTNER_ID
};

function post(url, data) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const bodyStr = JSON.stringify(data);
    const req = http.request({
      hostname: urlObj.hostname,
      port: 443,
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Private-Token': PRIVATE_TOKEN,
        'Content-Length': Buffer.byteLength(bodyStr)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(new Error(`Failed to parse response: ${body}`));
        }
      });
    });
    req.on('error', reject);
    req.write(bodyStr);
    req.end();
  });
}

async function run() {
  try {
    console.log("Fetching client performance...");
    const perf = await post(`${API_BASE}/v1/External/client/performance`, params);
    const perfList = Array.isArray(perf) ? perf : (perf.Data || perf.data || perf.clients || []);
    console.log("Performance clients count:", perfList.length);

    console.log("Fetching referrals...");
    const ref = await post(`${API_BASE}/v1/External/client/referral_details`, params);
    const refList = Array.isArray(ref) ? ref : (ref.Data || ref.data || ref.clients || []);
    console.log("Referrals clients count:", refList.length);

    console.log("Fetching insights...");
    const ins = await post(`${API_BASE}/v1/External/client/insights`, params);
    const insList = Array.isArray(ins) ? ins : (ins.Data || ins.data || ins.clients || []);
    console.log("Insights clients count:", insList.length);

    if (perfList.length === 0) {
      console.log("No clients found in performance API.");
      return;
    }
    
    const topClient = perfList[0];
    const topClientId = topClient.clientId || topClient.id || topClient.client_id;
    console.log("\n================ TOP CLIENT ID:", topClientId, "================\n");

    console.log("Raw Performance Record for Top 1 Client:");
    console.log(JSON.stringify(topClient, null, 2));

    const refRecord = refList.find(r => (r.clientId || r.id || r.client_id || r.clientid) === topClientId);
    console.log("\nRaw Referral Record for Top 1 Client:");
    console.log(JSON.stringify(refRecord || "Not Found", null, 2));

    const insRecord = insList.find(i => (i.clientId || i.id || i.client_id || i.clientid) === topClientId);
    console.log("\nRaw Insight Record for Top 1 Client:");
    console.log(JSON.stringify(insRecord || "Not Found", null, 2));

  } catch (error) {
    console.error("Error running script:", error);
  }
}

run();
