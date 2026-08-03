const { MongoClient } = require("mongodb");

async function run() {
  const uri = "mongodb+srv://sandeshgirish_db_user:idcTK8EGI5BE53Fv@cluster0.ci7mmxz.mongodb.net/";
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db("tradetalks");
    const tradersCol = db.collection("traders");
    const trader = await tradersCol.findOne({
      $or: [
        { _id: "f02549b7867" },
        { clientId: "f02549b7867" }
      ]
    });
    console.log("TRADER_DOC:", JSON.stringify(trader, null, 2));

    const settings = await db.collection("global_settings").findOne({ _id: "global_badge_eligibility" });
    console.log("SETTINGS_DOC:", JSON.stringify(settings, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

run();
