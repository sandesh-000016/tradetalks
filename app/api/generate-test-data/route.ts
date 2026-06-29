import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";


const MOCK_FILE_PATH = path.join(process.cwd(), "test_alpari_responses.json");

const firstNames = ["James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda", "William", "Elizabeth", "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Charles", "Karen"];
const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin"];
const countries = ["India", "United Arab Emirates", "United Kingdom", "Singapore", "Malaysia", "South Africa", "Nigeria", "Saudi Arabia", "Qatar", "Germany"];

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomName(): string {
  return `${getRandomElement(firstNames)} ${getRandomElement(lastNames)}`;
}

export async function GET() {
  try {
    const performances: any[] = [];
    const referrals: any[] = [];
    const insights: any[] = [];

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
      let drawdown = Math.round((Math.random() * 8 + 1) * 100) / 100; // 1% to 9%
      let winRate = Math.floor(Math.random() * 25) + 60; // 60% to 85%
      
      const scenarioType = i % 10;
      
      if (scenarioType === 0) {
        // Case 2: Pre-season cutoff date
        regDate = "Jun 25 2026  9:00AM";
        balance = netDeposits + 50;
        volume = 5.0;
        tradesCount = 15;
      } else if (scenarioType === 1) {
        // Case 3: Washout account (balance <= 0)
        balance = 0;
        volume = 1.0;
        tradesCount = 12;
        drawdown = 100;
        winRate = 10;
      } else if (scenarioType === 2) {
        // Case 4: Low trade count (< 10)
        tradesCount = Math.floor(Math.random() * 9) + 1; // 1 to 9
        balance = netDeposits + 80;
        volume = 3.0;
      } else if (scenarioType === 3) {
        // Case 5: Low volume ratio
        volume = 0.1 * (balance / 100); 
        balance = netDeposits + 100;
        tradesCount = 18;
      } else {
        // Case 1 & 6: Qualified, badge-earning traders
        const profitPercent = Math.random() * 120 + 5; // 5% to 125% profit
        balance = Math.round(netDeposits * (1 + profitPercent / 100));
        tradesCount = 15 + Math.floor(Math.random() * 120);
        volume = 0.8 * (balance / 100) + Math.random() * 30; // abundant volume
      }

      // Calculate profit percentage
      const profit = netDeposits > 0 ? ((balance - netDeposits) / netDeposits) * 100 : 0;

      // Determine which badges they qualify for
      const earnedBadges: string[] = [];

      // Add to Performance API response (including settled/unsettled metrics)
      performances.push({
        id: numId,
        client_id: numId,
        external_client_id: extId,
        client_name: name,
        country: country,
        registration_date: regDate,
        mt_net_deposits: netDeposits,
        settled_rebates: Math.round(volume * 1.5 * 100) / 100,
        unsettled_rebates: Math.round(volume * 0.25 * 100) / 100,
        volume: Math.round(volume * 100) / 100,
        unsettled_volume: Math.round(volume * 0.15 * 100) / 100,
        turnover: Math.round(volume * 100000),
        win_rate: winRate,
        drawdown: drawdown,
        trades_count: tradesCount,
        earned_badges: earnedBadges,
        badges_count: earnedBadges.length,
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
        unsettled_rebates: Math.round(volume * 0.25 * 100) / 100,
        first_deposit_date: "Jun 29 2026  6:00AM",
        last_deposit_date: "Jun 29 2026  6:30AM",
        last_activity_date: "Jun 29 2026  12:00PM",
      });
    }

    const output = {
      performance: performances,
      referrals: referrals,
      insights: insights
    };

    fs.writeFileSync(MOCK_FILE_PATH, JSON.stringify(output, null, 2), "utf8");

    return NextResponse.json({
      success: true,
      message: "Successfully generated 100 enriched test records in test_alpari_responses.json!",
      counts: {
        performance: performances.length,
        referrals: referrals.length,
        insights: insights.length,
      }
    });
  } catch (error: any) {
    console.error("Generate test-data route error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate test data." },
      { status: 500 }
    );
  }
}
