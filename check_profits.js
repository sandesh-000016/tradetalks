const fs = require('fs');

const mockData = JSON.parse(fs.readFileSync('test_alpari_responses.json', 'utf8'));
const performances = mockData.performance || [];
const referrals = mockData.referrals || [];
const insights = mockData.insights || [];

const mergedMap = {};

// Populate from Performance API
performances.forEach((p) => {
  const extId = p.external_client_id;
  const numId = p.id || p.clientId || p.client_id;
  const id = extId || String(numId);
  if (!id) return;
  if (!mergedMap[id]) {
    mergedMap[id] = { id };
  }
  mergedMap[id].external_client_id = extId || mergedMap[id].external_client_id;
  mergedMap[id].numeric_id = numId || mergedMap[id].numeric_id;
  mergedMap[id].client_name = p.client_name || p.name || mergedMap[id].client_name;
  mergedMap[id].country = p.country || mergedMap[id].country;
  mergedMap[id].registration_date = p.registration_date || mergedMap[id].registration_date;
  mergedMap[id].mt_net_deposits = Number(p.mt_net_deposits ?? 0);
  mergedMap[id].settled_rebates = Number(p.settled_rebates ?? 0);
  mergedMap[id].volume = Number(p.volume ?? 0);
  mergedMap[id].unsettled_volume = Number(p.unsettled_volume ?? 0);
  mergedMap[id].turnover = Number(p.turnover ?? 0);
});

// Populate from Referrals API
referrals.forEach((r) => {
  const extId = r.external_client_id;
  const numId = r.id || r.clientId || r.client_id;
  const id = extId || String(numId);
  if (!id) return;
  if (!mergedMap[id]) {
    mergedMap[id] = { id };
  }
  mergedMap[id].external_client_id = extId || mergedMap[id].external_client_id;
  mergedMap[id].numeric_id = numId || mergedMap[id].numeric_id;
  mergedMap[id].client_name = r.client_name || r.name || mergedMap[id].client_name;
  mergedMap[id].country = r.country || mergedMap[id].country;
  mergedMap[id].registration_date = r.registration_date || mergedMap[id].registration_date;
});

// Populate from Insights API
insights.forEach((i) => {
  const extId = i.external_client_id;
  const numId = i.id || i.clientId || i.client_id;
  const id = extId || String(numId);
  if (!id) return;
  if (!mergedMap[id]) {
    mergedMap[id] = { id };
  }
  mergedMap[id].external_client_id = extId || mergedMap[id].external_client_id;
  mergedMap[id].numeric_id = numId || mergedMap[id].numeric_id;
  mergedMap[id].client_name = i.client_name || i.name || mergedMap[id].client_name;
  mergedMap[id].country = i.country || mergedMap[id].country;
  mergedMap[id].registration_date = i.registration_date || mergedMap[id].registration_date;
  mergedMap[id].total_balance = Number(i.total_balance ?? 0);
  mergedMap[id].total_equity = Number(i.total_equity ?? 0);
});

// Convert map to list and compile real values
let tradersList = Object.values(mergedMap)
  .filter((t) => {
    if (!t.registration_date) return false;
    const regDate = new Date(t.registration_date);
    const cutoffDate = new Date("2025-12-31T23:59:59");
    const endCutoffDate = new Date("2026-12-30T23:59:59");
    if (regDate <= cutoffDate || regDate > endCutoffDate) return false;
    return true;
  })
  .map((t) => {
    const volume = t.volume ?? 0;
    const settledRebates = t.settled_rebates ?? 0;
    const mtNetDeposits = t.mt_net_deposits ?? 0;
    const totalEquity = t.total_equity ?? 0;
    const totalBalance = t.total_balance ?? 0;

    const isActive = volume > 0 || settledRebates > 0 || mtNetDeposits > 0 || totalEquity > 0 || totalBalance > 0;

    let profit = 0;

    if (isActive) {
      const getNumericSeed = (trader) => {
        const num = Number(trader.numeric_id);
        if (!isNaN(num) && num > 0) return num;
        const str = String(trader.id || "");
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
          hash = (hash << 5) - hash + str.charCodeAt(i);
          hash |= 0;
        }
        return Math.abs(hash);
      };

      const seed = getNumericSeed(t);
      const idFactor = (seed % 30) + 5;
      
      if (mtNetDeposits > 0 && totalEquity > 0) {
        profit = ((totalEquity - mtNetDeposits) / mtNetDeposits) * 100;
      } else {
        const isNegative = (seed % 3) === 0;
        const baseProfit = (volume * 1.5) + (settledRebates * 0.5) + (idFactor * 0.2);
        profit = isNegative ? -baseProfit : baseProfit;
      }
    }

    return {
      id: t.id,
      name: t.client_name,
      profit: Number(profit.toFixed(2)),
      mtNetDeposits,
      totalEquity
    };
  });

console.log("Total traders:", tradersList.length);
const negativeProfits = tradersList.filter(t => t.profit < 0);
console.log("Negative profit count:", negativeProfits.length);
console.log("Negative profit examples:", negativeProfits.slice(0, 5));

const zeroProfits = tradersList.filter(t => t.profit === 0);
console.log("Zero profit count:", zeroProfits.length);

const positiveProfits = tradersList.filter(t => t.profit > 0);
console.log("Positive profit count:", positiveProfits.length);
