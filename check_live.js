const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

const API_BASE = process.env.ALPARI_API_BASE_URL || "https://api.alpariportal.com";
const PRIVATE_TOKEN = process.env.ALPARI_PRIVATE_TOKEN || "03764376-ec54-4a11-94aa-7c63d39d1f2f";
const PARTNER_ID = Number(process.env.ALPARI_DIRECT_PARTNER_ID || "417398");

console.log("Using API Config:");
console.log("Base URL:", API_BASE);
console.log("Partner ID:", PARTNER_ID);
console.log("Private Token:", PRIVATE_TOKEN.substring(0, 8) + "...");

const params = {
  RegistrationFromDate: "01/01/2026",
  RegistrationToDate: new Date().toISOString().split("T")[0].split("-").reverse().join("/"), // DD/MM/YYYY
  DirectPartner: PARTNER_ID
};

console.log("Params:", params);

async function testEndpoint(name, path) {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Private-Token": PRIVATE_TOKEN
      },
      body: JSON.stringify(params)
    });
    console.log(`${name} Status:`, res.status, res.statusText);
    const data = await res.json();
    console.log(`${name} Response structure:`, Object.keys(data));
    const items = Array.isArray(data) ? data : (data.Data || data.data || data.clients || []);
    console.log(`${name} Item count:`, items.length);
    if (items.length > 0) {
      console.log(`First ${name} item:`, JSON.stringify(items[0], null, 2));
    }
    return items;
  } catch (error) {
    console.error(`Error testing ${name}:`, error.message);
    return null;
  }
}

async function run() {
  const performance = await testEndpoint("Performance", "/v1/External/client/performance");
  const referrals = await testEndpoint("Referrals", "/v1/External/client/referral_details");
  const insights = await testEndpoint("Insights", "/v1/External/client/insights");
}

run();
