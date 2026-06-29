const fs = require('fs');
const path = require('path');

// 1. Setup lists of mock names and countries
const firstNames = ["James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda", "William", "Elizabeth", "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Charles", "Karen"];
const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin"];
const countries = ["India", "United Arab Emirates", "United Kingdom", "Singapore", "Malaysia", "South Africa", "Nigeria", "Saudi Arabia", "Qatar", "Germany"];

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomName() {
  return `${getRandomElement(firstNames)} ${getRandomElement(lastNames)}`;
}

// 2. Generate 100 cases
const performances = [];
const referrals = [];
const insights = [];

for (let i = 1; i <= 100; i++) {
  const extId = `trader_${String(i).padStart(3, '0')}`;
  const numId = 400000 + i;
  const name = getRandomName();
  const country = getRandomElement(countries);

  // Default to a valid registration date within the season
  let regDate = "Jun 29 2026  10:00AM";
  let netDeposits = Math.floor(Math.random() * 20) * 100 + 100; // $100 to $2000
  let balance = netDeposits;
  let volume = 0.6 * (balance / 100) + Math.random() * 10; // meets minimum volume scaling by default
  let tradesCount = 10 + Math.floor(Math.random() * 50); // meets 10 trades default
  
  // Distribute across test scenarios
  const scenarioType = i % 10;
  
  if (scenarioType === 0) {
    // Case 2: Pre-season cutoff date (Jun 25 2026) -> should be hidden
    regDate = "Jun 25 2026  9:00AM";
    balance = netDeposits + 50;
    volume = 5.0;
  } else if (scenarioType === 1) {
    // Case 3: Washout account (balance/equity <= 0) -> should be hidden
    balance = 0;
    volume = 1.0;
  } else if (scenarioType === 2) {
    // Case 4: Low trade count (< 10) -> should be hidden
    tradesCount = Math.floor(Math.random() * 9) + 1; // 1 to 9
    balance = netDeposits + 80;
    volume = 3.0;
  } else if (scenarioType === 3) {
    // Case 5: Low volume ratio -> should be hidden
    // For $500 balance, requires 3.0 lots. We give it 0.2 lots.
    volume = 0.1 * (balance / 100); 
    balance = netDeposits + 100;
  } else {
    // Case 1 & 6: Qualified, badge-earning traders
    // Vary profits, drawdowns, win rates, balances
    const profitPercent = Math.random() * 120 + 5; // 5% to 125% profit
    balance = Math.round(netDeposits * (1 + profitPercent / 100));
    tradesCount = 15 + Math.floor(Math.random() * 120);
    volume = 0.8 * (balance / 100) + Math.random() * 30; // abundant volume
  }

  // Add to Performance API response
  performances.push({
    id: numId,
    client_id: numId,
    external_client_id: extId,
    client_name: name,
    country: country,
    registration_date: regDate,
    mt_net_deposits: netDeposits,
    settled_rebates: Math.round(volume * 1.5 * 100) / 100,
    volume: Math.round(volume * 100) / 100,
    turnover: Math.round(volume * 100000)
  });

  // Add to Referrals API response
  referrals.push({
    id: numId,
    client_id: numId,
    external_client_id: extId,
    client_name: name,
    country: country,
    registration_date: regDate,
    program_name: "Scheme 1.0, MT"
  });

  // Add to Insights API response
  insights.push({
    id: numId,
    client_id: numId,
    external_client_id: extId,
    client_name: name,
    country: country,
    registration_date: regDate,
    total_balance: balance,
    total_equity: balance,
    settled_rebates: Math.round(volume * 1.5 * 100) / 100,
    unsettled_rebates: 0
  });
}

// 3. Output to test_alpari_responses.json
const output = {
  performance: performances,
  referrals: referrals,
  insights: insights
};

fs.writeFileSync(
  path.join(__dirname, 'test_alpari_responses.json'),
  JSON.stringify(output, null, 2)
);

console.log("Successfully generated test_alpari_responses.json with 100 records!");
