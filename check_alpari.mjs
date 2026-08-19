const getApiBase = () => "https://api.alpariportal.com";
const getPrivateToken = () => "03764376-ec54-4a11-94aa-7c63d39d1f2f";
const getDirectPartnerId = () => 417398;

async function checkClient() {
  console.log("Checking client f00904b4902 in Alpari API...");
  
  // Also check recent 60 days
  const now = new Date();
  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(now.getDate() - 60);
  
  const formatDate = (d) => {
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  const datesToTry = [
    { from: "01/10/2025", to: "30/12/2026", label: "Full Season" },
    { from: formatDate(sixtyDaysAgo), to: formatDate(now), label: "Last 60 Days" }
  ];

  for (const range of datesToTry) {
    console.log(`\n--- Fetching for range ${range.label} (${range.from} - ${range.to}) ---`);
    const params = {
      RegistrationFromDate: range.from,
      RegistrationToDate: range.to,
      DirectPartner: getDirectPartnerId(),
    };

    try {
      console.log("Fetching Insights...");
      const res = await fetch(`${getApiBase()}/v1/External/client/insights`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Private-Token": getPrivateToken(),
        },
        body: JSON.stringify(params),
      });
      const insightsData = await res.json();
      const insights = Array.isArray(insightsData) ? insightsData : (insightsData.Data || insightsData.data || insightsData.clients || []);
      
      console.log("Fetching Performance...");
      const res2 = await fetch(`${getApiBase()}/v1/External/client/performance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Private-Token": getPrivateToken(),
        },
        body: JSON.stringify(params),
      });
      const perfData = await res2.json();
      const performances = Array.isArray(perfData) ? perfData : (perfData.Data || perfData.data || perfData.clients || []);
      
      const input = 'f00904b4902';
      
      const insight = insights.find((i) => {
        const extId = i.external_client_id || i.externalClientId || i.clientId || i.id;
        const numId = i.id || i.clientId || i.client_id;
        return String(extId || "").toLowerCase() === input || String(numId || "").toLowerCase() === input;
      });

      const perf = performances.find((p) => {
        const extId = p.external_client_id || p.externalClientId || p.clientId || p.id;
        const numId = p.id || p.clientId || p.client_id;
        return String(extId || "").toLowerCase() === input || String(numId || "").toLowerCase() === input;
      });

      if (insight || perf) {
        console.log(">>> FOUND in Alpari API <<<");
        console.log("Insight:", insight);
        console.log("Performance:", perf);
        return;
      } else {
        console.log("Not found in this range.");
      }
    } catch(e) {
      console.error("Error fetching data:", e);
    }
  }
  
  console.log("\n>>> RESULT: Client f00904b4902 is NOT FOUND in Alpari API responses.");
}

checkClient();
