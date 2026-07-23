const fs = require('fs');
const path = require('path');

// Load environment variables from .env in parent directory
function loadEnv() {
  const envPath = path.join(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split(/\r?\n/).forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const index = trimmed.indexOf('=');
        if (index > 0) {
          const key = trimmed.substring(0, index).trim();
          const value = trimmed.substring(index + 1).trim().replace(/(^['"]|['"]$)/g, '');
          process.env[key] = value;
        }
      }
    });
  }
}

loadEnv();

const API_BASE_URL = process.env.ALPARI_API_BASE_URL || 'https://api.alpariportal.com';
const PRIVATE_TOKEN = process.env.ALPARI_PRIVATE_TOKEN;
const DIRECT_PARTNER_ID = Number(process.env.ALPARI_DIRECT_PARTNER_ID || '72725');

if (!PRIVATE_TOKEN) {
  console.error("Error: ALPARI_PRIVATE_TOKEN is not defined in the .env file.");
  process.exit(1);
}

// Full challenge season parameter (Jan 1, 2026 to Dec 30, 2026)
const params = {
  RegistrationFromDate: "01/01/2026",
  RegistrationToDate: "30/12/2026",
  DirectPartner: DIRECT_PARTNER_ID,
};

async function fetchFromAlpari(endpoint, body) {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log(`Fetching: ${url}...`);
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Private-Token': PRIVATE_TOKEN
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    throw new Error(`API error on ${endpoint}: ${response.status} ${response.statusText}`);
  }

  const resData = await response.json();
  return Array.isArray(resData) ? resData : (resData.Data || resData.data || resData.clients || []);
}

async function main() {
  try {
    console.log(`Using base URL: ${API_BASE_URL}`);
    console.log(`Using Direct Partner ID: ${DIRECT_PARTNER_ID}`);
    console.log(`Date range: ${params.RegistrationFromDate} to ${params.RegistrationToDate}\n`);

    console.log("Starting fetch from all 3 endpoints in parallel...");
    const [performance, referrals, insights] = await Promise.all([
      fetchFromAlpari('/v1/External/client/performance', params).catch(e => {
        console.error("Failed to fetch performance:", e.message);
        return [];
      }),
      fetchFromAlpari('/v1/External/client/referral_details', params).catch(e => {
        console.error("Failed to fetch referrals:", e.message);
        return [];
      }),
      fetchFromAlpari('/v1/External/client/insights', params).catch(e => {
        console.error("Failed to fetch insights:", e.message);
        return [];
      })
    ]);

    const result = {
      timestamp: new Date().toISOString(),
      params,
      data: {
        performance,
        referrals,
        insights
      }
    };

    const outputPath = path.join(__dirname, '../alpari_api_data.json');
    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf8');
    console.log(`\nSuccess! All current API data saved to: ${path.resolve(outputPath)}`);
    console.log(`Performance records: ${performance.length}`);
    console.log(`Referrals records: ${referrals.length}`);
    console.log(`Insights records: ${insights.length}`);
  } catch (error) {
    console.error("Fatal error:", error);
  }
}

main();
