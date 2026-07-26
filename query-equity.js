const fs = require('fs');
const path = require('path');

try {
  const filePath = path.join(__dirname, 'alpari_api_data.json');
  if (!fs.existsSync(filePath)) {
    console.error("Could not find alpari_api_data.json. Please make sure it is in the current directory.");
    process.exit(1);
  }
  
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const parsedData = JSON.parse(fileContent);

  // The JSON structure contains data.insights
  const insights = parsedData.data ? parsedData.data.insights : [];
  console.log(`Total insights records loaded: ${insights.length}`);

  // Filter out any traders where total_equity is more than 100
  const filtered = insights.filter(i => (i.total_equity ?? 0) > 100);
  console.log(`Found ${filtered.length} traders with total_equity > 100.\n`);

  // Sort them by equity descending
  filtered.sort((a, b) => (b.total_equity ?? 0) - (a.total_equity ?? 0));

  console.log("=================== TOP TRADERS WITH EQUITY > 100 ===================");
  filtered.slice(0, 20).forEach((t, index) => {
    console.log(`${index + 1}. Name: ${t.client_name || 'N/A'}
   Client ID (External ID): ${t.external_client_id}
   Numeric ID: ${t.id}
   Total Equity: $${t.total_equity}
   Total Balance: $${t.total_balance}
   Country: ${t.country || 'N/A'}
   Registration Date: ${t.registration_date}
   ---------------------------------------------------------------------`);
  });
} catch (err) {
  console.error("Error scanning JSON file:", err.message);
}
