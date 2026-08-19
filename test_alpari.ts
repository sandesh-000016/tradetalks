import { verifyAlpariClientDirect, getIntegratedLeaderboard } from './lib/alpariApi';
import clientPromise from './lib/mongodb';

async function run() {
  console.log("Checking verifyAlpariClientDirect...");
  try {
    const res = await verifyAlpariClientDirect('f00904b4902');
    console.log("verifyAlpariClientDirect result:", res);
  } catch (e: any) {
    console.log("Error in verifyAlpariClientDirect:", e.message);
  }

  console.log("Checking full leaderboard API...");
  try {
    const leaderboard = await getIntegratedLeaderboard("monthly", true, true);
    const found = leaderboard.find(t => String(t.id).toLowerCase() === 'f00904b4902' || String(t.internalId) === 'f00904b4902' || String(t.externalClientId).toLowerCase() === 'f00904b4902');
    if (found) {
      console.log("Found in leaderboard:", found);
    } else {
      console.log("Not found in leaderboard response.");
    }
  } catch (e: any) {
    console.log("Error in getIntegratedLeaderboard:", e.message);
  }
  
  process.exit(0);
}
run();
