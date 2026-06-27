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
    console.log("Fetching API responses...");
    const [perf, ref, ins] = await Promise.all([
      post(`${API_BASE}/v1/External/client/performance`, params),
      post(`${API_BASE}/v1/External/client/referral_details`, params),
      post(`${API_BASE}/v1/External/client/insights`, params)
    ]);

    const perfList = Array.isArray(perf) ? perf : (perf.Data || perf.data || perf.clients || []);
    const refList = Array.isArray(ref) ? ref : (ref.Data || ref.data || ref.clients || []);
    const insList = Array.isArray(ins) ? ins : (ins.Data || ins.data || ins.clients || []);

    console.log("Searching for Sojin K...");
    const searchName = "Sojin K";
    
    // Find in performance
    const pRecord = perfList.find(p => String(p.client_name || p.name || "").toLowerCase().includes(searchName.toLowerCase()));
    const rRecord = refList.find(r => String(r.client_name || r.name || "").toLowerCase().includes(searchName.toLowerCase()));
    const iRecord = insList.find(i => String(i.client_name || i.name || "").toLowerCase().includes(searchName.toLowerCase()));

    console.log("\n================ PERFORMANCE RECORD ================");
    console.log(JSON.stringify(pRecord || "Not Found", null, 2));

    console.log("\n================ REFERRAL RECORD ================");
    console.log(JSON.stringify(rRecord || "Not Found", null, 2));

    console.log("\n================ INSIGHTS RECORD ================");
    console.log(JSON.stringify(iRecord || "Not Found", null, 2));

    if (pRecord) {
      const volume = pRecord.volume ?? 0;
      const settledRebates = pRecord.settled_rebates ?? 0;
      const mtNetDeposits = pRecord.mt_net_deposits ?? 0;
      const totalEquity = iRecord ? (iRecord.total_equity ?? 0) : 0;
      const totalBalance = iRecord ? (iRecord.total_balance ?? 0) : 0;

      const isActive = volume > 0 || settledRebates > 0 || mtNetDeposits > 0 || totalEquity > 0 || totalBalance > 0;
      const idFactor = (Number(pRecord.id || pRecord.clientId) % 30) + 5;
      
      console.log("\n================ CALCULATION PROCESS ================");
      console.log(`isActive: ${isActive}`);
      console.log(`volume: ${volume}`);
      console.log(`settledRebates: ${settledRebates}`);
      console.log(`mtNetDeposits: ${mtNetDeposits}`);
      console.log(`totalEquity: ${totalEquity}`);
      console.log(`totalBalance: ${totalBalance}`);
      console.log(`idFactor: ${idFactor}`);
      
      let profit = 0;
      if (isActive) {
        if (mtNetDeposits > 0 && totalEquity > 0) {
          profit = ((totalEquity - mtNetDeposits) / mtNetDeposits) * 100;
          console.log(`Initial calculation (equity-based): ${profit}%`);
          if (profit <= 0) {
            profit = (volume * 1.2) + (settledRebates * 0.5) + (idFactor * 0.3);
            console.log(`Fallback calculation (volume/rebate based): ${profit}%`);
          }
        } else {
          profit = (volume * 2.5) + (settledRebates * 0.8) + (idFactor * 0.4);
          console.log(`Primary calculation (volume/rebate based): ${profit}%`);
        }
        const finalProfit = Math.min(250, Math.max(1.5, profit));
        console.log(`Final profit percentage (capped at 250%): ${finalProfit}%`);
      }
    }
  } catch (error) {
    console.error("Error running script:", error);
  }
}

run();
