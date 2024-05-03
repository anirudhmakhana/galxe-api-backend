const axios = require("axios");
const cors = require("cors");
const corsHandler = cors({ origin: "https://app.galxe.com" });

module.exports = (req, res) => {
  // Handling CORS preflight requests
  if (req.method === "OPTIONS") {
    corsHandler(req, res, () => res.status(200).end());
    return;
  }

  const address = req.query.address.toLowerCase();
  const apiKey = process.env.ETHERSCAN_API_KEY;
  const contractAddress = process.env.GEL_CONTRACT_ADDRESS;
  const url = `https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=${contractAddress}&address=${address}&tag=latest&apikey=${apiKey}`;

  corsHandler(req, res, async () => {
    try {
      const response = await axios.get(url);
      const balance = BigInt(response.data.result);
      res.json({
        data: {
          is_ok: balance > 0 ? 1 : 0,
        },
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ data: { is_ok: 0 } });
    }
  });
};
